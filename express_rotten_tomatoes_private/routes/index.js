const express = require("express");
const userModel = require("../models/index.js");
const movieModel = require('../models/movie.js');
const app = express();
var bodyParser = require('body-parser');
const { createHash } = require('crypto');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))
    .use(express.urlencoded())
    .use(cors())
    .use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/* -- Users -- */
app.get("/users", async (request, response) => {
    const users = await userModel.find({});
    console.log(users)
    try {
        response.send(users);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/users/:id", async (request, response) => {
    const user = await userModel.findById(request.params.id);
    console.log(user)
    try {
        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/usersWithToken/:token", async (req, res) => {
    const access_token = req.params.token;
    const user = await userModel.findOne({ access_token: access_token });
    console.log(user);

    try {
        res.json(user);
    }
    catch (error) {
        console.log(error);
    }
})

app.post("/register", async (req, res) => {
    let date = new Date()
    let currentDate = date.getDay().toString()
    let access_token = createHash('sha256').update(currentDate).digest('hex');
    const existingUser = await userModel.findOne({ email: req.body.email }).exec()

    if (existingUser) {
        console.log("User already exists => ", existingUser);
        res.send({ "error": "user already exists" });
    }
    else {
        const user = new userModel({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            access_token: access_token
        });

        console.log("user created =>", user)

        try {
            await user.save();
            res.send(user);
        }
        catch (error) {
            res.send(error);
            console.log(error);
        }
    }
});

app.post('/login', async (req, res) => {
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (existingUser) {
        if (existingUser.password != req.body.password) {
            try {
                res.send({ "error": "wrong credentials" });
            }
            catch (error) {
                console.log(error);
            }

        }
        else {
            try {
                res.send(existingUser);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    else {
        try {
            res.send({ "error": "user does not exist" });
        }
        catch (error) {
            console.log(error);
        }
    }
})

app.put('/updateProfile/:id', async(req, res) => {
const user = await userModel.findById(req.params.id)
    if(user){
        if (req.body.username) {
            user.username = req.body.username
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
    
        try {
            await user.save()
            res.send({ "request": req.body, "user": user })
        }
        catch (err) {
            console.log(err)
        }
    } 
    else{
        res.send({"error": "user does not exist"})
    }
})

app.put("/modifyUser/:id", async (req, res) => {

    const user = await userModel.findById(req.params.id)
    if(user){
        if (req.body.username) {
            user.username = req.body.username
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.admin_status) {
            user.admin_status = req.body.admin_status;
        }
    
        try {
            await user.save()
            res.send({ "request": req.body, "user": user })
        }
        catch (err) {
            console.log(err)
        }
    } 
    else{
        res.send({"error": "user does not exist"})
    }
    
});

app.put("/addToFavourites/:token", async (req, res) => {
    
    const existingMovie = await movieModel.findOne({title: req.body.favourites})
    const user = await userModel.findOne({access_token: req.params.token})
    let movieInFavourites = false;
    for(let i in user.favourites){
        if(user.favourites[i] == existingMovie.title){
            movieInFavourites = true;
            break;
        }
    }
    if(!movieInFavourites){
        const response = await userModel.updateOne({ access_token: req.params.token }, { $push: { favourites: req.body.favourites } })
        try {
            res.send({ "favourite added": req.body.favourites });
        }
        catch (error) {
            console.log(response);
        }
    }
    else{
        res.send({"error": "Movie already in favourites"})
    }
    
})

app.delete('/delete/:id', async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        res.send({"deleted user": user});
    }
    catch (error) {
        console.log(error);
    }
})




/* -- Movies -- */

app.get('/movies', async (req, res) => {
    const response = await movieModel.find({});

    try {
        res.send(response);
    }
    catch (error) {
        console.log(response);
    }
});

app.get('/movies/:id', async(req, res) => {
    const response = await movieModel.find({_id: req.params.id});

    try{
        res.json(response);
    }
    catch(error){
        console.log(error);
        res.send(error);
    }
})

app.post('/addMovie', async (req, res) => {
    const existingMovie = await movieModel.findOne({ title: req.body.title }).exec()

    if (existingMovie) {
        console.log("movie already exists => ", existingMovie);
        res.send({ "error": "movie already exists" });
    }
    else {
        const movie = new movieModel({
            title: req.body.title,
            overview: req.body.overview,
            popularity: req.body.overview,
            site_notes: req.body.site_notes,
            genres: req.body.genres,
            poster_link: req.body.poster_link,
            release_date: req.body.release_date
        });

        console.log("movie created =>", movie)

        try {
            await movie.save();
            res.send(movie);
        }
        catch (error) {
            res.send(error);
            console.log(error);
        }
    }
})

app.post('/addMovieFromAPI', async(req, res) => {
    const genres = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=a9e18ac76b016640288da1cafea57f44&language=en-US')
        .then((response) => response.json());
    const matchedMovie = req.body.movie;
    const existingMovie = await movieModel.findOne({title: matchedMovie.title, overview: matchedMovie.overview})
    console.log(req.body);
    if(existingMovie){
        res.json({"error": "movie already in db"})
    }
    else{
        let genresToAdd = []
        for(let genreId in matchedMovie.genre_ids){
            console.log(matchedMovie.genre_ids[genreId]);
            genresToAdd.push(genres.genres.filter(genre => genre.id == matchedMovie.genre_ids[genreId])[0].name)
        }
        try{
            const movieToAdd = await new movieModel({
                title: matchedMovie.title, 
                overview: matchedMovie.overview, 
                poster_link: 'https://image.tmdb.org/t/p/original/' + matchedMovie.poster_path, 
                genres: genresToAdd, 
                popularity: matchedMovie.vote_average,
                release_date: matchedMovie.release_date
            })
        
            await movieToAdd.save();
            res.json(movieToAdd);
        }
        catch(error){
            console.log(error);
        }
    }
    
})



app.delete('/deleteMovie/:id', async (req, res) => {
    try {
        const movie = await movieModel.findByIdAndDelete(req.params.id);
        res.send({"deleted movie": movie});
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
})

app.put("/review/:movieId/:userId", async (req, res) => {
    const user = await userModel.findOne({_id: req.params.userId});
    console.log('body =>', req.body)
    let userVotes = user.votes;
    let hasVoted = false;
    for(let i in userVotes){
        if(userVotes[i].movie == req.params.movieId){
            hasVoted = true;
            break;
        }
    }

    try{
        if(hasVoted){
            res.send({"has voted": "true"});
        }
        else if(hasVoted == false){
            const movie = await movieModel.updateOne({ _id: req.params.movieId }, { $push: { site_notes: req.body.site_notes } })
            const userToUpdate = await userModel.updateOne({_id: req.params.userId}, {$push: {votes: {movie: req.params.movieId, note: req.body.site_notes}}});
            try {
                res.send({ "note added": req.body.site_notes, "user": userToUpdate, "movie": movie });
                console.log({"note added": req.body.site_notes})
            }
            catch (error) {
                console.log(movie);
            }
        }
        else{
            res.send({'error': 'error'})
        }
    }
    catch(error){
        console.log(error);
        res.send(error);
    }
    
    
})

app.get('/hasVoted/:movieId/:userId', async(req, res) => {
    const user = await userModel.findOne({_id: req.params.userId});
    let userVotes = user.votes;
    let hasVoted = false;
    for(let i in userVotes){
        if(userVotes[i].movie == req.params.movieId){
            hasVoted = true;
            break;
        }
    }

    if(hasVoted){
        res.send({"has voted": "true"});
    }
    else if(hasVoted == false){
        res.send({"has voted": "false"})
    }
    else{
        res.send({'error': 'error'})
    }
})

app.put("/addComment/:postId", async(req, res) => {
    const response = await movieModel.updateOne({_id: req.params.postId}, {$push: {comments: {author: req.body.author, comment: req.body.comment}}})

    try{
        res.json({"comment": req.body.author, "author": req.body.comment, "response": response});
    }
    catch(error){
        console.log(error)
    }
})

app.put("/addGenre/:id", async (req, res) => {
    const response = await movieModel.updateOne({ _id: req.params.id }, { $push: { genres: req.body.genres } })

    try {
        res.send({ "genre added": req.body.genres });
    }
    catch (error) {
        console.log(response);
    }
})

app.put("/modifyMovie/:id", async (req, res) => {

    const movie = await movieModel.findById(req.params.id)
    if (req.body.poster_link) {
        movie.poster_link = req.body.poster_link
    }
    if (req.body.title) {
        movie.title = req.body.title;
    }
    if (req.body.overview) {
        movie.overview = req.body.overview;
    }
    if (req.body.popularity) {
        movie.popularity = req.body.overview;
    }
    if (req.body.poster_link) {
        movie.poster_link = req.body.poster_link;
    }
    if (req.body.release_date) {
        movie.release_date = req.body.release_date;
    }
    if (req.body.genres) {
        movie.genres = req.body.genres;
    }
    if (req.body.site_notes) {
        movie.site_notes = req.body.site_notes;
    }

    try {
        await movie.save()
        res.status(200).send({ "movie object": movie, "request": req.body })
    }
    catch (err) {
        console.log(err)
    }
});

module.exports = app;