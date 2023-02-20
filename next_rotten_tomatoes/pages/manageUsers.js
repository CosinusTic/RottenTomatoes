import UserCard from '../components/User';
import React, {useEffect, useState} from 'react';
import NavBar from '../components/NavBar';
const manageUsers = () => {

    const [users, setUsers] = useState(undefined);  
    const [user, setUser] = useState(undefined);

    async function getLocalStorageToken() {
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

    async function getUsers() {
        await fetch('http://localhost:3002/users')
            .then(response => response.json())
            .then(response => setUsers(response));
    }

    useEffect(() => {
        getUsers();
        getLocalStorageToken();
    }, [])

    return (
        <div>
            <NavBar/>
            <h1>manageUsers</h1>
            {
                user ? (users ? users.map(user => <UserCard user={user}/>) : <p>Loading...</p>) : <p>Not signed in</p>
            }
            
        </div>
    )
}

export default manageUsers;