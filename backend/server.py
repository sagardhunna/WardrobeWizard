from flask import Flask, jsonify, request, session, url_for
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
from auth import create_auth_blueprint
from aws import create_aws_blueprint
from mysql_db import create_mysql_db_blueprint

app = Flask(__name__)

app.config.update(
    SESSION_COOKIE_SAMESITE='None',  # Allow cross-origin cookies
    SESSION_COOKIE_SECURE=True,      # Make sure the cookie is sent over HTTPS
)

load_dotenv()

WARDROBE_MYSQL_PASSWORD = os.getenv("WARDROBE_MYSQL_PASSWORD")
WARDROBE_MYSQL_DATABASE = os.getenv("WARDROBE_MYSQL_DATABASE")
WARDROBE_CLIENT_ID = os.getenv("WARDROBE_CLIENT_ID")
WARDROBE_CLIENT_SECRET = os.getenv("WARDROBE_CLIENT_SECRET")
WARDROBE_SECRET_KEY = os.getenv("WARDROBE_SECRET_KEY")
WARDROBE_SERVER = os.getenv("WARDROBE_SERVER")

WARDROBE_MYSQL_HOST= os.getenv("WARDROBE_MYSQL_HOST")
WARDROBE_MYSQL_USER= os.getenv("WARDROBE_MYSQL_USER")

app.secret_key = WARDROBE_SECRET_KEY
CORS(app, origins=[WARDROBE_SERVER], supports_credentials=True)

# def get_db_connection():
#     return mysql.connector.connect(
#         host=WARDROBE_MYSQL_HOST,
#         user=WARDROBE_MYSQL_USER,
#         password=WARDROBE_MYSQL_PASSWORD,
#         database=WARDROBE_MYSQL_DATABASE,
#         connection_timeout=10
#     )


@app.route("/")
def home():
    return "<h1>Welcome to Wizard Wardrobe Backend</h1>"


oauth = OAuth(app)

google = oauth.register(
    name='google',
    client_id=WARDROBE_CLIENT_ID,
    client_secret=WARDROBE_CLIENT_SECRET,
    access_token_url= "https://www.googleapis.com/oauth2/v4/token",
    access_token_params=None,
    authorize_url= "https://accounts.google.com/o/oauth2/v2/auth",
    authorize_params=None,
    api_base_url= "https://www.googleapis.com/oauth2/v3/",
    client_kwargs= {"scope": "openid email profile"},
    server_metadata_url= 'https://accounts.google.com/.well-known/openid-configuration'
)

mysql_db_bp = create_mysql_db_blueprint()
app.register_blueprint(mysql_db_bp)
    
auth_bp = create_auth_blueprint(google)
app.register_blueprint(auth_bp)

aws_bp = create_aws_blueprint()
app.register_blueprint(aws_bp) 
        


if __name__=="__main__":
    print("connecting to DB...")
    app.run(debug=True)