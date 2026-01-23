'use client';

import Quiz from '@/components/Quiz';
import welcomePic from '@/public/welcome.jpg';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Welcome() {
  const [currentPage, setCurrentPage] = useState('Welcome');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    console.log('Current Page:', currentPage);
  }, [currentPage]);

  return (
    <div>
    {currentPage === 'Welcome' && (
      <div className="flex min-h-screen items-center justify-center font-sans bg-gray-300 px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 max-w-6xl w-full">
          <div className="w-full md:w-1/2 max-w-md md:max-w-none">
            <Image
              src={welcomePic}
              alt="Welcome Image"
              className="mx-auto mb-4 md:mb-6 rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="w-full md:w-1/2 p-4 md:p-8 text-center md:text-left">
            <h1 className="mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              Welcome to the Java Quiz!
            </h1>
            <div className="mb-4 md:mb-6 text-base md:text-lg text-gray-700">
              <div className="flex flex-col gap-4">
                <div>Enter Your Name</div>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="p-3 border border-gray-400 rounded-lg w-full sm:w-auto" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                />
                <button 
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => setCurrentPage('Quiz')}
                  disabled={!userName.trim()}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    {currentPage === 'Quiz' && (
      <Quiz userName={userName} />
    )}
  </div>
  );
}
