const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ success: true, message: "OK" }));

app.use("/api/students", studentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/summary", summaryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
