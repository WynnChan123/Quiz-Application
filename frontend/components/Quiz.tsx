import React, { useEffect, useState } from 'react'
import { Question } from './question';
import { ArrowRight } from 'lucide-react';

const Quiz = ({ userName }: { userName: string }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const letters = ['A', 'B', 'C', 'D'];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quiz-application-jwas.onrender.com';

  useEffect(() => {
    // Init fields
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setError('');
    setLoading(true);
    setUserAnswers([]);
  }, []);

  useEffect(() => {
    // Fetch questions
    const fetchQuestions = async ()=> {
      try {
        const response = await fetch(`${API_BASE_URL}/question/category/JAVA`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error('Network response was not ok');
        }

        const questions: Question[] = await response.json();
        console.log('Fetched Questions:', questions);
        setQuestions(questions);

      }catch (err) {
        console.error('Failed to fetch questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load questions');      
      }finally{
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  const handleNext = (selectedAnswer: string) => {
    if(!selectedAnswer){
      setError('Please select an answer before proceeding to the next question.');
      return;
    }
    // save the user's answer first
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newUserAnswers);

    setError('');

    if(currentQuestionIndex < questions.length - 1){
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(newUserAnswers[currentQuestionIndex + 1] || '');
    }else{
      handleSubmit();
    }
  }

  const handlePrevious = (selectedAnswer: string) => {
    // Save the user's answer first
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newUserAnswers);
    setError('');

    setCurrentQuestionIndex(i => Math.max(0, i - 1));
    setSelectedAnswer(newUserAnswers[currentQuestionIndex - 1] || '');
  }

  const handleSubmit = async() => {
    const finalAnswers = [...userAnswers];

    if (selectedAnswer) {
      finalAnswers[currentQuestionIndex] = selectedAnswer;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!finalAnswers[i]) {
        setError('Please select an answer for all questions before submitting.');
        return;
      }
    }

    let finalScore = 0;
    for (let i = 0; i < questions.length; i++) {
      if (finalAnswers[i] === questions[i].rightAnswer) {
        finalScore++;
      }
    }

    setUserAnswers(finalAnswers);
    setScore(finalScore);
    setQuizFinished(true);
    setShowReview(false);
    console.log('Calling backend to submit score...');
    // Send score to backend
    try{
      const response = await fetch(`${API_BASE_URL}/leaderboard/createUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName,
          totalScore: finalScore
        })
      });
      if(!response.ok){
        throw new Error('Failed to submit score');
      }
      console.log('Score submitted successfully');
    }catch(err){
      console.error('Error submitting score:', err);
    }
  };

  const reviewItems = questions.map((q, idx) => {
    const user = userAnswers[idx] || '';
    const correct = q.rightAnswer;
    const isCorrect = user === correct;
    return {
      id: q.id,
      index: idx,
      questionTitle: q.questionTitle,
      options: [q.option1, q.option2, q.option3, q.option4],
      user,
      correct,
      isCorrect
    };
  });

  if (loading) return <div>Loading...</div>;
  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 50; 

    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-6 font-sans bg-gray-300">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12">
        <div className="flex flex-row justify-end items-end">
          <a
            href="/leaderboard"
            className="px-4 py-2 bg-amber-400 text-white font-bold rounded-lg hover:bg-amber-500 transition-colors duration-200"
          >
            View Leaderboard
            <ArrowRight className="inline-block ml-1 w-4 h-4" />
          </a>
        </div>
          <div className="text-center mb-4 md:mb-6">
            <div className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4">
              {passed ? '🎉' : '📚'}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {passed ? 'Congratulations!' : 'Quiz Completed!'}
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              {userName || 'Student'}
            </p>
          </div>

          {/* Score circle */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative w-36 h-36 md:w-48 md:h-48">
              <svg className="transform -rotate-90 w-36 h-36 md:w-48 md:h-48">
                <circle cx="72" cy="72" r="64" stroke="#e5e7eb" strokeWidth="10" fill="none" className="md:hidden" />
                <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="12" fill="none" className="hidden md:block" />
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke={passed ? '#10b981' : '#f59e0b'}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 64}`}
                  strokeDashoffset={`${2 * Math.PI * 64 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out md:hidden"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={passed ? '#10b981' : '#f59e0b'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out hidden md:block"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">{score}</span>
                <span className="text-gray-500 text-xs md:text-sm">out of {questions.length}</span>
                <span className={`text-xl md:text-2xl font-semibold mt-1 ${passed ? 'text-green-600' : 'text-amber-600'}`}>{percentage}%</span>
              </div>
            </div>
          </div>

          {/* Performance message */}
          <div className="text-center mb-6 md:mb-8">
            <p className="text-base md:text-lg text-gray-700">
              {percentage >= 90 ? '🌟 Outstanding! You mastered this topic!' :
              percentage >= 80 ? '✨ Excellent work! You did great!' :
              percentage >= 50 ? '👏 Good job! You passed!' :
              '💪 Keep studying! You can do better!'}
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Quiz Summary</h3>
            <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-green-600">{score}</div>
                <div className="text-xs md:text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-red-600">{questions.length - score}</div>
                <div className="text-xs md:text-sm text-gray-600">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-xs md:text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              onClick={() => {
                setQuizFinished(false);
                setScore(0);
                setCurrentQuestionIndex(0);
                setSelectedAnswer('');
                setUserAnswers([]);
                setShowReview(false);
              }}
              className="flex-1 px-4 md:px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg text-sm md:text-base"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="flex-1 px-4 md:px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 shadow-lg text-sm md:text-base"
            >
              Back to Home
            </button>
          </div>

          {/* Review toggle */}
          <button
            onClick={() => setShowReview(v => !v)}
            className="w-full mt-3 md:mt-4 px-4 md:px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 text-sm md:text-base"
          >
            {showReview ? 'Hide Review' : 'Review Answers'}
          </button>

          {/* Review list */}
          {showReview && (
            <div className="mt-4 md:mt-6">
              <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Review</h3>
              <div className="space-y-3 md:space-y-4">
                {reviewItems.map(item => (
                  <div key={item.index} className="p-3 md:p-4 rounded-lg border bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-base md:text-lg mb-2">{item.questionTitle}</div>
                        <div className="mt-3 grid gap-2">
                          {item.options.map((opt, i) => {
                            const isUser = opt === item.user;
                            const isCorrectOpt = opt === item.correct;
                            const bg = isCorrectOpt ? 'bg-green-50 border-green-200' : isUser ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100';
                            const border = isCorrectOpt || isUser ? 'border' : 'border';
                            return (
                              <div key={i} className={`p-2 md:p-3 rounded-md ${bg} ${border} flex items-center w-full`}>
                                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-bold bg-gray-100 shrink-0 text-sm md:text-base">{letters[i]}</div>
                                  <div className={`text-xs sm:text-sm flex-1 ${isCorrectOpt ? 'text-green-800' : isUser ? 'text-red-800' : 'text-gray-800'}`}>{opt}</div>
                                </div>
                                <div className="text-xs ml-2 md:ml-4 shrink-0 w-20 sm:w-24 text-right">
                                  {isCorrectOpt && <span className="text-green-700 font-semibold">Correct</span>}
                                  {!isCorrectOpt && isUser && <span className="text-red-700 font-semibold">Your answer</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="ml-3 md:ml-4 text-right shrink-0">
                        <div className={`font-semibold text-sm md:text-base ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {item.isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return questions.length ? (
    <div className="flex items-center justify-center min-h-screen px-4 py-6 font-sans bg-gray-300">
      <div className="max-w-4xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-8 lg:gap-12">
        {/* Left side - questions */}
        <div className="w-full lg:w-1/2 text-center lg:text-left text-lg md:text-xl lg:text-2xl">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: String(Math.floor(((currentQuestionIndex + 1) / questions.length) * 100) || 0) + "%" }}
            ></div>
          </div>
          <div>
            Q{currentQuestionIndex + 1}: {questions[currentQuestionIndex].questionTitle}
          </div>
        </div>

        {/* Right side - options */}
        <div className="w-full lg:w-1/2 max-w-full md:max-w-md lg:max-w-lg space-y-3 md:space-y-4">
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          
          {[
            questions[currentQuestionIndex].option1,
            questions[currentQuestionIndex].option2,
            questions[currentQuestionIndex].option3,
            questions[currentQuestionIndex].option4
          ].map((option, i) => (
            <button
              key={i}
              onClick={() => setSelectedAnswer(option)}
              className={`flex items-center p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 w-full text-left shadow-lg border min-h-17.5 md:min-h-20 ${
                selectedAnswer === option 
                  ? 'bg-blue-500 text-white border-blue-600' 
                  : 'bg-white border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-lg md:text-xl font-bold mr-3 md:mr-4 shrink-0">
                {letters[i]}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-base md:text-lg">{option}</div>
              </div>
            </button>
          ))}

          <div className="flex gap-3 md:gap-4 mt-4 md:mt-6">
            <button
              onClick={() => handlePrevious(selectedAnswer)}
              disabled={currentQuestionIndex === 0}
              className="px-4 md:px-6 py-3 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors text-sm md:text-base"
            >
              Previous
            </button>
            <button
              onClick={()=> handleNext(selectedAnswer)}
              className="flex-1 px-4 md:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  ): null;
}

export default Quiz