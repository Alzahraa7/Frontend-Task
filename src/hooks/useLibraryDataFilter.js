import { useEffect, useState } from "react";
import { getBookById } from "../services/books";
import { getAuthorById } from "../services/authors";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const useInventoryRelations = ({ storeId = null, query = '' } = {}) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [mergedData, setmergedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch inventory data
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${baseUrl}/inventory?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch inventory: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setInventoryData(data);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [storeId, query]);

  // fetch books 
  useEffect(() => {
    if (inventoryData.length === 0) {
      setmergedData([]);
      setLoading(false);
      return;
    }

    const getBooks = async () => {
      try {
        const books = await Promise.all(
          inventoryData.map((inventory) => getBookById(inventory.book_id))
        );
        return books;
      } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
      }
    };

    // resolve the promise
    getBooks()
      .then((books) => {
        const bookMap = books.reduce((acc, book) => {
          acc[book.id] = book;
          return acc;
        }, {});

        // merge inventory with book data
        const enriched = inventoryData.map((inventory) => ({
          ...inventory,
          book: bookMap[inventory.book_id] || null
        }));

        setmergedData(enriched);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [inventoryData]);

  // fetch authors
  useEffect(() => {
    if (mergedData.length === 0) {
      return;
    }

    // Check if we have books with author_ids
    const booksWithAuthors = mergedData.filter(item => item.book && item.book.author_id);

    if (booksWithAuthors.length === 0) {
      setLoading(false);
      return;
    }

    const getAuthors = async () => {
      try {
        // Get unique author IDs from books
        const authorIds = [...new Set(
          booksWithAuthors.map(item => item.book.author_id)
        )];

        const authors = await Promise.all(
          authorIds.map((authorId) => getAuthorById(authorId))
        );
        return authors;
      } catch (error) {
        console.error("Error fetching authors:", error);
        throw error;
      }
    };

    getAuthors()
      .then((authors) => {
        const authorMap = authors.reduce((acc, author) => {
          acc[author.id] = author;
          return acc;
        }, {});

        // add author data to books
        const finalEnriched = mergedData.map((inventory) => ({
          ...inventory,
          book: inventory.book ? {
            ...inventory.book,
            author: authorMap[inventory.book.author_id] || null
          } : null
        }));

        setmergedData(finalEnriched);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [mergedData.length]);

  return {
    data: mergedData,
    loading,
    error,
  };
};