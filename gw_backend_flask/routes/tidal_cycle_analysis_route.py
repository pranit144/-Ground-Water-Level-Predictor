from flask import Flask, render_template, request, jsonify, Blueprint
import pandas as pd
import folium
import plotly.express as px
import numpy as np
from folium.plugins import HeatMap
from geopy.geocoders import Nominatim
import os

bp = Blueprint('tidal_cycle_analysis', __name__, template_folder='templates', static_folder='static')

try:
    data_path = os.path.abspath('data/tidal_cycles_ground_water_data.csv')

    # Load data
    if not os.path.isfile(data_path):
        raise FileNotFoundError(f"Data file not found at path: {data_path}")
    df = pd.read_csv(data_path)
except:
    print("Something went wrong")

# Groundwater base levels for reference
base_groundwater_levels = {
    'Mumbai': 41.91, 'Beypore': 2.17, 'Bhavnagar': 9.14, 'VisaKhapatnam': 5.33,
    'Cochin': 1.44, 'Chennai': 4.02, 'Diamond Harbour': 3.02, 'Okha': 3.89,
    'Gangasagar': 1.93, 'Ennore': 4.03, 'mangalore': 8.14, 'Karwar': 28.49,
    'Kakinada': 1.93, 'Marmagaon': 6.99, 'Chandbali': 2.75, 'Lakshadweep': 20.1,
    'Porbandar': 8.82, 'Nagappattinam': 3.98, 'Kandla': 6.04, 'RAMESWARAM': 2.99,
    'Tuticorin': 3.78, 'Mayapur': 5.01, 'Port Blair': 3.77, 'Paradip': 2.07,
    'Pipanav Bandar': 27.59, 'Vadinar': 4.69, 'Shortt\'s Island': 1.91, 'Sagar': 1.93,
    'Veraval': 51.92}


# Helper functions
def geocode_address(address):
    geolocator = Nominatim(user_agent="geoapi")
    location = geolocator.geocode(address)
    if location:
        return location.latitude, location.longitude
    else:
        return None, None


def calculate_avg_time(times):
    times = pd.to_datetime(times, format='%H:%M:%S')
    avg_time = times.mean().time()
    return avg_time.strftime('%I:%M %p')


@bp.route('/line_plots', methods=['POST'])
def line_plots():
    location = request.form.get('location')
    selected_time = request.form.get('selected_time')

    location_data = df[df["LOCATION"] == location]

    # Prepare Groundwater Levels Line Plot
    groundwater_data = location_data.groupby(location_data["Tidal Cycles Timings"].apply(
        lambda t: pd.to_datetime(t, format='%H:%M:%S').strftime('%H:%M'))).agg({
        "Ground water level (mbgl)": "mean"
    }).reset_index()
    fig1 = px.line(groundwater_data, x="Tidal Cycles Timings", y="Ground water level (mbgl)", markers=True,
                   line_shape='linear')
    fig1.update_traces(line_color="green")
    fig1.update_layout(title_text='Groundwater Levels throughout the Day', title_x=0.5, title_font_color='skyblue')

    # Prepare Sea Water Levels Line Plot
    seawater_data = location_data.groupby(location_data["Tidal Cycles Timings"].apply(
        lambda t: pd.to_datetime(t, format='%H:%M:%S').strftime('%H:%M'))).agg({
        "Sea Water Level (m)": "mean"
    }).reset_index()
    fig2 = px.line(seawater_data, x="Tidal Cycles Timings", y="Sea Water Level (m)", markers=True, line_shape='linear')
    fig2.update_traces(line_color="brown")
    fig2.update_layout(title_text='Sea Water Levels throughout the Day', title_x=0.5, title_font_color='skyblue')

    return jsonify({
        'groundwater_plot': fig1.to_html(full_html=False),
        'seawater_plot': fig2.to_html(full_html=False)
    })


def calculate_avg_groundwater_deviation(location):
    base_level = base_groundwater_levels.get(location, 0)
    location_data = df[df['LOCATION'] == location]
    avg_groundwater_level = location_data['Ground water level (mbgl)'].mean()
    return abs(avg_groundwater_level - base_level)


def map_time_to_dataset_format(selected_time):
    time_mapping = {'3 AM': '03:00:00', '9 AM': '09:00:00', '3 PM': '15:00:00', '9 PM': '21:00:00'}
    return time_mapping.get(selected_time)


def find_nearest_time_entry(data, selected_time):
    data['Time_Delta'] = pd.to_timedelta(data['Tidal Cycles Timings'])
    target_time = pd.to_timedelta(selected_time)

    def find_nearest(row):
        time_deltas = np.abs(row['Time_Delta'] - target_time)
        nearest_idx = time_deltas.idxmin()
        return data.loc[nearest_idx]

    nearest_times = data.groupby('LOCATION').apply(find_nearest)
    return nearest_times


