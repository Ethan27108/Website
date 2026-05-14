from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, verify_jwt_in_request
import os
import sqlite3  
import re
import random
from datetime import datetime
app = Flask(__name__, static_folder="./dist", static_url_path="/")
CORS(app)


app.config["JWT_SECRET_KEY"] = "Ethan27108"  
jwt = JWTManager(app)

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory("./uploads", filename)
def encrypt(message):
    count=10
    messageFinal = []
    for i in message:
        count+=5
        messageFinal.append(chr(ord(i)+count))
    
    return "".join(messageFinal)

def decrypt(message):
    count=10
    messageFinal = []
    for i in message:
        count+=5
        messageFinal.append(chr(ord(i)-count))
    return "".join(messageFinal)

def is_valid_email(email):
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(email_regex, email) is not None

def sql(query, params):
    connection = sqlite3.connect("LoginData.db")
    cursor = connection.cursor()
    if params==None:
        cursor.execute(query)
    else:
        cursor.execute(query,params)
    val = cursor.fetchall()
    connection.commit()
    connection.close()
    return val

def find_lowest_unused_photoID():
    query = """
    SELECT MIN(t.PhotoID + 1) AS next_id
    FROM Photos t
    WHERE NOT EXISTS (
        SELECT 1
        FROM Photos t2
        WHERE t2.PhotoID = t.PhotoID + 1
    )
    """
    result = sql(query, None)
    next_id = result[0][0] if result and result[0][0] is not None else None

    # Handle the case where all IDs are consecutive
    if next_id is None:
        max_query = "SELECT MAX(photoID) + 1 FROM Photos"
        result = sql(max_query, None)
        next_id = result[0][0] or 1  # Default to 1 if the table is empty

    return next_id

