import { APIConfig } from "./api-config";

export const getBookById = async (id) => {
  const url = APIConfig.getBookById.url(id);

  const response = await fetch(url, {
    method: "GET"
  });

  if (!response.ok) {
    const errorInfo = await response.json();

    throw new Error(
      JSON.stringify({
        message: errorInfo.message,
        status: response.status
      })
    );
  }

  let data = await response.json();

  return data;
}

export const getBooksBySearch = async (searchTerm) => {
  const url = APIConfig.getBooksBySearch.url(searchTerm);

  const response = await fetch(url, {
    method: "GET"
  });

  if (!response.ok) {
    const errorInfo = await response.json();

    throw new Error(
      JSON.stringify({
        message: errorInfo.message,
        status: response.status
      })
    );
  }

  let data = await response.json();

  return data;
}