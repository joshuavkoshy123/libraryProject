# Library Project
Python based Library Management System

## How to Build and Run
- Language: Python 3.14 (3.12+ should suffice)
- Compiler Version: 3.14 (3.12+ should suffice)
- imports are included, but the following installs may be required (using pip install):
  - pandas
  - html
  - unittest
  - psycopg2
  - datetime
- In order to run the program, you should have PostgreSQL installed. Also, make sure to update this line with your credentials:

```python
conn = psycopg2.connect(host="localhost", dbname="library", user="postgres", password="Joshua123", port=5432)
```

### To run the program, simply run the files in the following order:
1. normalization_script.py
2. database_creation_script.py
3. backend.py

You can test each function individually by calling them with the required parameters. In Milestone 3, we will develop a GUI to streamline this process.
