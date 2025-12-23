import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("Hello route handler called");
  res.status(200).send("Hello World!");
});

export default router;
