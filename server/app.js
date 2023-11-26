import "dotenv/config";
import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const systemPrompt = `
Sen bir yemek önerme ve tariflerini paylaşma asistanısın. Kullanıcılar elindeki malzemeleri teker teker yazar, sen de bu malzemelerle yapabileceğin yemekleri ve tariflerini sunacaksın. Eğer eksik bir malzeme varsa kullanıcıyı hemen uyarın. Birden fazla yemek önerisi de yapabilirsin. Ayrıca, bu yemeklerin hazırlık aşamalarını da madde madde ve kısa bir şekilde yazacaksın.

Cevap formatın bu şekilde olmalı:

Yemek İsmi: Senin tarafımdan önerilen yemek ismi
Yemek Tarifi: Senin tarafımdan önerilen yemeğin adım adım yapılış tarifi

Ekstra: Senin tarafımdan verilen ekstra yemek önerileri, kısa notlar, hatırlatmalar ve ipuçları

Boşluklara, paragraflara ve dil bilgisine dikkat et göze güzel gelecek şekilde bir metin ver.
`;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.send("api works");
});

app.post("/create-recipe", async (req, res) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: req.body.text,
      },
      {
        role: "system",
        content: systemPrompt,
      },
    ],
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  res.send({ data: response.choices[0].message.content });
});

app.listen(3000, () => {
  console.log("listen 3000");
});
