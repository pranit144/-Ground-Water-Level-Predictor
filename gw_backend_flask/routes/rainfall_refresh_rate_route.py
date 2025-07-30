from flask import Flask, render_template, request, jsonify, Blueprint
import pandas as pd
import os

bp = Blueprint('rainfall_refresh_rate', __name__, template_folder='templates', static_folder='static')


# Load the data
def load_rainfall_data():
    data_path = os.path.abspath('data/rainfall_final_data.csv')
    return pd.read_csv(data_path)  # Update with the actual file path

@bp.route('/')
def index():
    df = load_rainfall_data()
    states = df['State'].unique()
    selected_state = request.args.get('state', states[0])
    districts = df[df['State'] == selected_state]['District'].unique()
    selected_district = request.args.get('district', districts[0] if len(districts) > 0 else None)
    soil_types = {
        'Sandy soil': 20,
        'Loamy soil': 15,
        'Clayey soil': 5,
        'Urban areas (impermeable surfaces)': 2,
        'Forested areas': 25,
        'Agricultural land': 10
    }
    soil_type = request.args.get('soil_type', list(soil_types.keys())[0])

    if selected_district and not df[(df['State'] == selected_state) & (df['District'] == selected_district)].empty:
        actual_rainfall = df.loc[(df['State'] == selected_state) & (df['District'] == selected_district), 'Actual (mm)'].values[0]
        deviation = df.loc[(df['State'] == selected_state) & (df['District'] == selected_district), 'Deviation (mm)'].values[0]
    else:
        actual_rainfall = 0
        deviation = 0

    recharge_coefficient = soil_types[soil_type]
    refresh_rate = (actual_rainfall * recharge_coefficient) / 100 + deviation

    return render_template('rainfall/refresh.html', states=states, districts=districts, selected_state=selected_state,
                           selected_district=selected_district, soil_types=soil_types, selected_soil_type=soil_type,
                           refresh_rate=refresh_rate.round(2))

@bp.route('/get_districts/<state>')
def get_districts(state):
    df = load_rainfall_data()
    print("Inside get districts")
    districts = df[df['State'] == state]['District'].unique()
    return jsonify(districts=districts.tolist())  # Ensure to convert numpy array to list
