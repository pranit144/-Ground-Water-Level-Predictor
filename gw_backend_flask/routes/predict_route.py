from flask import Flask, render_template, request, jsonify, Blueprint
import joblib
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import plotly.graph_objects as go
import plotly.io as pio
from geopy.geocoders import Nominatim
import google.generativeai as genai
import os

bp = Blueprint('gw_level_predictor', __name__, template_folder='templates', static_folder='static')


# Load models
model_ground_water_path = os.path.abspath('models/SIH1696_groudnwaterprediction.pkl')
model_depth_path = os.path.abspath('models/SIH1696_welldepth.pkl')
model_well_type_path = os.path.abspath('models/SIH1696_welltype.pkl')
model_aquifer_path = os.path.abspath('models/SIH1696aquifer_model.pkl')

model_ground_water = joblib.load(model_ground_water_path)
model_depth = joblib.load(model_depth_path)
model_well_type = joblib.load(model_well_type_path)
model_aquifer = joblib.load(model_aquifer_path)

# Define the mappings used in encoding
well_type_mapping = {0: 'Dug Well', 1: 'Bore Well', 2: 'Tube Well', 3: 'Dug Cum Bore'}
aquifer_type_mapping = {0: 'Semi confined', 1: 'Semi Confined', 2: 'Granite', 3: 'Basalt', 4: 'Basic Rocks (Basalt)',
                        5: 'Younger Alluvium (Clay/Silt/Sand/ Calcareous concr)', 6: 'Limestone', 7: 'Sandstone',
                        8: 'Phreatic/Shale', 9: 'Unconfined', 10: 'Shale', 11: 'Unconfined Aquifer',
                        12: 'Lathi Formation', 13: 'Older Alluvium', 14: 'Unconfined to Semi Confined',
                        15: 'Younger Alluvium', 16: 'Alluvium', 17: 'Gneiss', 18: 'Schist', 19: 'Unconfined ',
                        20: 'Tertiary Sandstone', 21: 'Alluvium(S)', 22: 'Allu./Qtz', 23: 'Semi-Confined To Confined',
                        24: 'Unconfined and Confined', 25: 'Unconfined To Semi-Confined',
                        26: 'Unconfined, Confined & Leaky Confined', 27: 'Qtz./Schist', 28: 'SANDSTONE',
                        29: 'Phreatic/Granite', 30: 'BASALT', 31: 'Phreatic/Basalt', 32: 'Phreatic',
                        33: 'Alluvium/Sandstone', 34: 'Shale / Sandstone', 35: 'Shale & Sandstone',
                        36: 'Shale / Limestone', 37: 'Phreatic/Sandstone', 38: 'Schist/ Phylite/ Gneisses', 39: 'BGC',
                        40: 'Granite Gneisses', 41: 'Alluvium/Limetone', 42: 'Allu./Sandstone', 43: 'Gneisses',
                        44: 'Quartzite', 45: 'OLDER ALLUVIUM', 46: 'Shale/Sandstone'}

# Initialize Nominatim API
geolocator = Nominatim(user_agent="app.py")

# Load data
data_path = os.path.abspath('data/finalgroundwaterdataSIH1696.csv')
df = pd.read_csv(data_path)


# Prediction function
def predict_all(latitude, longitude, month, year):
    month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
             "November", "December"].index(month) + 1
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)
    ground_water_level = model_ground_water.predict([[latitude, longitude, month_sin, month_cos, year]])[0].round(2)
    well_depth = model_depth.predict([[latitude, longitude]])[0].round(2)
    well_type_pred = model_well_type.predict([[latitude, longitude]])[0]
    well_type = well_type_mapping[well_type_pred]
    aquifer_type_pred = model_aquifer.predict([[latitude, longitude]])[0]
    aquifer_type = aquifer_type_mapping[aquifer_type_pred]

    # Count Nearby Wells
    coordinates = df[['LATITUDE', 'LONGITUDE']].values
    nn = NearestNeighbors(radius=0.25)  # Define a suitable radius for your area
    nn.fit(coordinates)
    distances, indices = nn.radius_neighbors([[latitude, longitude]])
    well_count = len(indices[0])

    # Find 5 nearest points using KNN
    nn = NearestNeighbors(n_neighbors=5)  # Find 5 nearest neighbors
    nn.fit(coordinates)
    distances, indices = nn.kneighbors([[latitude, longitude]])
    nearest_points = df.iloc[indices[0]]
    nutrient_info = nearest_points[['pH', 'electrical conductivity', 'TDS (mg/l)', 'Total Hardness (mg/l)',
                                    'Calcium (mg/l)', 'Magnesium (mg/l)', 'Sodium (mg/l)', 'Potassium (mg/l)',
                                    'Carbonate (mg/l)', 'Bicarbonate (mg/l)', 'Sulphate (mg/l)',
                                    'Chloride (mg/l)', 'Fluoride (mg/l)', 'Nitrate (mg/l)']]
    average_nutrients = nutrient_info.mean().round(2)

    return ground_water_level, well_depth, well_type, aquifer_type, well_count, average_nutrients