def delete_photo(photo_id):
    query = "Delete From Photos Where PhotoID=?"
    sql(query, (photo_id,))
    upload_folder = "./uploads"
    for filename in os.listdir(upload_folder):
        if filename.startswith(f"{photo_id}_"):
            file_path = os.path.join(upload_folder, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
                break

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Simulate email format validation
    if not is_valid_email(email):
        return jsonify({"error": "Incorrect format for email"}), 400

    # Simulate database checks
    
    elif sql("SELECT * From Password Where email = ?",(email,)):
        return jsonify({"error": "Email already taken"}), 409
    
    elif sql("SELECT * From Password Where username = ?",(username,)):
        return jsonify({"error": "Username already taken"}), 409
    
    elif username=='null':
        return jsonify({"error": "Username cannot be null"}), 409
    
    else:
        password=encrypt(password)
        query="""
        Insert into Password values (?,?,?)
        """
        sql(query,(username,email,password))
        
        query=f"""CREATE TABLE {username} (
        username VARCHAR(30),
        chatID INTEGER
        )
        """
        sql(query,())
        return jsonify({"message": "Account created successfully!"}), 200

@app.route("/loginpage", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    password=encrypt(password)
    query="""
    SELECT Username
    From Password
    Where (Username = ? or Email=?) and Password = ? 
    """
    username = sql(query,(username,username,password))
    if username:
        return jsonify(username=username), 200
    else:
        return jsonify({"error": "Incorrect password or username"}), 400
     
@app.route("/UploadingPhotos", methods=["POST"])
def UploadingPhotos():
     
    
    photo_id = find_lowest_unused_photoID()
    
    if "file" not in request.files:
        return jsonify({"error": "No file was given"}), 400

    file = request.files["file"]  
    description = request.form.get("description")  
    username = request.form.get("username")  
    
    # Save the file to the 'uploads' directory
    upload_folder = "./uploads"
    os.makedirs(upload_folder, exist_ok=True)  # Ensure the folder exists
    file_path = os.path.join(upload_folder, f"{photo_id}_{file.filename}")
    file.save(file_path)

    # Insert the file metadata into the database
    query = """
    INSERT INTO Photos (username, photoID, description) VALUES (?, ?, ?)
    """
    sql(query, (username, photo_id, description))
    photo_id="comment"+str(photo_id)
    query = f"""CREATE TABLE {photo_id} (
    comment VARCHAR(300),
    who VARCHAR(30),
    time VARCHAR(30)
    )
    """
    sql(query,None)
    
    return jsonify({"message": "Image uploaded successfully!"}), 200


@app.route("/GettingImage", methods=["GET"])
def get_images():
    page = int(request.args.get("page", 1))  # Get page from query parameter (default to 1)
    images_per_page = 10  # Number of images to show per page
    usernameInput = request.args.get("username")  # Get username from query parameter

    # Get a list of image filenames and descriptions from the uploads folder
    upload_folder = "./uploads"
    image_files = [f for f in os.listdir(upload_folder) if os.path.isfile(os.path.join(upload_folder, f))]

    # Shuffle the image files randomly
    random.shuffle(image_files)

    # Paginate the results
    start_index = (page - 1) * images_per_page
    end_index = start_index + images_per_page
    paginated_images = image_files[start_index:end_index]

    # Assuming you have descriptions stored in the Photos table
    image_urls = []
    for image_file in paginated_images:
        # Fetch the description for the current image
        photo_id = image_file.split('_')[0]
        if usernameInput and usernameInput != 'null':
            query = "SELECT photoID, description, username FROM Photos WHERE photoID = ? AND username = ?"
            result = sql(query, (photo_id, usernameInput))
        else:
            query = "SELECT photoID, description, username FROM Photos WHERE photoID = ?"
            result = sql(query, (photo_id,))
            

        if result:
            photo_id = result[0][0]
            description = result[0][1]
            username = result[0][2]
            image_urls.append({
                "id": photo_id,
                "url": f"/uploads/{image_file}",
                "description": description,
                "username": username
            })

    return jsonify({"images": image_urls})

@app.route("/Comments", methods=["POST"])
def comments():
    data = request.json
    photo_id = data.get("photoid")
    photo_id="comment"+str(photo_id)
    try:
        query = f"SELECT who, comment FROM {photo_id}"
        result = sql(query,None)

        # Convert result to list of dicts
        comments = [{"who": row[0], "comment": row[1]} for row in result]
        return jsonify({"comments": comments})
    except Exception as e:
        # Return empty comments if table doesn't exist
        return jsonify({"comments": []})

@app.route("/AddComments", methods=["POST"])
def Addcomments():
    data = request.json
    photo_id = data.get("photoid")
    comment = data.get("comment")
    who = data.get("username")
    now = datetime.now()
    time = now.strftime("%H:%M:%S")
    photo_id="comment"+str(photo_id)
    query = f"insert into {photo_id} VALUES (?, ?, ?)"
    sql(query, (comment, who, time))

    return jsonify({"message": "Comment added successfully!"}), 200

@app.route("/deletePhoto", methods=["DELETE"])
def delete_photo_route():
    
    data = request.json
    photo_id = data.get("imageID")
    delete_photo(photo_id)
    photo_id = "comment" + str(photo_id)
    query = f"drop table {photo_id}"
    sql(query, None)
    return jsonify({"message": "Photo deleted successfully!"}), 200

@app.route("/getUserDetails", methods=["GET"])
def get_user_details():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "Username is required"}), 400

    query = "SELECT email, password FROM Password WHERE username = ?"
    result = sql(query, (username,))
    
    if result:
        email = result[0][0]
        password = result[0][1]
        return jsonify({"email": email, "password": password}), 200
    else:
        return jsonify({"error": "User not found"}), 404

