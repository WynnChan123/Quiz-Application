'use client';

import Quiz from '@/components/Quiz';
import welcomePic from '@/public/welcome.jpg';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Welcome() {
  const [currentPage, setCurrentPage] = useState('Welcome');

  useEffect(() => {
    console.log('Current Page:', currentPage);
  }, [currentPage]);

  return (
    <div>
    {currentPage === 'Welcome' && (
      <div className="flex min-h-screen items-center justify-center font-sans bg-gray-300">
        <div className="w-1/2">
          <Image
            src={welcomePic}
            alt="Welcome Image"
            className="mx-auto mb-6 rounded-lg shadow-lg w-fit h-fit"
          />
        </div>
        <div className="w-1/2 p-8 text-left">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">
            Welcome to the Java Quiz!
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            <div className = "flex flex-col gap-4">
              <div>Enter Your Name</div>
              <input type="text" placeholder="Your Name" className="p-2 border border-gray-400 rounded-lg w-fit" />
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-fit"
                onClick={() => setCurrentPage('Quiz')}
              >
                Start Quiz
              </button>
            </div>
          </p>
        </div>
      </div>
    )}
    {currentPage === 'Quiz' && (
      <Quiz />
    )}
  </div>
  );
}
