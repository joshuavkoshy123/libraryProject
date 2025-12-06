# -*- coding: utf-8 -*-
"""
Created on Mon Oct 13 10:56:59 2025

@author: koshy
"""

import psycopg2
import pandas as pd

df_book = pd.read_csv('book.csv', sep=',')
df_book_authors = pd.read_csv('book_authors.csv', sep=',')
df_authors = pd.read_csv('authors.csv', sep=',')
df_borrower = pd.read_csv('borrower.csv', sep=',')

print(df_book.columns.tolist())
print(df_book_authors.columns.tolist())
print(df_authors.columns.tolist())
print(df_borrower.columns.tolist())

conn = psycopg2.connect(host="localhost", dbname="library", user="postgres", password="Joshua123", port=5432)

cursor = conn.cursor()

#Drop all existing tables first
cursor.execute("""DROP TABLE IF EXISTS BOOK CASCADE;""")
cursor.execute("""DROP TABLE IF EXISTS BOOK_AUTHORS CASCADE;""")
cursor.execute("""DROP TABLE IF EXISTS AUTHORS CASCADE;""")
cursor.execute("""DROP TABLE IF EXISTS BORROWER CASCADE;""")
cursor.execute("""DROP TABLE IF EXISTS BOOK_LOANS CASCADE;""")
cursor.execute("""DROP TABLE IF EXISTS FINES CASCADE;""")

# Create tables
cursor.execute("""CREATE TABLE IF NOT EXISTS BOOK (
    isbn CHAR(10) PRIMARY KEY,
    title VARCHAR(255)
);
""")
cursor.execute("""CREATE TABLE IF NOT EXISTS AUTHORS (
    author_id INT PRIMARY KEY,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255)
);
""")
cursor.execute("""CREATE TABLE IF NOT EXISTS BOOK_AUTHORS (
    author_id INT,
    isbn CHAR(10),
    PRIMARY KEY(author_id, isbn),
    FOREIGN KEY(author_id) REFERENCES AUTHORS(author_id),
    FOREIGN KEY(isbn) REFERENCES BOOK(isbn)
);
""")
cursor.execute("""CREATE TABLE IF NOT EXISTS BORROWER (
    card_id CHAR(8) PRIMARY KEY,
    ssn VARCHAR(11) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    phone VARCHAR(14)
);
""")
cursor.execute("""CREATE TABLE IF NOT EXISTS BOOK_LOANS (
    loan_id INT PRIMARY KEY,
    isbn CHAR(10),
    card_id CHAR(8),
    date_out DATE,
    due_date DATE,
    date_in DATE,
    FOREIGN KEY(isbn) REFERENCES BOOK(isbn),
    FOREIGN KEY(card_id) REFERENCES BORROWER(card_id)
);
""")
cursor.execute("""CREATE TABLE IF NOT EXISTS FINES (
    loan_id INT PRIMARY KEY,
    fine_amt DECIMAL(10,2),
    paid INT,
    FOREIGN KEY(loan_id) REFERENCES BOOK_LOANS(loan_id)
);
""")

# Insert entries

# Book table
for row in df_book.itertuples():
    isbn = row.ISBN10
    title = row.Title
    cursor.execute("""INSERT INTO BOOK (isbn, title) VALUES (%s, %s);""", (isbn, title))

# Authors table
for row in df_authors.itertuples():
    author_id = row.Author_id
    fname = row.First_Name
    mname = row.Middle_Name
    lname = row.Last_Name
    cursor.execute("""INSERT INTO AUTHORS (author_id, first_name, middle_name, last_name) VALUES (%s, %s, %s, %s);""", (author_id, fname, mname, lname))

# Book_Authors table
for row in df_book_authors.itertuples():
    author_id = row.Author_id
    isbn = row.ISBN10
    cursor.execute("""INSERT INTO BOOK_AUTHORS (author_id, isbn) VALUES (%s, %s);""", (author_id, isbn))

# Borrowers table
for row in df_borrower.itertuples(index=False):
    card_id = row[0]
    ssn = row[1]
    fname = row[2]
    lname = row[3]
    address = row[4]
    city = row[5]
    state = row[6]
    phone = row[7]
    cursor.execute("""INSERT INTO BORROWER (card_id, ssn, first_name, last_name, address, city, state, phone) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);""", (card_id, ssn, fname, lname, address, city, state, phone))

conn.commit()

cursor.close()
conn.close()