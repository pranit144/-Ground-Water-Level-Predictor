from flask import Flask, render_template, request, Blueprint
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import folium
from folium.plugins import HeatMap
import os

bp = Blueprint('hydrogeology', __name__, template_folder='templates', static_folder='static')

def load_data():
    data_path = os.path.abspath('data/finalgroundwaterdata.csv')

    # Load data
    if not os.path.isfile(data_path):
        raise FileNotFoundError(f"Data file not found at path: {data_path}")
    return pd.read_csv(data_path)

def generate_gauge_figures(df, district):
    parameters = ['pH', 'electrical conductivity', 'TDS (mg/l)',
                  'Total Hardness (mg/l)', 'Calcium (mg/l)', 'Magnesium (mg/l)',
                  'Sodium (mg/l)', 'Potassium (mg/l)', 'Carbonate (mg/l)',
                  'Bicarbonate (mg/l)', 'Sulphate (mg/l)', 'Chloride (mg/l)',
                  'Fluoride (mg/l)', 'Nitrate (mg/l)']

    df2 = df[df['DISTRICT'] == district]
    averages = df2[parameters].mean()

    fig_list = []
    for i in range(0, len(parameters), 3):
        figs = []
        for j in range(3):
            if i + j < len(parameters):
                param = parameters[i + j]
                fig = go.Figure()
                fig.add_trace(go.Indicator(
                    mode="gauge+number",
                    value=averages[param],
                    title={"text": param},
                    gauge={"axis": {"range": [0, averages[param] * 1.2]},
                           "bar": {"color": "darkblue"},
                           "steps": [
                               {"range": [0, averages[param] * 0.25], "color": "red"},
                               {"range": [averages[param] * 0.25, averages[param] * 0.5], "color": "yellow"},
                               {"range": [averages[param] * 0.5, averages[param] * 1.2], "color": "green"}
                           ]
                           }
                ))
                fig.update_layout(grid=dict(rows=1, columns=1), title_text="", height=300)
                figs.append(fig)
        fig_list.append(figs)

    return fig_list


def generate_correlation_heatmap(df):
    parameters = ['pH', 'electrical conductivity', 'TDS (mg/l)',
                  'Total Hardness (mg/l)', 'Calcium (mg/l)', 'Magnesium (mg/l)',
                  'Sodium (mg/l)', 'Potassium (mg/l)', 'Carbonate (mg/l)',
                  'Bicarbonate (mg/l)', 'Sulphate (mg/l)', 'Chloride (mg/l)',
                  'Fluoride (mg/l)', 'Nitrate (mg/l)']

    correlation_matrix = df[parameters].corr()
    fig_corr = px.imshow(correlation_matrix, text_auto=True, aspect='auto', color_continuous_scale='Viridis')
    fig_corr.update_layout(height=600)
    return fig_corr


def generate_aquifer_pie_chart(df):
    aquifer_counts = df['AQUIFER'].value_counts()
    total_count = aquifer_counts.sum()
    aquifer_percentages = (aquifer_counts / total_count) * 100
    aquifer_counts_filtered = aquifer_counts[aquifer_percentages >= 2]

    if not aquifer_counts_filtered.empty:
        # Create pie chart
        fig_pie = px.pie(aquifer_counts_filtered, values=aquifer_counts_filtered.values,
                         names=aquifer_counts_filtered.index)

        # Adjust layout
        fig_pie.update_layout(
            title_text=None,
            height=600,  # Increased height
            width=800,   # Increased width to make space for legend
            margin=dict(l=50, r=150, t=0, b=0),  # Adjust margins to make space for legend on the right
            showlegend=True,
            legend=dict(
                orientation="v",  # Vertical orientation
                yanchor="middle",  # Center the legend vertically
                y=0.5,  # Center the legend vertically
                xanchor="left",  # Align the legend to the left
                x=1.05  # Move legend to the right side of the chart
            ),
            paper_bgcolor='rgba(0,0,0,0)',  # Transparent background
            plot_bgcolor='rgba(0,0,0,0)'   # Transparent background
        )

        return fig_pie
    return None



def generate_histogram(df, selected_parameter):
    fig_hardness = px.histogram(df, x=selected_parameter, nbins=10, title=f'{selected_parameter} Distribution')
    fig_hardness.update_layout(title_font_size=20, height=400)
    return fig_hardness


