'use strict';

const Hapi = require('@hapi/hapi');

const books = [];

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost'
    });

    // Menyimpan buku
    /*
    Contoh JSON:
    {
        "judul": "Book_API",
        "total_halaman": 200
    }
    */
    server.route({
        method: 'POST',
        path: '/book',
        handler: (req, h) => {
            const book = req.payload;
            if (books.length == 0) {
                book.id = 1
            } else {
                book.id = books[books.length - 1].id + 1;
            }
            books.push(book);
            return h.response(`Buku berjudul ${book.judul} berhasil disimpan!`);
        }
    });

    // Menampilkan seluruh buku
    server.route({
        method: 'GET',
        path: '/book',
        handler: (req, h) => {
            return h.response(books);
        }
    });

    // Menampilkan detail buku
    server.route({
        method: 'GET',
        path: '/book/{id}',
        handler: (req, h) => {
            const id = req.params.id;
            const book_idx = books.findIndex(book => book.id == id);
            if (book_idx !== -1) {
                return h.response(books[book_idx]);
            } else {
                return h.response(`Buku tidak ditemukan!`);
            }
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
    server.route({
        method: 'PUT',
        path: '/book/{id}',
        handler: (req, h) => {
            const id = req.params.id;
            const book_idx = books.findIndex(book => book.id == id);
            if (book_idx !== -1) {
                books[book_idx].judul = req.payload.judul;
                books[book_idx].total_halaman = req.payload.total_halaman;
                return h.response(`Buku dengan id ${id} berhasil diupdate!`);
            } else {
                return h.response(`Buku tidak ditemukan!`);
            }
        }
    });

    // Menghapus buku
    server.route({
        method: 'DELETE',
        path: '/book/{id}',
        handler: (req, h) => {
            const id = req.params.id;
            const book_idx = books.findIndex(book => book.id == id);
            if (book_idx !== -1) {
                books.splice(book_idx, 1);
                return h.response(`Buku dengan id ${id} berhasil dihapus!`);
            } else {
                return h.response(`Buku tidak ditemukan!`);
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();