const axios = require("axios");

const LANGFLOW_URL = "http://localhost:7860"; // hoặc link server Langflow
const FLOW_ID = "12345"; // flow_id lấy trong Langflow
const API_KEY = process.env.LANGFLOW_API_KEY; // nếu bạn có set auth key

async function askLangflow(prompt) {
  try {
    const response = await axios.post(
      `${LANGFLOW_URL}/api/v1/run/${FLOW_ID}`,
      {
        input: prompt,          // input của bạn gửi cho AI
        stream: false           // nếu muốn stream thì true
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY && { Authorization: `Bearer ${API_KEY}` })
        }
      }
    );

    return response.data; // AI trả về
  } catch (error) {
    console.error("Error calling Langflow:", error.message);
    throw error;
  }
}

module.exports = { askLangflow };
