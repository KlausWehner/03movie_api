

const express = require('express'),
app = express(),
morgan = require('morgan');

const bodyParser = require('body-parser'),
  methodOverride = require('method-override');


app.use(morgan('common'));


let topBooks = [
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling'
  },
  {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien'
  },
  {
    title: 'Twilight',
    author: 'Stephanie Meyer'
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my book club!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/books', (req, res) => {
  res.json(topBooks);
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