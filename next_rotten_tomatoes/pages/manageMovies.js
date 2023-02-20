import React, {useState, useEffect} from "react";
import { useRouter } from "next/router";
import WebsiteMovieAdminPage from "../components/WebsiteMovieAdminPage";
import NavBar from "../components/NavBar";

const manageMovies = () => {
    const router = useRouter();
    const [movies, setMovies] = useState(undefined);
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

    async function getMovies(){
        const response = await fetch('http://localhost:3002/movies')
            .then((response) => response.json());
        setMovies(response);
        console.log(response);
    }

    useEffect(() => {
        getLocalStorageToken();
        getMovies();    
    }, [])
    return(
    <div>
        <NavBar/>
        <h2>Manage Movies</h2>
        {
            user ? movies.map((movie) => <WebsiteMovieAdminPage movie={movie}/>) : <p>User not connected</p>
        }
    </div>
    )
}
export default manageMovies;