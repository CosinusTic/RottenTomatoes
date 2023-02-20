import React, {useState, useEffect} from 'react';
import WebsiteMovieComment from './WebsiteMovieComment';
import { useRouter } from "next/router";

const WebsiteMovie = ({movie}) => {
    const [commentCount, setCommentCount] = useState(undefined);
    const [user, setUser] = useState(undefined);
    const router = useRouter();
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const [scoreAverage, setScoreAverage] = useState(undefined);

    function redirectCommentPage(){
        router.push('/movieComments');
        localStorage.setItem('movie_id', movie._id)
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
                // console.log(response);
            }
        }
    }

    async function addToFavourites(event){
        event.preventDefault();
        const titleToAdd = movie.title;
        const userToken = user.access_token;
        console.log('movie: ', titleToAdd);
        console.log('user:', userToken);
        const requestOptions = {
            method: 'PUT', 
            body: JSON.stringify({
                favourites: titleToAdd
            }),
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch('http://localhost:3002/addToFavourites/' + userToken, requestOptions)
            .then(response => response.json());
        console.log(response);
        if(response['favourite added']){
            alert(response['favourite added'] + ' added to favourites');
        }
        else{
            alert('Movie already in favourites');
        }
        
    }

    async function removeMovie(event){
        event.preventDefault();
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'} 
        };
        const response = await fetch('http://localhost:3002/deleteMovie/' + movie._id, requestOptions)
            .then((response) => response.json());
        console.log(response);
        if(response['deleted movie']){
            alert('movie deleted')
        }
    }

    async function addMovieReview(event){
        event.preventDefault();
        const review = event.target.score.value;  
         
        const requestOptions = {
            method: 'PUT', 
            body: JSON.stringify({
                site_notes: review
            }),
            headers: {'Content-Type': 'application/json'}
        }
        const response = await fetch("http://localhost:3002/review/" + movie._id + "/" + user._id, requestOptions)
            .then((response) => response.json());
        console.log(response);
        if(response["has voted"] == "true"){
            alert('error: you already voted for this movie')
        }
        else{
            alert('review added');
        }
    }

    async function getMovieReviews(){
        const reviews = movie.site_notes;
        let count = 0;
        let reviewsToInt = [];
        let total = 0;
        for(let i = 0; i < reviews.length; i++){
            count++;
            total += parseInt(reviews[i])
            reviewsToInt.push(parseInt(reviews[i]))
        }
        if(reviewsToInt.length == 0){
            setScoreAverage(undefined);
        }
        else{
            setScoreAverage(total / reviewsToInt.length)
        }
    }

    useEffect(() => {
        let count = 0;
        if(movie.comments){
            for(let i = 0; i < movie.comments.length; i++){
                count++;
            }
        }
        
        setCommentCount(count);
        getLocalStorageToken(); 
        getMovieReviews();
    }, [])

    return(
        <div className='website_movie_el'>
            <h3>{movie.title}</h3>
            <p>Overview: {movie.overview}</p>
            <div>
                <img src={movie.poster_link} className="movie_img"/>
            </div>
            <div className='movie_info'>
                <p>Release: {movie.release_date}</p>
                <p>Popularity (tmdb): {movie.popularity}</p>
                {scoreAverage ? <p>popularity (rotten tomato): {scoreAverage}</p> : <p>No vote</p>}
            </div>
            {movie.comments ? 
                <button onClick={redirectCommentPage}>Comments: {commentCount}</button>
                :
                <button onClick={redirectCommentPage}>Comments: 0</button>
            }
            
            
            {user ? <button onClick={addToFavourites}>Add to favourites</button> : null }
            {
                user ? 
                <form onSubmit={addMovieReview}>
                    <select id='score' name='score' className='score'>
                        {numbers.map((number) => <option >{number}</option>)}
                    </select>
                    <button >Add review</button>
                </form> : null
            }
            {user ? (user.admin_status == true ? <button onClick={removeMovie}>Remove</button> : null) : null}
        </div>
    )
}

export default WebsiteMovie;