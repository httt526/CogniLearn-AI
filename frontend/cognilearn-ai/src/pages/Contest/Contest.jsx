import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInsantce";

// Hàm tạo đáp án sai gần đúng
function generateFakeAnswers(correct) {
  let fakeAnswers = [];

  function randomAround(num) {
    // Lệch số khoảng 10-50%
    let delta = Math.floor(Math.random() * num * 0.5) + 1;
    return Math.random() > 0.5 ? num + delta : Math.max(0, num - delta);
  }

  while (fakeAnswers.length < 3) {
    // Nếu là số → tạo sai số xung quanh
    if (!isNaN(correct)) {
      let num = Number(correct);
      for (let i = 1; i <= 3; i++) {
        fakeAnswers.push(randomAround(num));
      }
    } else if (typeof correct === "string") {
      // Nếu là chuỗi, ví dụ "Chiều dài 9 m, chiều rộng 4 m"
      // Thay đổi số trong chuỗi để tạo đáp án sai
      let match = correct.match(/\d+/g);
      if (match) {
        match.forEach((numStr) => {
          let num = parseInt(numStr);
          let attempts = 0;
          let newAnswer = correct.replace(numStr, randomAround(num));
          while (fakeAnswers.includes(newAnswer) && attempts < 10) {
            newAnswer = correct.replace(numStr, randomAround(num));
            attempts++;
          }
          fakeAnswers.push(newAnswer);
        });
      }
    }
  }

  return fakeAnswers.slice(0, 3);
}

// Hàm shuffle mảng
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

const Contest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [answers, setAnswers] = useState({}); // lưu đáp án HS chọn
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axiosInstance.get(`/get-contest/${id}`);
        let contestData = res.data;

        // Chuẩn bị options cho mỗi câu hỏi
        contestData.questions = contestData.questions.map((q) => {
          const correctAnswer = q.answer;
          const fakeAnswers = generateFakeAnswers(correctAnswer);
          const options = shuffle([correctAnswer, ...fakeAnswers]);
          return { ...q, options };
        });

        setContest(contestData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchContest();
  }, [id]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!contest) return;

    // Chuẩn bị dữ liệu kết quả để gửi về backend
    const resultData = {
      ...contest,
      userId: "12345", // Thay bằng ID người dùng hiện tại
      questions: contest.questions.map((q) => ({
        ...q,
        answers: answers[q.id] === q.answer ? "correct" : "incorrect",
      })),
    };

    try {
      await axiosInstance.post(`/contest-result/${id}`, resultData);
      console.log("Kết quả đã lưu thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu kết quả:", err);
    }
  };

  if (!contest) return <p>Đang tải đề thi...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{contest.name}</h1>

      {contest.questions.map((q, index) => (
        <div key={q.id} className="my-4 p-4 border rounded-lg">
          <p className="font-semibold">
            Câu {index + 1}: {q.content}
          </p>

          <div className="mt-2 space-y-2">
            {q.options.map((opt, i) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleSelect(q.id, opt)}
                  disabled={submitted}
                />
                <span className="ml-2">{opt}</span>
              </label>
            ))}
          </div>

          {submitted && (
            <p
              className={`mt-2 font-medium ${
                answers[q.id] === q.answer
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {answers[q.id] === q.answer
                ? "✅ Chính xác"
                : `❌ Sai, đáp án đúng: ${q.answer}`}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Nộp bài
        </button>
      ) : (
        <p className="mt-4 text-lg font-bold text-purple-600">
          Bạn đã nộp bài!
        </p>
      )}
    </div>
  );
};

export default Contest;
