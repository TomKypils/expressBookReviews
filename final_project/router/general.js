const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBooksByAuthor(authorName) {
  var authorBooks = [];
  for (var bookId in books) {
    if (books.hasOwnProperty(bookId)) {
      var bookInfo = books[bookId];
      if (bookInfo.author === authorName) {
        authorBooks.push(bookInfo);
      }
    }
  }
  return authorBooks;
}

function getBooksByTitle(bookTitle) {
  var authorBooks = [];
  for (var bookId in books) {
    if (books.hasOwnProperty(bookId)) {
      var bookInfo = books[bookId];
      if (bookInfo.title === bookTitle) {
        authorBooks.push(bookInfo);
      }
    }
  }
  return authorBooks;
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {

  let myPromise = new Promise((resolve,reject) => {
      // Send the book list as a response
      res.status(200).send(JSON.stringify(books, null, 4));
      resolve("Get Book list resolved")
    })

    myPromise.then((successMessage) => {
      console.log("From Callback " + successMessage)
    })

  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];

  let myPromise = new Promise((resolve,reject) => {
    // Send the book details as a response
    res.status(200).send(book);
    resolve("Get Book details resolved")
  })

  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let author_books = getBooksByAuthor(author);

  let myPromise = new Promise((resolve,reject) => {
    // Send the books by author as a response
    res.status(200).send(author_books);
    resolve("Get Books by author resolved")
  })

  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let books_title = getBooksByTitle(title);

  let myPromise = new Promise((resolve,reject) => {
    // Send the books by title as a response
    res.status(200).send(books_title);
    resolve("Get Books by title resolved")
  })

  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
