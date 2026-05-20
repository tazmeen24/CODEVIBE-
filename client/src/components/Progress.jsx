// src/components/Progress.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { FaCheckCircle, FaBookOpen, FaTrophy, FaFire } from "react-icons/fa";

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("userEmail"); // user email stored after login
    if (!email) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/progress/${email}`)
      .then((res) => {
        setProgress(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#050505]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-pink-400 font-semibold text-lg tracking-wider">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#050505]">
        <div className="bg-gray-900/50 border border-pink-500/30 p-8 rounded-2xl backdrop-blur-sm text-center max-w-md mx-4 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
          <FaBookOpen className="text-5xl text-pink-500 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-white mb-2">No Progress Yet</h2>
          <p className="text-pink-200/70 mb-6">Start learning today to see your statistics grow!</p>
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.5)]">
            Explore Courses
          </button>
        </div>
      </div>
    );
  }

  const completionPercentage = progress.totalLessons > 0 
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100) 
    : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] p-4 sm:p-8 font-sans">
      <div className="w-full max-w-3xl">
        {/* Header Section */}
        <div className="text-center mb-10 mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4 drop-shadow-lg">
            Your Learning Journey
          </h1>
          <p className="text-pink-200/80 text-lg md:text-xl max-w-xl mx-auto">
            Track your milestones and celebrate your coding achievements.
          </p>
        </div>

        {/* Main Progress Card */}
        <div className="bg-gray-900/60 border border-purple-500/30 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.15)] mb-8 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl text-white font-semibold flex items-center gap-2 mb-1">
                  <FaTrophy className="text-yellow-400" /> Course Completion
                </h3>
              </div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                {completionPercentage}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-5 mb-3 border border-gray-700 shadow-inner overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${completionPercentage}%` }}
              >
                {/* Shine effect on progress bar */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-right font-medium">
              {progress.completedLessons} of {progress.totalLessons} lessons completed
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Stat Card 1 */}
          <div className="bg-gray-900/50 border border-pink-500/20 rounded-2xl p-6 flex items-center gap-5 hover:bg-gray-800/80 hover:border-pink-500/40 transition-all group shadow-lg">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <FaCheckCircle className="text-3xl text-pink-500" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">Completed</p>
              <h4 className="text-4xl font-black text-white group-hover:text-pink-400 transition-colors">
                {progress.completedLessons}
              </h4>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-gray-900/50 border border-purple-500/20 rounded-2xl p-6 flex items-center gap-5 hover:bg-gray-800/80 hover:border-purple-500/40 transition-all group shadow-lg">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <FaBookOpen className="text-3xl text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">Total Lessons</p>
              <h4 className="text-4xl font-black text-white group-hover:text-purple-400 transition-colors">
                {progress.totalLessons}
              </h4>
            </div>
          </div>
        </div>

        {/* Encouragement Banner */}
        <div className="mt-8 bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-500/20 rounded-xl p-5 flex items-center justify-center gap-3 backdrop-blur-sm shadow-lg">
          <FaFire className="text-orange-500 text-2xl animate-pulse" />
          <p className="text-pink-100 font-medium text-lg">
            {completionPercentage === 100 
              ? "Incredible work! You've mastered all the lessons! 🌟" 
              : "Keep up the momentum, you're doing amazing! 🚀"}
          </p>
          <FaFire className="text-orange-500 text-2xl animate-pulse" />
        </div>
      </div>

      {/* Required shimmer animation styles for progress bar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
          0% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
};

export default Progress;
