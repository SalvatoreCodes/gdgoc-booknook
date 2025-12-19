import React, { useState } from 'react';
import { db } from "../firebase"
import { collection, doc, setDoc, addDoc } from "firebase/firestore"

const Dashboard = () => {
  const [book, setBook] = useState({
  title: '',
  author: '',
  isbn: '',
  price: '',
  description: ''
});

  const handleInputChange = (field, value) => {
    setBook(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const docRef = await addDoc(collection(db, 'books'), {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: parseFloat(book.price) || 0,
      description: book.description,
      createdAt: new Date().toISOString()
    });
    
    console.log('Book added with ID: ', docRef.id);
    
    setBook({
      title: '',
      author: '',
      isbn: '',
      price: '',
      description: ''
    });
    
  } catch (error) {
    console.error('Error adding book: ', error);
    alert('Error adding book. Please try again.');
  }
};

  return (
    <div className="container mx-auto py-10 px-6 bg-white rounded-lg shadow-md max-w-2xl my-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={book.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Author <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={book.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={book.isbn}
              onChange={(e) => handleInputChange('isbn', e.target.value.replace(/\D/g, '').slice(0, 13))}
              placeholder="Enter 13-digit ISBN"
              pattern="\d{13}"
              required
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR) <span className="text-red-500">*</span></label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rp</span>
              </div>
              <input
                type="number"
                min="0"
                step="1000"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={book.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              value={book.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter book description"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;