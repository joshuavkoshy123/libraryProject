import psycopg2
import pandas as pd

conn = psycopg2.connect(host="localhost", dbname="library", user="postgres", password="Joshua123", port=5432)

cursor = conn.cursor()

def search(search_str):
    search_str = f"%{search_str.lower()}%"
    print("BOOK")
    #SELECT BOOK.isbn, title, AUTHORS.first_name, AUTHORS.middle_name, AUTHORS.last_name
    #cursor.execute("""SELECT * FROM book WHERE LOWER(isbn) LIKE %s OR LOWER(title) LIKE %s;""", (search_str, search_str))
    cursor.execute("""SELECT BOOK.isbn, title, AUTHORS.first_name, AUTHORS.middle_name, AUTHORS.last_name
                      FROM BOOK
                      JOIN BOOK_AUTHORS ON BOOK.isbn=BOOK_AUTHORS.isbn
                      JOIN AUTHORS ON BOOK_AUTHORS.author_id=AUTHORS.author_id
                      WHERE LOWER(BOOK.isbn) LIKE %s OR LOWER(title) LIKE %s OR LOWER(AUTHORS.first_name) LIKE %s OR LOWER(AUTHORS.middle_name) LIKE %s OR LOWER(AUTHORS.last_name) LIKE %s;""",
                        (search_str, search_str, search_str, search_str, search_str))
    rows = cursor.fetchall()

    for row in rows:
        print(row)

search("WILL")