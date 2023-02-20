import { useRouter } from "next/router";
import React, {useEffect, useState} from 'react'



const login = () => {
  const router = useRouter();
  async function handleForm(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const options = {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
      headers: { 'Content-Type': 'application/json' }
    }
    const response = await fetch('http://localhost:3002/login', options)
      .then((response) => response.json())
    console.log(response);
    if (response.access_token) {
      let now = new Date().getTime();
      let duration = 600000;

      let item = {
        access_token: response.access_token,
        expiry: now + duration
      }
      localStorage.setItem("access_token", JSON.stringify(item));
      alert('Login successful');
      router.push('/');
    }
    else if(response.error == "user does not exist"){
      alert('User does not exist')
    }
    else if(response.error == "wrong credentials"){
      alert('wrong credentials'); 
    }

    
  }
  return (
    <div>
      <form className="formlogin" onSubmit={handleForm}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label1">Email address</label>
          <input type="email" className="form-control" name="email" id="email" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div>
          <label className="password">Password</label>
          <input className="password1"/>
        </div>
        <button type="submit" className="btn1">Log in</button>
      </form>
    </div>

  )
}


export default login