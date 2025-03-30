from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
import google_auth_oauthlib

app = Flask(__name__)
CORS(app)

load_dotenv()
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")

db=mysql.connector.connect(
    host='localhost',
    user='root',
    password=MYSQL_PASSWORD,
    database=MYSQL_DATABASE
)

@app.route("/")
def home():
    return "<h1>Welcome to Wizard Wardrobe Backend</h1>"

@app.route('/getTables', methods=['GET'])
def get_tables():
    cursor=db.cursor()
    cursor.execute("SHOW TABLES;")
    tables=cursor.fetchall() # fetches the vessel from the cursor variable
    cursor.close()
    db.close()
    print(tables)
    table_names=[table[0] for table in tables]
    return jsonify({"tables":table_names}), 200

@app.route("/addStudent", methods=["POST"])
def add_student():
    try:
        data=request.get_json()
        name=data.get('name')
        mark=data.get('mark')

        cursor=db.cursor() # allows us to execute mysql queries
        sql_query = 'INSERT INTO students (name, mark) VALUES (%s, %s);'
        cursor.execute(sql_query, (name, mark))
        db.commit()

        return jsonify({'message': 'Successfully added student'}), 200
    except Exception as e:
        return jsonify({'Error': f'{e}'}), 405

@app.route("/viewStudents", methods=["GET"])
def view_students():
    cursor=db.cursor()

    sql_query='SELECT * FROM students;'
    cursor.execute(sql_query)

    students=cursor.fetchall()
    cursor.close()
    db.close()
    print(students)

    info_map = {}

    for student in students:
        info_map[student[1]] = [f'Student ID: {student[0]}', f'Student Mark: {student[2]}']

    return jsonify(
        info_map
    ), 200

@app.route("/auth-to-refresh")
def auth_to_refresh():
    state = Flask.session['state']
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        'client_secret.json',
        scopes=['https://www.googleapis.com/auth/drive.metadata.readonly'],
        state=state)
    flow.redirect_uri = Flask.url_for('oauth2callback', _external=True)

    authorization_response = Flask.request.url
    flow.fetch_token(authorization_response=authorization_response)

    # Store the credentials in the session.
    # ACTION ITEM for developers:
    #     Store user's access and refresh tokens in your data store if
    #     incorporating this code into your real app.
    credentials = flow.credentials
    Flask.session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'granted_scopes': credentials.granted_scopes}

@app.route("/authToAccess", methods=["POST"])
def authToAccess():
    data = request.get_json()
    
    code = data['auth-code']
    
    return jsonify({'code': code}), 200
    
    


if __name__=="__main__":
    print("dbnecting to DB...")
    app.run(debug=True)