# AI configuration
genai.configure(api_key='AIzaSyBCYG1m-yKCufYF3UaNDmj9TUpJ5DZ1UOA')
model = genai.GenerativeModel("gemini-1.5-flash")


def generate_ai_suggestions(data):
    prompt = (
        "This are my ground water stats:\n"
        f"Ground Water Level: {data['ground_water_level']} m\n"
        f"Well Depth: {data['well_depth']} m\n"
        f"Well Type suggested : {data['well_type']}\n"
        f"Aquifer Type: {data['aquifer_type']}\n"
        f"nearby Well Count: {data['well_count']}\n"
        f"Average Nutrients or water values :\n{data['average_nutrients']}\n"
        "give left align heading to this text (h1) AI Based Suggestions, now go through each and every quality and stats.each stats heading left align h3 green and stat text from left to right in black.I want in-depth analysis and suggestion on ground water quality. First start with aquifer type. Describe the aquifer type then comment on ground water level and probable well depth, and then tell some suggestive facts on nearby well count and well type suggestion align them properly so that each heading and paragraph can have systematic padding and layout. Then move on to each and every water quality and tell whether it is in the normal range or low or high.In this at last give proper central align table (only want table with porper borders) for each parameter (features of table : remarks -good,bad,normal and chemical significance compulsary for all) (like if ex:ph-6.35 then acidic water) note that the table should always align center but the contents in the table should be align from left to right. At last, tell if w which parameters are bad, which are good and suitable. Use suggestions for water like drinking, bathing, irrigation, any suggestible use. while each subtopic should be central align and its content start from next line left, dont give markdown stlyes like **** or ## also each line on new line , i am rendering this text in html so be sure to give proper aligned and format report without markdowns, all heading should not be bold. dont give even *** or ### each new sentence on a new line followed by a full stop. i want proper report format all sentences justified and headings left align with spacing.all heading in blue in blue font, all subheadings in green font. i want porper interactive report porper spacing , boldness headings etc but dont involve markdown element like # , **etc. all central align justified and not include **. i want all in one a proper report all heading central align text left align justified proper spacing and for last point as well all sentences seperated by newline and ensure that all the content is having proper spacing and padding so that it can looks systematic and properly align"
    )
    response = model.generate_content(prompt)
    return response.text


@bp.route('/')
def index():
    states = df['STATE/UT'].unique()
    return render_template('predict/index.html', states=states)


@bp.route('/districts/<state>')
def get_districts(state):
    districts = df[df['STATE/UT'] == state]['DISTRICT'].unique()
    return jsonify(districts.tolist())


@bp.route('/tehsils/<state>/<district>')
def get_tehsils(state, district):
    tehsils = df[(df['STATE/UT'] == state) & (df['DISTRICT'] == district)]['TEHSIL'].unique()
    return jsonify(tehsils.tolist())


@bp.route('/villages/<state>/<district>/<tehsil>')
def get_villages(state, district, tehsil):
    villages = df[(df['STATE/UT'] == state) & (df['DISTRICT'] == district) & (df['TEHSIL'] == tehsil)][
        'VILLAGE'].unique()
    return jsonify(villages.tolist())


