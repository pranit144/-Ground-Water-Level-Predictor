from flask import Flask, request, Blueprint, jsonify
import pandas as pd
import folium
from folium.plugins import HeatMap
import plotly.express as px
import plotly.graph_objs as go
import os

bp = Blueprint('elevation', __name__, template_folder='templates', static_folder='static')

def load_elevation_data():
    # Ensure data is loaded as numeric for relevant columns
    data_path = os.path.abspath('data/final_elevation.csv')
    if not os.path.isfile(data_path):
        raise FileNotFoundError(f"Data file not found at path: {data_path}")
    df = pd.read_csv(data_path)
    # Convert numeric columns, if necessary
    df['elevation'] = pd.to_numeric(df['elevation'], errors='coerce')
    df['Ground water level (mbgl)'] = pd.to_numeric(df['Ground water level (mbgl)'], errors='coerce')
    df['WELL DEPTH'] = pd.to_numeric(df['WELL DEPTH'], errors='coerce')
    return df

def create_map(df, heat_data, gradient, map_type):
    # Create the map centered at mean latitude and longitude
    m = folium.Map(location=[df['Latitude'].mean(), df['Longitude'].mean()], zoom_start=6, prefer_canvas=True)

    # Add heatmap for elevation
    HeatMap(
        heat_data,
        min_opacity=0.6,
        radius=15,
        blur=20,
        gradient=gradient
    ).add_to(m)

    # Add different markers based on map type
    if map_type == 'groundwater':
        # Add groundwater level as circle markers
        for _, row in df.iterrows():
            folium.CircleMarker(
                location=[row['Latitude'], row['Longitude']],
                radius=row['Ground water level (mbgl)'] / 5 if pd.notna(row['Ground water level (mbgl)']) else 5,
                color='darkblue',
                fill=True,
                fill_color='darkblue',
                fill_opacity=0.7,
                tooltip=f"Location: ({row['Latitude']}, {row['Longitude']})<br>Water Level: {row['Ground water level (mbgl)']}<br>Elevation: {row['elevation']}"
            ).add_to(m)
    elif map_type == 'aquifer':
        # Add aquifer type as circle markers
        fixed_palette = [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
            '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
        ]

        aquifer_types = df['AQUIFER'].unique()
        aquifer_colors = {aquifer: fixed_palette[i % len(fixed_palette)] for i, aquifer in enumerate(aquifer_types)}

        for _, row in df.iterrows():
            aquifer_type = row['AQUIFER']
            color = aquifer_colors.get(aquifer_type, 'gray')

            folium.CircleMarker(
                location=[row['Latitude'], row['Longitude']],
                radius=5,
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=0.7,
                tooltip=f"Location: ({row['Latitude']}, {row['Longitude']})<br>Aquifer: {aquifer_type}<br>Elevation: {row['elevation']}"
            ).add_to(m)
    elif map_type == 'well_depth':
        # Add well depth as circle markers
        for _, row in df.iterrows():
            folium.CircleMarker(
                location=[row['Latitude'], row['Longitude']],
                radius=row['WELL DEPTH'] / 10 if pd.notna(row['WELL DEPTH']) else 5,
                color='darkblue',
                fill=True,
                fill_color='darkblue',
                fill_opacity=0.7,
                tooltip=f"Location: ({row['Latitude']}, {row['Longitude']})<br>Well Depth: {row['WELL DEPTH']}<br>Elevation: {row['elevation']}"
            ).add_to(m)

    return m

@bp.route("/", methods=["GET", "POST"])
def elevation_analysis():
    df = load_elevation_data()

    # Compute Plotly figures based on the entire dataset
    fig_well_type_vs_elevation = px.bar(
        df.groupby('WELL TYPE').mean(numeric_only=True).reset_index(),
        x='WELL TYPE', y='elevation', title="Well Type vs Elevation"
    )

    fig_well_depth_vs_elevation = go.Figure()
    fig_well_depth_vs_elevation.add_trace(
        go.Scatter(
            x=df.groupby('WELL DEPTH').mean(numeric_only=True).reset_index()['WELL DEPTH'],
            y=df.groupby('WELL DEPTH').mean(numeric_only=True).reset_index()['elevation'],
            mode='lines+markers',
            name="Well Depth vs Elevation"
        )
    )
    fig_well_depth_vs_elevation.update_layout(
        title="Well Depth vs Elevation",
        xaxis_title="Well Depth (m)",
        yaxis_title="Elevation (m)"
    )

    # District selection logic
    selected_district = None
    filtered_df = df
    if request.method == "POST":
        selected_district = request.json.get("district")
        if selected_district:
            filtered_df = df[df['District'] == selected_district]

    # Filter numeric data only for groupby operations
    numeric_cols = ['elevation', 'WELL DEPTH', 'Ground water level (mbgl)']
    filtered_numeric = filtered_df[numeric_cols].dropna()

    heat_data = df[['Latitude', 'Longitude', 'elevation']].values.tolist()
    gradient = {
        0.1: 'green',
        0.4: 'blue',
        0.6: 'orange',
        0.9: 'red'
    }

    # Create maps based on the filtered dataset
    elevation_map = create_map(df, heat_data, gradient, 'groundwater')
    aquifer_map = create_map(df, heat_data, gradient, 'aquifer')
    well_depth_map = create_map(df, heat_data, gradient, 'well_depth')

    return jsonify({
        "districts": df['District'].unique().tolist(),
        "selected_district": selected_district,
        "metrics": filtered_df.iloc[0].to_dict() if not filtered_df.empty else {},
        "elevation_map": elevation_map._repr_html_(),
        "fig_well_type_vs_elevation": fig_well_type_vs_elevation.to_json(),
        "fig_well_depth_vs_elevation": fig_well_depth_vs_elevation.to_json(),
        "aquifer_map": aquifer_map._repr_html_(),
        "well_depth_map": well_depth_map._repr_html_()
    })
