from flask import Flask, request

from DatabaseHandler import *
from MailSender import *

app = Flask(__name__)

@app.route('/login')
def login():
    username = request.args.get('username')
    password = request.args.get('password')
    
    if user_exists(username, password):
        return {"access" : "granted"}
    else:
        return {"access" : "denied"}

@app.route('/signup')
def signup():
    first_name = request.args.get('first_name')
    last_name = request.args.get('last_name')
    username = request.args.get('username')
    password = request.args.get('password')
    email = request.args.get('email')
    phone = request.args.get('phone')

    if len(username) < 5:
        return {
                "component" : "username",
                "response" : "This username is shorter than 5 characters. Please try a longer username."
               }

    if len(password) < 8:
        return {
                "component" : "password",
                "response" : "This password is shorter than 8 characters. Please try a longer password."
               }

    if not check_username_copies(username):
        return {
                "component" : "username",
                "response" : "This username has already been taken. Please try a unique username."
               }

    if not check_password_copies(password):
        return {
                "component" : "password",
                "response" : "This username has already been taken. Please try a unique username."
               }

    if email.find("@") == -1 or email.find(".") == -1:
        return {
                "component" : "email",
                "response" : "This is not a valid email address. Please enter a valid email address."
               }

    try:
        int(phone)
    except Exception:
        return {
                "component" : "phone",
                "response" : "This is not a valid phone number. Please enter a valid phone number."
               }

    add_user(first_name, last_name, username, password, email, phone)
    return {"response" : "Accepted"}

@app.route('/signup/verify_code')
def verify_code():
    username = request.args.get('username')
    code = request.args.get('code')

    if verify_user(username, code):
        return {"response" : "Accepted"}
    else:
        return {"response" : "Not Accepted"}

@app.route('/signup/resend_email')
def resend_email():
    name = request.args.get('name')
    username = request.args.get('username')

    update_verif_code(username, signup_verif(name))

    return {"status" : "Sent"}

@app.route('/delete_user')
def delete_profile():
    username = request.args.get('username')
    password = request.args.get('password')
    delete_user(username, password)

    return {"response" : "Done"}

@app.route('/delete_account')
def delete_account():
    username = request.args.get('username')
    password = request.args.get('password')
    if (delete_account_db(username, password) != False):
        return {"response" : "Done"}
    else:
        return {"response" : "Wrong password"}

@app.route('/get_profile')
def get_profile():
    username = request.args.get('username')

    results = get_user(username)
    results = list(results[0][1:])
    results[0] = "First name: " + results[0]
    results[1] = "Last name: " + results[1]
    results[2] = "Username: " + results[2]
    results[3] = "Password: " + results[3]
    results[4] = "Email address: " + results[4]
    results[5] = "Phone number: " + results[5]
    results[6] = "Date joined: " + results[6]
    results[7] = "Reports submitted: " + str(results[7])
    results = [tuple(results)]
    
    return {"profile" : results}

@app.route('/submit_report')
def submit_report():
    username = request.args.get('username')
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    
    update_report_count(username)
    #TODO deal with me

    return {"response" : "Submitted"}

app.run()