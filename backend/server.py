from flask import Flask, jsonify, request, session, url_for
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
from auth import create_auth_blueprint
from aws import create_aws_blueprint
import boto3, botocore
import uuid


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

#is_logged_in = False

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


@app.route("/createUser", methods=["POST"])
def createUser():
    data = request.get_json()
    try:
        email = [data.get('email')]
        print(f'email is: {email}')
        print(f"request.get_json(): {request.get_json()}")
        sql_query = 'INSERT INTO users (email) VALUES (%s);'
        
        cursor = db.cursor() # allows us to excute MySQL queries
        cursor.execute(sql_query, (email))
        db.commit()
        
        return jsonify({
            'message': 'Successfully created user!'
        }), 200
    except Exception as e:
        return jsonify({
            "Error": str(e)
        }), 500
        
@app.route("/hasAccount", methods=["POST"])
def checkHasAccount():
    data = request.get_json()
    try:
        sql_query = 'SELECT email FROM users WHERE email = (%s);'
        email = data.get('email')
        
        cursor = db.cursor() # allows us to excute MySQL queries
        cursor.execute(sql_query, (email,))
        result = cursor.fetchone()

        if result is None:
            return jsonify({
                'hasAccount': False
            })
        else:
            return jsonify({
                'hasAccount': True
            })
        
    except Exception as e:
        return jsonify({
            "Error": str(e)
        }), 500
        
        
# retrieve image from SQL SERVER
@app.route("/getImages", methods=["GET"])
def getImages():
    try:
        sql_query = 'SELECT user_id, image_url, image_category FROM images WHERE user_id = (%s);'
        
        cursor = db.cursor()
        cursor.execute(sql_query, (24,))
        results = cursor.fetchall()

        data = []
        
        for result in results:            
            user_id = result[0]
            image_url = result[1]
            image_category = result[2]
            
            information = {
                'image_url': image_url,
                'image_category': image_category,
                'user_id': user_id,
            }
            
            data.append(information)
        
        if result is None:
            return jsonify({
                "ImageURL": "N/A"
            }), 500
        else:
            return data, 200
    except Exception as e:
        return jsonify({
            "Error": str(e)
        }), 500
        
    
auth_bp = create_auth_blueprint(google)
app.register_blueprint(auth_bp)

aws_bp = create_aws_blueprint()
app.register_blueprint(aws_bp) 
        


if __name__=="__main__":
    print("connecting to DB...")
    app.run(debug=True)