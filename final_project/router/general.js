const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return new Promise((resolve,reject) => {
    if (Object.entries(books).length > 0) {
      resolve(res.status(200).send(JSON.stringify(books,null,4)));
    } else {
      reject(res.status(404).json({message: "book list is empty"}));    
    }
  }).then((response) => {
    return response;
  }).catch((response) => {
    return response;
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return new Promise((resolve,reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      resolve(res.status(200).send(book));
    } else {
      reject(res.status(404).json({message: "isbn not exists"}));
    }
  }).then((response) => {
    return response;
  }).catch((response) => {
    return response;
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return new Promise((resolve,reject) => {
    let results = [];
      Object.entries(books).forEach(([isbn,book]) => {
         if (book.author === req.params.author) {
            results.push(book);
         }
      });
      if (results.length > 0) {
        resolve(res.status(200).send(JSON.stringify(results,null,4)));
      } else {
        reject(res.status(404).json({message: "author not exists"}));
      }
  }).then((response) => {
    return response;
  }).catch((response) => {
    return response;
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  return new Promise((resolve,reject) => {
    let results = [];
      Object.entries(books).forEach(([isbn,book]) => {
         if (book.title === req.params.title) {
            results.push(book);
         }
      });
      if (results.length > 0) {
        resolve(res.status(200).send(JSON.stringify(results,null,4)));
      } else {
        reject(res.status(404).json({message: "title not exists"}));
      }
  }).then((response) => {
    return response;
  }).catch((response) => {
    return response;
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    const book = books[isbn];
    if (book) {
      const reviews = book.reviews;
      return res.status(200).json({reviews: reviews});
    } else {
      return res.status(200).json({message: "isbn not exist"});
    }
  } else {
    return res.status(200).json({message: "isbn not exist"});
  }
});

module.exports.general = public_users;
