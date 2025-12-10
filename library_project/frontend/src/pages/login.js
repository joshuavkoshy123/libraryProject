import { useState } from "react";
import '../styles/login.css'

/*

    - ssn
    - first_name
    - last_name
    - address
    - city
    - state
    - phone
    */

export default function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const [userCreds, setUserCreds] = useState({
    ssn: '',
    fName: '',
    lName: '',
    address: '',
    city: '',
    state: '',
    phone: '',
  });

  // Handles change in username/password fields
  function handleChange(e) {
    const {id, value} = e.target;
    setUserCreds(prevUserCreds => ({
      
      ...prevUserCreds,
      [id]: value,
      
    }));
    
  }

  



  /**
   * Handles the user's login, ensuring they have an account and prompting them 
   * if they have not created an account
   * 
   * Queries the database of users to check if the user exists
   * 
   * @param {SubmitEvent} e 
   */
  async function handleLogin(e) {
    e.preventDefault();
    console.log(userCreds.ssn);
    try{
      const res = await fetch('http://localhost:5001/api/create_account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssn: userCreds.ssn, first_name: userCreds.fName, last_name: userCreds.lName, address: userCreds.address, city: userCreds.city, state: userCreds.state, phone: userCreds.phone }),
    
      });
      const data = await res.json();
      console.log(data);
    }
    catch (e) {
      console.error(e)
    }
  }

  return (
    <form className="login" onSubmit={handleLogin}> 
      <h1>{isLogin ? 'Log In' : 'Sign up'}</h1>
      <label for='ssn'>Social Security Number</label>
      <input id='ssn' type='text'  onChange={handleChange}/>
      <label for='fName'>First Name</label>
      <input id='fName' type='text' onChange={handleChange} />
      <label for='lName'>Last Name</label>
      <input id='lName' type='text' onChange={handleChange} />
      <label for='address'>Address</label>
      <input id='address' type='text' onChange={handleChange} />
      <label for='city'>City</label>
      <input id='city' type='text' onChange={handleChange} />
      <label for='state'>State</label>
      <input id='state' type='text' onChange={handleChange}/>
      <label for='phone'>Phone</label>
      <input id='phone' type='text' onChange={handleChange} />
      <input type="submit" />
    </form>
  );
}