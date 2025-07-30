from flask import Flask, render_template, request, Blueprint
import pandas as pd
import plotly.graph_objs as go
import plotly.express as px
import folium
from folium.plugins import HeatMap
import json
import os

bp = Blueprint('population', __name__, template_folder='templates', static_folder='static')

# Load population data
def load_population_data():
    data_path = os.path.abspath('data/population_water_level_final.csv')

    # Load data
    if not os.path.isfile(data_path):
        raise FileNotFoundError(f"Data file not found at path: {data_path}")
    df = pd.read_csv(data_path)
    df.columns = df.columns.str.strip()  # Remove extra whitespace in column names
    return df

# Function to create Folium map with population and water scarcity analysis
def create_population_map(df):
    m = folium.Map(location=[df['LATITUDE'].mean(), df['LONGITUDE'].mean()], zoom_start=6)

    # Add heatmap for population
    heat_data_pop = df[['LATITUDE', 'LONGITUDE', 'Population']].values.tolist()
    HeatMap(
        heat_data_pop,
        min_opacity=0.6,
        radius=20,
        blur=30,
        gradient={0.1: 'blue', 0.3: 'green', 0.7: 'orange', 1: 'red'}
    ).add_to(m)

    # Add markers for water levels
    for _, row in df.iterrows():
        folium.CircleMarker(
            location=[row['LATITUDE'], row['LONGITUDE']],
            radius=row['Ground water level (mbgl)'] / 10,  # Scale the groundwater level
            color='blue',
            fill=True,
            fill_color='blue',
            fill_opacity=0.7,
            tooltip=f"District: {row['District']}<br>Population: {row['Population']}<br>Ground Water Level: {row['Ground water level (mbgl)']} mbgl"
        ).add_to(m)

        # Highlight zones with red markers for high population and low water levels
        if row['Population'] > 500000 and row['Ground water level (mbgl)'] > 10:
            folium.CircleMarker(
                location=[row['LATITUDE'], row['LONGITUDE']],
                radius=15,
                color='red',
                fill=True,
                fill_color='red',
                fill_opacity=0.8,
                tooltip=f"Scarcity Zone<br>Population: {row['Population']}<br>Ground Water Level: {row['Ground water level (mbgl)']} mbgl"
            ).add_to(m)
            folium.Marker(
                location=[row['LATITUDE'], row['LONGITUDE']],
                icon=folium.Icon(color='black', icon='square', icon_color='white'),
                popup=f"Scarcity Zone<br>Population: {row['Population']}<br>Ground Water Level: {row['Ground water level (mbgl)']} mbgl"
            ).add_to(m)

    return m

# Route for the dashboard
@bp.route("/", methods=["GET", "POST"])
def population_analysis():
    df = load_population_data()

    selected_district = None
    filtered_df = df
    if request.method == "POST":
        selected_district = request.form.get("district")
        if selected_district:
            filtered_df = df[df['District'] == selected_district]

    # Population gauge for the selected district
    if not filtered_df.empty:
        district_data = filtered_df.iloc[0]
        population = district_data['Population']
        ground_water_level = district_data['Ground water level (mbgl)']

        # Gauge for population
        fig_pop = go.Figure(go.Indicator(
            mode="gauge+number",
            value=population,
            gauge={'axis': {'range': [0, df['Population'].max()]}, 'bar': {'color': "cyan"}},
            title={'text': f"Population of {selected_district}"}
        ))

        # Determine groundwater demand status
        if (ground_water_level > 25 and population > 500000) or population > 1000000:
            demand_status = "Very High"
            level = 1.0
        elif ground_water_level >= 15 or population > 500000:
            demand_status = "High"
            level = 0.75
        elif ground_water_level >= 5 and ground_water_level < 15 or population > 100000:
            demand_status = "Normal"
            level = 0.5
        else:
            demand_status = "Low"
            level = 0.25

        # Gauge for groundwater demand status
        fig_demand = go.Figure(go.Indicator(
            mode="gauge+number",
            value=level,
            gauge={'axis': {'range': [0, 1]}, 'bar': {'color': "lime" if demand_status == "Normal" else "red"}},
            title={'text': f"Ground Water Demand Status - {demand_status}"}
        ))

    # Top 10 population districts
    top_10_districts = df.nlargest(10, 'Population')
    fig_top_10 = px.bar(top_10_districts, x='Population', y='District', orientation='h', labels={'Population': 'Population', 'District': 'District'},
                        color='Population', color_continuous_scale='viridis')

    # Create map for population analysis
    population_map = create_population_map(df)

    return render_template("population/index.html",
                           districts=df['District'].unique(),
                           selected_district=selected_district,
                           population_map=population_map._repr_html_(),
                           fig_pop=fig_pop.to_html(),
                           fig_demand=fig_demand.to_html(),
                           fig_top_10=fig_top_10.to_html())

