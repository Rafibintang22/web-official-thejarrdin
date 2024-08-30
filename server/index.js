const express = require("express");

const app = express();

// const { router } = require("./routes");
// app.use("/", router);

const port = 3000;
app.listen(port, () => {
  console.log(`>> Server is running on http://localhost:${port}`);
});
