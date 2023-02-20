import React, {useState, useEffect} from "react";
import APIMovie from "../components/APIMovie";
import NavBar from "../components/NavBar";

const addMovie = () => {
    const[movies, setMovies] = useState(undefined);
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

    async function getUpcomingMovies(event){
        event.preventDefault();
        const response = await fetch('http://localhost:3001/movies/upcoming')
            .then((response) => response.json());
        setMovies(response.results);
        console.log(response.results);
    }

    async function getInTheaterMovies(event){
        event.preventDefault();
        const response = await fetch('http://localhost:3001/movies/inTheater')
            .then(response => response.json());
        console.log(response.results);
        setMovies(response.results);
    }

    async function getSearchedMovies(event){
        event.preventDefault();
        const search = event.target.search.value;
        const response = await fetch('http://localhost:3001/movies/search/' + search)
            .then((response) => response.json());
        console.log(response);
        setMovies(response.results);
    }

    async function getPopularMovies(event){
        event.preventDefault();
        const response = await fetch('http://localhost:3001/getPopular')
            .then(response => response.json())
        console.log(response);
        setMovies(response.results);
    }

    useEffect(() => {
        getLocalStorageToken();
    }, [])
    return(
        <div>
            <NavBar/>
            <h3>Add a movie</h3>
            {
                user ? <div>
                    <button onClick={getUpcomingMovies}>Upcoming</button>
                    <button onClick={getInTheaterMovies}>In theater</button>
                    <button onClick={getPopularMovies}>Popular</button>
                    <form onSubmit={getSearchedMovies}>
                        <input name="search" type="text" id="search" className="search" placeholder="search a movie"/>
                        <button>Search</button>
                    </form>
                    
                </div>
                : <p>user not logged in</p>
            }
            {
                
                user && movies ? 
                movies.map((movie) => <APIMovie movie={movie}/>) : ''
            }
        </div>
    )
}

export default addMovie;