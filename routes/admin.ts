import express from "express";
import { Admin, Courses, User } from "../db";
import { z } from "zod";
import { authenticationJwt, generateJwtToken } from "../middleware";

const router = express.Router();

// Admin routes
router.post("/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  if(typeof  username !== "string"){
    res.status(411).json({
      msg: "You sent wrong input, username should be string"
    })
    return;
  }
  const existingAdmin = await Admin?.findOne({ username });
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = generateJwtToken(req.body);
    res.json({ message: "Admin created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req?.headers;
  console.log("username",username)
  const admin = await Admin?.findOne({ username }).maxTimeMS(30000);;

  if (admin) {
    const token = generateJwtToken(admin);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Authentication Failed" });
  }
});

router.post("/courses", authenticationJwt, async (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;
  if (title && description && price && imageLink && published) {
    const course = new Courses(req.body);
    await course.save();
    res.json({ message: "Course created successfully", courseId: course.id });
  } else {
    res.status(411).json({ message: "Please provide all values" });
  }
});

router.put("/courses/:courseId", authenticationJwt, async (req:any, res:any) => {
  // logic to edit a course
  const course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(403).json({ message: "Course ID not found" });
  }
});

router.get("/courses", authenticationJwt, async (req, res) => {
  // logic to get all courses
  const course = await Courses.find({});
  res.json({ courses: course });
});

export default router;
