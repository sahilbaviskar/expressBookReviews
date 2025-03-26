const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get the book list using Async/Await
public_users.get('/', async function (req, res) {
    try {
        // Direct access to books object instead of calling our own API
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details by ISBN using Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const { isbn } = req.params;
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Task 12: Get book details by Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    try {
        const { author } = req.params;
        const result = Object.entries(books)
            .filter(([_, book]) => book.author === author)
            .reduce((acc, [isbn, book]) => {
                acc[isbn] = book;
                return acc;
            }, {});

        if (Object.keys(result).length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Task 13: Get book details by Title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    try {
        const { title } = req.params;
        const result = Object.entries(books)
            .filter(([_, book]) => book.title === title)
            .reduce((acc, [isbn, book]) => {
                acc[isbn] = book;
                return acc;
            }, {});

        if (Object.keys(result).length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    
    if (books[isbn] && books[isbn].reviews) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Add a specific route for /books to match the axios calls in the original code
public_users.get('/books', async function (req, res) {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Add a specific route for /books/:isbn to match the axios calls in the original code
public_users.get('/books/:isbn', async function (req, res) {
    try {
        const { isbn } = req.params;
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

module.exports.general = public_users;