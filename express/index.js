const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const client = redis.createClient();
client.connect();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true, parameterLimit: 100000, limit: "500mb"}));
app.use(cors());

const books = [];
/*
Contoh JSON books:
{
    id: 1,
    judul: 'Book_API',
    total_halaman: 200
}
*/

// API

// Menyimpan buku 
/*
Contoh JSON:
{
    "judul": "Book_API",
    "total_halaman": 200
}
*/
app.post('/book', async (req, res) => {
    const book = req.body;
    if (books.length == 0) {
        book.id = 1
    } else {
        book.id = books[books.length - 1].id + 1;
    }
    books.push(book);
    res.send(`Buku berjudul ${book.judul} berhasil disimpan!`);
});

// Menampilkan seluruh buku
app.get('/book', async (req, res) => {
    const book = await client.get('book');
    if (book) {
        res.send(JSON.parse(book));
    } else {
        await client.set('book', JSON.stringify(books));
        await client.expire('book', 300);
        res.send(books);
    }
});

// Menampilkan detail buku
app.get('/book/:id', async (req, res) => {
    const id = req.params.id;
    const book_idx = books.findIndex(book => book.id == id);
    if (book_idx !== -1) {
        res.send(books[book_idx]);
    } else {
        res.send(`Buku tidak ditemukan!`);
    }
});

// Mengubah data buku
/*
Contoh JSON:
{
    "judul": "Book_API",
    "total_halaman": 200
}
*/
app.put('/book/:id', async (req, res) => {
    const id = req.params.id;
    const book_idx = books.findIndex(book => book.id == id);
    if (book_idx !== -1) {
        books[book_idx].judul = req.body.judul;
        books[book_idx].total_halaman = req.body.total_halaman;
        res.send(`Buku dengan id ${id} berhasil diupdate!`);
    } else {
        res.send(`Buku tidak ditemukan!`);
    }
});


// Menghapus buku
app.delete('/book/:id', async (req, res) => {
    const id = req.params.id;
    const book_idx = books.findIndex(book => book.id == id);
    if (book_idx !== -1) {
        books.splice(book_idx, 1);
        res.send(`Buku dengan id ${id} berhasil dihapus!`);
    } else {
        res.send(`Buku tidak ditemukan!`);
    }
});

app.listen(5000, () => console.log(`Server running at port 5000`));