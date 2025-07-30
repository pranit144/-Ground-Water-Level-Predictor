from flask import Flask, Blueprint, render_template, request
import pandas as pd
import folium
from folium.plugins import HeatMap, MarkerCluster
import random
import os

bp = Blueprint('geospatial_analysis', __name__, template_folder='templates', static_folder='static')


# Define the path to the data file
data_path = os.path.abspath('data/finalgroundwaterdata.csv')

# Load data
if not os.path.isfile(data_path):
    raise FileNotFoundError(f"Data file not found at path: {data_path}")

df = pd.read_csv(data_path)


# Sample data function
def get_sample_data(df, fraction=1.0):
    sample_df = df[['LATITUDE', 'LONGITUDE', 'WELL TYPE', 'AQUIFER', 'Jan-23', 'May-22', 'Aug-22', 'Nov-22',
                    'WELL DEPTH']].dropna().sample(frac=fraction, random_state=1)
    return sample_df


# Initialize map function
def initialize_map(location, zoom_start):
    return folium.Map(location=location, zoom_start=zoom_start, width='100%', height='100%', prefer_canvas=True)


# Main route
@bp.route('/')
def index():
    # Render the main page with the navbar
    return render_template('geospatial_analysis/index.html')


# Plot route
@bp.route('/plot', methods=['POST'])
def plot():
    option = request.form.get('plot_type')

    # Handle empty form selection
    if not option:
        return "No plot type selected", 400

    # Heatmap Plot
    if option == "Groundwater Heatmap":
        selected_column = request.form.get('heatmap_date')
        if not selected_column:
            return "No heatmap date selected", 400

        df_heatmap = df[['LATITUDE', 'LONGITUDE', 'WELL TYPE', 'AQUIFER', selected_column]].dropna()
        df_heatmap[selected_column] = pd.to_numeric(df_heatmap[selected_column], errors='coerce')
        df_heatmap = df_heatmap.dropna()

        m = initialize_map([20.5937, 78.9629], zoom_start=6)
        heat_data = df_heatmap[['LATITUDE', 'LONGITUDE', selected_column]].values.tolist()

        HeatMap(
            heat_data,
            min_opacity=0.5,
            radius=10,
            blur=15,
            gradient={
                0.1: 'skyblue',
                0.2: 'blue',
                0.3: 'darkblue',
                0.4: 'yellow',
                0.5: 'orange',
                0.6: 'red',
                0.8: 'darkred',
            }
        ).add_to(m)

        # Add CircleMarkers with tooltips
        for _, row in df_heatmap.iterrows():
            folium.CircleMarker(
                location=[row['LATITUDE'], row['LONGITUDE']],
                radius=1,  # Adjust the radius as needed
                color='skyblue',
                fill=True,
                fill_color='blue',
                fill_opacity=0.7,
                tooltip=f"Latitude: {row['LATITUDE']}<br>Longitude: {row['LONGITUDE']}<br>Groundwater Level: {row[selected_column]} mg/l"
            ).add_to(m)

    # Wells Cluster Plot
    elif option == "Wells Cluster Plot":
        sample_df = get_sample_data(df, fraction=1.0)
        m = initialize_map([df['LATITUDE'].mean(), df['LONGITUDE'].mean()], zoom_start=6)
        marker_cluster = MarkerCluster().add_to(m)

        for _, row in sample_df.iterrows():
            folium.Marker(
                location=[row['LATITUDE'], row['LONGITUDE']],
                tooltip=f"Location: ({row['LATITUDE']}, {row['LONGITUDE']})<br>Well Type: {row['WELL TYPE']}"
            ).add_to(marker_cluster)

    # Well Type Scatter Plot
    elif option == "Well Type Scatter Plot":
        sample_df = get_sample_data(df, fraction=0.6)
        m = initialize_map([20.5937, 78.9629], zoom_start=6)
        colors = {'Dug Well': 'purple', 'Bore Well': 'green', 'Bore & Dug Well': 'yellow', 'Tube Well': 'orange'}

        for _, row in sample_df.iterrows():
            well_type = row['WELL TYPE']
            color = colors.get(well_type, 'gray')
            folium.CircleMarker(
                location=[row['LATITUDE'], row['LONGITUDE']],
                radius=5,
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=0.7,
                tooltip=f"Location: ({row['LATITUDE']}, {row['LONGITUDE']})<br>Well Type: {well_type}"
            ).add_to(m)

    # Aquifer Circle Plot
    elif option == "Aquifer Circle Plot":
        sample_df = get_sample_data(df, fraction=0.6)
        m = initialize_map([20.5937, 78.9629], zoom_start=6)
        aquifer_types = sample_df['AQUIFER'].unique()
        aquifer_colors = {aquifer: f'#{random.randint(0, 0xFFFFFF):06x}' for aquifer in aquifer_types}

        for _, row in sample_df.iterrows():
            aquifer_type = row['AQUIFER']
            color = aquifer_colors.get(aquifer_type, 'gray')
            folium.CircleMarker(
                location=[row['LATITUDE'], row['LONGITUDE']],
                radius=5,
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=0.7,
                tooltip=f"Location: ({row['LATITUDE']}, {row['LONGITUDE']})<br>Aquifer: {aquifer_type}"
            ).add_to(m)

    # Well Depth Plot
    elif option == "Well Depth Plot":
        sample_df = get_sample_data(df, fraction=0.8)
        m = initialize_map([20.5937, 78.9629], zoom_start=6)

        for _, row in sample_df.iterrows():
            depth = row['WELL DEPTH']
            folium.CircleMarker(
                location=[row['LATITUDE'], row['LONGITUDE']],
                radius=depth / 10,
                color='blue',
                fill=True,
                fill_color='blue',
                fill_opacity=0.7,
                tooltip=f"Location: ({row['LATITUDE']}, {row['LONGITUDE']})<br>Depth: {depth} meters"
            ).add_to(m)

    # Render the map as HTML
    return m._repr_html_()
