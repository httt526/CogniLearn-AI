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

    setAnswers(updatedAnswers);
    setDoneQuestions(updatedDoneQuestions);

    saveProgressToServer(
      updatedAnswers,
      updatedDoneQuestions,
      currentQIndex,
      timePerQuestion
    );
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
      await axiosInstance.post(`/contest-result/${id}`, resultData);
      console.log("Kết quả đã lưu thành công!");
      // ❌ Không navigate ngay, để học sinh xem lại kết quả
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
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-white mt-2">
              {currentQuestion.content}
            </h1>
            <p className="text-xl text-gray-300 mt-2">
              {currentQuestion.definition}
            </p>
          </div>

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
              const isCorrect = currentQuestion.correct_answer === key;

              let optionClass = "bg-[#4a5568] text-white";
              if (submitted) {
                if (isSelected && isCorrect) {
                  optionClass = "bg-green-600 text-white"; // chọn đúng
                } else if (isSelected && !isCorrect) {
                  optionClass = "bg-red-600 text-white"; // chọn sai
                } else if (!isSelected && isCorrect) {
                  optionClass = "bg-green-500 text-white"; // đáp án đúng (học sinh bỏ qua)
                } else {
                  optionClass = "bg-[#4a5568] text-gray-300"; // còn lại
                }
              } else {
                if (isSelected) {
                  optionClass = "bg-[#0367B0] text-white ring-2 ring-blue-400";
                }
              }

              return (
                <button
                  key={key}
                  onClick={() => handleSelect(currentQuestion.id, key)}
                  disabled={submitted}
                  className={`w-full p-4 rounded-lg font-semibold cursor-pointer transition-all duration-200 ${optionClass}`}
                >
                  {currentQuestion.answer_info.options[key]}
                </button>
              );
            })}
          </div>
        </div>

        {submitted && (
          <div className="mt-6 text-center">
            <p className="text-lg font-bold text-white">
              Đáp án đúng:{" "}
              {currentQuestion.answer_info.options[
                currentQuestion.correct_answer
              ]}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6 w-full max-w-4xl">
        <button
          disabled={currentQIndex === 0}
          onClick={() => handleChangeQuestion(currentQIndex - 1)}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          Câu trước
        </button>
        {currentQIndex < contest.questions.length - 1 ? (
          <button
            onClick={() => handleChangeQuestion(currentQIndex + 1)}
            className="px-6 py-2 bg-[#0367B0] text-white rounded-lg cursor-pointer"
          >
            Câu tiếp
          </button>
        ) : !submitted ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg cursor-pointer"
          >
            Nộp bài
          </button>
        ) : (
          <div>
            <p className="text-lg font-bold text-white">
              Bạn đã nộp bài! Xem lại đáp án ở trên.
            </p>
          </div>
        )}
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-2 px-6 py-2 bg-[#112D4E] text-white rounded-lg cursor-pointer"
      >
        Về Dashboard
      </button>
    </div>
  );
};

export default Contest;
