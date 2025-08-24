require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const supabase = require('./config/db');

const app = express();

// Middleware to handle CORS
app.use(cors({
  origin: "http://localhost:5173",   
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true                  
}));


// Middleware
app.use(express.json());

app.get("/questions", async (req, res) => {
  try {
    const { data, error } = await supabase.from("questions").select("*");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ questions: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Lấy câu hỏi theo id
app.get("/question/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ question: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/create-contest", async (req, res) => {
  try {
    const { name, questions } = req.body; // dữ liệu gửi từ frontend
    
    if (!name || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Insert contest vào Supabase
    const { data, error } = await supabase
      .from("contests")
      .insert([
        { 
          name: name, 
          questions: questions // cần kiểu ARRAY trong Supabase (Postgres) hoặc JSON
        }
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.json({ success: true, contest: data[0] });

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/get-contest/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Lấy contest
    const { data: contest, error: contestError } = await supabase
      .from("contests")
      .select("*")
      .eq("id", id)
      .single();

    if (contestError) throw contestError;

    let questions = [];
    if (contest.questions && contest.questions.length > 0) {
      // Query bảng questions theo list id
      const { data: qs, error: qErr } = await supabase
        .from("questions")
        .select("*")
        .in("id", contest.questions);

      if (qErr) throw qErr;
      questions = qs;
    }

    res.json({ ...contest, questions });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/contest-result/:id", async (req, res) => {
  try {
    const { id } = req.params; // ✅ đúng key
    const { name, questions, userId } = req.body;

    if (!name || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const { data, error } = await supabase
      .from("contest_results")
      .insert([{ 
        contestId: id,   // ✅ đúng tên cột
        name,
        questions,
        userId
      }]);

    if (error) throw error;

    res.status(201).json({ message: "Lưu kết quả thành công", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Có lỗi khi lưu kết quả" });
  }
});


// app.post("/add-questions", async (req, res) => {
//   try{
    
//   }catch(err) {
//     console.error("Error adding questions:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});