import sqlite3 as sql
import time

from MailSender import *

def alter_tables():
    conn = sql.connect("server/litterbot.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        DELETE FROM users
        WHERE userID = 2;
    """)
    conn.commit()

    conn.close()

@staticmethod
def add_user(first_name, last_name, username, password, email_address, phone_number):
    conn = sql.connect("server/litterbot.db")
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
            0
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
        verif_code = signup_verif(first_name, email_address)
    ))
    conn.commit()

    conn.close()

@staticmethod
def delete_user(username, password):
    conn = sql.connect("server/litterbot.db")
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

@staticmethod
def delete_account_db(username, password):
    conn = sql.connect("server/litterbot.db")
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

@staticmethod
def get_user(username):
    conn = sql.connect("server/litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM users
        WHERE username = "{username}"
    """.format(username = username))
    results = cursor.fetchall()
    
    conn.close()
    return results
    
@staticmethod
def check_username_copies(username):
    conn = sql.connect("server/litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM users
        WHERE username = "{username}"
    """.format(username = username))
    results = cursor.fetchall()

    conn.close()

    if len(results) > 0:
        return False
    else:
        return True

@staticmethod
def check_password_copies(password):
    conn = sql.connect("server/litterbot.db")
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM users
        WHERE password = "{password}"
    """.format(password = password))
    results = cursor.fetchall()

    conn.close()

    if len(results) > 0:
        return False
    else:
        return True

@staticmethod
def user_exists(username, password):
    conn = sql.connect("server/litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM users
        WHERE username = "{username}" AND password = "{password}"
    """.format(username = username, password = password))
    results = cursor.fetchall()

    conn.close()

    if len(results) == 0:
        return False
    else:
        return True

@staticmethod
def verify_user(username, code):
    conn = sql.connect("server/litterbot.db")
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

@staticmethod
def update_verif_code(username, code):
    conn = sql.connect("server/litterbot.db")
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
            UPDATE not_verified
            SET verif_code = "{code}"
            WHERE userID = {userID}
    """.format(userID = userID, code = code))
    conn.commit()

    conn.close()

@staticmethod
def update_report_count(username):
    conn = sql.connect("server/litterbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT reports_submitted FROM users
        WHERE username = "{username}"
    """.format(username = username))
    try:
        reports_submitted = cursor.fetchone()[0] + 1
    except TypeError:
        conn.close()
        return

    cursor.execute("""
            UPDATE users
            SET reports_submitted = "{reports_submitted}"
            WHERE username = "{username}"
    """.format(username = username, reports_submitted = reports_submitted))
    conn.commit()

    conn.close()