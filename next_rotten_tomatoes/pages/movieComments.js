import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react'
import WebsiteMovieComment from "../components/WebsiteMovieComment";
import NavBar from "../components/NavBar";


const movieComments = () => {
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
            console.log("user is logged in");
            const response = await fetch('http://localhost:3002/movies/' + movie_id)
                .then(response => response.json())
            setMovie(response);
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
    async function addComment(event){
        event.preventDefault();
        const commentInput = event.target.comment.value;
        const movie_id = localStorage.getItem("movie_id");
        console.log("user: ", user.username);
        console.log('comment input: ', commentInput);
        console.log('movie ID: ', movie_id);
        const requestOptions = {
            method: 'PUT', 
            body: JSON.stringify({
                author: user.username,
                comment: commentInput
            }),
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch('http://localhost:3002/addComment/' + movie_id, requestOptions) 
            .then(response => response.json());
        console.log(response);
        alert('Comment added!');
    }

    useEffect(() => {
        getMovie();
        getLocalStorageToken();
    }, [])
    return (
        <div>
            <NavBar />
            <p>Comments section</p>
                {
                    user ? (movie ? (movie[0].comments ? movie[0].comments.map((comment) => <WebsiteMovieComment comment={comment} />) : 
                    <div>
                        <p>No comment</p>
                        
                    </div>
                    ) : <p>Loading...</p>) 
                    : 
                    <div>
                        <p>You are not signed in</p>
                    </div>
                    
                    
                }
        <form onSubmit={addComment}>
                        <input type="text"  name="comment" class="comment" id="comment"/> <br/>
                        <button type="submit">Add comment</button>
                    </form>
        </div>
    )
}


export default movieComments;