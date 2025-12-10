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
    const {name, value} = e.target;
    setUserCreds(prevUserCreds => ({
      ...prevUserCreds,
      [name]: value,
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
    try{
      const res = await fetch('http://localhost:5000/api/create_account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
        signal: controller.signal,
      });
    }
    catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='login'>
      <h1>{isLogin ? 'Log In' : 'Sign up'}</h1>
      <label for='ssn'>Social Security Number</label>
      <input id='ssn' type='text' />
      <label for='fName'>First Name</label>
      <input id='fName' type='text' />
      <label for='lName'>Last Name</label>
      <input id='lName' type='text' />
      <label for='address'>Address</label>
      <input id='address' type='text' />
      <label for='city'>City</label>
      <input id='city' type='text' />
      <label for='state'>State</label>
      <input id='state' type='text' />
      <label for='phone'>Phone</label>
      <input id='phone' type='text' />
      <input type="submit" />
    </div>
  );
}