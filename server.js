import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const deepseek = new OpenAI({
  apiKey: "sk-1485529104a44a1faa8121a878297e27",
  baseURL: "https://api.deepseek.com"
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ]
    });

    // Aman: cek semua kemungkinan properti
    let reply = "AI tidak merespon";

    if (completion?.reply) {
      reply = completion.reply;
    } else if (completion?.choices?.[0]?.message?.content) {
      reply = completion.choices[0].message.content;
    } else if (completion?.choices?.[0]?.text) {
      reply = completion.choices[0].text;
    }

    res.json({ reply });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Gagal memanggil DeepSeek AI" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Chatbot DeepSeek running on http://localhost:${PORT}`));
