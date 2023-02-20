import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import WebsiteMovie from "../components/WebsiteMovie";

const adminUpdateMovie = () => {
    const router = useRouter();
    const [movie, setMovie] = useState(undefined);
    const [user, setUser] = useState(undefined);
    async function getMovie() {
        const now = new Date().getTime();
        const movie_id = localStorage.getItem("movie_id");
        if (!movie_id) {
            setMovie(undefined);
            return;
        } else {
            console.log("no movie");
            const response = await fetch('http://localhost:3002/movies/' + movie_id)
                .then(response => response.json())
            setMovie(response[0]);
            console.log(response);

        }
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
                console.log("user is logged in");
                const response = await fetch('http://localhost:3002/usersWithToken/' + token.access_token)
                    .then(response => response.json())
                setUser(response);
            }
        }
    }

    async function updateMovie(event){
        event.preventDefault();
        const titleInput = event.target.title.value;
        const overviewInput = event.target.overview.value;
        const poster_link_input = event.target.poster_link.value;
        const requestOptions = {
            method: 'PUT', 
            body: JSON.stringify({
                title: titleInput, 
                overview: overviewInput, 
                poster_link: poster_link_input
            }),
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch('http://localhost:3002/modifyMovie/' + movie._id, requestOptions)
            .then((response) => response.json());
        console.log(response);
    }

    useEffect(() => {
        getLocalStorageToken();
        getMovie();
    }, [])
    return(
        <div>
            <NavBar/>
            { user ? (movie ?
            <div>
                <div>
                    <h3>Current movie info</h3>
                    <WebsiteMovie movie={movie}/>
                    <h3>Update movie</h3>
                    <form onSubmit={updateMovie}>
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" className="title" name="title"/>
                        <label htmlFor="overview">Overview</label>
                        <input type="text" id="overview" className="overview" name="overview"/>
                        <label htmlFor="poster_link">Image Link</label>
                        <input type="url" id="poster_link" className="poster_link" name="poster_link"/>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div> : <p>No movie fetched</p>
            )
            :
            <div>
                <p>User not signed in</p>
            </div>}
            
        </div>
    )
}

export default adminUpdateMovie;