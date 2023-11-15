import express from "express";

import users from "./routes/users";

const app = express();
app.use(express.json());
app.use("/users", users);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// import seed from "./routes/seed";
// import stub from "./routes/stub";

// app.use("/seed/users", seed);
// app.use("/stub/users", stub);
