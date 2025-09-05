require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const supabase = require('./config/db');
const axios = require("axios");
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
      .maybeSingle(); 
    if (contestError) throw contestError;
    if (!contest) {
      return res.status(404).json({ error: "Contest không tồn tại" });
    }

    let questions = [];
    if (Array.isArray(contest.questions) && contest.questions.length > 0) {
      const { data: qs, error: qErr } = await supabase
        .from("questions")
        .select("*")
        .in("id", contest.questions);

      if (qErr) throw qErr;
      questions = qs || [];
    }

    res.json({ ...contest, questions });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/get-contests", async (req, res) => {
  const{limit} = req.query;
  try {
    const { data: contests, error } = await supabase
      .from("contests")
      .select("id, name, created_at")
      .order("created_at", { ascending: false }) 
      .limit(limit || 20); 

    if (error) throw error;

    res.json(contests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/get-contest-results", async (req, res) => {
  const { limit, userId } = req.query; // lấy user_id từ query

  if (!userId) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  try {
    const query = supabase
      .from("contest_results")
      .select(`
        id,
        contestId,
        point,
        analysis_report,
        created_at,
        name 
      `)
      .eq("userId", userId)
      .order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    const results = data.map((item) => ({
      id: item.id,
      contest_id: item.contestId,
      name: item.name || "Unknown Contest",
      point: item.point,
      analysis_report: item.analysis_report,
      created_at: item.created_at,
    }));

    res.json(results);
  } catch (err) {
    console.error("Error fetching contest results:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/get-progress/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Lấy tối đa 3 bản ghi progress gần nhất
    const { data: progresses, error: progressError } = await supabase
      .from("contest_progress")
      .select("*")
      .eq("userId", userId)
      .order("updated_at", { ascending: false })
      .limit(3);

    if (progressError) throw progressError;

    if (!progresses || progresses.length === 0) {
      return res.status(200).json({ message: "No progress found", data: [] });
    }

    // Lấy danh sách contestId
    const contestIds = progresses.map((p) => p.contestId);

    // Lấy thông tin contests tương ứng
    const { data: contests, error: contestError } = await supabase
      .from("contests")
      .select("id, name")
      .in("id", contestIds);

    if (contestError) throw contestError;

    // Map dữ liệu progress với contest
    const data = progresses.map((p) => {
      const contest = contests.find((c) => c.id === p.contestId);
      return {
        contestId: contest?.id,
        contestName: contest?.name,
        progress: p,
      };
    });

    return res.json({
      message: "Progresses found",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/contest-progress/:id", async (req, res) => {
  const { id } = req.params; // contestId
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const { error } = await supabase
      .from("contest_progress")
      .delete()
      .eq("contestId", id)
      .eq("userId", userId);

    if (error) throw error;

    res.json({ message: "Progress deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/contest-result/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, questions, userId, point } = req.body;

    if (!name || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // 1️⃣ Lưu contest result
    const { data, error } = await supabase
      .from("contest_results")
      .insert([{ 
        contestId: id,   
        name,
        questions,
        userId,
        point
      }])
      .select("id")   
      .single();

    if (error) throw error;
    const contestResultId = data.id;
    
    try {
      await axios.post("https://cognilearn-analyzer-api.onrender.com/analyze", {
        contest_result_id: contestResultId
      });
    } catch (analyzeErr) {
      console.error("Analyzer error:", analyzeErr.message);
 
    }

    res.status(201).json({ 
      message: "Lưu kết quả thành công, đang phân tích...", 
      data 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Có lỗi khi lưu kết quả" });
  }
});
app.get("/contest-progress/:contestId", async (req, res) => {
  const { contestId } = req.params;
  const { userId } = req.query;

  try {
    const { data, error } = await supabase
      .from("contest_progress")
      .select("*")
      .eq("contestId", contestId)
      .eq("userId", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116: No rows found
    res.json(data || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Lưu hoặc cập nhật tiến độ
app.post("/contest-progress/:contestId", async (req, res) => {
  const { contestId } = req.params;
  const { userId, answers, currentQIndex, timePerQuestion, totalQuestions, doneQuestions } = req.body;

  try {
    const { data, error } = await supabase
      .from("contest_progress")
      .upsert({
        contestId,
        userId,
        answers,
        currentQIndex,
        timePerQuestion,
        totalQuestions,
        doneQuestions: req.body.doneQuestions,
        updated_at: new Date(),
      }, { onConflict: ["contestId", "userId"] })
       .select("*")
       .single();

    if (error) throw error;
    res.json({ message: "Progress saved", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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
    
    await supabase.from('profiles').insert([{id: data.user.id, name, role, level: 0, classes: null, experiences: [ 
      {"name": "Tư duy logic", "point": 0}, 
      {"name" : "Sự cẩn thận", "point": 0}, 
      {"name" : "Sự kiên trì", "point": 0}, 
      {"name" : "Tốc độ học hỏi", "point": 0}
    ]}]);

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

    console.log("Authenticated user:", user);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*") 
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json({
      user: profile
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
      console.warn("⚠️ Supabase logout error:", error.message);
      // Nếu token không hợp lệ hoặc đã hết hạn, coi như logout thành công
      if (
        error.message.includes("Invalid") ||
        error.message.includes("expired") ||
        error.message.includes("not found")
      ) {
        return res.json({ message: "Already logged out (token invalid/expired)" });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/topic-stats", async (req, res) => {
  try {
    const { data, error } = await supabase.rpc("get_topic_accuracy");
    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch topic stats" });
  }
});

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
