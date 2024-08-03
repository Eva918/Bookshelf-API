const { nanoid } = require('nanoid');
const books = require('./books');

const addNewBook = (ask, k) => {
  const {
    name, 
    year, 
    author, 
    summary, 
    publisher,
    pageCount, 
    readPage, 
    reading,
  } = ask.payload;

  if (!name) {
    const response = k.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);return response;
  }

  if (pageCount < readPage) {
    const response = k.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = k.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);return response;
  }

  const response = k.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);return response;
};

const retrieveAllBooks = (ask, k) => {
  const { 
    name, 
    reading, 
    finished } = ask.query;

  let filteredBooks = books;

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book
      .name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }

  const response = k.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);

  return response;
};

const getBookDetails = (ask, k) => {
  const { id } = ask.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = k.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);return response;
};

const updateBookDetails = (ask, k) => {
  const { id } = ask.params;
  const {
    name, 
    year, 
    author, 
    summary, 
    publisher, 
    pageCount, 
    readPage, 
    reading,
  } = ask.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (!name) {
      const response = k.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);

      return response;
    }

    if (pageCount < readPage) {
      const response = k.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);

      return response;
    }

    const finished = (pageCount === readPage);

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = k.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);

    return response;
  }

  const response = k.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

const removeBook = (ask, k) => {
  const { id } = ask.params;

  const index = books.findIndex((note) => note.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = k.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  const response = k.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

module.exports = {
  addNewBook,
  retrieveAllBooks,
  getBookDetails,
  updateBookDetails,
  removeBook,
};