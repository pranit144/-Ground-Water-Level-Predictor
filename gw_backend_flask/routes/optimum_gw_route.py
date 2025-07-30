from flask import Blueprint, request, jsonify
import pandas as pd
import numpy as np
from geopy.geocoders import Nominatim
import matplotlib.pyplot as plt
import io
import base64
import folium
from folium.plugins import HeatMap
import os

# Create a Blueprint for the routes
bp = Blueprint('optimum_gw', __name__)

# Define the path to the data file
data_path = os.path.abspath('data/final_cord_data.csv')

# Load data
if not os.path.isfile(data_path):
    raise FileNotFoundError(f"Data file not found at path: {data_path}")

df = pd.read_csv(data_path)

# Calculate the average of the groundwater levels
df['Average_GroundWaterLevel'] = df[['Aug-22', 'Jan-23', 'Nov-22', 'Mar-22']].mean(axis=1)

# Function to get address from latitude and longitude
def get_address(lat, lon):
    geolocator = Nominatim(user_agent="app.py")
    location = geolocator.reverse((lat, lon))
    return location.address if location else "Address not found"

# Function to find optimal coordinates within a nearby area
def find_optimal_coordinates(df, user_lat, user_lon, radius_km):
    # Filter data for points within the radius
    nearby_points = df[
        (np.abs(df['LATITUDE'] - user_lat) <= radius_km / 111) &  # Convert km to degrees
        (np.abs(df['LONGITUDE'] - user_lon) <= radius_km / (111 * np.cos(np.radians(user_lat))))
    ]

    if nearby_points.empty:
        return None

    # Normalize the columns so that both criteria are on the same scale
    nearby_points['normalized_groundwater'] = nearby_points['Average_GroundWaterLevel'] / nearby_points['Average_GroundWaterLevel'].max()
    nearby_points['normalized_depth'] = nearby_points['WELL DEPTH'] / nearby_points['WELL DEPTH'].max()

    # We want to minimize both, so we sum the normalized values (lower is better)
    nearby_points['score'] = nearby_points['normalized_groundwater'] + nearby_points['normalized_depth']

    # Find the row with the minimum score
    optimal_row = nearby_points.loc[nearby_points['score'].idxmin()]
    return optimal_row

# API to handle groundwater prediction
@bp.route('/optimum_gw', methods=['POST'])
def find_optimum_gw():
    try:
        data = request.get_json()
        user_lat = float(data.get('latitude'))
        user_lon = float(data.get('longitude'))

        # Validate latitude and longitude ranges
        if not (-90 <= user_lat <= 90) or not (-180 <= user_lon <= 180):
            return jsonify({'error': 'Invalid latitude or longitude values. Latitude must be between -90 and 90, and longitude must be between -180 and 180.'}), 400

        user_address = get_address(user_lat, user_lon)
        radius_km = 50
        max_radius_km = 200  # Define a maximum radius to prevent infinite loops
        optimal_coords = None

        # Iterate through increasing radii until points are found or maximum radius is reached
        while radius_km <= max_radius_km:
            optimal_coords = find_optimal_coordinates(df, user_lat, user_lon, radius_km)

            if optimal_coords is not None:
                break

            radius_km += 50  # Increase the radius by 50 km

        if optimal_coords is None:
            return jsonify({'error': 'No suitable coordinates found within the maximum search radius.'}), 404

        optimal_lat = optimal_coords['LATITUDE']
        optimal_lon = optimal_coords['LONGITUDE']
        optimal_address = get_address(optimal_lat, optimal_lon)

        # Create the gauge chart
        avg_gw_level = optimal_coords['Average_GroundWaterLevel']
        gauge_value = min(max(avg_gw_level, 0), 1)

        fig, ax = plt.subplots(figsize=(6, 6))
        wedges, texts = ax.pie([gauge_value, 1 - gauge_value],
                               labels=["", ""], startangle=90, counterclock=False,
                               colors=["#FF9999", "#DDDDDD"], wedgeprops={'width': 0.3})

        # Set transparent background
        fig.patch.set_alpha(0.0)
        ax.patch.set_alpha(0.0)

        # Display the average groundwater level at the center of the gauge
        plt.text(0, 0, f"{avg_gw_level:.2f}m", ha='center', va='center', fontsize=18, color='darkgreen', fontweight='bold')

        # Save the plot to a BytesIO object and encode as base64
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        gauge_img = base64.b64encode(img.getvalue()).decode()

        # Create the map with heatmap
        map_center = [(user_lat + optimal_lat) / 2, (user_lon + optimal_lon) / 2]
        m = folium.Map(location=map_center, zoom_start=7)

        distance_km = np.sqrt((optimal_lat - user_lat) ** 2 + (optimal_lon - user_lon) ** 2) * 111

        lat_min = map_center[0] - distance_km / 111
        lat_max = map_center[0] + distance_km / 111
        lon_min = map_center[1] - distance_km / (111 * np.cos(np.radians(map_center[0])))
        lon_max = map_center[1] + distance_km / (111 * np.cos(np.radians(map_center[0])))

        heat_data = []
        for _, row in df.iterrows():
            point_lat = row['LATITUDE']
            point_lon = row['LONGITUDE']
            if lat_min <= point_lat <= lat_max and lon_min <= point_lon <= lon_max:
                heat_data.append([point_lat, point_lon, row['Average_GroundWaterLevel']])

        HeatMap(heat_data).add_to(m)

        folium.Circle(
            location=[map_center[0], map_center[1]],
            radius=distance_km * 1000,
            color='red',
            fill=True,
            fill_color='red',
            fill_opacity=0.1,
        ).add_to(m)

        folium.Marker(
            location=[user_lat, user_lon],
            popup=f"User Input Location: {get_address(user_lat, user_lon)}",
            icon=folium.Icon(color='green')
        ).add_to(m)

        folium.Marker(
            location=[optimal_lat, optimal_lon],
            popup=f"Optimal Location: {optimal_address}",
            icon=folium.Icon(color='blue')
        ).add_to(m)

        map_html = m._repr_html_()  # Get HTML representation of the map

        # Return the result as JSON for the frontend to handle
        return jsonify({
            'user_address': user_address,
            'optimal_lat': optimal_lat,
            'optimal_lon': optimal_lon,
            'optimal_address': optimal_address,
            'gauge_img': gauge_img,
            'map_html': map_html
        })

    except Exception as e:
        # Handle any other unexpected errors
        print(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500
