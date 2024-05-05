const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username == username && user.password === password)
  })
  if (validusers.length > 0) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" })
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewData = req.query.review;
  if (books[isbn]) {
    const username = req.session.authorization.username;
    console.log(username)
    books[isbn].reviews = {
      ...books[isbn].reviews,
      [username]: reviewData
    };
    res.send(`The review for the book with ISBN ${isbn} has been added/updated`);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const book = books[isbn];
    if (book.reviews) {
      if (book.reviews.hasOwnProperty(username)) {
        delete book.reviews[username];
        return res.send(`Review for the ISBN ${isbn} posted by the ${username} deleted.`);
      } else {
        return res.status(404).json({ message: `No review found for user '${username}' for book with ISBN '${isbn}'` });
      }
    } else {
      return res.status(404).json({ message: `No reviews found for book with ISBN '${isbn}'` });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
