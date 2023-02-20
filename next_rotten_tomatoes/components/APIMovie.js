import React, {useState, useEffect} from "react";

const APIMovie = ({movie}) => {
    const [movie_poster_url, setUrl] = useState(undefined);
     
    async function addMovie(event){
        event.preventDefault();
        console.log(movie)
        const requestOptions = {
            method: 'POST', 
            body: JSON.stringify({movie: movie}), 
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch('http://localhost:3002/addMovieFromAPI', requestOptions) 
            .then((response) => response.json())
        console.log(response);
        if(response.error == "movie already in db"){
            alert('movie already in website')
        }
        else{
            alert('movie added')
        }
    }

    useEffect(() => {
        setUrl('https://image.tmdb.org/t/p/original/' + movie.poster_path);
    }, [])
    return(
        <div>
            <p>Title: {movie.title}</p>
            <img class="movie_img" src={movie_poster_url}/>
            <button onClick={addMovie}>Add to website</button>
        </div>
    )
}

export default APIMovie;