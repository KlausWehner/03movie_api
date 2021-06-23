

const express = require('express'),
app = express();
const morgan = require('morgan');

const bodyParser = require('body-parser'),
  methodOverride = require('method-override');


app.use(morgan('common'));


let movies = [
  {
    id: 1,
    title: 'The Snake',
    director: {name : 'John Carpenter',
    born: '1953'},
    genre: 'Dystopian Science Fiction'
  },
  {
    id: 2,
    title: 'Alien',
    director: {name : 'Ridley Scott',
       born: '1940'},
    genre: 'Science Fiction'
  },
  {
    id: 3,
    title: 'Cabaret',
    director: {name : 'Liza Minelli',
    born: '1839'},
    genre: 'Musical'
    }
];

let users = [];

// list of  ALL movies - works but returns whole list

app.get('/movies', (req, res) => {
  res.json(movies);
});

// return all available data about one movie
app.get('/movies/:title', (req, res) => {
  res.json(movies);
});

// return genre of movie
app.get('/movies/:genre', (req, res) => {
  res.json(movies);
});

// return director's bio
app.get('/movies/:director', (req, res) => {
  res.json(movies);
});

//Allow new users to register
app.post('/users', (req, res) => {
  let newUser = req.body;
  
  if (!newUser.name) {
    const message = 'Missing "name" in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});





//Allow users to update their user info (username)
app.put('/users/:username'), (req, res) => {
  res.json(movies);
}


//Allow users to add a movie to their list of favorites
app.put('/users/:username/:favourites'), (req, res) => {
  res('Show text that list has been created');
}

//Allow users to remove a movie to their list of favorites
app.patch('/users/:username/:favourites'), (req, res) => {
  res('Show text that list has been altered');
}


//allow user to delete their accounnt (by id):
app.delete('/users/:id'), (req, res) => {
  res.delete('delete user account'); 
}




app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});



app.use(express.static('public'));



app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});




// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});