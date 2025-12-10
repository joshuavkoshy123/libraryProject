import { useState } from "react";

export default function Search() {
  const [search, setSearch] = useState('');

  /**
   * Collects search field value
   * @param {ChangeEvent} e 
   */
  function handleChange(e) {
    const {name, value} = e.target;

    setSearch(prevSearch => ({
      ...prevSearch,
      [name]: value,
    }));
  }

  /**
   * Handles the event to query the database 
   * @param {SubmitEvent} event 
   */
  async function handleSubmit(event) {
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: search }),
      });

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
  curl -i -X POST http://localhost:5000/api/search \
    -H "Content-Type: application/json" \
    -d '{ "query": "search" }' 

  */

  return (
    <div>
      <form action='submit'>
        <label for='search'>Search: </label>
        <input id="search" type="text" onChange={handleChange}/>
        <input type='submit' />
      </form>
    </div>
  );
}