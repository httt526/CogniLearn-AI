import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInsantce";

const Contest = ({ userInfo }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timePerQuestion, setTimePerQuestion] = useState({});
  const [doneQuestions, setDoneQuestions] = useState(new Set());

  const userId = userInfo?.id; 

  // 🔹 Load đề thi
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axiosInstance.get(`/get-contest/${id}`);
        let contestData = res.data;
        contestData.questions = contestData.questions.map((q) => {
          const options = q.answer_info.options;
          return { ...q, options };
        });
        setContest(contestData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContest();
  }, [id]);

  // 🔹 Lấy tiến độ từ server khi vào lại trang
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axiosInstance.get(
          `/contest-progress/${id}?userId=${userId}`
        );
        if (res.data) {
          setAnswers(res.data.answers || {});
          setCurrentQIndex(res.data.currentQIndex || 0);
          setTimePerQuestion(res.data.timePerQuestion || {});
          setDoneQuestions(new Set(res.data.doneQuestions || [])); 
        }
      } catch (err) {
        console.error("Lỗi khi tải tiến độ:", err);
      }
    };
    if (userId) fetchProgress();
  }, [id, userId]);

  // 🔹 Lưu tiến độ lên server
  const saveProgressToServer = async (updatedAnswers, doneQuestions, updatedIndex, updatedTime) => {
    if (!userId || !contest) return;
    try {
      await axiosInstance.post(`/contest-progress/${id}`, {
        userId,
        answers: updatedAnswers,
        currentQIndex: updatedIndex,
        timePerQuestion: updatedTime,
        totalQuestions: contest.questions.length || 0,
        doneQuestions: Array.from(doneQuestions),
      });
    } catch (err) {
      console.error("Lỗi lưu tiến độ:", err);
    }
  };

  
  const handleChangeQuestion = (newIndex) => {
    if(!contest) return;
    const now = Date.now();
    const currentQ = contest.questions[currentQIndex];
    const timeSpent = Math.floor((now - questionStartTime) / 1000);

    const updatedTime = {
      ...timePerQuestion,
      [currentQ.id]: (timePerQuestion[currentQ.id] || 0) + timeSpent,
    };

    console.log(doneQuestions);

    setTimePerQuestion(updatedTime);
    setCurrentQIndex(newIndex);
    setQuestionStartTime(Date.now());

    saveProgressToServer(answers, doneQuestions, newIndex, updatedTime);
  };

  
  const handleSelect = (questionId, option) => {
  if (!contest) return;
  console.log("Selected:", questionId, option);

  const updatedAnswers = {
    ...answers,
    [questionId]: option,
  };
  const updatedDoneQuestions = new Set(doneQuestions);
  updatedDoneQuestions.add(questionId);

  console.log("Done Questions:", updatedDoneQuestions);

  setAnswers(updatedAnswers);
  setDoneQuestions(updatedDoneQuestions);

  saveProgressToServer(
    updatedAnswers,
    updatedDoneQuestions,
    currentQIndex,
    timePerQuestion
  );
};

  // 🔹 Nộp bài
  const handleSubmit = async () => {
    const now = Date.now();
    const lastQ = contest.questions[currentQIndex];
    const timeSpent = Math.floor((now - questionStartTime) / 1000);

    const finalTimePerQuestion = {
      ...timePerQuestion,
      [lastQ.id]: (timePerQuestion[lastQ.id] || 0) + timeSpent,
    };

    setSubmitted(true);

    if (!contest || !userId) return;

    const resultData = {
      contestId: contest.id,
      name: contest.name,
      userId,
      questions: contest.questions.map((q) => {
        const { vector, ...qWithoutVector } = q;
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

      // 🔹 Reset tiến độ khi đã nộp bài
      await axiosInstance.post(`/contest-progress/${id}`, {
        userId,
        answers: {},
        currentQIndex: 0,
        timePerQuestion: {},
        doneQuestions: [],
      });
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
          {["A", "B", "C", "D"].map((option) => (
            <label key={option} className="block">
              <input
                type="radio"
                name={`q-${currentQuestion.id}`}
                value={currentQuestion.answer_info.options[option]}
                checked={answers[currentQuestion.id] === option}
                onChange={() => handleSelect(currentQuestion.id, option)}
                disabled={submitted}
              />
              <span className="ml-2">
                {currentQuestion.answer_info.options[option]}
              </span>
            </label>
          ))}
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
