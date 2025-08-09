const baseUrl = import.meta.env.VITE_BASE_URL;

export const APIConfig = {
  getAllAuthors: {
    url: () => `${baseUrl}/authors`,
  },
  getAuthorById: {
    url: (id) => `${baseUrl}/authors/${id}`,
  },
};