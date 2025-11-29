import psycopg2


import pandas as pd
#import normalization_script
#import database_creation_script

#conn = psycopg2.connect(host="localhost", dbname="library", user="postgres", password="Joshua123", port=5432)
conn = psycopg2.connect(
    host="localhost",
    dbname="library",
    user="kadija",
    password="kadijab",
    port=5432
)
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



create_account(12348857, "sjkdbkj", "sbkjb", "kjasb", "asjkfjabf", "sdkjbvk", "ksjdbkjh")
checkout("ID001000", "1552041778") 
cursor.close()
conn.close()