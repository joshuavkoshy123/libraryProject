import { useState } from "react";
import '../styles/search.css';

export default function Search() {
  const [search, setSearch] = useState('');
  const [currentBook, setCurrentBook] = useState('');
  const [books, setBooks] = useState([{ // Array of book objects
    ssn: '',
    title: '',
    fName: '',
    mName: '',
    lName: '',
  }]);

  /**
   * Collects search field value
   * @param {ChangeEvent} e 
   */
  function handleChange(e) {
    const {name, value} = e.target;

    setSearch(prevSearch => value);
  }

  /**
   * For every book in data, map to a book object and add to temp.
   * Then pdate state to temp.
   * @param {[{isbn, title, fName, mName, lName}]} queryBooks 
   */
  function updateBooks(queryBooks) {
    let temp = queryBooks.map((book) => ({ // Temporary new array of books
      isbn: book[0],
      title: book[1],
      fName: book[2],
      mName: book[3],
      lName: book[4],
    }));
    console.log(temp);
    setBooks(prevBooks => temp);
  }

  /**
   * Handles the event to query the database 
   * @param {SubmitEvent} event 
   */
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: search }),
      });

      if (!response.ok) {
        throw new Error('Failed to query database');
      }

      const data = await response.json();
      updateBooks(data);
    } catch (e) {
      console.error(e);
    }
  }

  function handleCheckout(e) {
    
  }

  /**
   * When the user hovers over a row, the state will store its isbn
   * @param {MouseEvent} isbn 
   */
  function handleHover(isbn) {
    setCurrentBook(_ => isbn);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='search'>Search: </label>
        <input id="search" type="text" onChange={handleChange}/>
        <input type='submit' />
      </form>
      <table>
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Title</th>
            <th>Author Name</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.isbn} onMouseEnter={() => handleHover(book.isbn)}>
              <td>{book.isbn}</td>
              <td>{book.title}</td>
              <td>{book.fName} {book.mName != "NaN" ? book.mName : ""} {book.lName}</td>
              <td>
                <button onClick={handleCheckout}>
                  Check out
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}