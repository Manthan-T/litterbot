# Import Flask, a tool used to create web APIs
from flask import Flask, request

# Import Threading so that the multiple server components can be run at once
from threading import Thread    

# Import the database handling functions and the mail sending function
from DatabaseHandler import *
from MailSender import *

# Create a flask app
app = Flask(__name__)

# For every function here, the "app.route" annotation means that when the website requests something from the server,
# it will be requested as if it were a url, for example, "[server ip]/login" (although the server ip is automatically
# entered and is not entered by the website, so the code would be more like "fetch(/login)").
# Upon such a request, the function below will be executed.

# In each method, there are also the assignments "[variable name] = request.args.get('[something]')".
# Taking the example from above, a fetch request for a login would actually look like "/login?username=[username]&password=[password]".
# Here, username and password are arguments, and the assignment retrieves the values of the arguments and assigns them to variables.

# A login request
@app.route('/login')
def login():
    username = request.args.get('username')
    password = request.args.get('password')
    
    # If the username and password entered match the database, grant access, otherwise, don't
    if user_exists(username, password):
        return {"access" : "granted"}
    else:
        return {"access" : "denied"}

# A signup request
@app.route('/signup')
def signup():
    first_name = request.args.get('first_name')
    last_name = request.args.get('last_name')
    username = request.args.get('username')
    password = request.args.get('password')
    email = request.args.get('email')
    phone = request.args.get('phone')

    # These if statements check the information for various requirements (see the "response" strings for what they are)
    # and returns an error message if the requirements are not fulfilled

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

    # All emails have to have an '@' and a '.'
    if email.find("@") == -1 or email.find(".") == -1:
        return {
                "component" : "email",
                "response" : "This is not a valid email address. Please enter a valid email address."
               }

    # Here it checks if the phone number is actually a number
    try:
        int(phone)
    except Exception:
        return {
                "component" : "phone",
                "response" : "This is not a valid phone number. Please enter a valid phone number."
               }

    # If everything is fine, add the user and return a message saying that the information was accepted
    add_user(first_name, last_name, username, password, email, phone)
    return {"response" : "Accepted"}

# A request withing the signup request; this request verifies the user from an inputted verification code
@app.route('/signup/verify_code')
def verify_code():
    username = request.args.get('username')
    code = request.args.get('code')

    # If the code matches the username, return that the user has been accepted (and vice versa)
    if verify_user(username, code):
        return {"response" : "Accepted"}
    else:
        return {"response" : "Not Accepted"}

# A request to resend the verification code email
@app.route('/signup/resend_email')
def resend_email():
    name = request.args.get('name')
    username = request.args.get('username')

    # This method updates the verification code 
    update_verif_code(username, signup_verif(name))

    # Notify of the email being sent
    return {"status" : "Sent"}

# A request to delete a user (this is used if they fail to enter their verification code)
@app.route('/delete_user')
def delete_profile():
    username = request.args.get('username')
    password = request.args.get('password')
    delete_user(username, password)

    # Notify of the account being deleted
    return {"response" : "Done"}

# A request to delete a user (this is used if they want to delete their account from the profile)
@app.route('/delete_account')
def delete_account():
    username = request.args.get('username')
    password = request.args.get('password')

    # If the password is correct, the account is deleted and notification of this is returned and vice versa
    if (delete_account_db(username, password) != False):
        return {"response" : "Done"}
    else:
        return {"response" : "Wrong password"}

# A request to get all of the information of a user
@app.route('/get_profile')
def get_profile():
    username = request.args.get('username')

    results = get_user(username)

    # The first value is "userID" which we don't care about and therefore remove, and make it a list (so we can edit it)
    results = list(results[0][1:])

    # Give the remaining results titles
    results[0] = "First name: " + results[0]
    results[1] = "Last name: " + results[1]
    results[2] = "Username: " + results[2]
    results[3] = "Password: " + results[3]
    results[4] = "Email address: " + results[4]
    results[5] = "Phone number: " + results[5]
    results[6] = "Date joined: " + results[6]
    results[7] = "Reports submitted: " + str(results[7])

    # Turn the result into a tuple (immutable/unchangeable) and put it into a list so that we can send it (we need to do this
    # it isn't just extra)
    results = [tuple(results)]
    
    # Return the results
    return {"profile" : results}

# A request to report litter at the current location
@app.route('/submit_report')
def submit_report():
    username = request.args.get('username')
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    
    # Update the number of reports the user has submitted
    update_report_count(username)

    # Notify that the response has been received
    return {"response" : "Submitted"}

# Run the flask app in a thread
kwargs = {
    "host": "127.0.0.1",
    "port": 5000,
    "threaded": True,
    "use_reloader": False,
    "debug": False,
}

flask_thread = Thread(target=app.run, daemon=True, kwargs=kwargs, name="Webserver Thread")

# This thread is started in Server.py