def generate_heatmap(df, parameter_selection):
    df_map = df[['LATITUDE', 'LONGITUDE', parameter_selection]].dropna()
    df_map[parameter_selection] = pd.to_numeric(df_map[parameter_selection], errors='coerce')
    df_map = df_map.dropna()
    sample_size = int(len(df_map) * 0.45)
    df_map = df_map.sample(n=sample_size, random_state=1)

    if parameter_selection == 'pH':
        normal_ranges = {'pH': (6.2, 7.8)}
        normal_range = normal_ranges.get(parameter_selection, (0, 14))
        gradient = {0.0: 'red', 0.1: 'red', 0.3: 'red', 0.4: 'red', 0.5: 'lightgreen',
                    0.6: 'darkblue', 0.7: 'darkblue', 0.8: 'darkblue', 0.9: 'darkblue', 1.0: 'darkblue'}
    else:
        normal_ranges = {'electrical conductivity': (0, 150), 'TDS (mg/l)': (300, 900),
                         'Total Hardness (mg/l)': (20, 180),
                         'Calcium (mg/l)': (0, 200), 'Magnesium (mg/l)': (0, 100), 'Sodium (mg/l)': (0, 200),
                         'Potassium (mg/l)': (0, 10), 'Carbonate (mg/l)': (0, 50), 'Bicarbonate (mg/l)': (0, 200),
                         'Sulphate (mg/l)': (0, 250), 'Chloride (mg/l)': (25, 135), 'Fluoride (mg/l)': (0, 1.5),
                         'Nitrate (mg/l)': (0, 10)}
        normal_range = normal_ranges.get(parameter_selection, (0, 100))
        gradient = {0.2: 'yellow', 0.4: 'cyan', 0.5: 'lightgreen', 0.6: 'green', 0.7: 'orange', 0.8: 'red',
                    0.9: 'darkred'}

    m = folium.Map(location=[20.5937, 78.9629], zoom_start=6)
    heat_data = df_map[['LATITUDE', 'LONGITUDE', parameter_selection]].values.tolist()
    HeatMap(heat_data, min_opacity=0.5, radius=10, blur=15, gradient=gradient).add_to(m)

    for _, row in df_map.iterrows():
        folium.CircleMarker(
            location=[row['LATITUDE'], row['LONGITUDE']],
            radius=1, color='skyblue', fill=True, fill_color='blue', fill_opacity=0.2,
            tooltip=folium.Tooltip(f"{parameter_selection}: {row[parameter_selection]:.2f}")
        ).add_to(m)

    map_html = m._repr_html_()
    return map_html


@bp.route('/', methods=['GET', 'POST'])
def index():
    df = load_data()
    districts = df['DISTRICT'].unique()
    selected_district = None
    if request.method == 'POST':
        if 'district' in request.form:
            district = request.form.get('district')
            selected_district = district  # Store selected district
            if district:
                fig_list = generate_gauge_figures(df, district)
                correlation_heatmap = generate_correlation_heatmap(df)
                aquifer_pie_chart = generate_aquifer_pie_chart(df)
                print(district)
                print(fig_list)
                print(selected_district)
                return render_template('hydrogeology/index.html',
                                       districts=districts,
                                       selected_district=selected_district,
                                       figures=fig_list,
                                       correlation_heatmap=correlation_heatmap.to_html(full_html=False),
                                       aquifer_pie_chart=aquifer_pie_chart.to_html(
                                           full_html=False) if aquifer_pie_chart else None,
                                       show_histogram=False,
                                       show_heatmap=False)

        elif 'parameter' in request.form:
            selected_parameter = request.form.get('parameter')
            if selected_parameter:
                histogram = generate_histogram(df, selected_parameter)
                heatmap = generate_heatmap(df, selected_parameter)
                return render_template('hydrogeology/index.html',
                                       districts=districts,
                                       selected_district=selected_district,
                                       show_histogram=True,
                                       histogram=histogram.to_html(full_html=False),
                                       show_heatmap=True,
                                       heatmap=heatmap)

    return render_template('hydrogeology/index.html', districts=districts, selected_district=selected_district, show_histogram=False, show_heatmap=False)