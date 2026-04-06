"use client";

import { useState, useEffect } from "react";

export default function InterviewUI() {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [filtered, setFiltered] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState([]);

  const [totalScore, setTotalScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  

  // custom modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState("");
  const [pendingDifficulty, setPendingDifficulty] = useState("");
  const [changeType, setChangeType] = useState(""); // "category" or "difficulty"

  const categories = [
    "javascript",
    "python",
    "java",
    "cpp",
    "c",
    "csharp",
    "php",
    "react",
    "nodejs",
    "express",
    "mongodb",
    "sql",
    "html",
    "css",
    "dsa",
    "os",
    "dbms",
    "cn",
  ];

  const categoryLabels = {
    javascript: "JavaScript",
    python: "Python",
    java: "Java",
    cpp: "C++",
    c: "C",
    csharp: "C#",
    php: "PHP",
    react: "React",
    nodejs: "Node.js",
    express: "Express",
    mongodb: "MongoDB",
    sql: "SQL",
    html: "HTML",
    css: "CSS",
    dsa: "DSA",
    os: "Operating System",
    dbms: "DBMS",
    cn: "Computer Networks",
  };

  const difficulties = ["easy", "medium", "hard"];

  const resetInterviewState = () => {
    setFiltered([]);
    setCurrentIndex(0);
    setAnswers([]);
    setScores([]);
    setTotalScore(0);
    setFinished(false);
    setTimeLeft(300);
    setLoadingQuestions(false);
  };

  const isInterviewInProgress =
    category && difficulty && filtered.length > 0 && !finished;

  const handleCategoryChange = (newCategory) => {
    if (isInterviewInProgress) {
      setPendingCategory(newCategory);
      setPendingDifficulty("");
      setChangeType("category");
      setShowConfirmModal(true);
      return;
    }

    setCategory(newCategory);
    setDifficulty("");
    resetInterviewState();
  };

  const handleDifficultyChange = (newDifficulty) => {
    if (isInterviewInProgress) {
      setPendingDifficulty(newDifficulty);
      setChangeType("difficulty");
      setShowConfirmModal(true);
      return;
    }

    setDifficulty(newDifficulty);
    resetInterviewState();
  };

  const handleConfirmChange = () => {
    if (changeType === "category") {
      setCategory(pendingCategory);
      setDifficulty("");
    } else if (changeType === "difficulty") {
      setDifficulty(pendingDifficulty);
    }

    resetInterviewState();
    setShowConfirmModal(false);
    setPendingCategory("");
    setPendingDifficulty("");
    setChangeType("");
  };

  const handleCancelChange = () => {
    setShowConfirmModal(false);
    setPendingCategory("");
    setPendingDifficulty("");
    setChangeType("");
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!category || !difficulty) return;

      try {
        setLoadingQuestions(true);

        const res = await fetch("/api/generate-questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category,
            difficulty,
          }),
        });

        const data = await res.json();

        if (
          data.questions &&
          Array.isArray(data.questions) &&
          data.questions.length > 0
        ) {
          setFiltered(data.questions);
          setCurrentIndex(0);
          setAnswers(Array(data.questions.length).fill(""));
          setScores(Array(data.questions.length).fill(null));
          setTotalScore(0);
          setFinished(false);
          setTimeLeft(300);
        } else {
          setFiltered([]);
        }
      } catch (error) {
        console.log("Question fetch error:", error);
        setFiltered([]);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [category, difficulty]);

  useEffect(() => {
    if (
      !category ||
      !difficulty ||
      finished ||
      filtered.length === 0 ||
      loadingQuestions
    )
      return;

    if (timeLeft === 0) {
      setFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, category, difficulty, finished, filtered.length, loadingQuestions]);

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleSaveNext = async () => {
    if (!filtered[currentIndex]) return;

    const userAns = (answers[currentIndex] || "").toLowerCase();

    const matched = filtered[currentIndex].keywords.filter((k) =>
      userAns.includes(k.toLowerCase())
    );

    const calculated = Math.min(
      10,
      Math.floor(
        (matched.length / filtered[currentIndex].keywords.length) * 10
      )
    );

    const updatedScores = [...scores];
    updatedScores[currentIndex] = calculated;
    setScores(updatedScores);

    const total = updatedScores.reduce((a, b) => a + (b || 0), 0);
    setTotalScore(total);

    if (currentIndex === filtered.length - 1) {
      setFinished(true);

      try {
        await fetch("/api/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category,
            difficulty,
            score: total,
          }),
        });
      } catch (err) {
        console.log("Save error:", err);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCategory("");
    setDifficulty("");
    resetInterviewState();
  };

  return (
    <div className="relative flex h-[calc(100vh-80px)] bg-[#020617] text-white">
      {/* CUSTOM CONFIRM MODAL */}
      {showConfirmModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#0b1220] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-3">End current interview?</h2>
            <p className="text-gray-400 mb-6">
              Your current interview will be reset if you change the category or
              difficulty. Do you want to continue?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelChange}
                className="px-5 py-2 rounded-lg border border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmChange}
                className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-72 bg-[#0b1220] border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xs text-gray-500 uppercase mb-6 tracking-widest">
            Category
          </h2>

          <div>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#020617] text-white border border-gray-800 outline-none"
            >
              <option value="" disabled>
                Select Category
              </option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]}
                </option>
              ))}
            </select>
          </div>

          {category && (
            <>
              <h2 className="text-xs text-gray-500 uppercase mt-10 mb-4 tracking-widest">
                Difficulty
              </h2>

              <div>
                <select
                  value={difficulty}
                  onChange={(e) => handleDifficultyChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#020617] text-white border border-gray-800 outline-none"
                >
                  <option value="" disabled>
                    Select Difficulty
                  </option>

                  {difficulties.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500">Interview System</div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10">
        {!category && (
          <p className="text-gray-400 text-lg">Select a category to begin</p>
        )}

        {category && !difficulty && (
          <p className="text-gray-400 text-lg">Select difficulty level</p>
        )}

        {loadingQuestions && (
          <p className="text-gray-400 text-lg">Loading AI questions...</p>
        )}

        {category &&
          difficulty &&
          !loadingQuestions &&
          filtered.length === 0 &&
          !finished && (
            <p className="text-gray-400 text-lg">
              No questions found for this category and difficulty
            </p>
          )}

        {category &&
          difficulty &&
          !finished &&
          !loadingQuestions &&
          filtered.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-semibold">
                    {categoryLabels[category]}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    {difficulty.toUpperCase()} LEVEL
                  </p>
                </div>

                <div className="bg-[#0b1220] border border-gray-800 px-5 py-2 rounded-lg">
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="font-semibold">{formatTime(timeLeft)}</p>
                </div>
              </div>

              <div className="bg-[#0b1220] border border-gray-800 rounded-xl p-8 max-w-4xl">
                <p className="text-lg mb-6">{filtered[currentIndex]?.question}</p>

                <textarea
                  value={answers[currentIndex] || ""}
                  onChange={(e) => {
                    const updated = [...answers];
                    updated[currentIndex] = e.target.value;
                    setAnswers(updated);
                  }}
                  className="w-full p-4 bg-[#020617] border border-gray-800 rounded-lg"
                  rows={6}
                  placeholder="Write your answer here..."
                />

                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-5 py-2 bg-gray-700 rounded-lg disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    onClick={handleSaveNext}
                    className="px-6 py-2 bg-white text-black rounded-lg"
                  >
                    {currentIndex < filtered.length - 1
                      ? "Save & Next"
                      : "Finish"}
                  </button>
                </div>
              </div>
            </>
          )}

        {finished && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-10 w-full max-w-xl text-center">
              <h2 className="text-3xl font-semibold mb-4">
                Interview Completed 🎉
              </h2>

              <p className="text-gray-400 mb-4">Your Score</p>

              <div className="text-5xl font-bold mb-6">
                {totalScore} / {filtered.length * 10}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRestart}
                  className="px-6 py-2 bg-white text-black rounded-lg"
                >
                  Restart
                </button>

                <button
                  onClick={() => (window.location.href = "/history")}
                  className="px-6 py-2 border border-gray-600 rounded-lg"
                >
                  View History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}