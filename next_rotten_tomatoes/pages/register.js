import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/router';

const register = () => {
    const router = useRouter();
    async function register(event){
        event.preventDefault();
        const userNameInput = event.target.username.value;
        const emailInput = event.target.email.value;
        const passwordInput = event.target.password.value;
        const password_confirmation_input = event.target.password_confirmation.value;
        if(passwordInput == password_confirmation_input){
            const requestOptions = {
                method: 'POST', 
                body: JSON.stringify({
                    username: userNameInput, 
                    email: emailInput,
                    password: passwordInput
                }),
                headers: {'Content-Type': 'application/json'}
            }
            const response = await fetch('http://localhost:3002/register', requestOptions)
                .then((response) => response.json());
            if(response.error == "user already exists"){
                alert('email already registered');
            }
            else{
                alert('Account successfuly created!');
                router.push('/')
            }
        }
        else{
            alert('password and password confirmation must match');
        }
    }
    return(
        <div>
            <h1>Register</h1>
            <form className="formlogin" onSubmit={register}>
           
            <div className="mb-3">
          <label htmlFor="name" className="form-label1">Username</label>
          <input type="name" className="form-control" name="name" id="name" aria-describedby="emailHelp" />

        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label1">Email address</label>
          <input type="email" className="form-control" name="email" id="email" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password Confirmation</label>
          <input type="password" className="form-control" id="password_confirmation" name="password_confirmation" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
</div>
    )}

export default register;