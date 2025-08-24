import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInsantce";
import { useNavigate } from "react-router-dom";

const CreateContest = () => {
  const [contestName, setContestName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách câu hỏi từ backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get("/questions");
        setQuestions(res.data.questions || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  // Toggle chọn câu hỏi
  const handleSelectQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  // Submit tạo contest
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contestName.trim() || selectedQuestions.length === 0) {
      alert("Hãy nhập tên contest và chọn ít nhất 1 câu hỏi!");
      return;
    }

    try {
      await axiosInstance.post("/create-contest", {
        name: contestName,
        questions: selectedQuestions,
      });
      alert("Contest created successfully!");
      navigate("/"); // quay về trang chủ
    } catch (error) {
      console.error("Error creating contest:", error);
      alert("Failed to create contest!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Contest</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contest Name */}
        <div>
          <label className="block font-medium">Contest Name</label>
          <input
            type="text"
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            placeholder="Enter contest name..."
          />
        </div>

        {/* Questions List */}
        <div>
          <label className="block font-medium mb-2">Select Questions</label>
          <div className="max-h-64 overflow-y-auto border p-2 rounded">
            {questions.map((q) => (
              <div key={q.id} className="flex items-center mb-2">
                
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(q.id)}
                  onChange={() => handleSelectQuestion(q.id)}
                  className="mr-2"
                />
                <span> {q.content} </span>
        
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Contest
        </button>
      </form>
    </div>
  );
};

export default CreateContest;
