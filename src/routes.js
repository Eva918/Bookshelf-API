const {
  addNewBook,
  retrieveAllBooks,
  getBookDetails,
  updateBookDetails,
  removeBook,
  } = require('./handlers');
  
  //route 

//handler untuk menambah buku
    const routes = [
    {
      method: 'POST',
      path: '/books',
      handler: addNewBook,
    },
//handler untuk mengambil semua buku
    {
      method: 'GET',
      path: '/books',
      handler: retrieveAllBooks,
    },
//handler untuk mengambil detail buku
    {
      method: 'GET',
      path: '/books/{id}',
      handler: getBookDetails,
    },
//handler untuk meng-update detail buku
    {
      method: 'PUT',
      path: '/books/{id}',
      handler: updateBookDetails,
    },
//handler untuk membuang buku
    {
      method: 'DELETE',
      path: '/books/{id}',
      handler: removeBook,
    },
  ];
  
  module.exports = routes;