from flask import Flask, render_template, request, Blueprint
import pandas as pd
import plotly.express as px
import plotly.io as pio
from plotly.graph_objects import Indicator, Figure
import folium
from folium.plugins import HeatMap
import json
import os

bp = Blueprint('rainfall_trend_analysis', __name__, template_folder='templates', static_folder='static')


# Load the dataset
def load_rainfall_data():
    data_path = os.path.abspath('data/rainfall_final_data.csv')

    if not os.path.isfile(data_path):
        raise FileNotFoundError(f"Data file not found at path: {data_path}")
    return pd.read_csv(data_path)


def create_map(df, map_type):
    m = folium.Map(location=[23.5937, 80.9629], zoom_start=5, control_scale=True, width='100%', height='500px')

    if map_type == 'rainfall_gw':
        rainfall_data = df[['LATITUDE', 'LONGITUDE', 'Actual (mm)']].dropna()
        heat_data_rainfall = rainfall_data[['LATITUDE', 'LONGITUDE', 'Actual (mm)']].values.tolist()
        gw_data = df[['LATITUDE', 'LONGITUDE', 'Ground Water level (mbgl)', 'Actual (mm)']].dropna()

        HeatMap(heat_data_rainfall, min_opacity=0.5, radius=10, blur=15,
                gradient={0.2: 'darkred', 0.4: 'red', 0.5: 'orange', 0.6: 'pink', 0.7: 'skyblue', 0.8: 'blue',
                          0.9: 'darkblue'}
                ).add_to(m)

        for index, row in gw_data.iterrows():
            folium.CircleMarker(
                location=(row['LATITUDE'], row['LONGITUDE']),
                radius=row['Ground Water level (mbgl)'] * 0.2,
                color='darkblue',
                fill=True,
                fill_opacity=0.6,
                tooltip=f"Lat: {row['LATITUDE']}, Lon: {row['LONGITUDE']}<br>"
                        f"Rainfall: {row['Actual (mm)']} mm<br>"
                        f"Groundwater Level: {row['Ground Water level (mbgl)']} mbgl"
            ).add_to(m)

    elif map_type == 'refresh_rate':
        refresh_rate_data = df[['LATITUDE', 'LONGITUDE', 'Refresh Rate']].dropna()
        heat_data_refresh_rate = refresh_rate_data[['LATITUDE', 'LONGITUDE', 'Refresh Rate']].values.tolist()

        HeatMap(heat_data_refresh_rate, min_opacity=0.5, radius=10, blur=15,
                gradient={0.2: 'aqua', 0.4: 'skyblue', 0.5: 'darkblue', 0.6: 'orange', 0.8: 'red', 0.9: 'darkred'}
                ).add_to(m)

        for index, row in refresh_rate_data.iterrows():
            folium.CircleMarker(
                location=(row['LATITUDE'], row['LONGITUDE']),
                radius=2,
                color='black',
                fill=True,
                fill_opacity=0.6,
                tooltip=f"Lat: {row['LATITUDE']}, Lon: {row['LONGITUDE']}<br>"
                        f"Refresh Rate: {row['Refresh Rate']} mm/year"
            ).add_to(m)

    return m


@bp.route('/')
def index():
    import logging
    logging.basicConfig(level=logging.DEBUG)
    logging.debug(f"Request args: {request.args}")

    df = load_rainfall_data()

    state = request.args.get('state', df['State'].unique()[0])
    district = request.args.get('district', df[df['State'] == state]['District'].unique()[0])

    logging.debug(f"State: {state}, District: {district}")

    filtered_df = df[df['State'] == state]
    filtered_df_district = filtered_df[filtered_df['District'] == district]

    avg_rainfall = filtered_df_district['Actual (mm)'].mean()
    avg_refresh_rate = filtered_df_district['Refresh Rate'].mean()
    avg_deviation = filtered_df_district['Deviation (mm)'].mean()

    fig_rainfall = Figure(Indicator(
        mode="gauge+number",
        value=avg_rainfall,
        title={'text': "Average Rainfall (mm)"},
        gauge={'axis': {'range': [0, 1000]}, 'bar': {'color': 'blue'}}
    ))

    fig_refresh_rate = Figure(Indicator(
        mode="gauge+number",
        value=avg_refresh_rate,
        title={'text': "Average Refresh Rate (mm/year)"},
        gauge={'axis': {'range': [0, 100]}, 'bar': {'color': 'green'}}
    ))

    fig_deviation = Figure(Indicator(
        mode="gauge+number",
        value=avg_deviation,
        title={'text': "Average Deviation (mm)"},
        gauge={'axis': {'range': [-500, 500]}, 'bar': {'color': 'orange'}}
    ))

    plot_rainfall = pio.to_html(fig_rainfall, full_html=False)
    plot_refresh_rate = pio.to_html(fig_refresh_rate, full_html=False)
    plot_deviation = pio.to_html(fig_deviation, full_html=False)

    rainfall_stats = filtered_df_district[['Actual (mm)', 'Deviation (mm)', 'Normal (mm)']].mean()
    stats = {
        'Actual Rainfall': rainfall_stats['Actual (mm)'],
        'Deviation': rainfall_stats['Deviation (mm)'],
        'Normal Rainfall': rainfall_stats['Normal (mm)']
    }

    fig_bar = px.bar(
        x=list(stats.keys()), y=list(stats.values()),
        labels={'x': 'Rainfall Type', 'y': 'Amount (mm)'},
        title="Rainfall Analysis"
    )
    plot_bar = pio.to_html(fig_bar, full_html=False)

    map_rainfall_gw = create_map(df, 'rainfall_gw')
    map_refresh_rate = create_map(df, 'refresh_rate')

    map_rainfall_gw_html = map_rainfall_gw._repr_html_()
    map_refresh_rate_html = map_refresh_rate._repr_html_()

    return render_template('rainfall/rainfall.html',
                           plot_rainfall=plot_rainfall,
                           plot_refresh_rate=plot_refresh_rate,
                           plot_deviation=plot_deviation,
                           plot_bar=plot_bar,
                           map_rainfall_gw=map_rainfall_gw_html,
                           map_refresh_rate=map_refresh_rate_html,
                           states=df['State'].unique(),
                           selected_state=state,
                           districts=filtered_df['District'].unique(),
                           selected_district=district)
