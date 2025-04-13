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

MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")
SERVER = os.getenv("SERVER")

app.secret_key = SECRET_KEY
CORS(app, origins=[SERVER], supports_credentials=True)

db = mysql.connector.connect(
    host='localhost',
    user='root',
    password=MYSQL_PASSWORD,
    database=MYSQL_DATABASE
)


@app.route("/")
def home():
    return "<h1>Welcome to Wizard Wardrobe Backend</h1>"


oauth = OAuth(app)

google = oauth.register(
    name='google',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    access_token_url= "https://www.googleapis.com/oauth2/v4/token",
    access_token_params=None,
    authorize_url= "https://accounts.google.com/o/oauth2/v2/auth",
    authorize_params=None,
    api_base_url= "https://www.googleapis.com/oauth2/v3/",
    client_kwargs= {"scope": "openid email profile"},
    server_metadata_url= 'https://accounts.google.com/.well-known/openid-configuration'
)

mysql_db_bp = create_mysql_db_blueprint(db)
app.register_blueprint(mysql_db_bp)
    
auth_bp = create_auth_blueprint(google)
app.register_blueprint(auth_bp)

aws_bp = create_aws_blueprint()
app.register_blueprint(aws_bp) 
        


if __name__=="__main__":
    print("connecting to DB...")
    app.run(debug=True)