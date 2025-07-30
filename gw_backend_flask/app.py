from flask import Flask
from flask_cors import CORS
from routes import register_blueprints

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}},supports_credentials=True,methods=["GET", "POST"])

# Register all Blueprints
register_blueprints(app)

if __name__ == '__main__':
    app.run(debug=True)
