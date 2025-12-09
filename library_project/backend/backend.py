from unittest import result

import psycopg2
import pandas as pd
from datetime import date
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

#conn = psycopg2.connect(host="localhost", dbname="library", user="postgres", password="Joshua123", port=5432)
conn = psycopg2.connect(host="localhost", dbname="library", user="postgres", password="2004", port=5432)
# conn = psycopg2.connect(
#     host="localhost",
#     dbname="library",
#     user="kadija",
#     password="kadijab",
#     port=5432
# )
cursor = conn.cursor()

@app.route('/api/search', methods=['GET'])
def search():
    search = request.get_json()
    search_str = search.get("query", "")
    search_str = f"%{search_str.lower()}%"
    cursor.execute("""SELECT BOOK.isbn, title, AUTHORS.first_name, AUTHORS.middle_name, AUTHORS.last_name
                      FROM BOOK
                      JOIN BOOK_AUTHORS ON BOOK.isbn=BOOK_AUTHORS.isbn
                      JOIN AUTHORS ON BOOK_AUTHORS.author_id=AUTHORS.author_id
                      WHERE LOWER(BOOK.isbn) LIKE %s OR LOWER(title) LIKE %s OR LOWER(AUTHORS.first_name) LIKE %s OR LOWER(AUTHORS.middle_name) LIKE %s OR LOWER(AUTHORS.last_name) LIKE %s
                      ORDER BY BOOK.isbn ASC;""",
                        (search_str, search_str, search_str, search_str, search_str))
    rows = cursor.fetchall()

    seen = set()
    duplicates = set()

    for row in rows:
        isbn = row[0]
        if isbn in seen:
            duplicates.add(isbn)
        seen.add(isbn)

    #print("Duplicate ISBNs:", duplicates)

    print(f"{'ISBN':<16}\t{'TITLE':<150}\t{'AUTHORS':<100}\t{'STATUS':<100}")

    isbn = rows[0][0]
    authors = ""
    i = 0
    while i < len(rows):
        isbn = rows[i][0]
        title = rows[i][1]
        while (i < len(rows) and rows[i][0] == isbn):
            middle_name = rows[i][3]
            if (middle_name == ""):
                middle_name = ""
            authors = authors + rows[i][2] + " " + middle_name + " " + rows[i][4] + ", "
            i = i + 1

        cursor.execute("""SELECT date_in FROM BOOK_LOANS WHERE isbn=%s;""", (isbn,))
        results = cursor.fetchall()

        status = "IN"

        for result in results:
            if result:
                if result[0] is None:
                    status = "OUT"
                    break
                else:
                    status = "IN"
            else:
                status = "IN"

        authors = authors[:-2]
        print(f"{isbn:<14} \t {title:<150} \t {authors:<100} \t {status:<100}")
        authors = ""

    return jsonify(rows)

@app.route('/api/create_account', methods=['POST'])
def create_account():
    try:
        data = request.get_json()

        ssn = data.get("ssn", "")
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        address = data.get("address", "")
        city = data.get("city", "")
        state = data.get("state", "")
        phone = data.get("phone", "")

        cursor.execute("""SELECT card_id
                        FROM BORROWER
                        ORDER BY card_id DESC
                        LIMIT 1;""")

        row = cursor.fetchone()

        print(row[0])

        id_num = int(row[0][2:])

        length = 6 - len(str(id_num))

        zeros = ""
        for i in range(length):
            zeros = zeros + "0"

        card_id = "ID" + zeros + str(id_num + 1)

        print(card_id)

        cursor.execute("""INSERT INTO BORROWER (card_id, ssn, first_name, last_name, address, city, state, phone) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);""", (card_id, ssn, first_name, last_name, address, city, state, phone))
        conn.commit()

    except psycopg2.Error as err:
        print("Database error:", err)

    return jsonify({"status": "OK"})

@app.route('/api/display_all_checked_out', methods=['GET'])
def display_all_checked_out():
    cursor.execute("""SELECT BL.loan_id, BL.isbn, BL.card_id, BR.first_name, BR.last_name, B.title, BL.date_out, BL.due_date
                      FROM BOOK_LOANS BL
                      JOIN BOOK B ON BL.isbn = B.isbn
                      JOIN BORROWER BR ON BL.card_id = BR.card_id
                      ORDER BY BL.loan_id ASC;
                      """)

    rows = cursor.fetchall()
    return jsonify(rows)

# depends on checkout
# find checked out books with isbn, card_id, and borrower name in order to decide which books to check in
@app.route('/api/find_checked_out', methods=['POST'])
def find_checked_out(): # by dylan
    data = request.get_json()
    search = data.get("search", "")
    search = f"%{search}%" # format for query

    cursor.execute("""
        SELECT BL.loan_id, BL.isbn, BL.card_id, BR.first_name, BR.last_name, B.title, BL.date_out, BL.due_date
        FROM BOOK_LOANS BL
        JOIN BOOK B ON BL.isbn = B.isbn
        JOIN BORROWER BR ON BL.card_id = BR.card_id
        WHERE BL.date_in IS NULL 
        AND (
            BL.isbn ILIKE %s OR BL.card_id ILIKE %s OR BR.first_name ILIKE %s OR BR.last_name ILIKE %s
        )
        ORDER BY BL.loan_id ASC;
    """, (search, search, search, search))

    rows = cursor.fetchall()
    return jsonify(rows)

