from flask import Flask, jsonify, make_response, redirect, render_template, request, session, url_for
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
import time

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

is_logged_in = False

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

# login for google
@app.route("/login/google")
def login_google():
    try:
        redirect_uri = url_for('authorize_google',_external=True) # _external so that the google pop up window comes out to log in
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        app.logger.error(f'Error during login: {str(e)}')
        return {'Error during login': str(e)}, 500


# authorize for google
@app.route("/authorize/google")
def authorize_google():
    try:
        token = google.authorize_access_token()
        userinfo_endpoint = google.server_metadata['userinfo_endpoint'] 
        resp = google.get(userinfo_endpoint)
        user_info = resp.json()
        username = user_info['email']
        
        session['username'] = username
        session['oauth_token'] = token
        
        return redirect(url_for('routing'))
    except Exception as e:
        app.logger.error(f'Error during authorization: {str(e)}')
        return {'Error during authorization': str(e)}, 500

@app.route("/routing")
def routing():
    global is_logged_in
    if 'username' in session:
        is_logged_in = True
        print("is_logged_in @ routing", is_logged_in)
        return redirect(f'{SERVER}/Home')
    else:
        return redirect(f'{SERVER}/')
    
@app.route("/getData", methods=['GET'])
def getData():
    global is_logged_in
    try:
        print("is_logged_in @ getData", is_logged_in)
        if is_logged_in:
            return jsonify({
                'email': session['username'],
                'data': session['oauth_token']
            }), 200
        else:
            session.clear()
            return jsonify({
                'email': 'UNDEFINED',
                'data': 'UNDEFINED'
            })
    except Exception as e:
        return jsonify({
            'Error': str(e)
        })
    
    
@app.route("/logout", methods=["POST"])
def logout():
    # Remove the user session data
    global is_logged_in
    try:
        is_logged_in = False 
        print("is_logged_in @ logout", is_logged_in)
       
        return jsonify({"message": "Logged out successfully"}), 200 
    except Exception as e:
        return jsonify({"Error": str(e)})

@app.route("/isLoggedIn") # just a test route I am using to make sure log out works
def isLoggedIn():
    global is_logged_in
    print("is_logged_in @ isLoggedIn", is_logged_in)
    return jsonify({
        'isLoggedIn': is_logged_in
    })

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
        


if __name__=="__main__":
    print("connecting to DB...")
    app.run(debug=True)