from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime, timedelta
import secrets
import bcrypt
from dotenv import load_dotenv
import smtplib
import ssl
from email.mime.text import MIMEText
import time
from functools import wraps

# ------------------ Configuration ------------------
# Load environment variables FIRST
load_dotenv()

# MySQL Configuration
MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
MYSQL_USER = os.environ.get("MYSQL_USER", "root")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "root")
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE", "workbook")
MYSQL_PORT = int(os.environ.get("MYSQL_PORT", 3306))

# SMTP Configuration
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "gopal.vishvakarma@onmyowntechnology.com")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "vmiucuiykdrlqnnn")
FROM_EMAIL = os.environ.get("FROM_EMAIL", "gopal.vishvakarma@onmyowntechnology.com")

# ------------------ Initialize Flask App ------------------
app = Flask(__name__)

# Simple CORS configuration
CORS(app, supports_credentials=True)

# ------------------ Helper Functions ------------------
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against bcrypt hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def _to_datetime(value):
    """Convert MySQL DATETIME (str or datetime) to datetime.datetime."""
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M:%S.%f"):
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                pass
    return value

def get_conn():
    """Get MySQL database connection with retry logic"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            conn = mysql.connector.connect(
                host=MYSQL_HOST,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD,
                database=MYSQL_DATABASE,
                port=MYSQL_PORT,
                connection_timeout=10
            )
            if conn.is_connected():
                return conn
        except Error as e:
            print(f"MySQL connection attempt {attempt + 1} failed: {e}")
            if attempt == max_retries - 1:
                raise
            time.sleep(1)
    return None

def send_reset_email(to_email: str, reset_link: str) -> None:
    """Send password reset email"""
    if not SMTP_SERVER or not SMTP_PORT or not FROM_EMAIL:
        raise RuntimeError("SMTP not configured")
    if SMTP_USERNAME and not SMTP_PASSWORD:
        raise RuntimeError("SMTP password missing")
    
    subject = "OMOTEC Password Reset"
    html_content = f"""
        <p>Hello,</p>
        <p>We received a request to reset your password.</p>
        <p>Click the link below to set a new password (valid for 30 minutes):<br>
        <a href=\"{reset_link}\">{reset_link}</a></p>
        <p>If you did not request this, ignore this email.</p>
        <p>- OMOTEC Team</p>
    """

    msg = MIMEText(html_content, "html")
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            if SMTP_USERNAME and SMTP_PASSWORD:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, [to_email], msg.as_string())
        print(f"Reset email sent to {to_email}")
    except Exception as e:
        print(f"SMTP error: {e}")
        raise

def send_otp_email(to_email: str, otp_code: str) -> None:
    """Send OTP email"""
    if not SMTP_SERVER or not SMTP_PORT or not FROM_EMAIL:
        raise RuntimeError("SMTP not configured")
    if SMTP_USERNAME and not SMTP_PASSWORD:
        raise RuntimeError("SMTP password missing")

    subject = "OMOTEC Password Reset OTP"
    html_content = f"""
        <p>Hello,</p>
        <p>Your one-time password (OTP) for resetting your OMOTEC account password is:</p>
        <p style=\"font-size:20px;font-weight:bold;\">{otp_code}</p>
        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        <p>- OMOTEC Team</p>
    """

    msg = MIMEText(html_content, "html")
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to_email

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            if SMTP_USERNAME and SMTP_PASSWORD:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, [to_email], msg.as_string())
        print(f"OTP email sent to {to_email}")
    except Exception as e:
        print(f"SMTP error (otp): {e}")
        raise

def init_db():
    """Initialize database with required tables"""
    conn = get_conn()
    cur = conn.cursor()
    
    # Create users table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create reset_tokens table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            token VARCHAR(255) UNIQUE NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create entries table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS entries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            school_name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            grade VARCHAR(50) NOT NULL,
            term VARCHAR(50) NOT NULL,
            workbook VARCHAR(255) NOT NULL,
            count INT NOT NULL,
            remark TEXT,
            submitted_by VARCHAR(255) NOT NULL,
            submitted_at DATETIME NOT NULL,
            delivered VARCHAR(10) DEFAULT 'No'
        )
    ''')
    
    # Create school_data table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS school_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            school_name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            reporting_branch VARCHAR(255),
            num_students INT DEFAULT 0
        )
    ''')
    
    # Create workbook_status table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS workbook_status (
            id INT AUTO_INCREMENT PRIMARY KEY,
            grade VARCHAR(50) NOT NULL,
            workbook_name VARCHAR(255) NOT NULL,
            quantity INT DEFAULT 0
        )
    ''')
    
    # Insert default admin users with hashed passwords
    default_password = hash_password("admin123")
    
    # Check if admin users already exist
    cur.execute("SELECT COUNT(*) FROM users WHERE email IN (%s, %s)", 
                ("admin1@onmyowntechnology.com", "admin2@onmyowntechnology.com"))
    count = cur.fetchone()[0]
    
    if count == 0:
        cur.execute("INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                    ("OMOTEC", "admin1@onmyowntechnology.com", default_password, "admin"))
        cur.execute("INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                    ("OMOTEC", "admin2@onmyowntechnology.com", default_password, "admin"))

    conn.commit()
    conn.close()
    print("✅ Database tables initialized")

# ------------------ Initialize Database ------------------
print("🔧 Initializing MySQL database...")
try:
    init_db()
    print("✅ Database initialized successfully!")
except Exception as e:
    print(f"❌ Database initialization failed: {e}")

# ------------------ Health Check ------------------
@app.route("/")
def index():
    return jsonify({"message": "Workbook Management API", "status": "running"})

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint for database connection"""
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT 1")
        conn.close()
        return jsonify({"status": "healthy", "database": "connected"})
    except Exception as e:
        return jsonify({"status": "unhealthy", "database": "disconnected", "error": str(e)}), 500

