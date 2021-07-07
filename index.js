const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;


//I don't think this is connected to the database. Is this path and localhost-number correct? I tried 8080 too. Didn't work either. Considering my previous issue?... 
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

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

app.use(bodyParser.json());
app.use(methodOverride());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// let movies = [
//   {
//     movieId: 1,
//     title: 'The Snake',
//     director: {name : 'John Carpenter',
//     born: '1953'},
//     genre: {name: 'Dystopian Science Fiction'}
//   },
//   {
//     movieId: 2,
//     title: 'Alien',
//     director: {name : 'Ridley Scott',
//        born: '1940'},
//     genre: {name: 'Science Fiction'}
//   },
//   {
//     movieId: 3,
//     title: 'Cabaret',
//     director: {name : 'Liza Minelli',
//     born: '1839'},
//     genre: {name: 'Musical'}
//     }
// ];

// let users = [
//   {
//     userId: 1,
//     username: 'Klaus Wehner'
//   }
// ];



// list of  ALL movies - works but returns whole list

app.get('/movies', (req, res) => {
  res.json(movies);
});

// return all available data about one movie

app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});
  
 
// return movie/s by genre
app.get('/movies/genre/:name', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.genre.name === req.params.name }));
});

// return movie by director
app.get('/movies/director/:name', (req, res) => {
  res.json(movies.find((movie) =>
  {return movie.director.name === req.params.name }));

});

//Allow new users to register

app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
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

//Allow users to update their user info (username)
// app.put('/users/:username', (req, res) => {
//   res.send('More here soon!');
// });


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
// app.put('/users/:username/movies/:movieId', (req, res) => {
//   res.send('Show text that list has been created');
// });


app.post('/users/:Username/movies/:MovieID', (req, res) => {
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
app.patch('/users/:username/movies/:movieId', (req, res) => {
  res.send('Show text that list has been altered');
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