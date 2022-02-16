const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/user");
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "hello!" });
});

app.use("/api/v1/users", userRouter);

app.listen(port, () => console.log(`Mock server listening on port ${port}`));
