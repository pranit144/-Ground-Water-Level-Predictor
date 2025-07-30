from flask import Flask, render_template, request, jsonify, Blueprint
from geopy.geocoders import Nominatim
import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from datetime import datetime
import os

bp = Blueprint('tidal_cycle_predict', __name__, template_folder='templates', static_folder='static')

# Load models
model_gw_path = os.path.abspath('models/groundwater_deviation_model.pkl')
model_sw_path = os.path.abspath('models/seawater_deviation_model.pkl')

model_groundwater = joblib.load(model_gw_path)
model_seawater = joblib.load(model_sw_path)

# Label encoder for 'Type of Tide'
le = LabelEncoder()
le.fit(['High', 'Low'])

# Geocoding function to convert address to latitude and longitude
def geocode_address(address):
    geolocator = Nominatim(user_agent="geoapi")
    location = geolocator.geocode(address)
    if location:
        return location.latitude, location.longitude
    else:
        return None, None

# Helper function to convert time to numeric (minutes since midnight)
def convert_time_to_numeric(time_str):
    time_obj = datetime.strptime(time_str, '%I:%M %p')
    return time_obj.hour * 60 + time_obj.minute

@bp.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        address = request.form['address']
        time_str = request.form['time']
        tide_type = request.form['tide_type']

        # Geocode the address
        lat, lon = geocode_address(address)
        if lat is None or lon is None:
            return jsonify({'error': 'Could not geocode the address. Please enter a valid coastal address.'})

        # Convert time and encode tide type
        tidal_time = convert_time_to_numeric(time_str)
        tide_type_encoded = le.transform([tide_type])[0]

        # Create input array for the models
        X_new = pd.DataFrame([[lat, lon, tidal_time, tide_type_encoded]],
                             columns=['Lattitude', 'Longitude', 'Tidal Cycles Timings', 'Type of Tide'])

        # Make predictions
        groundwater_deviation = model_groundwater.predict(X_new)[0]
        seawater_deviation = model_seawater.predict(X_new)[0]

        # Convert NumPy float32 to Python float before returning the result
        return jsonify({
            'groundwater_deviation': float(groundwater_deviation),
            'seawater_deviation': float(seawater_deviation)
        })
    return render_template('tidal_cycle/indextidalpredict.html')
