const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Director = Models.Director

mongoose.connect('mongodb://localhost:27017/flixMoviesDB', { useNewUrlParser: true, useUnifiedTopology: true });



// mongoose.connect('mongodb+srv://myFlixDBadmin:Password01@myflixdb.8gcoi.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser'),
methodOverride = require('method-override');

const { check, validationResult } = require('express-validator');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('common'));
app.use(express.static('public'));

app.use(methodOverride());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const cors = require('cors');
app.use(cors());

// this would use cors to only give acces to selected origins
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


//Default Welcome
app.get('/', (req, res) => {
  res.send('Welcome to Klaus\' movie database');
});


// REQUESTS TO MOVIES:

// Return a list of ALL movies to the user
app.get('/movies', 
      passport.authenticate('jwt', { session: false }),
      (req, res) => {
  Movies.find()
  .then((allmovies) => {
    res.status(200).json(allmovies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne( { Title: req.params.Title })
  .then( (requestedmovie) => {
    res.json(requestedmovie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
  

// Return all movies of a genre by name/title (e.g., “Thriller”)
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find( { "Genre.name": req.params.name })
  .then( (requestedgenre) => {
    res.json(requestedgenre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


//returns all movies of one director 
app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find( { "Director.name": req.params.name })
  .then( (requesteddirector) => {
    res.json(requesteddirector);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


// additional:  return only name and bio of director / logic does not yet do it ...
app.get('/movies/directorsBio/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Director.findOne( { "Director.name": req.params.name })
  .then( (directorsbio) => {
    res.json(directorsbio.name + ' ' + directorsbio.Bio);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});



// REQUESTS TO USERS

// Allow new users to register
app.post('/users',
   
  [  
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Non alphanumeric characters are not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    // check validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' This username exists already, please choose another!');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
  }
});


//Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {

  // let hashedPassword = Users.hashPassword(req.body.Password); ??

  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password, // hashedPassword??
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, //specifies proceeding callback is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Something went wrong. Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


//Allow users to add a movie to their list of favorites
app.post('/users/:Username/favorites/:MovieID',
 passport.authenticate('jwt', { session: false }), 
 (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, 
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});



//Allow users to remove a movie to their list of favorites
app.delete('/users/:Username/favorites/:MovieID', 
passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, 
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


// //allow user to delete their accounnt by Username):
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//Get a user by username:
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});




const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port: ' + port);
});

