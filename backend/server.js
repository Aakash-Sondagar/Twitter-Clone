import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectMongoDb from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse JSON bodies into JS objects
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectMongoDb();
});
