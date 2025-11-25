import pandas as pd
import html

df_books = pd.read_csv('books.csv', sep='\t')
df_borrowers = pd.read_csv('borrowers.csv', sep=',')

# Creating empty dfs for csv files
df_book = pd.DataFrame()
df_book_authors = pd.DataFrame()
df_authors = pd.DataFrame()
df_borrower = pd.DataFrame()

# Insert entries
for row in df_books.itertuples():
    isbn10 = row.ISBN10
    title = row.Title
    # New row as a dictionary
    new_row = {'ISBN10': isbn10, 'Title': title}

    # Append new DataFrame row
    if not(pd.isnull(title) or title == '' or title == '<unset>'):
        df_book = pd.concat([df_book, pd.DataFrame([new_row])], ignore_index=True)
    else:
        if not(pd.isnull(isbn10)):
            data = isbn10.split(',')
            isbn = data[0]
            title = data[2]
            author = data[3]
            new_row = {'ISBN10': isbn, 'Title': title}
            df_book = pd.concat([df_book, pd.DataFrame([new_row])], ignore_index=True)

author_id = 0
authors = df_books["Author"]
single_authors = []
for author_row in authors:
    row = str(author_row)
    row = row.split(',')
    for author in row:
        single_authors.append(author.strip())

single_authors = (dict.fromkeys(single_authors))
new_row = {'Author_id': 0, 'First_Name': 'Unknown', 'Middle_Name': "Unknown", 'Last_Name': 'Unknown'}
df_authors = pd.concat([df_authors, pd.DataFrame([new_row])], ignore_index=True)
author_id = 1
for name in single_authors:
    full_name = str(name)
    fname = ''
    mname = ''
    lname = ''

    # Decode HTML entities (&amp; → &)
    full_name = html.unescape(full_name).strip()

    if '&' in full_name:
        # Split the string around '&'
        parts = [p.strip() for p in full_name.split('&')]

        # Join everything except the last word from the last part
        # Example: "Mary-Kate & Ashley Olsen" →
        # parts = ["Mary-Kate", "Ashley Olsen"]
        last_words = parts[-1].split()
        if len(last_words) > 1:
            lname = last_words[-1]
            fname = " & ".join([
                parts[0],
                " ".join(last_words[:-1])
            ])
        else:
            # fallback if no space after '&'
            fname = full_name
            lname = ""
    else:
        full_name = full_name.split(" ")
        fname = full_name[0]
        mname = " ".join(full_name[1:len(full_name)-1])
        lname = full_name[len(full_name) - 1]
    new_row = {'Author_id': author_id, 'First_Name': fname, 'Middle_Name': mname, 'Last_Name': lname}
    df_authors = pd.concat([df_authors, pd.DataFrame([new_row])], ignore_index=True)
    author_id += 1

print(df_authors)

for row in df_books.itertuples():
    isbn10 = row.ISBN10
    name = row.Author
    if pd.isnull(isbn10):
        continue
    for single_name in str(name).split(","):
        full_name = str(single_name).strip()
        full_name = full_name.split(" ")
        fname = full_name[0]
        mname = " ".join(full_name[1:len(full_name) - 1])
        lname = full_name[len(full_name) - 1]
        if pd.isna(name) or name == '' or name == '<unset>':
            print(isbn10)
            print(name)
            new_row = {'Author_id': 0, 'ISBN10': isbn10}
            df_book_authors = pd.concat([df_book_authors, pd.DataFrame([new_row])], ignore_index=True)
            continue
        # Find rows where Name == full_name
        author_row = df_authors[(df_authors['First_Name'] == fname) & (df_authors['Middle_Name'] == mname) & (df_authors['Last_Name'] == lname)]
        if not author_row.empty:
            author_id = author_row.iloc[0]['Author_id']
        else:
            author_id = 0  # or handle however you want
        new_row = {'Author_id': author_id, 'ISBN10': isbn10}
        df_book_authors = pd.concat([df_book_authors, pd.DataFrame([new_row])], ignore_index=True)

df_book_authors = df_book_authors.drop_duplicates(['Author_id', 'ISBN10'])

for row in df_borrowers.itertuples(index=False):
    card_id = row.ID0000id
    ssn = row.ssn
    fname = row.first_name
    lname = row.last_name
    address = row.address
    city = row.city
    state = row.state
    phone = row.phone
    new_row = {'Card_id': card_id, 'Ssn': ssn, 'First_Name': fname, 'Last_Name': lname, 'Address': address, 'City': city, 'State': state, 'Phone': phone}
    if not(pd.isnull(card_id)):
        df_borrower = pd.concat([df_borrower, pd.DataFrame([new_row])], ignore_index=True)

print("Creating csv's")
# convert data frames to csv's
book_csv = df_book.to_csv('book.csv', index=False)
book_authors_csv = df_book_authors.to_csv('book_authors.csv', index=False)
authors_csv = df_authors.to_csv('authors.csv', index=False)
borrower_csv = df_borrower.to_csv('borrower.csv', index=False)