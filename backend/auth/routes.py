from flask import jsonify, redirect, session, url_for, Blueprint
import os
from dotenv import load_dotenv

is_logged_in = False


def create_auth_blueprint(google):
    SERVER = os.getenv("SERVER")
        
    auth_bp = Blueprint('auth', __name__)
    
    # login for google
    @auth_bp.route("/login/google")
    def login_google():
        try:
            redirect_uri = url_for('auth.authorize_google',_external=True) # _external so that the google pop up window comes out to log in
            return google.authorize_redirect(redirect_uri)
        except Exception as e:
            return {'Error during login': str(e)}, 500


    # authorize for google
    @auth_bp.route("/authorize/google")
    def authorize_google():
        try:
            token = google.authorize_access_token()
            userinfo_endpoint = google.server_metadata['userinfo_endpoint'] 
            resp = google.get(userinfo_endpoint)
            user_info = resp.json()
            username = user_info['email']
            
            session['username'] = username
            session['oauth_token'] = token
            
            return redirect(url_for('auth.routing'))
        except Exception as e:
            return {'Error during authorization': str(e)}, 500

    @auth_bp.route("/routing")
    def routing():
        global is_logged_in
        if 'username' in session:
            is_logged_in = True
            print("is_logged_in @ routing", is_logged_in)
            return redirect(f'{SERVER}/Home')
        else:
            return redirect(f'{SERVER}/')
        
    @auth_bp.route("/getData", methods=['GET'])
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
        
        
    @auth_bp.route("/logout", methods=["POST"])
    def logout():
        # Remove the user session data
        global is_logged_in
        try:
            is_logged_in = False 
            print("is_logged_in @ logout", is_logged_in)
        
            return jsonify({"message": "Logged out successfully"}), 200 
        except Exception as e:
            return jsonify({"Error": str(e)})

    @auth_bp.route("/isLoggedIn") # just a test route I am using to make sure log out works
    def isLoggedIn():
        global is_logged_in
        print("is_logged_in @ isLoggedIn", is_logged_in)
        return jsonify({
            'isLoggedIn': is_logged_in
        })
        
        
    return auth_bp