import random
import yagmail

@staticmethod
def signup_verif(name, email):
    code = str(random.randint(0, 999999))
    if len(code) < 6:
        zeroes_left = 6 - len(code)
        for zero in range(0, zeroes_left):
            code = "0" + code

    receiver = email
    
    message = """\
    Dear {recipient},

    Welcome to the Litterbot Reporting System!
    In order to complete your account creation, please enter this code where prompted:
    {code}
    The code above will expire after five minutes.

    Thank you for signing up!

    (If you have not signed up and have received this message in error, please ignore or delete this message)
    """.format(recipient = name, code = code)

    html = """\
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

    yag = yagmail.SMTP("thequintuscult@gmail.com", "hplgipblvcownmbm")
    yag.send(
        to = receiver,
        subject = "Litterbot Reporting System: Account Creation",
        contents = html,
    )

    return code