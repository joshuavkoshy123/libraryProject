import React from 'react';
import { useState } from 'react';
//ssn, fname, lname, address,city, state, phone

//label fields!! make more readable
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
    return (
        <div>
            <h1>
                Create New Account
            </h1>

            <input
                type="text"
                value={ssn}
                onChange = {(e) => setSsn(e.target.value)}
                placeholder ="ssn"
                />
                <p>You typed: {ssn}</p>


            <input
                type="text"
                value={firstName}
                onChange = {(e) => setFirstName(e.target.value)}
                placeholder ="First Name"
                />
                <p>You typed: {firstName}</p>

                <input
                type="text"
                value={lastName}
                onChange = {(e) => setLastName(e.target.value)}
                placeholder ="Last Name"
                />
                <p>You typed: {lastName}</p>

                <input
                type="text"
                value={address}
                onChange = {(e) => setAddress(e.target.value)}
                placeholder ="Address"
                />
                <p>You typed: {address}</p>

                <input
                type="text"
                value={city}
                onChange = {(e) => setCity(e.target.value)}
                placeholder ="City"
                />
                <p>You typed: {city}</p>

                <input
                type="text"
                value={state}
                onChange = {(e) => setState(e.target.value)}
                placeholder ="Statee"
                />
                <p>You typed: {state}</p>

                <input
                type="text"
                value={phone}
                onChange = {(e) => setPhone(e.target.value)}
                placeholder ="Phone"
                />
                <p>You typed: {phone}</p>

                
        </div>
    );
}

export default NewAccount;