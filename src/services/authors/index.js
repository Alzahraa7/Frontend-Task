import { APIConfig } from "./api-config";

export const getAuthorById = async (id) => {
  const url = APIConfig.getAuthorById.url(id);

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