/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';
import { getAllBooks } from '../../api/bookData';
import { useAuth } from '../../utils/context/authContext';
import CommunityBookCard from '../../components/CommunityBookCard';

function Home() {
  // Set a state for books
  const [books, setBooks] = useState([]);

  // Get user ID using useAuth Hook
  const { user } = useAuth();

  // create a function that makes the API call to get all the books
  const getAllTheBooks = () => {
    getAllBooks(user.uid).then(setBooks);
    console.log(user.uid);
  };

  // make the call to the API to get all the books on component render
  useEffect(() => {
    getAllTheBooks();
  }, []);
  // [] this is a dependecy, if these values inside are changed, this side effect will run again, if we leave it empty this won't run again.

  return (
    <div className="text-center my-4">
      <h1>No You Can NOT Actually Pay</h1>
      <div className="d-flex flex-wrap">
        {books.map((book) => (
          <CommunityBookCard key={book.firebaseKey} bookObj={book} onUpdate={getAllTheBooks} />
        ))}
      </div>
    </div>
  );
}

export default Home;
