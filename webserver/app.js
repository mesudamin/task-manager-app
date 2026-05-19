const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const tasksroute = require("./routes/tasks.js");
app.use(tasksroute);
const port = 3000;
app.listen(port, () => {
  console.log("server is running  on port 3000");
});