@app.route('/api/check_in', methods=['POST'])
def check_in(): # by dylan
    data = request.get_json()
    loan_ids = data.get("loan_ids", [])
    # loan_ids is a list of loan_id int

    updated = []

    for loan_id in loan_ids:
        # check if loan exists
        cursor.execute("""
            SELECT loan_id, date_in
            FROM BOOK_LOANS
            WHERE loan_id = %s;
        """, (loan_id,))
        row = cursor.fetchone()

        if row is None: # if loan doesn't exist
            return jsonify({"ERROR": f"Loan {loan_id} does not exist"}), 400

        # if already checked in
        if row[1] is not None: # row[1] = date_in
            return jsonify({"ERROR": f"Loan {loan_id} is already checked in"}), 400

        cursor.execute("""
            UPDATE BOOK_LOANS
            SET date_in = CURRENT_DATE
            WHERE loan_id = %s;
        """, (loan_id,))

        conn.commit()
        updated.append(loan_id)
    return jsonify({"Message": "Check in successful", "updated": updated})


# tests
# cursor.execute("""
#     INSERT INTO BOOK_LOANS(, isbn, card_id, date_out, due_date, date_in)
#     VALUES (0345391802, ID000001, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', NULL);
# """)
#conn.commit()

@app.route('/api/checkout', methods=['POST'])
def checkout(card_id, isbn):
    try:
        cursor.execute("""SELECT COUNT(BOOK_LOANS.card_id)
                          FROM BOOK_LOANS
                          WHERE BOOK_LOANS.card_id = %s AND date_in IS NULL;""", (card_id,))

        loan_count = cursor.fetchone()[0]

        if loan_count>=3:
            print("Cannot checkout more than 3 books.")
            return

        import datetime
        date_out = datetime.date.today()
        print(date_out)
        due_date = date_out + datetime.timedelta(days=14)
        date_in=None
        

        cursor.execute("""SELECT loan_id
                          FROM BOOK_LOANS 
                          WHERE ISBN =%s AND date_in IS NULL ;""", (isbn,))    
        if cursor.fetchone():
            print("Book is already checked out. Please make another selection.")
            return
        
        cursor.execute("""SELECT loan_id
                          FROM BOOK_LOANS 
                          ORDER BY  loan_id DESC
                          LIMIT 1;""")

        current_id=  cursor.fetchone()

        if  current_id is not None:
            loan_id= current_id[0] + 1

        else:
            loan_id=1


        cursor.execute("""INSERT INTO BOOK_LOANS (loan_id, isbn, card_id, date_out, due_date, date_in) VALUES (%s, %s, %s, %s, %s, %s);""", (loan_id, isbn, card_id, date_out, due_date, date_in))
        
        
        conn.commit()
        print ("Checkout successful, your book is due on ", due_date)
    except psycopg2.Error as err:
        print("Database error:", err)

def calculate_fines():
    try:
        cursor.execute("""SELECT loan_id, due_date, date_in
                        FROM BOOK_LOANS;""")

        results = cursor.fetchall()

        if not results:
            print("No results")
            return

        for result in results:
            loan_id = result[0]
            due_date = result[1]
            date_in = result[2]
            current_date = date.today()
            fine_amt = 0

            if date_in is None:
                if (current_date - due_date).days > 0:
                    fine_amt = (current_date - due_date).days * 0.25
                else:
                    fine_amt = 0

            else:
                if (date_in - date.today()).days > 0:
                    fine_amt = (date_in - due_date).days * 0.25
                else:
                    fine_amt = 0

            loan_arr = [loan_id]
            cursor.execute("""SELECT * FROM FINES WHERE loan_id=%s;""", loan_arr)

            record = cursor.fetchone()

            if record:
                if record[2] == 0 and fine_amt > record[2]:
                    cursor.execute("""UPDATE FINES SET fine_amt=%s WHERE loan_id=%s;""", (fine_amt, loan_id))

            else:
                cursor.execute("""INSERT INTO FINES (loan_id, fine_amt, paid) VALUES (%s, %s, %s);""", (loan_id, fine_amt, 0))
                conn.commit()

    except psycopg2.Error as err:
        print("Database error:", err)

@app.route('/api/update_fines', methods=['POST'])
def update_fines(loan_id):
    try:
        cursor.execute("""SELECT date_in FROM BOOK_LOANS WHERE loan_id=%s;""", loan_id)
        record = cursor.fetchone()

        if not record:
            print("BOOK_LOANS NOT FOUND")
            return

        if not record[0]:
            print("BOOK HAS NOT BEEN RETURNED!")
            return

        cursor.execute("""UPDATE FINE SET fine_amt=%s, paid=%s WHERE loan_id=%s;""", (0, 1, loan_id))

    except psycopg2.Error as err:
        print("Database error:", err)

@app.route('/api/display_fines', methods=['GET'])
def display_fines():
    calculate_fines()
    cursor.execute("""SELECT card_id, SUM(fine_amt)
                      FROM BOOK_LOANS
                      JOIN FINES ON BOOK_LOANS.loan_id = FINES.loan_id
                      GROUP BY card_id;""")
    results = cursor.fetchall()
    if not results:
        print("No book loans")
        return

    else:
        return jsonify(results)

#checkout("ID000001","1552041778")
# print("Temp loan created")
#print(find_checked_out("ID000002"))
#check_in([2])
#search()
#create_account(123455, "sjkdbkj", "sbkjb", "kjasb", "asjkfjabf", "sdkjbvk", "ksjdbkjh")
#fines()
#update_fines([1])
#print(display_fines())
#cursor.close()
#conn.close()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
