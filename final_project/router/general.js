const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfuly created!" });
    } else {
      return res.status(404).json({ message: "User already exist!" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks.then((bookList) => {
    res.status(200).send(JSON.stringify(bookList, null, 4));
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ message: "Book not found" });
    }
  });

  getBook
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json(err));
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const filteredBooks = await Object.values(books).filter(
      (book) => book.author === author,
    );
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res
        .status(404)
        .json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const filteredBooks = await Object.values(books).filter(
      (book) => book.title === title,
    );
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res
        .status(404)
        .json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "No review found" });
  }
});

module.exports.general = public_users;
