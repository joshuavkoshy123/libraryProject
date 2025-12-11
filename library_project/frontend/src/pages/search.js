import { useState } from "react";
import '../styles/search.css';

export default function Search() {
  const [search, setSearch] = useState('');
  const [currentBook, setCurrentBook] = useState('');
  const [books, setBooks] = useState([]); // Array of book objects

  /**
   * Collects search field value
   * @param {ChangeEvent} e 
   */
  function handleChange(e) {
    const {name, value} = e.target;
    setSearch(_ => value);
  }

  /**
   * Maps each individual collection of author, isbn, statuse, and title 
   * to an object
   * 
   * PRECONDITION: all parameters are same length
   * @param {Array} authors 
   * @param {Array} isbns 
   * @param {Array} statuses
   * @param {Array} titles 
   */
  function updateBooks(isbns, titles, authors, statuses) {
    const titleIndex = 1;
    let temp = authors.map((_, index) => ({ // Create array of objects
      isbn: isbns[index],
      title: titles[index],
      author: authors[index],
      status: statuses[index],
    }));
    setBooks(_ => temp);
    console.log(books);
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
      updateBooks(data.isbns, data.titles, data.author_list, data.status);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Prompts the user to checkout a book
   * @param {{isbn, title, author, status}} book 
   */
  async function handleCheckout(book) {
    const cardId = window.prompt(`ISBN: ${book.isbn}\n\nTitle: ${book.title}\n\nEnter your card to check out: `);
    book.status = "OUT";
    if (!cardId) {
      alert('Checkout Cancelled.');
    }

    try {
      const res = await fetch('http://localhost:5001/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: cardId,
          isbn: book.isbn,
        }),
      });
    } catch (error) {
      console.error(error);
    }
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.isbn} onMouseEnter={() => handleHover(book.isbn)}>
              <td>{book.isbn}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.status}</td>
              <td>
                {book.status === 'IN' 
                  ? <button onClick={() => handleCheckout(book)}>Check out</button>
                  : <button>Already checked out</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}