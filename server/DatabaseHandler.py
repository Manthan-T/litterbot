# Import the sqlite3 and time libraries
import sqlite3 as sql
import time

# Import all of the mail sending functions
from MailSender import *

# For development purposes only (ignore this method)
def alter_tables():
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        ALTER TABLE users
        ADD reports_submitted INTEGER DEFAULT 0;
    """)
    conn.commit()

    conn.close()

# In all of these methods, the first couple of lines are for connecting to the database and bringing the cursor to it.
# The cursor executes various SQL query using "cursor.execute("[string query]")", and if the query changes a
# table in any way (eg, adds to it or updates a value), the change needs to be commited using "conn.commit()" immediately
# after. In the case of a "SELECT" query, the "cursor.fetchone()" or "cursor.fetchall()" method is used to get the results,
# and index notation is used in the latter case to retrieve specific values from the returned list, and the tuples it contains.
# Near the end, "conn.close()" closes the connection to the database, which is just good practice, and a value is
# returned if needed.

# In the SQL query, you often see "{something}", and at the end, """".format(something = somethingelse))". This is
# simply adding the arguments provided when the method is called as the query's arguments (ie, values that need to be entered or
# used to be retrieved).

# A static method to add a user to the database; specifically to the "users" and "not_verified" tables
@staticmethod
def add_user(first_name, last_name, username, password, email_address, phone_number):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO users
        VALUES (
            null,
            "{first_name}",
            "{last_name}",
            "{username}",
            "{password}",
            "{email_address}",
            "{phone_number}",
            "{date}",
            null
        )
    """.format(
        first_name = first_name,
        last_name = last_name,
        username = username,
        password = password,
        email_address = email_address,
        phone_number = phone_number,
        date = time.ctime()
    ))
    conn.commit()
    
    # Retrieve the id of the user that was just added and use it to add the user to the "not_verified" table
    cursor.execute("""
        SELECT userID FROM users
        WHERE username = "{username}"
    """.format(
        username = username
    ))
    try:
        userID = cursor.fetchone()[0]
    except TypeError:
        return

    cursor.execute("""
        INSERT INTO not_verified
        VALUES (
            {userID},
            "{verif_code}"
        )
    """.format(
        userID = userID,
        # Gets a verification code and also sends an email (see MailSender.py for more)
        verif_code = signup_verif(first_name, email_address)
    ))
    conn.commit()

    conn.close()

# A static method to delete an unverified user from both tables of the database
@staticmethod
def delete_user(username, password):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT userID FROM users
        WHERE username = "{username}" AND password = "{password}"
    """.format(username = username, password = password))
    try:
        userID = cursor.fetchone()[0]
    except TypeError:
        conn.close()
        return
    
    # Retrieve the id of the user to be deleted and use it to delete the user from the "users" and "not_verified" table
    cursor.execute("""
        DELETE FROM users
        WHERE userID = {userID}
    """.format(userID = userID))
    conn.commit()

    cursor.execute("""
        DELETE FROM not_verified
        WHERE userID = {userID}
    """.format(userID = userID))
    conn.commit()

    conn.close()

# A static method to delete a verified user from the "users" table
@staticmethod
def delete_account_db(username, password):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT userID FROM users
        WHERE username = "{username}" AND password = "{password}"
    """.format(username = username, password = password))
    try:
        userID = cursor.fetchone()[0]
    except TypeError:
        conn.close()
        return False
    
    cursor.execute("""
        DELETE FROM users
        WHERE userID = {userID}
    """.format(userID = userID))
    conn.commit()

    conn.close()
    return True

# A static method to get all information about a user
@staticmethod
def get_user(username):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM users
        WHERE username = "{username}"
    """.format(username = username))
    results = cursor.fetchall()
    
    conn.close()
    return results

# A static method to check whether a username has already been taken
@staticmethod
def check_username_copies(username):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM users
        WHERE username = "{username}"
    """.format(username = username))
    results = cursor.fetchall()

    conn.close()

    # If there are more than 0 results, the username must be taken
    if len(results) > 0:
        return False
    else:
        return True

# A static method to check whether a password has already been taken
@staticmethod
def check_password_copies(password):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM users
        WHERE password = "{password}"
    """.format(password = password))
    results = cursor.fetchall()

    conn.close()

    # If there are more than 0 results, the password must be taken
    if len(results) > 0:
        return False
    else:
        return True

# A static method to check whether a user exists (this is used to log in)
@staticmethod
def user_exists(username, password):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM users
        WHERE username = "{username}" AND password = "{password}"
    """.format(username = username, password = password))
    results = cursor.fetchall()

    conn.close()

    # If there are 0 results, the user must not exist (so the details entered are incorrect)
    if len(results) == 0:
        return False
    else:
        return True

# A static method to check whether verify an entered verification code and if the code is correct, remove the user from the "not_verified" table
@staticmethod
def verify_user(username, code):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT userID FROM users
        WHERE username = "{username}"
    """.format(username = username))
    try:
        userID = cursor.fetchone()[0]
    except TypeError:
        conn.close()
        return

    cursor.execute("""
        SELECT * FROM not_verified
        WHERE userID = {userID} AND verif_code = "{code}"
    """.format(userID = userID, code = code))
    results = cursor.fetchall()

    # If there are 0 results, the verification code must be incorrect
    if len(results) == 0:
        conn.close()
        return False
    else:
        cursor.execute("""
            DELETE FROM not_verified
            WHERE userID = {userID}
        """.format(userID = userID))
        conn.commit()
        
        conn.close()
        return True

# A static method to create a new verification code and update it for the (potential) user that requested a new one
@staticmethod
def update_verif_code(username, code):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT userID FROM users
        WHERE username = "{username}"
    """.format(username = username))
    try:
        userID = cursor.fetchone()[0]
    # Should not happen but just in case
    except TypeError:
        conn.close()
        return

    cursor.execute("""
            UPDATE not_verified
            SET verif_code = "{code}"
            WHERE userID = {userID}
    """.format(userID = userID, code = code))
    conn.commit()

    conn.close()

# A static method to update the number of reports a user has sent
@staticmethod
def update_report_count(username):
    conn = sql.connect("./litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT reports_submitted FROM users
        WHERE username = "{username}"
    """.format(username = username))
    try:
        # Add one to the retrieved number of reports
        reports_submitted = cursor.fetchone()[0] + 1
    # Should not happen but just in case
    except TypeError:
        conn.close()
        return

    # Put this new value into the table
    cursor.execute("""
            UPDATE users
            SET reports_submitted = "{reports_submitted}"
            WHERE username = "{username}"
    """.format(username = username, reports_submitted = reports_submitted))
    conn.commit()

    conn.close()