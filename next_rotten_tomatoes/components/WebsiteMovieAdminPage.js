import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";

const WebsiteMovieAdminPage = ({movie}) => {
    const router = useRouter();

    async function deleteMovie(event){
        event.preventDefault();
        console.log(movie._id);
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch('http://localhost:3002/deleteMovie/' + movie._id, requestOptions)
            .then((response) => response.json());
        if(response['deleted movie']){
            alert('movie deleted!')
        }
        else{
            alert('error')
        }
        console.log(response);
    }
    function redirectUpdate(event){
        event.preventDefault();
        localStorage.setItem('movie_id', movie._id);
        router.push('/adminUpdateMovie');
    }
    return(
        <div>
            <p>{movie.title}</p>
            <button onClick={redirectUpdate}>Update movie</button>
            <button onClick={deleteMovie}>Delete movie</button>
        </div>
    )
}

export default WebsiteMovieAdminPage;