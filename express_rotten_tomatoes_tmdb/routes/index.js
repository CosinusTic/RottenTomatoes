const express = require('express');
const { response } = require('../../express_rotten_tomatoes_tmdb/routes');
const app = express();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
const cookieParser = require('cookie-parser');

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

app.get('/movies/upcoming', async (req, res) => {
    const response = await fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=a9e18ac76b016640288da1cafea57f44&language=en-US&page=1')
        .then(response => response.json());

    try{
        res.json(response);
    }
    catch(error){
        console.log(error);
    }
});

app.get('/movies/inTheater', async(req, res) => {
    const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=a9e18ac76b016640288da1cafea57f44&language=en-US&page=1')
        .then(response => response.json())
        .then((response) => {console.log("TEST", response); return response})
    console.log("COUCOU", response)
    try{
        res.json(response);
    }
    catch(error){
        console.log(error);
    }
})


app.get('/movies/search/:search', async(req, res) => {
    const response = await fetch('https://api.themoviedb.org/3/search/movie?api_key=a9e18ac76b016640288da1cafea57f44&language=en-US&page=1&include_adult=false&query=' + req.params.search)
        .then(response => response.json());
    console.log(req.params.search);
    try{
        res.json(response);
        console.log(response);
    }
    catch(error){
        console.log(error);
    }
});

app.get('/allGenres', async(req, res) => {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=a9e18ac76b016640288da1cafea57f44&language=en-US')
        .then((response) => response.json());
    try{
        res.json(response)
    }
    catch(error){
        console.log(error);
    }
})
app.get('/getGenres/:id', async(req, res) => {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=a9e18ac76b016640288da1cafea57f44&language=en-US')
        .then((response) => response.json());
    const filteredResponse = response.genres.filter(genre => genre.id == req.params.id);
    try{
        res.json(filteredResponse);
    }
    catch(error){
        console.log(error);
    }
})

app.get('/getPopular', async(req, res) => {
    const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=a9e18ac76b016640288da1cafea57f44&language=en-US&page=1')
        .then((response) => response.json());
    try{
        res.send(response);
    }
    catch(error){
        console.log(error);
    }
})


module.exports = app;