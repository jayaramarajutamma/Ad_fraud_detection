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
cursor.execute("""
CREATE TABLE IF NOT EXISTS ads(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image TEXT,
    app INTEGER,
    channel INTEGER
)
""")
cursor.execute("""
               CREATE TABLE blocked_ips (
id INTEGER PRIMARY KEY AUTOINCREMENT,
ip TEXT UNIQUE,
blocked_time TEXT
);""")


conn.commit()
conn.close()

print("Database ready")