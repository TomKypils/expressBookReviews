const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const booksByAuthor = (author)=>{ 
      let authorBooks = {};

      for(key in books) {
         if(books[key].author === author) {
            authorBooks.push(books[key]);
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


const getBooks = async () => {
  try {
    // Make the GET request using Axios
    const response = await axios.get('http://localhost:5000');

    // Process the response data
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const getBook = async () => {
  try {
    // Make the GET request using Axios
    const response = await axios.get('http://localhost:5000/isbn/3');

    // Process the response data
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
   
    // Send the book list as a response
    return res.status(200).send(JSON.stringify(books, null, 4));
   });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  let book = books[isbn];

  return res.status(200).send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  let author_books = booksByAuthor(author);

  return res.status(200).send(author_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
module.exports.getBooks = getBooks;
module.exports.getBook = getBook;
