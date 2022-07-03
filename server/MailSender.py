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

    yag = yagmail.SMTP("thequintuscult@gmail.com", "hplgipblvcownmbm")
    yag.send(
        to = receiver,
        subject = "Litterbot Reporting System: Account Creation",
        contents = message,
    )

    return code