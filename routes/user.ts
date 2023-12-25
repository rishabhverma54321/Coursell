import express from "express";
import { User, Courses } from "../db";
import { generateJwtToken,authenticationJwt } from "../middleware";

const router = express.Router()

router.post("/signup", async (req, res) => {
    const {username, password} = req.body
    const existingUser = await User.findOne({ username });
    console.log("existinguser", username)
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
    console.log("userLogin")
    const { username } = req.body;
    
    const user = await User.findOne({ username });
    if (user) {
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
  
  router.post("/courses/:courseId", authenticationJwt, async (req:any, res) => {
    // logic to purchase a course
    // const course_id = parseInt(req?.params?.courseId);
    // const findCourse = COURSES?.find((course) => course?.courseId == course_id);
    const course:any = await Courses.findById(req.params.courseId);
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
  
  router.get("/purchasedCourses", authenticationJwt, async (req:any, res) => {
    // logic to view purchased courses
    const user:any = await User.findOne({ username: req.user.username }).populate('purchasedCourses')
    const courses = user.purchasedCourses;
    res.json({ purchasedCourses: courses || [] });
  });

  export default router;