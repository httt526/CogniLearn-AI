import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInsantce";

// // Hàm tạo đáp án sai gần đúng
// function generateFakeAnswers(correct) {
//   let fakeAnswers = [];

//   function randomAround(num) {
//     // Lệch số khoảng 10-50%
//     let delta = Math.floor(Math.random() * num * 0.5) + 1;
//     return Math.random() > 0.5 ? num + delta : Math.max(0, num - delta);
//   }

//   while (fakeAnswers.length < 3) {
//     if (!isNaN(correct)) {
//       // Nếu là số
//       let num = Number(correct);
//       for (let i = 1; i <= 3; i++) {
//         fakeAnswers.push(randomAround(num));
//       }
//     } else if (typeof correct === "string") {
//       // Nếu là chuỗi
//       let match = correct.match(/\d+/g);
//       if (match) {
//         match.forEach((numStr) => {
//           let num = parseInt(numStr);
//           let attempts = 0;
//           let newAnswer = correct.replace(numStr, randomAround(num));
//           while (fakeAnswers.includes(newAnswer) && attempts < 10) {
//             newAnswer = correct.replace(numStr, randomAround(num));
//             attempts++;
//           }
//           fakeAnswers.push(newAnswer);
//         });
//       }
//     }
//   }

//   return fakeAnswers.slice(0, 3);
// }

// // Hàm shuffle mảng
// function shuffle(array) {
//   return array.sort(() => Math.random() - 0.5);
// }

const Contest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Theo dõi thời gian làm bài
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timePerQuestion, setTimePerQuestion] = useState({});

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axiosInstance.get(`/get-contest/${id}`);
        let contestData = res.data;
        contestData.questions = contestData.questions.map((q) => {
          const options = q.answer_info.options;
          return { ...q, options};
        });

        setContest(contestData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchContest();
  }, [id]);

  // Cập nhật thời gian khi chuyển câu hỏi
  const handleChangeQuestion = (newIndex) => {
    const now = Date.now();
    const currentQ = contest.questions[currentQIndex];
    const timeSpent = Math.floor((now - questionStartTime) / 1000); // giây

    setTimePerQuestion((prev) => ({
      ...prev,
      [currentQ.id]: (prev[currentQ.id] || 0) + timeSpent,
    }));

    setCurrentQIndex(newIndex);
    setQuestionStartTime(Date.now());
  };

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
  const now = Date.now();
  const lastQ = contest.questions[currentQIndex];
  const timeSpent = Math.floor((now - questionStartTime) / 1000);

  const finalTimePerQuestion = {
    ...timePerQuestion,
    [lastQ.id]: (timePerQuestion[lastQ.id] || 0) + timeSpent,
  };

  setSubmitted(true);

  if (!contest) return;

  const resultData = {
    contestId: contest.id, // Chỉ lấy id để gửi thay vì spread toàn contest
    name: contest.name,
    userId: "12345", // Thay bằng ID người dùng
    questions: contest.questions.map((q) => {
      const { vector, ...qWithoutVector } = q; // Bỏ vector
      return {
        ...qWithoutVector,
        selected: answers[q.id] || null,
        result:
          answers[q.id] !== null
            ? answers[q.id] === q.correct_answer
              ? "correct"
              : "incorrect"
            : "unanswered",
        time: finalTimePerQuestion[q.id] || 0,
      };
    }),
  };

  try {
    await axiosInstance.post(`/contest-result/${id}`, resultData);
    console.log("Kết quả đã lưu thành công!");
  } catch (err) {
    console.error("Lỗi khi lưu kết quả:", err);
  }
};

  if (!contest) return <p>Đang tải đề thi...</p>;

  const currentQuestion = contest.questions[currentQIndex];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{contest.name}</h1>

      <div key={currentQuestion.id} className="p-4 border rounded-lg">
        <p className="font-semibold mb-2">
          Câu {currentQIndex + 1}: {currentQuestion.content}
        </p>

        <div className="space-y-2">
          
            <label className="block">
              <input
                text={currentQuestion.answer_info.options.A}
                type="radio"
                name={`q-${currentQuestion.id}`}
                value={currentQuestion.answer_info.options.A}
                checked={answers[currentQuestion.id] === "A"}
                onChange={() => handleSelect(currentQuestion.id, "A")}
                disabled={submitted}
              />
              <span className="ml-2">{currentQuestion.answer_info.options.A}</span>
            </label>
            <label className="block">
              <input
                text={currentQuestion.answer_info.options.B}
                type="radio"
                name={`q-${currentQuestion.id}`}
                value={currentQuestion.answer_info.options.B}
                checked={answers[currentQuestion.id] === "B"}
                onChange={() => handleSelect(currentQuestion.id, "B")}
                disabled={submitted}
              />
              <span className="ml-2">{currentQuestion.answer_info.options.B}</span>
            </label>
            <label className="block">
              <input
                text={currentQuestion.answer_info.options.C}
                type="radio"
                name={`q-${currentQuestion.id}`}
                value={currentQuestion.answer_info.options.C}
                checked={answers[currentQuestion.id] === "C"}
                onChange={() => handleSelect(currentQuestion.id, "C")}
                disabled={submitted}
              />
              <span className="ml-2">{currentQuestion.answer_info.options.C}</span>
            </label>
            <label className="block">
              <input
                text={currentQuestion.answer_info.options.D}
                type="radio"
                name={`q-${currentQuestion.id}`}
                value={currentQuestion.answer_info.options.D}
                checked={answers[currentQuestion.id] === "D"}
                onChange={() => handleSelect(currentQuestion.id, "D")}
                disabled={submitted}
              />
              <span className="ml-2">{currentQuestion.answer_info.options.D}</span>
            </label>

        </div>

        {submitted && (
          <p
            className={`mt-2 font-medium ${
              answers[currentQuestion.id] === currentQuestion.correct_answer
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {answers[currentQuestion.id] === currentQuestion.correct_answer
              ? "✅ Chính xác"
              : `❌ Sai, đáp án đúng: ${currentQuestion.correct_answer}`}
          </p>
        )}
      </div>

      {/* Nút điều hướng câu hỏi */}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentQIndex === 0}
          onClick={() => handleChangeQuestion(currentQIndex - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Câu trước
        </button>
        {currentQIndex < contest.questions.length - 1 ? (
          <button
            onClick={() => handleChangeQuestion(currentQIndex + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Câu tiếp
          </button>
        ) : !submitted ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Nộp bài
          </button>
        ) : (
          <p className="text-lg font-bold text-purple-600">Bạn đã nộp bài!</p>
        )}
      </div>
    </div>
  );
};

export default Contest;
