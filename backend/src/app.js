import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({
    statusCode: 200,
    status: "success",
    message: "Verix is Working",
  });
});

import geminiRoutes from "./routes/gemini.route.js";
app.use("/api/gemini", geminiRoutes);

import serpApiRoutes from "./routes/serpApi.route.js";
app.use("/api/search", serpApiRoutes);

import investigateRoutes from "./routes/investigation.route.js";
app.use("/api/investigations", investigateRoutes);

export { app };
