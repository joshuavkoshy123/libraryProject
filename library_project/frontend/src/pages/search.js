import { useState } from "react";

export default function Search() {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);

  /**
   * Collects search field value
   * @param {ChangeEvent} e 
   */
  function handleChange(e) {
    const {name, value} = e.target;

    setSearch(prevSearch => value);
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

      console.log("function");
      if (!response.ok) {
        throw new Error('Failed to query database');
      }

      const data = response.json();
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  }

    /*
    - ssn
    - first_name
    - last_name
    - address
    - city
    - state
    - phone
    */
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
            <th>SSN</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>
    </div>
  );
}