def generate_tidal_map(data, groundwater_levels, selected_time):
    # Initialize the map
    tidal_map = folium.Map(location=[16.5937, 80.9629], zoom_start=6)

    # Add heat map layer for sea water levels
    heat_data = [[row['Lattitude'], row['Longitude'], row['Sea Water Level (m)']] for index, row in data.iterrows()]
    HeatMap(heat_data, min_opacity=0.6, max_val=max(data['Sea Water Level (m)']),
            gradient={0.0: 'cyan', 0.2: 'green', 0.4: 'yellow', 0.6: 'orange', 0.8: 'red', 1.0: 'darkred'}).add_to(
        tidal_map)

    # Add CircleMarkers for groundwater deviation
    for index, row in data.iterrows():
        location_name = row['LOCATION']
        groundwater_diff = groundwater_levels.get(location_name, 0) - row['Ground water level (mbgl)']

        bubble_color = 'pink' if groundwater_diff > 0 else 'blue'
        bubble_size = abs(groundwater_diff) * 10

        folium.CircleMarker(
            location=[row['Lattitude'], row['Longitude']],
            radius=bubble_size,
            color=bubble_color,
            fill=True,
            fill_opacity=0.9,
            tooltip=f"Location: {row['LOCATION']}<br>"
                    f"Latitude: {row['Lattitude']}<br>"
                    f"Longitude: {row['Longitude']}<br>"
                    f"Type of Tide: {row['Type of Tide']}<br>"
                    f"Deviation: {groundwater_diff:.2f} mbgl<br>"
                    f"Sea Water Level: {row['Sea Water Level (m)']:.2f} m"
        ).add_to(tidal_map)

        # Add tide type marker (arrows)
        icon_color = 'green' if row['Type of Tide'] == 'High' else 'red'
        icon = folium.DivIcon(
            html=f'<div style="font-size: 24px; color: {icon_color};">&#9650;</div>' if row['Type of Tide'] == 'High'
            else f'<div style="font-size: 24px; color: {icon_color};">&#9660;</div>')

        folium.Marker(
            location=[row['Lattitude'], row['Longitude']],
            icon=icon,
            tooltip=f"Location: {row['LOCATION']}<br>"
                    f"Latitude: {row['Lattitude']}<br>"
                    f"Longitude: {row['Longitude']}<br>"
                    f"Type of Tide: {row['Type of Tide']}<br>"
                    f"Deviation: {groundwater_diff:.2f} mbgl<br>"
                    f"Sea Water Level: {row['Sea Water Level (m)']:.2f} m"
        ).add_to(tidal_map)

    # Add sky-blue bold header at the top of the map
    title_html = '''
             <h3 align="center" style="font-size:24px; color:skyblue; font-weight:bold;">
             Tidal Cycles - Groundwater Impact Prediction</h3>
             '''
    tidal_map.get_root().html.add_child(folium.Element(title_html))

    return tidal_map



@bp.route('/',methods=["GET"])
def index():
    locations = df["LOCATION"].unique()
    return render_template('tidal_cycle/tide.html', locations=locations)


@bp.route('/tidal_data', methods=['POST'])
def tidal_data():
    location = request.form.get('location')
    selected_time = request.form.get('selected_time')

    # Filter and process data
    location_data = df[df["LOCATION"] == location]
    avg_high_tide_time = calculate_avg_time(
        location_data[location_data["Type of Tide"] == "High"]["Tidal Cycles Timings"])
    avg_low_tide_time = calculate_avg_time(
        location_data[location_data["Type of Tide"] == "Low"]["Tidal Cycles Timings"])
    avg_sea_water_level = location_data["Sea Water Level (m)"].mean()
    avg_groundwater_deviation = calculate_avg_groundwater_deviation(location)




    return jsonify({
        'avg_high_tide_time': avg_high_tide_time,
        'avg_low_tide_time': avg_low_tide_time,
        'avg_sea_water_level': round(avg_sea_water_level, 2),
        'avg_groundwater_deviation': round(avg_groundwater_deviation, 2)
    })


@bp.route('/map', methods=['POST'])
def tidal_map_view():
    selected_time = request.form.get('selected_time')
    mapped_time = map_time_to_dataset_format(selected_time)
    nearest_times_df = find_nearest_time_entry(df, mapped_time)
    tidal_map = generate_tidal_map(nearest_times_df, base_groundwater_levels, mapped_time)
    return tidal_map._repr_html_()
