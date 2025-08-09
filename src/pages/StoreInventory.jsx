// src/pages/Inventory.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Modal from '../components/Modal';
import Header from '../components/Header';
import { useInventoryRelations } from '../hooks/useLibraryDataFilter';
import BooksTable from '../components/BooksTable';
import Table from '../components/Table/Table';

const Inventory = () => {
  // State for UI
  const [activeTab, setActiveTab] = useState('books');
  const [showModal, setShowModal] = useState(false);

  // get the store id from the url
  const storeId = useParams().storeId;
  const { data: inventoryData, loading, error } = useInventoryRelations({
    storeId,
    query: `store_id=${storeId}`
  });

  // Set active tab based on view query param
  const view = 'books';
  useEffect(() => {
    if (view === 'authors' || view === 'books') {
      setActiveTab(view);
    }
  }, [view]);

  // Modal controls
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!inventoryData.length) return <p>No data found</p>;

  console.log(inventoryData);
  const renderBooksTable = () => (
    <Table
      columns={[
        {
          id: 'bookId',
          header: 'Book ID',
          accessorFn: (row) => row.book_id,
        },
        {
          id: 'bookName',
          header: 'Book Name',
          accessorFn: (row) => row.book_name,
        },
        {
          id: 'pages',
          header: 'Pages',
          accessorFn: (row) => row.pages,
        },
        {
          id: 'authorName',
          header: 'Author Name',
          accessorFn: (row) => row.author_name,
        }, {
          id: 'price',
          header: 'Price',
          accessorFn: (row) => row.price,
        }, {
          id: 'actions',
          header: 'Actions',
          accessorFn: (row) => row.actions,
        }]}
      data={
        [
          ...inventoryData.map((item) => ({
            book_id: item.book_id,
            book_name: item.book.name,
            pages: item.book.page_count,
            author_name: item.book.author?.first_name + ' ' + item.book.author?.last_name,
            price: item.price,
            actions: item.actions
          }))]
      }
    />
  );

  return (
    <div className="py-6">
      <div className="flex mb-4 w-full justify-center items-center">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 border-b-2 py-2 ${activeTab === 'books' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Books
        </button>
        <button
          onClick={() => setActiveTab('authors')}
          className={`px-4 border-b-2 py-2 ${activeTab === 'authors' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Authors
        </button>
      </div>

      <Header addNew={openModal} title={`Store Inventory`} buttonTitle="Add to inventory" />

      {activeTab === 'books' ? (
        renderBooksTable()
      ) : (
        <p className="text-gray-600">No authors with books in this store.</p>
      )}

      <Modal
        title="Add/Edit Book in Store"
        save={closeModal}
        cancel={closeModal}
        show={showModal}
        setShow={setShowModal}
      >
        <div className="flex flex-col gap-4 w-full">
          <div>
            <label htmlFor="book_select" className="block text-gray-700 font-medium mb-1">
              Select Book
            </label>
            <select
              id="book_select"
              className="border border-gray-300 rounded p-2 w-full"
            >
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              type="text"
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter Price (e.g., 29.99)"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;