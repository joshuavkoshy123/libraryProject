import psycopg2
import pandas as pd
from datetime import date

# change password to yours
conn = psycopg2.connect(host="localhost", dbname="library", user="postgres", password="2004", port=5432)
#conn.rollback()
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

    print("Duplicate ISBNs:", duplicates)

    isbn = rows[0][0]
    authors = ""
    i = 0
    while i < len(rows):
        isbn = rows[i][0]
        title = rows[i][1]
        while (i < len(rows) and rows[i][0] == isbn):
            middle_name = rows[i][3]
            if (pd.isna(middle_name)):
                middle_name = ""
            authors = authors + rows[i][2] + " " + middle_name + " " + rows[i][4] + ", "
            i = i + 1

        authors = authors[:-2]
        print(f"{isbn:<12} \t {title:<90} \t {authors:<100}")
        authors = ""

def create_account(ssn, first_name, last_name, address, city, state, phone):
    try:
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

#create_account(123455, "sjkdbkj", "sbkjb", "kjasb", "asjkfjabf", "sdkjbvk", "ksjdbkjh")

# depends on checkout
# find checked out books with isbn, card_id, and borrower name in order to decide which books to check in
def find_checked_out(search): # by dylan
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

    # ILIKE is the case insensitive version of LIKE
    rows = cursor.fetchall()
    print("Active Loans")
    print("loan_id, isbn, card_id, borrower, title")
    for r in rows:
        loan_id = r[0]
        isbn = r[1]
        card_id = r[2]
        borrower = f"{r[3]} {r[4]}"
        title = r[5]
        print(f"{loan_id}, {isbn}, {card_id}, {borrower}, {title}")
    return rows

def check_in(loan_ids): # by dylan
    # loan_ids is a list of loan_id int
    for loan_id in loan_ids:
        # check if loan exists
        cursor.execute("""
            SELECT loan_id, date_in
            FROM BOOK_LOANS
            WHERE loan_id = %s;
        """, (loan_id,))
        row = cursor.fetchone()

        if row is None: # if loan doesn't exist
            print(f"ERROR: Loan {loan_id} does not exist.")
            continue

        # if already checked in
        if row[1] is not None: # row[1] = date_in 
            print(f"Loan {loan_id} is already checked in.")
            continue

        cursor.execute("""
            UPDATE BOOK_LOANS
            SET date_in = CURRENT_DATE
            WHERE loan_id = %s;
        """, (loan_id,))

        conn.commit()
        print("Check in successful")


# tests
cursor.execute("""
    INSERT INTO BOOK_LOANS(, isbn, card_id, date_out, due_date, date_in)
    VALUES (0345391802, ID000001, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', NULL);
""")
conn.commit()
print("Temp loan created")
print(find_checked_out("Mark"))
check_in([1])

cursor.close()
conn.close()