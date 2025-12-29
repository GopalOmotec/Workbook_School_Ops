# import_excel_sqlserver.py
# Usage:
#   pip install pandas pyodbc openpyxl
#   python import_excel_sqlserver.py

import pandas as pd
import pyodbc
import os
import time

# --- CONFIG ---
file_path = "SchoolWise Book Status (2).xlsx"

# ------------------ MySQL Configuration ------------------
MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
MYSQL_USER = os.environ.get("MYSQL_USER", "appuser")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "StrongPassword123")
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE", "workbook")
MYSQL_PORT = os.environ.get("MYSQL_PORT", 3306)

# SQL Server connection config
server = MYSQL_HOST    
database = MYSQL_DATABASE
username = MYSQL_USER    
password = MYSQL_PASSWORD

# 1) Read Excel
df = pd.read_excel(file_path, sheet_name=0)

# 2) Basic checks & cleaning
expected_cols = ['School Name', 'Location', 'Books Reporting Branch']
for c in expected_cols:
    if c not in df.columns:
        raise RuntimeError(f"Expected column '{c}' not found. Found: {df.columns.tolist()}")

df_clean = df.dropna(subset=['School Name', 'Location']).copy()
df_clean['School Name'] = df_clean['School Name'].astype(str).str.strip()
df_clean['Location'] = df_clean['Location'].astype(str).str.strip()
df_clean['Books Reporting Branch'] = df_clean.get('Books Reporting Branch', "").astype(str).str.strip().fillna("")

# 3) Connect to SQL Server
conn_str = f"DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}"
conn = pyodbc.connect(conn_str)
cur = conn.cursor()

# 4) Create table if it doesn't exist
cur.execute("""
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='school_data' AND xtype='U')
BEGIN
    CREATE TABLE school_data (
        id INT IDENTITY(1,1) PRIMARY KEY,
        school_name NVARCHAR(255) NOT NULL,
        location NVARCHAR(255),
        reporting_branch NVARCHAR(255),
        num_students NVARCHAR(50),
        CONSTRAINT UQ_school_location UNIQUE(school_name, location)
    )
END
""")
conn.commit()

# 5) Insert rows
inserted = 0
pairs_seen = set()

for _, row in df_clean.iterrows():
    school = row['School Name']
    location = row['Location']
    reporting = row.get('Books Reporting Branch', "") or ""
    num_students = row.get('No of Students', None)

    pairs_seen.add((school, location))

    # Use MERGE or INSERT IGNORE equivalent in SQL Server
    try:
        cur.execute("""
            IF NOT EXISTS (
                SELECT 1 FROM school_data
                WHERE school_name = ? AND location = ?
            )
            INSERT INTO school_data (school_name, location, reporting_branch, num_students)
            VALUES (?, ?, ?, ?)
        """, (school, location, school, location, reporting, str(num_students) if num_students is not None else None))
        conn.commit()
        if cur.rowcount > 0:
            inserted += cur.rowcount
    except Exception as e:
        print(f"Error inserting {school}, {location}: {e}")

# 6) Summary
cur.execute("SELECT COUNT(*) FROM school_data")
total_rows = cur.fetchone()[0]

print(f"Unique school+location pairs in Excel: {len(pairs_seen)}")
print(f"Total rows in school_data: {total_rows}")

conn.close()