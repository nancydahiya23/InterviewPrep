"use client";

import { useState, useEffect } from "react";
import { questions } from "@/data/questions";

export default function InterviewPage() {

  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  const [filtered, setFiltered] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState([]);

  const [totalScore, setTotalScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300); // 5 min

  const categories = ["javascript", "react", "dsa"];
  const difficulties = ["easy", "medium", "hard"];

  // FILTER QUESTIONS
  useEffect(() => {
    if (category && difficulty) {
      const q = questions
        .filter(
          (item) =>
            item.category === category &&
            item.difficulty === difficulty
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      setFiltered(q);
      setCurrentIndex(0);
      setAnswers(Array(q.length).fill(""));
      setScores(Array(q.length).fill(null));
      setTotalScore(0);
      setFinished(false);
      setTimeLeft(300);
    }
  }, [category, difficulty]);

  // TIMER
  useEffect(() => {
    if (!category || !difficulty || finished) return;

    if (timeLeft === 0) {
      setFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, category, difficulty, finished]);

  // FORMAT TIME
  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // SUBMIT
  const handleSubmit = () => {
    const userAns = (answers[currentIndex] || "").toLowerCase();

    const matched =
      filtered[currentIndex].keywords.filter((k) =>
        userAns.includes(k)
      );

    const calculated = Math.min(
      10,
      Math.floor(
        (matched.length /
          filtered[currentIndex].keywords.length) *
          10
      )
    );

    const updatedScores = [...scores];
    updatedScores[currentIndex] = calculated;

    setScores(updatedScores);

    const total = updatedScores.reduce((a, b) => a + (b || 0), 0);
    setTotalScore(total);
  };

  // NEXT
  const handleNext = () => {
    if (currentIndex < filtered.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  // PREVIOUS
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#020617]">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#0b1220] border-r border-gray-800 p-6">

        <h2 className="text-xs text-gray-500 uppercase mb-6 tracking-widest">
          Categories
        </h2>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => {
                setCategory(cat);
                setDifficulty(null);
              }}
              className={`px-4 py-3 rounded-lg cursor-pointer transition
              ${
                category === cat
                  ? "bg-white text-black"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {cat.toUpperCase()}
            </div>
          ))}
        </div>

        {/* DIFFICULTY */}
        {category && (
          <>
            <h2 className="text-xs text-gray-500 uppercase mt-8 mb-4 tracking-widest">
              Difficulty
            </h2>

            <div className="space-y-2">
              {difficulties.map((lvl) => (
                <div
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`px-4 py-2 rounded-lg cursor-pointer transition
                  ${
                    difficulty === lvl
                      ? "bg-white text-black"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {lvl.toUpperCase()}
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* MAIN PANEL */}
      <div className="flex-1 p-10">

        {!category && (
          <h1 className="text-gray-400 text-lg">
            Select a category to start
          </h1>
        )}

        {category && !difficulty && (
          <h1 className="text-gray-400 text-lg">
            Select difficulty level
          </h1>
        )}

        {category && difficulty && !finished && filtered.length > 0 && (
          <>
            {/* TOP */}
            <div className="mb-8 flex justify-between items-center">

              <div>
                <h1 className="text-2xl font-semibold text-white">
                  {category.toUpperCase()} - {difficulty.toUpperCase()}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Question {currentIndex + 1} / {filtered.length}
                </p>
              </div>

              <div className="text-sm">
                Time Left:{" "}
                <span
                  className={`font-semibold ${
                    timeLeft < 60 ? "text-red-400" : "text-white"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>

            </div>

            {/* QUESTION CARD */}
            <div className="bg-[#0b1220] border border-gray-800 rounded-xl p-6 max-w-3xl">

              <p className="text-gray-300 mb-6">
                {filtered[currentIndex].question}
              </p>

              <textarea
                value={answers[currentIndex] || ""}
                onChange={(e) => {
                  const updated = [...answers];
                  updated[currentIndex] = e.target.value;
                  setAnswers(updated);
                }}
                placeholder="Write your answer..."
                className="w-full p-4 bg-[#020617] border border-gray-800 rounded-lg text-sm outline-none focus:border-gray-600 text-white"
                rows={5}
              />

              {/* BUTTONS */}
              <div className="mt-6 flex justify-between items-center">

                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`px-4 py-2 rounded-md text-sm ${
                    currentIndex === 0
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-4">

                  {scores[currentIndex] !== null && (
                    <span className="text-green-400">
                      Score: {scores[currentIndex]}/10
                    </span>
                  )}

                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-white text-black rounded-md text-sm"
                  >
                    Submit
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm"
                  >
                    {currentIndex < filtered.length - 1
                      ? "Next"
                      : "Finish"}
                  </button>

                </div>

              </div>

            </div>
          </>
        )}

        {/* RESULT */}
        {finished && (
          <div className="text-center mt-20">

            <h2 className="text-3xl text-white mb-4">
              Interview Completed
            </h2>

            <p className="text-gray-400 text-lg">
              Score: {totalScore} / {filtered.length * 10}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}