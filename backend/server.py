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


'''
# SECTION START FOR IMAGE UPLOAD AND RETRIEVAL FROM AWS S3
ALLOWED_EXTENSIONS = {'png', 'heic', 'jpeg', 'jpg'}

AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploadFile', methods=["POST"])
def uploadFile(acl="public-read"):
    if 'file-to-save' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    
    uploaded_file = request.files["file-to-save"]
    print(f'uploaded_file:', uploaded_file)
    
    if not allowed_file(uploaded_file.filename):
        return jsonify({
            "Error": "FILE NOT ALLOWED!"
        })    
    
    secure_filename = uuid.uuid4().hex + '.' + uploaded_file.filename.rsplit('.', 1)[1].lower() # generates a unique number for us
    
    try:
        s3.upload_fileobj(
            uploaded_file,
            AWS_BUCKET_NAME,
            secure_filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": uploaded_file.content_type 
            }
        )
        
        s3_url = f"http://{AWS_BUCKET_NAME}.s3.amazonaws.com/{secure_filename}"
        
        return jsonify({
            "message": "Upload successful",
            "filename": secure_filename,
            "url": s3_url
        }), 200
    
    except Exception as e:
        return jsonify({
            "Error": str(e)
        }), 500
'''


# SECTION END FOR IMAGE UPLOAD AND RETRIEVAL FROM AWS S3

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
        
    
auth_bp = create_auth_blueprint(google)
app.register_blueprint(auth_bp)

aws_bp = create_aws_blueprint()
app.register_blueprint(aws_bp) 
        


if __name__=="__main__":
    print("connecting to DB...")
    app.run(debug=True)