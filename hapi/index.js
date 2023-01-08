'use strict';

const Hapi = require('@hapi/hapi');
const { nanoid } = require('nanoid');

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
        "name": string,
        "year": number,
        "author": string,
        "summary": string,
        "publisher": string,
        "pageCount": number,
        "readPage": number,
        "reading": boolean
    }
    */
    server.route({
        method: 'POST',
        path: '/books',
        handler: (req, h) => {
            if (req.payload.name) {
                if (req.payload.readPage > req.payload.pageCount) {
                    return h.response(
                        {
                            "status": "fail",
                            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
                        }
                    ).code(400);
                } else {
                    const book = {
                        "id": nanoid(),
                        "name": req.payload.name,
                        "year": req.payload.year,
                        "author": req.payload.author,
                        "summary": req.payload.summary,
                        "publisher": req.payload.publisher,
                        "pageCount": req.payload.pageCount,
                        "readPage": req.payload.readPage,
                        "finished": req.payload.pageCount === req.payload.readPage,
                        "reading": req.payload.reading,
                        "insertedAt": new Date().toISOString()
                    }
                    book.updatedAt = book.insertedAt;
                    books.push(book);
                    return h.response(
                        {
                            "status": "success",
                            "message": "Buku berhasil ditambahkan",
                            "data": {
                                "bookId": book.id
                            }
                        }
                    ).code(201);
                }
            } else {
                return h.response(
                    {
                        "status": "fail",
                        "message": "Gagal menambahkan buku. Mohon isi nama buku"
                    }
                ).code(400);
            }
        }
    });

    // Menampilkan seluruh buku
    server.route({
        method: 'GET',
        path: '/books',
        handler: (req, h) => {
            const book = [];
            for (let i = 0; i < books.length; i++) {
                book.push(
                    {
                        "id": books[i].id,
                        "name": books[i].name,
                        "publisher": books[i].publisher
                    }
                )
            }
            return h.response(
                {
                    "status": "success",
                    "data": {
                        "books": book
                    }
                }
            ).code(200);
        }
    });

    // Menampilkan detail buku
    server.route({
        method: 'GET',
        path: '/books/{bookId}',
        handler: (req, h) => {
            const id = req.params.bookId;
            const book_idx = books.findIndex(book => book.id == id);
            if (book_idx !== -1) {
                return h.response(
                    {
                        "status": "success",
                        "data": {
                            "book": books[book_idx]
                        }
                    }
                ).code(200);
            } else {
                return h.response(
                    {
                        "status": "fail",
                        "message": "Buku tidak ditemukan"
                    }
                ).code(404);
            }
        }
    });

    // Mengubah data buku
    /*
    Contoh JSON:
    {
        "name": string,
        "year": number,
        "author": string,
        "summary": string,
        "publisher": string,
        "pageCount": number,
        "readPage": number,
        "reading": boolean
    }
    */
    server.route({
        method: 'PUT',
        path: '/books/{bookId}',
        handler: (req, h) => {
            if (req.payload.name) {
                if (req.payload.readPage > req.payload.pageCount) {
                    return h.response(
                        {
                            "status": "fail",
                            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
                        }
                    ).code(400);
                } else {
                    const id = req.params.bookId;
                    const book_idx = books.findIndex(book => book.id == id);
                    if (book_idx !== -1) {
                        books[book_idx].name = req.payload.name,
                        books[book_idx].year = req.payload.year,
                        books[book_idx].author = req.payload.author,
                        books[book_idx].summary = req.payload.summary,
                        books[book_idx].publisher = req.payload.publisher,
                        books[book_idx].pageCount = req.payload.pageCount,
                        books[book_idx].readPage = req.payload.readPage,
                        books[book_idx].finished = req.payload.pageCount === req.payload.readPage,
                        books[book_idx].reading = req.payload.reading,
                        books[book_idx].updatedAt = new Date().toISOString()
                        return h.response(
                            {
                                "status": "success",
                                "message": "Buku berhasil diperbarui"
                            }
                        ).code(200);
                    } else {
                        return h.response(
                            {
                                "status": "fail",
                                "message": "Gagal memperbarui buku. Id tidak ditemukan"
                            }
                        ).code(404);
                    }
                }
            } else {
                return h.response(
                    {
                        "status": "fail",
                        "message": "Gagal memperbarui buku. Mohon isi nama buku"
                    }
                ).code(400);
            }
        }
    });

    // Menghapus buku
    server.route({
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: (req, h) => {
            const id = req.params.bookId;
            const book_idx = books.findIndex(book => book.id == id);
            if (book_idx !== -1) {
                books.splice(book_idx, 1);
                return h.response(
                    {
                        "status": "success",
                        "message": "Buku berhasil dihapus"
                    }                    
                ).code(200);
            } else {
                return h.response(
                    {
                        "status": "fail",
                        "message": "Buku gagal dihapus. Id tidak ditemukan"
                    }
                ).code(404);
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