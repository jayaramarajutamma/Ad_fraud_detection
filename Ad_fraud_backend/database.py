import sqlite3

conn = sqlite3.connect("adfraud.db")
conn.execute("PRAGMA journal_mode=WAL;")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS click_logs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    app INTEGER,
    device TEXT,
    os TEXT,
    channel INTEGER,
    click_time TEXT
)
""")

conn.commit()
conn.close()

print("Database ready")