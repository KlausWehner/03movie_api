const express = require('express'),
app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser'),
methodOverride = require('method-override');


app.use(morgan('common'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(methodOverride());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


let movies = [
  {
    movieId: 1,
    title: 'The Snake',
    director: {name : 'John Carpenter',
    born: '1953'},
    genre: {name: 'Dystopian Science Fiction'}
  },
  {
    movieId: 2,
    title: 'Alien',
    director: {name : 'Ridley Scott',
       born: '1940'},
    genre: {name: 'Science Fiction'}
  },
  {
    movieId: 3,
    title: 'Cabaret',
    director: {name : 'Liza Minelli',
    born: '1839'},
    genre: {name: 'Musical'}
    }
];

let users = [
  {
    userId: 1,
    username: 'Klaus Wehner'
  }
];



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
  res.send('More here soon!');
});

//Allow users to update their user info (username)
app.put('/users/:username', (req, res) => {
  res.send('More here soon!');
});


//Allow users to add a movie to their list of favorites
app.put('/users/:username/movies/:movieId', (req, res) => {
  res.send('Show text that list has been created');
});

//Allow users to remove a movie to their list of favorites
app.patch('/users/:username/movies/:movieId', (req, res) => {
  res.send('Show text that list has been altered');
});


// //allow user to delete their accounnt (by id):

app.delete('/users/:username', (req, res) => {
  res.send('update user account')
  }); 

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});