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

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }, // user_metadata
      },
    });
    
    await supabase.from('profiles').insert([{id: data.user.id, name, role}]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({
      message: "User registered successfully",
      user: data.user, // user.user_metadata sẽ chứa name, role
      session: data.session,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Login successful",
      user: data.user,
      session: data.session, // session chứa access_token, refresh_token
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/get-profile", async (req, res) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }
    const token = authHeader.split(" ")[1];

    // Xác thực user bằng token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Trả về user metadata luôn (name, role)
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ error: "Missing access token" });
    }

    // Gọi Supabase để xoá session
    const { error } = await supabase.auth.admin.signOut(access_token);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});