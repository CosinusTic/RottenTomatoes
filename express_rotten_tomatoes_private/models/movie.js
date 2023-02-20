const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    title: {
        type: String
    }, 
    overview: {
        type: String
    }, 
    popularity: {
        type: Number
    }, 
    site_notes: {
        type: Array
    }, 
    genres: {
        type: Array
    }, 
    poster_link: {
        type: String
    }, 
    release_date: {
        type: String
    }, 
    comments: {
        type: Object
    }

});
const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;