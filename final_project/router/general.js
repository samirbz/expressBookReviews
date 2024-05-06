const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password })
      res.send("Customer successfully registred. Now you can login")
    } else {
      res.send("Customer already registered")
    }
  } else {
    res.send("Please fill username and password")
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const fetchBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books)
    } else {
      reject(new Error('Books data not available'))
    }
  })
  fetchBooks.then(allBooks => {
    res.json(allBooks)
  }).catch(error => {
    res.status(500).json({ error: 'Error fetching books' });
  })
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return new Promise((resolve, reject) => {
    if (book) {
      res.send(book);
    }
  })
    .then(books => res.send(books))
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch books' });
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Create a promise to find books by the provided author
  const findBooksByAuthorPromise = new Promise((resolve, reject) => {
    const matchingBooks = [];
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        if (book.author === author) {
          matchingBooks.push(book);
        }
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks); // Resolve with matching books
    } else {
      reject(new Error("No book found for the provided author")); // Reject if no books found
    }
  });

  // Using the promise
  findBooksByAuthorPromise.then(matchingBooks => {
    res.json(matchingBooks); // Send matching books as JSON response
  }).catch(error => {
    res.status(404).send(error.message); // Send 404 status with error message if no books found
  });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const findBooksByTitlePromise = new Promise((resolve, reject) => {
    const matchingBooks = [];
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        if (book.title === title) {
          matchingBooks.push(book);
        }
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks); 
    } else {
      reject(new Error("No book found for the provided title")); 
    }
  });

  findBooksByTitlePromise.then(matchingBooks => {
    res.json(matchingBooks); 
  }).catch(error => {
    res.status(404).send(error.message); 
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]
  res.send(book.reviews)

});

module.exports.general = public_users;
