import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Inicializa a SDK GoogleGenAI no servidor com header User-Agent para telemetria
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint seguro para Smart Breakdown com Gemini 3.8 Flash
app.post("/api/breakdown", async (req, res) => {
  try {
    const { goal, category } = req.body;
    if (!goal || typeof goal !== "string" || goal.trim().length === 0) {
      return res.status(400).json({ error: "O objetivo é obrigatório." });
    }

    const trimmedGoal = goal.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `O usuário quer decompor o seguinte objetivo ou meta grande em 3 a 5 subtarefas práticas, acionáveis e diretas:
"${trimmedGoal}"

Gere entre 3 e 5 subtarefas objetivas para compor uma lista de afazeres.
Para cada tarefa:
- title: nome claro e direto da ação prática (em português)
- priority: deve ser exatamente um destes valores: "high", "medium", ou "low"
- category: categoria sugerida (ex: "Trabalho", "Pessoal", "Urgente", "Estudos", "Finanças", "Saúde" ou a informada: "${category || 'Trabalho'}")
- daysFromNow: prazo estimado em dias a partir de hoje (número inteiro entre 1 e 14)`,
      config: {
        systemInstruction:
          "Você é um especialista em produtividade e metodologia GTD/Agile. Seu papel é decompor objetivos grandes em 3 a 5 passos executáveis imediatos, claros e em português.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              description: "Lista de 3 a 5 subtarefas sugeridas",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Título acionável da subtarefa",
                  },
                  priority: {
                    type: Type.STRING,
                    description: "Nível de prioridade: 'high', 'medium' ou 'low'",
                  },
                  category: {
                    type: Type.STRING,
                    description: "Categoria da subtarefa",
                  },
                  daysFromNow: {
                    type: Type.INTEGER,
                    description: "Número de dias a partir de hoje para a data limite",
                  },
                },
                required: ["title", "priority", "category", "daysFromNow"],
              },
            },
          },
          required: ["tasks"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Resposta vazia da API do Gemini.");
    }

    const parsed = JSON.parse(text);
    return res.json({ tasks: parsed.tasks || [] });
  } catch (error: any) {
    console.error("Erro no processamento do Smart Breakdown:", error?.message || error);

    // Fallback inteligente caso a chave ou conexão esteja temporariamente indisponível
    const fallbackTasks = [
      {
        title: `Definir escopo e metas específicas para: ${req.body?.goal?.slice(0, 35) || 'Projeto'}`,
        priority: "high",
        category: req.body?.category || "Trabalho",
        daysFromNow: 1,
      },
      {
        title: "Levantar recursos, prazos e ferramentas necessárias",
        priority: "medium",
        category: req.body?.category || "Trabalho",
        daysFromNow: 3,
      },
      {
        title: "Executar o primeiro marco acionável",
        priority: "medium",
        category: req.body?.category || "Trabalho",
        daysFromNow: 5,
      },
      {
        title: "Revisar entregas, validar e organizar próximos passos",
        priority: "low",
        category: req.body?.category || "Trabalho",
        daysFromNow: 7,
      },
    ];

    return res.json({
      tasks: fallbackTasks,
      isFallback: true,
    });
  }
});

// Inicia servidor com middleware Vite no modo de desenvolvimento ou arquivos estáticos em produção
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: "0.0.0.0",
        port: PORT,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TaskFlow Server rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
