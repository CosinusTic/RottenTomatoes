import React, {useState, useEffect} from 'react';
import NavBar from '../components/NavBar';
import { useRouter } from "next/router";

const adminDashboard = () => {
    const router = useRouter();
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
                this.connectedUser = undefined;
            } else {
                console.log("user is logged in");
                const response = await fetch('http://localhost:3002/usersWithToken/' + token.access_token)
                    .then(response => response.json())
                setUser(response);
            }
        }
    }
    function redirectManageUsers(){
        router.push('/manageUsers')
    }
    function redirectManageMovies(){
        router.push('/manageMovies');
    }
    function redirectAddMovie(){
        router.push('/addMovie');
    }

    useEffect(() => {
        getLocalStorageToken();
    }, [])
    return(
        <div>
            <NavBar />
            {user ? (user.admin_status == true ? 
                <div>
                    <p>User is admin</p>
                    <button onClick={redirectManageMovies}>Manage website movies</button>
                    <button onClick={redirectAddMovie}>Add movies to website</button>
                    <button onClick={redirectManageUsers}>Manage users</button>
                </div>
                    : <p>User is not admin</p>) 
                : <p>User is not signed in</p>}
        </div>
        
    )
}
export default adminDashboard;