# Import the random and yagmail libraries
import random
import yagmail

# A static method used to verify a user attempting to sign up
@staticmethod
def signup_verif(name, email):
    # Creates a 6 digit code by choosing a random number between 0 and 999999 inclusive
    # It then converts this number into a string
    # If the code is less than 6 digits long, it adds 0s to the front until the code is 6 digits long
    code = str(random.randint(0, 999999))
    if len(code) < 6:
        zeroes_left = 6 - len(code)
        for zero in range(0, zeroes_left):
            code = "0" + code

    # Creates a HTML styled email; inline CSS code is used to specify how the email will be presented. "<br>" is for starting a new line.
    message = """\
        <html>
        <head/>
        <body>
            <div style = "max-width: 500px; margin: 30px auto; overflow: auto; min-height: 300px; border: 5px solid #30323D; padding: 30px; border-radius: 15px; background-color: #494B5B; color: #F7F1F8">
                <h1 style = "text-align: center;">Welcome to the Litterbot Reporting System!</h1>
                <p style = "text-align: center;">Dear {recipient},<br>
                In order to complete your account creation, please enter this code where prompted:
                </p>
                <h1 style = "text-align: center;">{code}</h2>
                <p style = "text-align: center;">The code above will expire after five minutes.<br>
                Thank you for signing up!<br>
                With regards,
                </p>
                <h2 style = "text-align: center;">The Quintus Cult</h2>
                <h5 style = "text-align: center;">(If you have not signed up and have received this message in error, please ignore or delete this message)</h5>
            </div>
        </body>
        </html>
    """.format(recipient = name, code = code)

    # Login to the email account using a secure app password provided by google stored in a .env file
    # The .env file has been removed from this repository, but you can try this using your own email
    # and app password (which you can create at myaccount.google.com -> Security -> Signing in to google -> App Passwords
    # Then, click "Select app", click "Other (custom name)", enter whatever name you want, and then click "GENERATE".
    # Create your own "emailpassword.env" in the same directory as the server. Set the first line as the email and the second as
    # the app password.
    with open("emailpassword.env", "r") as app_password:
        yag = yagmail.SMTP(app_password.readline(), app_password.readline())
    
    # Sends the email to the user attempting to signup
    yag.send(
        to = email,
        subject = "Litterbot Reporting System: Account Creation",
        contents = message
    )

    # Return the verification code
    return code