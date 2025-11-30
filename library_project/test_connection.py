import psycopg2

try:
    # change password to yours
    conn = psycopg2.connect(host="localhost", dbname="library", user="postgres", password="2004",port=5432)
    print("Connection successful!")
    conn.close()
except Exception as e:
    print("Error:", e)
