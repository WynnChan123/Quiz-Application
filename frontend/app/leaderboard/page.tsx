"use client";

import { User } from '@/components/user';
import { RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const Leaderboard = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalValuesPerPage = 10;
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);

  useEffect(() => {
    const start = (currentPage - 1) * totalValuesPerPage;
    const end = currentPage * totalValuesPerPage;
    setDisplayedUsers(users.slice(start, end));
  }, [currentPage, users]);

  useEffect(() => {
    const getUsers = async() => {
      setLoading(true);
      setError('');
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/allUsers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        if(!response.ok){
          throw new Error('Failed to fetch users');
        }
        const users: User[] = await response.json();
        setUsers(users);
        console.log('Users:', users);
      }catch(err){
        setError(err instanceof Error ? err.message : 'Failed to load questions');      
        console.error('Error fetching users:', err);
      }finally{
        setLoading(false);
      }
    }

    getUsers();
  }, []);

  const displayUsers = () => {
    if(displayedUsers.length > 0){
      return displayedUsers.map((user, index)=> {
        const rank = (currentPage - 1) * totalValuesPerPage + index + 1;
        return (
          <tr key={user.id} className="border-b">
            <td className="py-2 px-4 text-left">{rank}</td>
            <td className="py-2 px-4 text-left">{user.username}</td>
            <td className="py-2 px-4 text-left">{user.totalScore}</td>
          </tr>
        )
      })
    }else{
      return null;
    }
  }

  const handlePreviousPage = () => {
    if(currentPage === 1){
      return;
    }else{
      setCurrentPage(currentPage - 1);
    }
  }
  const handleNextPage = () => {
    const totalPages = Math.ceil(users.length / totalValuesPerPage);
    if(currentPage === totalPages){
      return;
    }else{
      setCurrentPage(currentPage + 1);
    }
  }

  if(loading){
    return <div>Loading...</div>
  }
  if(error){
    return <div className="text-red-500 text-lg">{error}</div>
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6 font-sans bg-gray-300">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12 text-center">
        <div className="flex items-end justify-end">
          <button 
            className="flex items-center px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => window.location.href = '/'} >
            <RotateCcw  
              className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" 
            />
            <div className="text-gray-600 ml-2">Try again</div>
          </button>
        </div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-gray-900">
          Leaderboard
        </h1>
        <div className="text-lg md:text-xl text-gray-700">
          {users.length === 0 ? 'No users found.' : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Rank</th>
                  <th className="py-2 px-4 text-left">Username</th>
                  <th className="py-2 px-4 text-left">Total Score</th>
                  </tr>
                  </thead>
                  <tbody>
                    {displayUsers()}
                  </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-between mt-6">
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            onClick={handleNextPage}
            disabled={currentPage * totalValuesPerPage >= users.length}
          >
            Next
          </button>
      </div>  
      </div>
    </div>
  )
}

export default Leaderboard;
