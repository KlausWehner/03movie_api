const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/flixMoviesDB', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser'),
methodOverride = require('method-override');


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


// REQUESTS TO MOVIES:

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  Movies.find()
  .then((allmovies) => {
    res.status(201).json(allmovies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:Title', (req, res) => {
  Movies.findOne( { Title: req.params.Title })
  .then( (requestedmovie) => {
    res.json(requestedmovie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});
  
// ?????????? 
// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/:Genre', (req, res) => {
  Movies.findOne( { Genre: req.params.Genre })
  .then( (requestedgenre) => {
    res.json(requestedgenre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// ??????????
// Return data about a director by name 
app.get('/movies/:Director', (req, res) => {
  Movies.findOne( { Director: req.params.Director })
  .then( (requesteddirector) => {
    res.json(requesteddirector);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});



// REQUESTS TO USERS

// Allow new users to register
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' This username exists already, please choose another!');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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
});


//Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


//Allow users to add a movie to their list of favorites
app.post('/users/:Username', (req, res) => {
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
app.delete('/users/:Username', (req, res) => {
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
app.get('/users/:Username', (req, res) => {
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


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});