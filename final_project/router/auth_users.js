const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
   if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

function changeCommentByUsername(isbn,username,newComment) {
  // Iterate over the reviews array
  for (let i = 0; i < books[isbn].reviews.length; i++) {
    if (books[isbn].reviews[i].username === username) {
      // Change the comment of the matching username
      books[isbn].reviews[i].comment = newComment;
      break; // Exit the loop once the comment is changed
    }
  }
}

function deleteReviewByUsername(isbn,username) {
  // Find the index of the review with the matching username
  const index = books[isbn].reviews.findIndex(review => review.username === username);

  // If a matching review is found, delete it from the array
  if (index !== -1) {
    books[isbn].reviews.splice(index, 1);
    return true;
  } else {
    return false;
   }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
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
        //Write your code here
        const isbn = req.params.isbn;
        const newReview = req.query.review; // Retrieve the review from query parameter
        const user = req.session.authorization.username;
        // Check if the book exists in the books database
        const bookExist = isbn in books;
        if (!bookExist) {
          return res.status(404).json({ message: "Book not found" });
        }

        let userReview = books[isbn].reviews.filter((review)=>{
            return (review.username === user)
          });

        // Add the review to the book
        if(userReview.length > 0) {
          changeCommentByUsername(isbn,user,newReview);
        }

        else {
            let firstReview = {username: user,comment: newReview}
            books[isbn].reviews.push(firstReview);
        }

        return res.status(200).json({ message: "Book review added successfully" });
      });

      regd_users.delete("/auth/review/:isbn", (req, res) => {
        const isbn = req.params.isbn;
        const user = req.session.authorization.username;

        const bookExist = isbn in books;
        if (!bookExist) {
          return res.status(404).json({ message: "Book not found" });
        }

        let isReviewByUser = deleteReviewByUsername(isbn,user);
        if(isReviewByUser) {
          return res.status(200).json({ message: "Book review deleted successfully" });
        } else {
           return res.status(208).json({message: "User review not found. Cannot delete"})
        }
      });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
