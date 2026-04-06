"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json(); // ✅ THIS WAS MISSING

        // ✅ ensure always array
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          console.log("API Error:", data);
          setHistory([]);
        }

      } catch (error) {
        console.log(error);
        setHistory([]);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">

      {/* SIDEBAR */}
      <div className="w-72 bg-[#0b1220] border-r border-gray-800 p-6">
        <h2 className="text-xs text-gray-500 uppercase mb-6 tracking-widest">
          Overview
        </h2>

        <div className="space-y-3">
          <div className="px-4 py-3 rounded-lg bg-white text-black">
            History
          </div>
          <div className="px-4 py-3 rounded-lg text-gray-400">
            Analytics (coming soon)
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10">

        <h1 className="text-2xl font-semibold mb-6">
          Interview History
        </h1>

        <div className="bg-[#0b1220] border border-gray-800 rounded-2xl shadow-lg">
        <div className="max-h-[70vh] overflow-auto rounded-2xl">
        <table className="w-full text-left min-w-[600]">

            <thead className="sticky top-0 bg-[#020617] text-gray-400 border-b border-gray-800 z-10">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Score</th>
              </tr>
            </thead>

            <tbody>

              {history.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No history found
                  </td>
                </tr>
              )}

              {(Array.isArray(history) ? history : []).map((item, index) => (
                <tr
                key={index}
                className="border-t border-gray-800 hover:bg-[#020617] transition duration-200"
                >
                  <td className="p-4">
                    {new Date(item.date).toLocaleDateString()}
                  </td>

                  <td className="p-4 capitalize">
                    {item.category || "-"}
                  </td>

                  <td className="p-4 capitalize">
                    {item.difficulty}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-white text-black text-sm font-semibold">
                      {item.score}
                    </span>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>
          </div>
        </div>
      </div>
    </div>
  );
}