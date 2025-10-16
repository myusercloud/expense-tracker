import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import expensesRoutes from "./routes/expensesRoutes.js";

dotenv.config();//load environment variables from a .env file into process.env
const app = express(); //function that handles http requests
app.use(cors());//allows your frontend to make API calls to your backend even if they are on different domains or ports
//without it, the browser would block these requests for security reasons
app.use(express.json());//parses incoming JSON request bodies and makes the data available under req.body
// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/expenses", expensesRoutes);

export default app;
