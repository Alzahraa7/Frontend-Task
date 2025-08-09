const baseUrl = import.meta.env.VITE_BASE_URL;

export const APIConfig = {
  getAllBooks: {
    url: () => `${baseUrl}/books`,
  },
  getBookById: {
    url: (id) => `${baseUrl}/books/${id}`,
  },
  getBooksBySearch: {
    url: (searchTerm) => `${baseUrl}/books?name=${searchTerm}`,
  },
};