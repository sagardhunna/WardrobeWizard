from flask import jsonify, Blueprint, request
import json
import os
from dotenv import load_dotenv
import mysql.connector


def create_mysql_db_blueprint():
    load_dotenv()
    
    WARDROBE_MYSQL_HOST= os.getenv("WARDROBE_MYSQL_HOST")
    WARDROBE_MYSQL_USER= os.getenv("WARDROBE_MYSQL_USER")
    WARDROBE_MYSQL_PASSWORD = os.getenv("WARDROBE_MYSQL_PASSWORD")
    WARDROBE_MYSQL_DATABASE = os.getenv("WARDROBE_MYSQL_DATABASE")
    
    def get_db_connection():
        return mysql.connector.connect(
            host=WARDROBE_MYSQL_HOST,
            user=WARDROBE_MYSQL_USER,
            password=WARDROBE_MYSQL_PASSWORD,
            database=WARDROBE_MYSQL_DATABASE,
            connection_timeout=10
        )
    
    
    mysql_db = Blueprint('mysql_db', __name__)
    
    @mysql_db.route("/createUser", methods=["POST"])
    def createUser():
        data = request.get_json()
        try:
            email = [data.get('email')]
            print(f'email is: {email}')
            print(f"request.get_json(): {request.get_json()}")
            sql_query = 'INSERT INTO users (email) VALUES (%s);'
            
            db = get_db_connection
            
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
        finally:
            cursor.close()
            db.close()
            
    @mysql_db.route("/hasAccount", methods=["POST"])
    def checkHasAccount():
        data = request.get_json()
        try:
            sql_query = 'SELECT email FROM users WHERE email = (%s);'
            email = data.get('email')
            
            db = get_db_connection()
            
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
        finally:
            cursor.close()
            db.close()
            
            
    @mysql_db.route("/viewUsers", methods=["GET"])
    def viewUsers():
        try:
            sql_query = 'SELECT * FROM users;'
            
            db = get_db_connection()
            cursor = db.cursor()
            
            cursor.execute(sql_query)
            results = cursor.fetchall()
            
            data = []
            
            for result in results: 
                user_id = result[0]
                user_email = result[1]           
                            
                information = {
                    'user_id': user_id,
                    'user_email': user_email
                }
                
                data.append(information)
            
            return data, 200
        except Exception as e:
            return jsonify({
                "Error": str(e)
            }), 500
        finally:
            cursor.close()
            db.close()
            
            
    # when calling this api, we will pass the user_id, image_category, and image_url        
    @mysql_db.route("/saveImageToSQL", methods=["POST"])
    def saveImageToSQL():
        data = request.get_json()
        try:
            image_category = data.get('image_category')
            user_id = data.get('user_id')
            image_url = data.get('image_url')
                
            sql_query = 'INSERT INTO images (image_category, user_id, image_url) VALUES (%s, %s, %s);'
            
            db = get_db_connection()
            
            cursor = db.cursor()
            
            cursor.execute(sql_query, (image_category, user_id, image_url))
            
            db.commit()
            
            return jsonify({
                'message': 'Successfully inserted image into database'
            }), 200
        except Exception as e:
            return jsonify({
                "Error": str(e)
            }), 500        
        finally:
            cursor.close()
            db.close()
            
            
    @mysql_db.route("/getUserID", methods=["POST"])
    def getUserID():
        data = request.get_json()
        try:
            user_email = data.get('user_email')
            
            sql_query = "SELECT user_id from users WHERE email = (%s);"
            
            db = get_db_connection()
            
            cursor = db.cursor()
            
            cursor.execute(sql_query, (user_email,))
            
            result = cursor.fetchone()
            
            return jsonify({
                "user_id": result[0]
            }), 200
        
        except Exception as e:
            return jsonify({
                'Error': str(e)
            }), 500
        finally:
            cursor.close()
            db.close()
            
    @mysql_db.route("/viewImages", methods=["GET"])
    def viewImages():
        try:
            sql_query = 'SELECT * FROM images;'
            
            
            db = get_db_connection()
            cursor = db.cursor()
            
            cursor.execute(sql_query)
            results = cursor.fetchall()
            
            data = []
            
            for result in results: 
                image_category = result[1]           
                user_id = result[2]
                image_url = result[3]
                
                information = {
                    'image_url': image_url,
                    'image_category': image_category,
                    'user_id': user_id,
                }
                
                data.append(information)
            
            return data, 200
        except Exception as e:
            return jsonify({
                "Error": str(e)
            })    
        finally:
            cursor.close()
            db.close()
            
                        
    # retrieve image from SQL SERVER
    @mysql_db.route("/getImages", methods=["POST"])
    def getImages():
        data = request.get_json()
        try:
            user_id = data.get("user_id")
            sql_query = 'SELECT user_id, image_url, image_category FROM images WHERE user_id = (%s);'
            
            
            db = get_db_connection()
            
            cursor = db.cursor()
            cursor.execute(sql_query, (user_id,))
            results = cursor.fetchall()

            if results is None:
                return jsonify({
                    "ImageURL": "N/A"
                }), 500

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
            
            return data, 200
        except Exception as e:
            return jsonify({
                "Error": str(e)
            }), 500
        finally:
            cursor.close()
            db.close()
            
                        
            
    @mysql_db.route("/saveOutfit", methods=["POST"])
    def saveOutfit():
        data = request.get_json()
        try:
            outfit_arr = data.get("complete_outfit")
            user_id = data.get("user_id")
            
            outfit_json = json.dumps(outfit_arr) # converts to a json string so that mysql can read it
            
            sql_query = "INSERT INTO outfits (user_id, outfit) VALUES (%s, %s);"
            
            db = get_db_connection()
            
            cursor = db.cursor()
            cursor.execute(sql_query, (user_id, outfit_json))
            
            db.commit()
            
            return jsonify({
                "message": "Successfully inserted outfit into database!"
            }), 200
            
        except Exception as e:
            return jsonify({
                "Error": str(e)
            }), 500
        finally:
            cursor.close()
            db.close()
            
            
    @mysql_db.route("/getOutfits", methods=["POST"])
    def getOutfits():
        data = request.get_json()
        try:
            user_id = data.get("user_id")
            
            sql_query = "SELECT outfit FROM outfits WHERE user_id = (%s);"
            
            
            db = get_db_connection()
            cursor = db.cursor()
            cursor.execute(sql_query, (user_id,))
            results = cursor.fetchall()

            if results is None:
                return jsonify({
                    "Outfits": "None"
                }), 500
                
                
            outfits = []
            
            for result in results:
                outfit_json = result[0]
                outfit = json.loads(outfit_json) # converts json to python array so its easier to read
                outfits.append(outfit)
            
            return outfits, 200
            
        except Exception as e:
            return jsonify({
                "Error": str(e)
            }), 500
        finally:
            cursor.close()
            db.close()
            
                        
    return mysql_db