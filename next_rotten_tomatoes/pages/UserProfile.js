import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import Profile from '../components/Profile';
import NavBar from '../components/NavBar';

const UserProfile = () => {
  const router = useRouter()
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
  
  useEffect(() => {
    getLocalStorageToken();
  }, [])
  console.log(user);

  return (
    <div>
      <NavBar/>
      <h1>User Profile</h1>
      {
        user ? 
        <div>
          <p>User is connected</p>
          <Profile user={user}/>
        </div>
        :
        <div>
          <h3>You are not signed in</h3>
        </div>
      }
    </div>

    
  )
} 

export default UserProfile