import { useState } from "react";

export default function Login() {
  const [userCreds, setUserCreds] = useState({
    username: '',
    password: '',
  });

  // Handles change in username/password fields
  function handleChange(e) {
    const {name, value} = e.target;
    setUserCreds(prevUserCreds => ({
      ...prevUserCreds,
      [name]: value,
    }));
  }

  function handleLoginSubmit(e) {
    
  }

  return (
    <>
      <label for='username'>Username</label>
      <input id='username' type='text' />
      <label for='password'>Password</label>
      <input id='password' type='text' />
      <input type="submit" />
    </>
  );
}