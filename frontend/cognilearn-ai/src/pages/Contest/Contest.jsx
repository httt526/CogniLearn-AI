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

  // Load đề thi
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axiosInstance.get(`/get-contest/${id}`);
        let contestData = res.data;
        // Giả lập dữ liệu bổ sung để khớp với UI mẫu
        // BẠN NÊN CẬP NHẬT API ĐỂ TRẢ VỀ CÁC TRƯỜNG NÀY
        contestData.questions = contestData.questions.map((q) => {
          const options = q.answer_info.options;
          return {
            ...q,
            options,
          };
        });
        setContest(contestData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContest();
  }, [id]);

  // Lấy tiến độ từ server khi vào lại trang
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

  // Lưu tiến độ lên server
  const saveProgressToServer = async (
    updatedAnswers,
    doneQuestions,
    updatedIndex,
    updatedTime
  ) => {
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
    if (!contest) return;
    const now = Date.now();
    const currentQ = contest.questions[currentQIndex];
    const timeSpent = Math.floor((now - questionStartTime) / 1000);

    const updatedTime = {
      ...timePerQuestion,
      [currentQ.id]: (timePerQuestion[currentQ.id] || 0) + timeSpent,
    };

    setTimePerQuestion(updatedTime);
    setCurrentQIndex(newIndex);
    setQuestionStartTime(Date.now());

    saveProgressToServer(answers, doneQuestions, newIndex, updatedTime);
  };

  const handleSelect = (questionId, optionKey) => {
    if (!contest || submitted) return;

    const updatedAnswers = {
      ...answers,
      [questionId]: optionKey,
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

  // Nộp bài
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
  let points = 0;
  contest.questions.forEach((q) => {
    if (answers[q.id] === q.correct_answer) {
      points += 1;
    }
  });
  const resultData = {
    contestId: contest.id,
    name: contest.name,
    point: (points / contest.questions.length) * 10,
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
    // Lưu kết quả
    await axiosInstance.post(`/contest-result/${id}`, resultData);
    console.log("Kết quả đã lưu thành công!");
    navigate("/dashboard"); // Quay về trang chủ
    // Xóa tiến trình thay vì reset
    await axiosInstance.delete(`/contest-progress/${id}`, {
      data: { userId },
    });
    console.log("Tiến trình đã được xóa!");
  } catch (err) {
    console.error("Lỗi khi lưu kết quả hoặc xóa tiến trình:", err);
  }
};

  if (!contest)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <p>Đang tải đề thi...</p>
      </div>
    );

  const currentQuestion = contest.questions[currentQIndex];
  const optionKeys = Object.keys(currentQuestion.answer_info.options);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 font-sans">
      <div className="w-full max-w-4xl bg-[#2d3748] rounded-2xl p-8 shadow-2xl relative">
        <span className="absolute top-6 right-8 text-gray-400 text-sm">
          {currentQIndex + 1} of {contest.questions.length}
        </span>

        <div className="flex justify-between items-start gap-8">
          {/* Phần nội dung bên trái */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-white mt-2">
              {currentQuestion.content}
            </h1>
            <p className="text-xl text-gray-300 mt-2">
              {currentQuestion.definition}
            </p>
          </div>

          {/* Phần ảnh bên phải */}
          {currentQuestion.image_url && (
            <div className="w-48 h-32 flex-shrink-0">
              <img
                src={currentQuestion.image_url}
                alt="Illustration"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="mt-10">
          <p className="text-gray-400 mb-4">Choose an answer</p>
          <div className="grid grid-cols-2 gap-4">
            {optionKeys.map((key) => {
                const isSelected = answers[currentQuestion.id] === key;
                return (
                    <button
                        key={key}
                        onClick={() => handleSelect(currentQuestion.id, key)}
                        disabled={submitted}
                        className={`w-full p-4 cursor-pointer rounded-lg text-white font-semibold transition-all duration-200
                        ${isSelected ? 'bg-[#0367B0] ring-2 ring-blue-400' : 'bg-[#4a5568] hover:bg-[#C6E7FF] hover:text-[#112D4E]'}
                        disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {currentQuestion.answer_info.options[key]}
                    </button>
                )
            })}
          </div>
        </div>

        <div className="text-center mt-6">
          <button className="text-gray-400 hover:text-white transition">
            Don't know?
          </button>
        </div>
      </div>

      {/* Nút điều hướng */}
      <div className="flex justify-between mt-6 w-full max-w-4xl">
        <button
          disabled={currentQIndex === 0}
          onClick={() => handleChangeQuestion(currentQIndex - 1)}
          className="px-6 py-2 bg-gray-600 text-white cursor-pointer rounded-lg disabled:opacity-50"
        >
          Câu trước
        </button>
        {currentQIndex < contest.questions.length - 1 ? (
          <button
            onClick={() => handleChangeQuestion(currentQIndex + 1)}
            className="px-6 py-2 bg-[#0367B0] cursor-pointer text-white rounded-lg"
          >
            Câu tiếp
          </button>
        ) : !submitted ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 cursor-pointer text-white rounded-lg"
          >
            Nộp bài
          </button>
        ) : (
          <div>
            <p className="text-lg font-bold text-purple-400">
              Bạn đã nộp bài!
            </p>
            {/* Nút quay về trang chủ có thể thêm vào đây nếu muốn */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contest;