# ------------------ AUTH APIs ------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not email.endswith("@onmyowntechnology.com"):
        return jsonify({"success": False, "message": "Invalid domain"}), 401

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT password, role FROM users WHERE email=%s", (email,))
    row = cur.fetchone()
    conn.close()

    if row:
        stored_hash, role = row[0], row[1]
        if verify_password(password, stored_hash):
            return jsonify({"success": True, "role": role, "email": email})

    return jsonify({"success": False, "message": "Invalid credentials"}), 401

# ------------------ PASSWORD RESET (LINK + OTP) ------------------
@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json or {}
    email = (data.get("email") or "").strip()
    if not email:
        return jsonify({"success": False, "message": "Email required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE email=%s", (email,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": True, "message": "If the email exists, OTP will be sent."})

    otp_code = str(secrets.randbelow(900000) + 100000)
    expires = datetime.utcnow() + timedelta(minutes=10)

    cur.execute("INSERT INTO reset_tokens (email, token, expires_at) VALUES (%s, %s, %s)",
                (email, otp_code, expires))
    conn.commit()
    conn.close()

    try:
        send_otp_email(email, otp_code)
        return jsonify({"success": True, "message": "OTP sent to your email."})
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to send OTP: {str(e)}"}), 500

@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    try:
        data = request.json or {}
        email = (data.get("email") or "").strip()
        otp = (data.get("otp") or "").strip()
        if not email or not otp:
            return jsonify({"success": False, "message": "Email and OTP required"}), 400

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT expires_at FROM reset_tokens WHERE email=%s AND token=%s LIMIT 1",
                    (email, otp))
        row = cur.fetchone()
        if not row:
            conn.close()
            return jsonify({"success": False, "message": "Invalid OTP"}), 400

        expires_at = _to_datetime(row[0])
        if isinstance(expires_at, datetime) and datetime.utcnow() > expires_at:
            conn.close()
            return jsonify({"success": False, "message": "OTP expired"}), 400

        reset_token = secrets.token_urlsafe(24)
        reset_expires = datetime.utcnow() + timedelta(minutes=15)
        cur.execute("INSERT INTO reset_tokens (email, token, expires_at) VALUES (%s, %s, %s)",
                    (email, reset_token, reset_expires))
        conn.commit()
        conn.close()

        return jsonify({"success": True, "reset_token": reset_token})
    except Exception as e:
        print(f"Verify OTP error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json or {}
    email = (data.get("email") or "").strip()
    if not email:
        return jsonify({"success": False, "message": "Email required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users WHERE email=%s", (email,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": True, "message": "If the email exists, reset link will be sent."})

    token = secrets.token_urlsafe(24)
    expires = datetime.utcnow() + timedelta(minutes=30)

    cur.execute("INSERT INTO reset_tokens (email, token, expires_at) VALUES (%s, %s, %s)",
                (email, token, expires))
    conn.commit()
    conn.close()

    frontend_base = os.environ.get("FRONTEND_BASE_URL", "http://localhost:3000")
    reset_link = f"{frontend_base}/reset-password?token={token}"

    try:
        send_reset_email(email, reset_link)
        return jsonify({"success": True, "message": "Password reset link sent to your email."})
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to send email: {str(e)}"}), 500

@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json or {}
    token = data.get("token") or data.get("reset_token")
    new_password = data.get("password")

    if not token or not new_password:
        return jsonify({"success": False, "message": "Token and new password required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT email, expires_at FROM reset_tokens WHERE token=%s", (token,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Invalid or expired token"}), 400

    email, expires_at = row
    expires_at = _to_datetime(expires_at)
    if isinstance(expires_at, datetime) and datetime.utcnow() > expires_at:
        conn.close()
        return jsonify({"success": False, "message": "Token expired"}), 400

    hashed_password = hash_password(new_password)
    cur.execute("UPDATE users SET password=%s WHERE email=%s", (hashed_password, email))
    cur.execute("DELETE FROM reset_tokens WHERE token=%s", (token,))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Password reset successful"})

# ------------------ USER MANAGEMENT ------------------
@app.route("/admin/users", methods=["GET"])
def get_users():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, password, role FROM users ORDER BY id")
    rows = cur.fetchall()
    conn.close()
    return jsonify([
        {"id": r[0], "name": r[1], "email": r[2], "password": "********", "role": r[4]} 
        for r in rows
    ])

@app.route("/admin/users", methods=["POST"])
def add_user():
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")
    
    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    try:
        hashed_password = hash_password(password)
        cur.execute("INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)", 
                   (name, email, hashed_password, role))
        conn.commit()
        user_id = cur.lastrowid
    except mysql.connector.IntegrityError:
        return jsonify({"success": False, "message": "User already exists"}), 400
    finally:
        conn.close()

    return jsonify({"success": True, "message": "User added", "id": user_id})

@app.route("/admin/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE id=%s", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "User deleted"})

@app.route("/admin/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    hashed_password = hash_password(password)
    cur.execute("UPDATE users SET name=%s, email=%s, password=%s, role=%s WHERE id=%s",
               (name, email, hashed_password, role, user_id))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "User updated"})

# ------------------ FORM SUBMISSIONS ------------------
@app.route("/admin/form-submissions", methods=["GET"])
def get_form_submissions():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, school_name, location, grade, term, workbook, count, remark, submitted_by, submitted_at, delivered
        FROM entries
        ORDER BY submitted_at DESC
    """)
    rows = cur.fetchall()
    conn.close()

    submissions = [
        {
            "id": r[0],
            "school_name": r[1],
            "location": r[2],
            "grade": r[3],
            "term": r[4],
            "workbook": r[5],
            "count": r[6],
            "remark": r[7],
            "submitted_by": r[8],
            "submitted_at": r[9] if r[9] else None,
            "delivered": r[10]
        }
        for r in rows
    ]
    return jsonify(submissions)

@app.route("/admin/form-submissions/<int:submission_id>", methods=["DELETE"])
def delete_submission(submission_id):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM entries WHERE id=%s", (submission_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": f"Submission {submission_id} deleted"})

@app.route("/admin/mark-delivered", methods=["PUT"])
def mark_delivered():
    data = request.json
    ids = data.get("ids", [])
    delivered = data.get("delivered", "Yes")

    if not ids:
        return jsonify({"success": False, "message": "No IDs provided"})

    conn = get_conn()
    cur = conn.cursor()
    try:
        placeholders = ",".join(["%s"] * len(ids))
        query = f"UPDATE entries SET delivered = %s WHERE id IN ({placeholders})"
        cur.execute(query, [delivered] + ids)
        conn.commit()
        return jsonify({"success": True, "updated": cur.rowcount})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    finally:
        conn.close()

# ------------------ SCHOOL DATA MANAGEMENT ------------------
@app.route("/admin/entries", methods=["GET"])
def get_entries():
    school = request.args.get("school", "")
    location = request.args.get("location", "")

    query = "SELECT id, school_name, location, reporting_branch, num_students FROM school_data WHERE 1=1"
    params = []
    if school:
        query += " AND school_name=%s"
        params.append(school)
    if location:
        query += " AND location=%s"
        params.append(location)
    query += " ORDER BY school_name"

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(query, tuple(params))
    rows = cur.fetchall()
    conn.close()

    return jsonify([
        {
            "id": r[0],
            "school_name": r[1],
            "location": r[2],
            "reporting_branch": r[3],
            "num_students": r[4]
        }
        for r in rows
    ])

@app.route("/admin/update/<int:row_id>", methods=["PUT"])
def update_entry(row_id):
    data = request.json or {}
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT id FROM school_data WHERE id=%s", (row_id,))
    if not cur.fetchone():
        conn.close()
        return jsonify({"success": False, "message": f"Row {row_id} not found"}), 404

    cur.execute("""
        UPDATE school_data
        SET school_name=%s, location=%s, reporting_branch=%s, num_students=%s
        WHERE id=%s
    """, (
        data.get("school_name"),
        data.get("location"),
        data.get("reporting_branch"),
        data.get("num_students"),
        row_id
    ))

    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": f"Row {row_id} updated"})

@app.route("/admin/entries", methods=["POST"])
def add_entry():
    data = request.json or {}
    school_name = data.get("school_name")
    location = data.get("location")
    reporting_branch = data.get("reporting_branch", "")
    num_students = data.get("num_students", 0)

    if not school_name or not location:
        return jsonify({"success": False, "message": "School name and location required"}), 400

    try:
        num_students = int(num_students)
        conn = get_conn()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO school_data (school_name, location, reporting_branch, num_students)
            VALUES (%s, %s, %s, %s)
        """, (school_name, location, reporting_branch, num_students))

        conn.commit()
        new_id = cur.lastrowid
        return jsonify({"success": True, "id": new_id, "message": "School added successfully"})

    except Exception as e:
        print(f"DB Insert Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@app.route("/admin/delete/<int:entry_id>", methods=["DELETE"])
def delete_entry(entry_id):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM school_data WHERE id = %s", (entry_id,))
        conn.commit()
        if cur.rowcount > 0:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "message": "School not found"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})
    finally:
        conn.close()

# ------------------ USER FORM APIs ------------------
@app.route("/schools", methods=["GET"])
def get_schools():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT school_name FROM school_data ORDER BY school_name")
    schools = [r[0] for r in cur.fetchall()]
    conn.close()
    return jsonify(schools)

@app.route("/locations", methods=["GET"])
def get_locations():
    school = request.args.get("school", "")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT location FROM school_data WHERE school_name=%s ORDER BY location", (school,))
    locations = [r[0] for r in cur.fetchall()]
    conn.close()
    return jsonify(locations)

@app.route("/reporting_branch", methods=["GET"])
def get_reporting_branch():
    school = request.args.get("school", "")
    location = request.args.get("location", "")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT reporting_branch FROM school_data WHERE school_name=%s AND location=%s LIMIT 1",
                (school, location))
    r = cur.fetchone()
    conn.close()
    return jsonify({"reporting_branch": r[0] if r else ""})

@app.route("/grades", methods=["GET"])
def get_grades():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT grade FROM workbook_status ORDER BY grade")
    rows = cur.fetchall()
    conn.close()
    grades = [r[0] for r in rows]
    return jsonify(grades)

@app.route("/workbook_name", methods=["GET"])
def workbooks_by_grade():
    grade = request.args.get("grade")
    if not grade:
        return jsonify({"workbooks": []})

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "SELECT DISTINCT workbook_name FROM workbook_status WHERE grade=%s ORDER BY workbook_name",
        (grade,)
    )
    rows = cur.fetchall()
    conn.close()

    workbooks = [r[0] for r in rows]
    return jsonify({"workbooks": workbooks})

@app.route("/submit", methods=["POST"])
def submit_form():
    data = request.json or {}
    school = data.get("school")
    location = data.get("location")
    grade = data.get("grade")
    term = data.get("term")
    workbook = data.get("workbook")
    count = data.get("count")
    remark = data.get("remark")
    submitted_by = data.get("submitted_by")

    if not all([school, location, grade, term, workbook, count, remark, submitted_by]):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    submitted_at = datetime.utcnow() + timedelta(hours=5, minutes=30)

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO entries
        (school_name, location, grade, term, workbook, count, remark, submitted_by, submitted_at, delivered)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'No')
    """, (school, location, grade, term, workbook, count, remark, submitted_by, submitted_at))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({"success": True, "id": new_id, "message": "Form submitted successfully"})

@app.route("/user-info", methods=["GET"])
def user_info():
    email = request.args.get("email")
    if not email:
        return jsonify({"success": False, "message": "Email required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT name, email FROM users WHERE email=%s", (email,))
    row = cur.fetchone()
    conn.close()

    if row:
        return jsonify({"success": True, "name": row[0], "email": row[1]})
    else:
        return jsonify({"success": False, "message": "User not found"}), 404

# ------------------ WORKBOOKS MANAGEMENT ------------------
@app.route("/admin/workbooks", methods=["GET"])
def get_workbooks():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, grade, workbook_name, quantity FROM workbook_status")
    rows = cur.fetchall()
    conn.close()

    data = [
        {
            "id": r[0],
            "grade": r[1],
            "workbook_name": r[2],
            "quantity": r[3],
        }
        for r in rows
    ]
    return jsonify(data)

@app.route("/admin/workbooks/<int:w_id>", methods=["PUT"])
def update_workbook(w_id):
    data = request.json
    qty = data.get("quantity")

    if qty is None:
        return jsonify({"success": False, "message": "Quantity required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "UPDATE workbook_status SET quantity = %s WHERE id = %s", (qty, w_id)
    )
    conn.commit()
    updated = cur.rowcount
    conn.close()

    if updated == 0:
        return jsonify({"success": False, "message": "Workbook not found"}), 404

    return jsonify({"success": True, "id": w_id, "quantity": qty})

@app.route("/admin/workbooks", methods=["POST"])
def add_workbook():
    data = request.json
    grade = data.get("grade")
    workbook_name = data.get("workbook_name")
    quantity = data.get("quantity")

    if not grade or not workbook_name or quantity is None:
        return jsonify({"success": False, "message": "Grade, workbook name and quantity required"}), 400

    try:
        grade_int = int(grade)
        qty_int = int(quantity)
        if qty_int < 0:
            return jsonify({"success": False, "message": "Quantity cannot be negative"}), 400
    except ValueError:
        return jsonify({"success": False, "message": "Invalid grade or quantity"}), 400

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO workbook_status (grade, workbook_name, quantity) VALUES (%s, %s, %s)",
        (grade_int, workbook_name.strip(), qty_int)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({"success": True, "id": new_id})

@app.route("/admin/workbooks/<int:w_id>", methods=["DELETE"])
def delete_workbook(w_id):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM workbook_status WHERE id = %s", (w_id,))
    conn.commit()
    deleted = cur.rowcount
    conn.close()

    if deleted == 0:
        return jsonify({"success": False, "message": "Workbook not found"}), 404

    return jsonify({"success": True, "id": w_id, "message": "Workbook deleted"})

# ------------------ MAINTENANCE ------------------
@app.route("/cleanup-tokens", methods=["POST"])
def cleanup_tokens():
    """Clean up expired reset tokens"""
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM reset_tokens WHERE expires_at < %s", 
               (datetime.utcnow(),))
    deleted_count = cur.rowcount
    conn.commit()
    conn.close()
    return jsonify({"success": True, "deleted": deleted_count})

# ------------------ Main Execution ------------------
if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)