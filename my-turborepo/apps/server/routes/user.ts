import express from "express";
import { User, Courses } from "../db";
import { generateJwtToken, authenticationJwt } from "../middleware";
import { signupInput, loginInput } from "@repo/types";

const router = express.Router();

// const signupInput = z.object({
//   username: z.string().min(6).max(20),
//   password: z.string().min(4).max(20),
// });

// const loginInput = z.object({
//   username: z.string().min(6).max(20),
//   password: z.string().min(4).max(20),
// });

// type signupInput = z.infer<typeof signupInput>
// type loginInput = z.infer<typeof loginInput>


router.post("/signup", async (req, res) => {
  const parsedsignupInput = signupInput.safeParse(req.body);
  if (!parsedsignupInput?.success) {
    return res.status(411).json({
      msg: parsedsignupInput.error,
    });
  }
  const { username, password } = parsedsignupInput?.data;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.json({ message: "User already exists" });
  } else {
    const user = new User(req.body);
    await user.save();
    const token = generateJwtToken(user);

    res.json({ message: "User created successfully", token: token });
  }
  // logic to sign up user
});

router.post("/login", async (req, res) => {
  const parsedInput = loginInput.safeParse(req.body);
  if (!parsedInput?.success) {
    res.status(411).json({
      msg: parsedInput.error,
    });
    return;
  }
  const { username, password } = parsedInput?.data;

  const user = await User.findOne({ username });
  const isAuthenticate = user?.password === password;
  if (isAuthenticate) {
    const token = generateJwtToken(user);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "LoggIn failed" });
  }
  // logic to log in user
});

router.get("/courses", authenticationJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Courses.find({ published: true });
  res.json({ courses });
});

router.post("/courses/:courseId", authenticationJwt, async (req: any, res) => {
  // logic to purchase a course
  // const course_id = parseInt(req?.params?.courseId);
  // const findCourse = COURSES?.find((course) => course?.courseId == course_id);
  const course: any = await Courses.findById(req.params.courseId);
  if (!course) {
    res.status(403).json({ message: "Course not found" });
  } else {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
});

router.get("/purchasedCourses", authenticationJwt, async (req: any, res) => {
  // logic to view purchased courses
  const user: any = await User.findOne({
    username: req.user.username,
  }).populate("purchasedCourses");
  const courses = user.purchasedCourses;
  res.json({ purchasedCourses: courses || [] });
});

export default router;
