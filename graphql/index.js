const express = require('express');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList, GraphQLSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

const app = express();

var bookshelves = [
    { id: 1, name: 'Bookshelf 1' },
    { id: 2, name: 'Bookshelf 2' },
    { id: 3, name: 'Bookshelf 3' }
];

const bookshelfType = new GraphQLObjectType({
    name: 'Bookshelf',
    description: 'Represents a bookshelf',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) }
    })
});

var books = [
    { id: 1, title: 'Title 1', bookshelfId: 1 },
    { id: 2, title: 'Title 2', bookshelfId: 2 },
    { id: 3, title: 'Title 3', bookshelfId: 3 },
    { id: 4, title: 'Title 4', bookshelfId: 1 },
    { id: 5, title: 'Title 5', bookshelfId: 2 },
    { id: 6, title: 'Title 6', bookshelfId: 3 },
    { id: 7, title: 'Title 7', bookshelfId: 1 },
    { id: 8, title: 'Title 8', bookshelfId: 2 }
];

const bookType = new GraphQLObjectType({
    name: 'Book',
    description: 'Represents a book in a bookshelf',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        bookshelfId: { type: new GraphQLNonNull(GraphQLInt) }
    })
});

const rootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(bookType),
            description: 'List of all books',
            resolve: () => books
        },
        book: {
            type: bookType,
            description: 'List of all books',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        bookshelves: {
            type: new GraphQLList(bookshelfType),
            description: 'List of all bookshelves',
            resolve: () => bookshelves
        },
        bookshelf: {
            type: bookshelfType,
            description: 'List of all bookshelves',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => bookshelves.find(bookshelf => bookshelf.id === args.id)
        }
    })
})

const rootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: bookType,
            description: 'Add a book',
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                bookshelfId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    title: args.title,
                    bookshelfId: args.bookshelfId
                }
                books.push(book);
                return book;
            }
        },
        updateBook: {
            type: bookType,
            description: 'Update a book',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                bookshelfId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                books[args.id - 1].title = args.title;
                books[args.id - 1].bookshelfId = args.bookshelfId;
                return books[args.id - 1];
            }
        },
        removeBook: {
            type: bookType,
            description: 'Remove a book',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = books[args.id - 1];
                books = books.filter(book => book.id !== args.id);
                return book;
            }
        },
        addBookshelf: {
            type: bookshelfType,
            description: 'Add a bookshelf',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const bookshelf = {
                    id: bookshelves.length + 1,
                    name: args.name
                }
                bookshelves.push(bookshelf);
                return bookshelf;
            }
        },
        updateBookshelf: {
            type: bookshelfType,
            description: 'Update a bookshelf',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                bookshelves[args.id - 1].name = args.name;
                return bookshelves[args.id - 1];
            }
        },
        removeBookshelf: {
            type: bookshelfType,
            description: 'Remove a bookshelf',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const bookshelf = bookshelves[args.id - 1];
                bookshelves = bookshelves.filter(bookshelf => bookshelf.id !== args.id);
                return bookshelf;
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: rootQueryType,
    mutation: rootMutationType
})

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));

app.listen(5000, () => console.log(`Server running at port 5000`));