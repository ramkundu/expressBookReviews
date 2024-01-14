const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  if (isbn) {
    const book = books[isbn];
    if (book) {
      const reviews = book.reviews;
      reviews[username] = req.query.review;
      book.reviews = reviews;
      books[isbn] = book;
      return res.status(200).json({message: "review of book with isbn " + isbn + " updated by " + username});
    } else {
      return res.status(200).json({message: "isbn not exist"});
    }
  } else {
    return res.status(200).json({message: "isbn not exist"});
  }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  if (isbn) {
    const book = books[isbn];
    if (book) {
      const reviews = book.reviews;
      delete reviews[username];
      book.reviews = reviews;
      books[isbn] = book;
      return res.status(200).json({message: "review of book with isbn " + isbn + " deleted by " + username});
    } else {
      return res.status(200).json({message: "isbn not exist"});
    }
  } else {
    return res.status(200).json({message: "isbn not exist"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
