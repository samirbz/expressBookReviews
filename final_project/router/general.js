const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



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
  //Write your code here
  const formattedBooks = JSON.stringify(books, null, 2); // 2 spaces indentation for readability
  res.send(`'books' : ${formattedBooks}`);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book);
  } else {
    res.status(404).send("Book not found");
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = [];
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.author === author) {
        matchingBooks.push(book)
      }
    }
  }
  if (matchingBooks.length > 0) {
    res.send(matchingBooks)
  } else {
    res.status(404).send("no book found for the provided author")
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = [];
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.title === title) {
        matchingBooks.push(book)
      }
    }
  }
  if (matchingBooks.length > 0) {
    res.send(matchingBooks)
  } else {
    res.status(404).send("no book found for the provided author")
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]
  res.send(book.reviews)
});

module.exports.general = public_users;