@app.route("/ChangeSettings", methods=["POST"])
def changeSetting():
    data = request.json
    newusername = data.get("username")
    newemail = data.get("email")
    password = data.get("password")
    username = data.get("oldUsername")
    email = data.get("oldEmail")

    # Simulate email format validation
    if not is_valid_email(newemail):
        return jsonify({"error": "Incorrect format for email"}), 400

    # Simulate database checks
    
    elif sql("SELECT * FROM Password WHERE email = ? AND username != ?", (newemail, username)):
        return jsonify({"error": "Email already taken"}), 409
    
    elif sql("SELECT * FROM Password WHERE username = ? AND email != ?", (newusername, email)):
        return jsonify({"error": "Username already taken"}), 409
    
    elif username=='null':
        return jsonify({"error": "Username cannot be null"}), 409
    
    else:
        query = """
        UPDATE Password
        SET email = ?, password = ?, username = ?
        WHERE username = ?
        """
        sql(query,(newemail,password,newusername,username))
        query = """
        UPDATE Photos
        SET username = ?
        WHERE username = ?
        """
        sql(query,(newusername,username))
        return jsonify({"message": newusername}), 200   

@app.route("/MessagePage", methods=["POST"])
def MessagePage():
    data = request.json
    username = data.get("username")
    query = f"""
    SELECT * FROM {username}
    """
    val= sql(query,())
    val = [item[0] for item in val]
    print(val)
    return jsonify({"message": val}), 200 

@app.route("/SingleMessage", methods=["POST"])
def SingleMessage():
    data = request.json
    username = data.get("username")
    buttonname = data.get("buttonname")
    query = f"""
    SELECT chatID FROM {username}
    WHERE username = ?
    """
    table_name = sql(query,(buttonname,))
    table_name = "message"+str(table_name[0][0])
    query = f"""
    SELECT message FROM {table_name}
    """
    val= sql(query,())
    val = [item[0] for item in val]
    
    query = f"""
    SELECT who FROM {table_name}
    """
    val2= sql(query,())
    val2 = [item[0] for item in val2]
    
    query = f"""
    SELECT time FROM {table_name}
    """
    val3= sql(query,())
    val3 = [item[0] for item in val3]
    
    return jsonify({"message": val,"who":val2,"time":val3}), 200 

@app.route("/MessageSent", methods=["POST"])
def MessageSent():
    data = request.json
    username = data.get("username")
    buttonname = data.get("buttonname")
    message = data.get("message")
    query = f"""
    SELECT chatID FROM {username}
    WHERE username = ?
    """
    table_name = sql(query,(buttonname,))
    table_name = "message"+str(table_name[0][0])
    query = f"""Insert INTO {table_name} (message,who,time) VALUES (?,?,?)
    """
    now = datetime.now()
    time=now.strftime("%H:%M:%S")
    sql(query,(message,username,time))
    return jsonify({"message": "Message sent successfully!"}), 200

@app.route("/FriendSearch", methods=["POST"])
def FriendSearch():
    data = request.json
    friend = data.get("friend")
    username = data.get("user")
    query = f"""
    SELECT username FROM Password
    WHERE username LIKE ?
    AND username NOT IN (SELECT username FROM {username})
    AND username != ?
"""
    friend = "%"+friend+"%"
    print(friend)
    val= sql(query,(friend,username))
    val = [item[0] for item in val]
    return jsonify({"friend": val}), 200 

@app.route("/FriendAdd", methods=["POST"])
def FriendAdd():
    data = request.json
    friend = data.get("friend")
    username = data.get("user")
    query = """
    SELECT id FROM ID"""
    val = sql(query,())
    val = int(val[0][0])+1
    query = """ update ID set id = ? where id = ?"""
    sql(query,(val,val-1))
    print(username,friend,val)
    query = f"""Insert INTO {username} (username,chatID) VALUES (?,?)
    """
    sql(query,(friend,val))
    
    query = f"""Insert INTO {friend} (username,chatID) VALUES (?,?)
    """
    sql(query,(username,val))
    
    query = f"""CREATE TABLE message{val} (
    message VARCHAR(300),
    who VARCHAR(30),
    time VARCHAR(30)
    )
"""
    sql(query,())
    return jsonify({"message": "Message sent successfully!"}), 200

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, "index.html")

@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True, threaded=True)

