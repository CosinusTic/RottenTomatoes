import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";

const NavBar = () => {
    const [user, setUser] = useState(undefined);
    const router = useRouter();
    async function getUser() {
        const now = new Date().getTime();
        const token = JSON.parse(localStorage.getItem("access_token"));
        if (!token) {
            console.log("User is not logged in");
            setUser(undefined);
            return;
        } else {
            if (now > token.expiry) {
                localStorage.removeItem("access_token");
                setUser(undefined);
            } else {
                console.log("user is logged in");
                const response = await fetch('http://localhost:3002/usersWithToken/' + token.access_token)
                    .then(response => response.json())
                setUser(response);
            }
        }
    }
    useEffect(() => {
        getUser();
    }, [])
    function redirectLogin() {
        router.push('/login');
    }
    function redirectHome() {
        router.push('/');
    }
    function redirectRegister() {
        router.push('/register');
    }
    function logOut() {
        localStorage.removeItem('access_token');
        router.push('/');
        alert('Good bye!');
    }
    function redirectAdminDashboard(){
        router.push('/adminDashboard');
    }
    function redirectProfile(){
        router.push('/UserProfile')
    }
    return (
        <div>
            <nav className='nav_bg'>
                <button className="home" onClick={redirectHome}>Home</button>
                {
                    user ? 
                    <div className="usergroup">
                    <p className="hello">Hello {user.username}</p> <button className="profilebtn" onClick={redirectProfile}>My profile</button> 
                    </div>
                    : <button className="loginbtn" onClick={redirectLogin}>Login</button> 
                }

                <button className="registerbtn" onClick={redirectRegister}>Register</button>
                {
                    user ? <button className="logoutbtn" onClick={logOut}>Logout</button> : <p></p>
                }
                {
                    user ? (user.admin_status == true ? <button className="adminbtn" onClick={redirectAdminDashboard}>Admin Dashboard</button> : ('')) : ('')
                }
            </nav>
        </div>
    )
}

export default NavBar;