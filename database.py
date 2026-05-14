import sqlite3  
def encrypt(message):
    count=10
    messageFinal = []
    for i in message:
        count+=5
        messageFinal.append(chr(ord(i)+count))
    
    return "".join(messageFinal)
connection = sqlite3.connect("LoginData.db")
cursor = connection.cursor()
'''sql_command = """CREATE TABLE Password (
    username VARCHAR(30),
    email VARCHAR(50),
    password VARCHAR(30)
    )
"""'''

'''sql_command = """CREATE TABLE Photos (
    username VARCHAR(30),
    PhotoID INTEGER,
    Description VARCHAR(300)
    )
"""'''

'''sql_command = """Delete From April
"""'''

'''sql_command = """CREATE TABLE a (
    username VARCHAR(30),
    chatID INTEGER
    )
"""'''

'''sql_command = """Insert INTO Ethan (username,chatID) VALUES ('April','1')
"""'''
sql_command = """CREATE TABLE {tablename} (
    comment VARCHAR(300),
    who VARCHAR(30),
    time VARCHAR(30)
    )
"""
'''sql_command = """UPDATE Password SET password = ? WHERE password = 'pass'"""
encrypted_password = encrypt("pass")'''
'''sql_command = """Drop TABLE message1"""'''


'''def reset_database():
    connection = sqlite3.connect("LoginData.db")
    cursor = connection.cursor()

    # Get the list of all tables in the database
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    # Tables to exclude from deletion
    exclude_tables = {"Password", "Photos", "ID"}

    # Drop all tables except the excluded ones
    for table in tables:
        table_name = table[0]
        if table_name not in exclude_tables:
            cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
            print(f"Deleted table: {table_name}")

    # Clear all data from the excluded tables
    for table_name in exclude_tables:
        cursor.execute(f"DELETE FROM {table_name}")
        print(f"Cleared data from table: {table_name}")

    # Commit changes and close the connection
    connection.commit()
    connection.close()
    print("Database reset complete.")

# Call the function
reset_database()'''

cursor.execute(sql_command)
connection.commit()
connection.close()