import express from "express";
import { Admin, Courses, User } from "../db";
import { z } from "zod";
import { authenticationJwt, generateJwtToken } from "../middleware";

const router = express.Router();

const signupInput = z.object({
  username: z.string().min(6).max(20),
  password: z.string().min(4).max(20),
});

const loginInput = z.object({
  username: z.string().min(6).max(20),
  password: z.string().min(4).max(20),
});

const courseInput = z.object({
  title: z.string().min(2),
  description: z.string().min(12),
  price: z.number().min(1),
  imageLink: z.string().min(4),
  published: z.boolean(),
});

// Admin routes
router.post("/signup", async (req, res) => {
  // logic to sign up admin
  const parsedsignupInput = signupInput.safeParse(req.body);
  if (!parsedsignupInput?.success) {
    return res.status(411).json({
      msg: parsedsignupInput.error,
    });
  }
  const { username, password } = parsedsignupInput?.data;
  const existingAdmin = await Admin?.findOne({ username });
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = generateJwtToken(parsedsignupInput?.data);
    res.json({ message: "Admin created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const parsedInput = loginInput.safeParse(req.headers);
  if (!parsedInput?.success) {
    res.status(411).json({
      msg: parsedInput.error,
    });
    return;
  }
  const { username, password } = parsedInput?.data;

  const admin = await Admin?.findOne({ username }).maxTimeMS(30000);
  const isAuthenticate = admin?.password === password;
  if (isAuthenticate) {
    const token = generateJwtToken(admin);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Authentication Failed" });
  }
});

router.post("/courses", authenticationJwt, async (req, res) => {
  // logic to create a course
  const parsedInput = courseInput.safeParse(req.body);
  if (!parsedInput?.success) {
    res.status(411).json({
      msg: parsedInput.error,
    });
    return;
  }
  const course = new Courses(parsedInput?.data);
  await course.save();
  res.json({ message: "Course created successfully", courseId: course.id });
});

router.put(
  "/courses/:courseId",
  authenticationJwt,
  async (req: any, res: any) => {
    const parsedInput = courseInput.safeParse(req.body);
    if (!parsedInput?.success) {
      res.status(411).json({
        msg: parsedInput.error,
      });
      return;
    }
    // logic to edit a course
    const course = await Courses.findByIdAndUpdate(req.params.id, parsedInput?.data, {
      new: true,
    });
    if (course) {
      res.json({ message: "Course updated successfully" });
    } else {
      res.status(403).json({ message: "Course ID not found" });
    }
  }
);

router.get("/courses", authenticationJwt, async (req, res) => {
  // logic to get all courses
  const course = await Courses.find({});
  res.json({ courses: course });
});

export default router;