@bp.route('/', methods=['POST'])
def predict():
    option = request.form.get('option')

    if option == 'location':
        state = request.form.get('state')
        district = request.form.get('district')
        tehsil = request.form.get('tehsil')
        village = request.form.get('village')
        month = request.form.get('month')
        year = int(request.form.get('year'))

        location_name = tehsil
        location_data = geolocator.geocode(location_name)
        if location_data:
            latitude = location_data.latitude
            longitude = location_data.longitude
            month=month
            year=year
            ground_water_level, well_depth, well_type, aquifer_type, well_count, average_nutrients = predict_all(
                latitude, longitude, month, year)
            location_address = geolocator.reverse(f"{latitude}, {longitude}", exactly_one=True).address
            # Chart 1: Nearest point - Ground Water Trends over Time
            nbrs = NearestNeighbors(n_neighbors=1, algorithm='ball_tree').fit(df[['LATITUDE', 'LONGITUDE']])
            distances, indices = nbrs.kneighbors([[latitude, longitude]])
            nearest_point = df.iloc[indices[0][0]]

            fig1 = go.Figure()
            fig1.add_trace(go.Scatter(
                x=['Mar-22', 'Aug-22', 'Nov-22', 'Jan-23'],
                y=nearest_point[['Mar-22', 'Aug-22', 'Nov-22', 'Jan-23']].values,
                mode='lines+markers',
                marker=dict(size=10),
                line=dict(width=2),
                name='Ground Water Level'
            ))
            fig1.update_layout(
                xaxis_title='Timeline',
                yaxis_title='Ground Water Level',
                title='Ground Water Trends Over Time'
            )

            # Chart 2: Ground Water Level Gauge
            fig_gwl = go.Figure(go.Indicator(
                mode="gauge+number",
                value=ground_water_level,
                title={'text': "Ground Water Level (m)"},
                gauge={'axis': {'range': [0, 20]}, 'bar': {'color': 'blue'}}
            ))

            # Chart 3: Well Depth Gauge
            fig_depth = go.Figure(go.Indicator(
                mode="gauge+number",
                value=well_depth,
                title={'text': "Well Depth (m)"},
                gauge={'axis': {'range': [0, 100]}, 'bar': {'color': 'green'}}
            ))

            # Generate AI suggestions
            ai_suggestions = generate_ai_suggestions({
                'ground_water_level': ground_water_level,
                'well_depth': well_depth,
                'well_type': well_type,
                'aquifer_type': aquifer_type,
                'well_count': well_count,
                'average_nutrients': average_nutrients.to_dict()
            })
            # Pass the chart HTML and AI suggestions to the template
            return render_template(
                'predict/result.html',
                latitude=latitude,
                longitude=longitude,
                location_address=location_address,
                ground_water_level=ground_water_level,
                well_depth=well_depth,
                well_type=well_type,
                aquifer_type=aquifer_type,
                well_count=well_count,
                average_nutrients=average_nutrients.to_dict(),
                ai_suggestions=ai_suggestions,
                fig1=fig1.to_html(full_html=False),
                fig_gwl=fig_gwl.to_html(full_html=False),
                fig_depth=fig_depth.to_html(full_html=False)
            )

        else:
            return "Location not found", 404

    elif option == 'latlong':
        latitude = float(request.form.get('latitude'))
        longitude = float(request.form.get('longitude'))
        month = request.form.get('month')
        year = int(request.form.get('year'))
        location_data = geolocator.reverse(f"{latitude}, {longitude}", exactly_one=True)
        location_address = location_data.address if location_data else "Address not found"

        ground_water_level, well_depth, well_type, aquifer_type, well_count, average_nutrients = predict_all(
            latitude, longitude, month, year)

        # Chart 1: Nearest point - Ground Water Trends over Time
        nbrs = NearestNeighbors(n_neighbors=1, algorithm='ball_tree').fit(df[['LATITUDE', 'LONGITUDE']])
        distances, indices = nbrs.kneighbors([[latitude, longitude]])
        nearest_point = df.iloc[indices[0][0]]

        fig1 = go.Figure()
        fig1.add_trace(go.Scatter(
            x=['Mar-22', 'Aug-22', 'Nov-22', 'Jan-23'],
            y=nearest_point[['Mar-22', 'Aug-22', 'Nov-22', 'Jan-23']].values,
            mode='lines+markers',
            marker=dict(size=10),
            line=dict(width=2),
            name='Ground Water Level'
        ))
        fig1.update_layout(
            xaxis_title='Timeline',
            yaxis_title='Ground Water Level',
            title='Ground Water Trends Over Time'
        )

        # Chart 2: Ground Water Level Gauge
        fig_gwl = go.Figure(go.Indicator(
            mode="gauge+number",
            value=ground_water_level,
            title={'text': "Ground Water Level (m)"},
            gauge={'axis': {'range': [0, 20]}, 'bar': {'color': 'blue'}}
        ))

        # Chart 3: Well Depth Gauge
        fig_depth = go.Figure(go.Indicator(
            mode="gauge+number",
            value=well_depth,
            title={'text': "Well Depth (m)"},
            gauge={'axis': {'range': [0, 100]}, 'bar': {'color': 'green'}}
        ))

        # Generate AI suggestions
        ai_suggestions = generate_ai_suggestions({
            'ground_water_level': ground_water_level,
            'well_depth': well_depth,
            'well_type': well_type,
            'aquifer_type': aquifer_type,
            'well_count': well_count,
            'average_nutrients': average_nutrients.to_dict()
        })

        # Pass the chart HTML and AI suggestions to the template
        return render_template(
            'predict/result.html',
            latitude=latitude,
            longitude=longitude,
            location_address=location_address,
            ground_water_level=ground_water_level,
            well_depth=well_depth,
            well_type=well_type,
            aquifer_type=aquifer_type,
            well_count=well_count,
            average_nutrients=average_nutrients.to_dict(),
            ai_suggestions=ai_suggestions,
            fig1=fig1.to_html(full_html=False),
            fig_gwl=fig_gwl.to_html(full_html=False),
            fig_depth=fig_depth.to_html(full_html=False)
        )

    else:
        return "Invalid option selected", 400