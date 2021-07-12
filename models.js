const mongoose = require('mongoose');

let movieSchema = mongoose.Schema ({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        name: String,
        Description: String
    },
    Director: {
        name: String,
        Bio: String
    },
    
    imageURL: String,
    Featured: Boolean
});

// to return just director's name + bio
let directorSchema = mongoose.Schema ({
    Director: {
        name: {type: String, required: true},
        Bio: {type: String, required: true},
    }
});

let userSchema = mongoose.Schema ({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;