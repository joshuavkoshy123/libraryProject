import React from 'react';
import { useState } from 'react';
//ssn, fname, lname, address,city, state, phone


// then just format the fields
// also submit button
// something that lets the user know that account
//  was created after submitting

function NewAccount() {
    const [ssn, setSsn] = useState(" ");
    const [firstName, setFirstName] = useState(" ");
    const [lastName, setLastName] = useState(" ");
    const [address, setAddress] = useState(" ");
    const [city, setCity] = useState(" ");
    const [state, setState] = useState(" ");
    const [phone, setPhone] = useState(" ");
    const submit =() => {
        alert("Account Created with Card ID: ");

    }
    return (
        <div style={{ margin: '20px'}}>
            <h1>
                Create New Account
            </h1>

            <label> Social Security Number:  
            <input
                type="text"
                style={{ 
                width: '20%', 
                padding: '10px', 
                margin: '10px 10px',
                fontSize: '16px'
                }}
                value={ssn}
                onChange = {(e) => setSsn(e.target.value)}
                placeholder ="ssn"
                />
                <br></br>
                
                </label>

            <label> First Name: 
            <input
                type="text"
                style={{ 
                width: '20%', 
                padding: '10px', 
                margin: '10px 10px',
                fontSize: '16px'
                }}
                value={firstName}
                onChange = {(e) => setFirstName(e.target.value)}
                placeholder ="First Name"
                />
                <br></br>
                </label>


                <label> Last Name: 
                <input
                type="text"
                style={{ 
                width: '20%', 
                padding: '10px', 
                margin: '10px 10px',
                fontSize: '16px'
                }}
                value={lastName}
                onChange = {(e) => setLastName(e.target.value)}
                placeholder ="Last Name"
                />
                <br></br>
                </label>


                <label> Address: 
                <input
                type="text"
                style={{ 
                width: '20%', 
                padding: '10px', 
                margin: '10px 10px',
                fontSize: '16px'
                }}
                value={address}
                onChange = {(e) => setAddress(e.target.value)}
                placeholder ="Address"
                />
                <br></br>
                </label>

                <label> City: 
                <input
                type="text"
                style={{ 
                width: '20%', 
                padding: '10px', 
                margin: '10px 10px',
                fontSize: '16px'
                }}
                value={city}
                onChange = {(e) => setCity(e.target.value)}
                placeholder ="City"
                />
                <br></br>
               
                </label>

                <label> State: 
                <input
                type="text"
                style={{ 
                width: '20%', 
                padding: '10px', 
                margin: '10px 10px',
                fontSize: '16px'
                }}
                value={state}
                onChange = {(e) => setState(e.target.value)}
                placeholder ="State"
                />
               <br></br>
                </label>


                <label> Phone: 
                <input
                type="text"
                style={{ 
                width: '20%', 
                padding: '10px', 
                margin: '10px 10px',
                fontSize: '16px'
                }}
                value={phone}
                onChange = {(e) => setPhone(e.target.value)}
                placeholder ="Phone"
                />
                <br></br>
                <br></br>
                </label>
                <button onClick={submit}> Submit & Create Account </button>

                
        </div>
    );
}

export default NewAccount;