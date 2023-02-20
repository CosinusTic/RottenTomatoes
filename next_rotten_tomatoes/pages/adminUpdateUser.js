import React, {useState, useEffect} from 'react'
import NavBar from '../components/NavBar';

const updateUser = ({}) => {
    const [user, setUser] = useState(undefined);
    const [userToUpdate, setUserToUpdate] = useState(undefined);

    async function getUser() {
        const userId = localStorage.getItem("user_to_update");
        console.log(userId);
        const response = await fetch('http://localhost:3002/users/' + userId)
            .then(response => response.json());
        setUserToUpdate(response);
    }

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
                console.log("user is logged in, token: ", token);
                const response = await fetch('http://localhost:3002/usersWithToken/' + token.access_token)
                    .then(response => response.json())
                setUser(response);
            }
        }
    }
    async function updateUser(event){
        event.preventDefault();
        const userNameInput = event.target.username.value;
        const emailInput = event.target.email.value;
        const adminInput = event.target.admin_rights.value;
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                username: userNameInput,
                email: emailInput,
                admin_status: adminInput
            }), 
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch('http://localhost:3002/modifyUser/' + userToUpdate._id, requestOptions )
            .then((response) => response.json())
            .then((response) => console.log(response))
    }

    useEffect(() => {
        getLocalStorageToken();
        getUser();
    }, [])

    return(
        <div>
            <NavBar/>
            {
                user ? (user.admin_status == true ? (userToUpdate ? 
                    <div>
                        <div className='user_credentials'>
                            <h4>Current credentials</h4>
                            <p>Username: {userToUpdate.username}</p>
                            <p>Email: {userToUpdate.email}</p>
                            <p>User ID: {userToUpdate._id}</p>
                            <p>Admin Status: {userToUpdate.admin_status}</p>
                        </div>  
                        <div>
                            <h3>Update user</h3>
                            <form onSubmit={updateUser}>
                                <label for="admin_rights">Username</label>
                                <input id="username" name="username" className="username"/>
                                <label for="admin_rights">Email</label>
                                <input id="email" name="email" className="email"/>
                                <label for="admin_rights">Toggle admin status</label>
                                <select id="admin_rights" className="admin_rights" name="admin_rights">
                                    <option value="true">With</option>
                                    <option value="false">Without</option>
                                </select>
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    </div>
                 
                
                : <p>User to update not fetched</p>) : <p>You do not have permission to access this page</p>) : <p>You are not signed in</p>
            }
        </div>
    )
}

export default updateUser;