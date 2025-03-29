from flask import Flask, jsonify
import mysql.connector
import os
from dotenv import load_dotenv

app=Flask(__name__)

load_dotenv()
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")

con=mysql.connector.connect(
    host='localhost',
    user='root',
    password=MYSQL_PASSWORD,
    database='mydatabase'
)

@app.route('/getTables', methods=['GET'])
def get_tables():
    cursor=con.cursor()
    cursor.execute("SHOW TABLES;")
    tables=cursor.fetchall() # fetches the vessel from the cursor variable
    cursor.close()
    con.close()
    print(tables)
    table_names=[table[0] for table in tables]
    return jsonify({"tables":table_names}), 200


if __name__=="__main__":
    print("connecting to DB...")
    app.run(debug=True)