import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def setup_mysql_database():
    """Create MySQL database and tables"""
    
    try:
        # First connect without database to create it
        conn = mysql.connector.connect(
            host=os.environ.get("MYSQL_HOST", "localhost"),
            user=os.environ.get("MYSQL_USER", "appuser"),
            password=os.environ.get("MYSQL_PASSWORD", "StrongPassword123")
        )
    except mysql.connector.Error as e:
        print(f"❌ Error connecting to MySQL server: {e}")
        return False
    
    cur = conn.cursor()
    
    # Create database if not exists
    database_name = os.environ.get("MYSQL_DATABASE", "workbook")
    cur.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
    print(f"Database '{database_name}' created or already exists")
    
    conn.close()
    
    try:
        # Now connect to the specific database
        conn = mysql.connector.connect(
            host=os.environ.get("MYSQL_HOST", "localhost"),
            user=os.environ.get("MYSQL_USER", "appuser"),
            password=os.environ.get("MYSQL_PASSWORD", "StrongPassword123"),
            database=database_name
        )
    except mysql.connector.Error as e:
        print(f"❌ Error connecting to database '{database_name}': {e}")
        return False
    
    cur = conn.cursor()
    
    # Drop existing tables (optional - for clean setup)
    tables = ['users', 'reset_tokens', 'entries', 'school_data', 'workbook_status']
    for table in tables:
        try:
            cur.execute(f"DROP TABLE IF EXISTS {table}")
            print(f"Dropped table {table} if existed")
        except Exception as e:
            print(f"Error dropping table {table}: {e}")
    
    # Create users table
    cur.execute('''
        CREATE TABLE users (
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
        CREATE TABLE reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            token VARCHAR(255) UNIQUE NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create entries table
    cur.execute('''
        CREATE TABLE entries (
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
        CREATE TABLE school_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            school_name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            reporting_branch VARCHAR(255),
            num_students INT DEFAULT 0
        )
    ''')
    
    # Create workbook_status table
    cur.execute('''
        CREATE TABLE workbook_status (
            id INT AUTO_INCREMENT PRIMARY KEY,
            grade VARCHAR(50) NOT NULL,
            workbook_name VARCHAR(255) NOT NULL,
            quantity INT DEFAULT 0
        )
    ''')
    
    print("All tables created successfully!")
    
    # Insert sample data for testing
    import bcrypt
    
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    default_password = hash_password("admin123")
    
    # Insert admin users
    cur.execute("INSERT IGNORE INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                ("OMOTEC", "admin1@onmyowntechnology.com", default_password, "admin"))
    cur.execute("INSERT IGNORE INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                ("OMOTEC", "admin2@onmyowntechnology.com", default_password, "admin"))
    
    # Insert sample school data
    cur.execute("INSERT IGNORE INTO school_data (school_name, location, reporting_branch, num_students) VALUES (%s, %s, %s, %s)",
                ("Sample School", "Mumbai", "Main Branch", 500))
    
    # Insert sample workbook data
    cur.execute("INSERT IGNORE INTO workbook_status (grade, workbook_name, quantity) VALUES (%s, %s, %s)",
                ("1", "Mathematics Workbook Grade 1", 100))
    cur.execute("INSERT IGNORE INTO workbook_status (grade, workbook_name, quantity) VALUES (%s, %s, %s)",
                ("2", "Science Workbook Grade 2", 150))
    
    conn.commit()
    conn.close()
    print("Sample data inserted successfully!")
    print("✅ MySQL database setup completed!")
    return True

if __name__ == "__main__":
    success = setup_mysql_database()
    if not success:
        print("❌ Database setup failed!")
        exit(1)
    else:
        print("🎉 Database setup completed successfully!")