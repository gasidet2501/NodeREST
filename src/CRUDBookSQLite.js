// SQLite3 CRUD operations
// npm install sqlite3
// Create a Bood. sqlite file in Database folder
// Run this file with node CRUDBookSQLite.js
// Test with Postman
const express = require('express');
const sqlite3 = require('sqlite3');
const app = express(); //สร้างแอพ
// connect to database
const db = new sqlite3.Database('./Database/Book.sqlite');
// parse incoming requests
app.use(express. json());
// create books table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT
)`);

// route to get all books
app.get('/books', (req, res) => {
  db.all('SELECT * FROM books', (err, rows) => { //db.all = ส่งข้อมูลมามากกว่า 1
     if (err) {
        res.status(500).send(err);
     }
    else {
      res.json(rows); //format ตัว rows ให้เป็น json แล้วส่งข้อมูลให้มาแสดง
    }
   });
 });

// route to get a book by id
app.get('/books/:id', (req, res) => {
  db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
     if (err) {
        res.status(500).send(err);
     }
    else{
        if(!row) {
            res.status (404).send('Book not found');
       }
        else{
            res.json(row);
        }
    }
   });
 });

 // route to create a new book
app.post('/books', (req, res) => {
    const book = req.body;
    db. run('INSERT INTO books (title, author) VALUES (?, ?)', book.title, book.author, function(err) {
    if (err) {
        res. status (500).send(err);
    }
    else {
        book.id = this.lastID; //lastid = ไอดีตัวถัดไปที่ยังว่างอยู่
        res. send (book);
    }
    });
});
// route to update a book
app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', book.title, book.author, req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else{
            res.send (book);
        }
    });
});

// route to delete a book
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, function(err) {
        if(err) {
            res. status (500).send(err);
        } else {
            res.send({});
        }
    });
});  
    
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));



