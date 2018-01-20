#!/usr/bin/python3
"""Flask app to generate complete html page containing location/amenity
dropdown menus and rental listings"""
from flask import Flask, request, make_response, redirect
from flask_cors import CORS

from os import getenv
import requests
import smtplib

app = Flask(__name__)
app.url_map.strict_slashes = False
cors = CORS(app, resources={r"/*": {"origins": "*"}})

app.route('/thankyouemail', methods=['GET'])
def send_email(user=None):
    """send email to user"""
    if user is None:
        return (jsonify({"error": "no email provided"}))
    FROM = 'orcateamhub@gmail.com'
    TO = [user]
    message = "Thank you for using Orca!"
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.starttls()
    server.login(FROM, 'elppa123')
    server.sendmail(FROM, TO, message)
    server.quit()
    return (jsonify({"status": "OK"}))

@app.route('/authenticate', methods=['GET'])
def authenticate_user():
    code = request.args.get('code')
    if code:
        data = {'code': code}
        data['client_id'] = getenv('CLIENT_ID')
        data['client_secret'] = getenv('CLIENT_SECRET')
        r = requests.post('https://github.com/login/oauth/access_token',
                          data=data, headers={'Accept': 'application/json'})
        if r.status_code == 200:
            auth_json = r.json()
            redirect_to_repos = redirect('https://orcas.holberton.us/repos')
            response = make_response(redirect_to_repos)
            response.set_cookie('access_token',
                                value=auth_json.get('access_token'))
            return response
    else:
        return redirect('https://orcas.holberton.us')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
