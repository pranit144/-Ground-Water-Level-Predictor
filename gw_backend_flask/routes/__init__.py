from flask import Blueprint

# Import Blueprints
from .optimum_gw_route import bp as optimum_gw_bp
from .geospatial_route import bp as geospatial_analysis_bp
from .hydrogeology_route import bp as hydrogeology_bp
from .elevation_route import bp as elevation_bp
from .population_route import bp as population_bp
from .rainfall_trend_analysis_route import bp as rainfall_trend_analysis_bp
from .rainfall_refresh_rate_route import bp as rainfall_refresh_rate_bp
from .tidal_cycle_analysis_route import bp as tidal_cycle_analysis_bp
from .tidal_cycle_predict_route import bp as tidal_cycle_predict_bp
from .predict_route import bp as gw_level_predictor_bp
def register_blueprints(app):
    app.register_blueprint(optimum_gw_bp,url_prefix="/api")
    app.register_blueprint(geospatial_analysis_bp,url_prefix="/api/geospatial_analysis")
    app.register_blueprint(hydrogeology_bp, url_prefix="/api/hydrogeology")
    app.register_blueprint(elevation_bp, url_prefix="/api/elevation")
    app.register_blueprint(population_bp, url_prefix="/api/population")
    app.register_blueprint(rainfall_trend_analysis_bp, url_prefix="/api/rainfall/analysis")
    app.register_blueprint(rainfall_refresh_rate_bp, url_prefix="/api/rainfall/refresh_rate")
    app.register_blueprint(tidal_cycle_analysis_bp, url_prefix="/api/tidal_cycle/analysis")
    app.register_blueprint(tidal_cycle_predict_bp, url_prefix="/api/tidal_cycle/predict")
    app.register_blueprint(gw_level_predictor_bp, url_prefix="/api/predict")