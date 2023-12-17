const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
const privateKey = "Rishabh";

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Courses = mongoose.model("Course", courseSchema);

const generateJwtToken = (user) => {
  return jwt.sign({ username: user?.username }, privateKey, {
    expiresIn: "1hr",
  });
};

const authenticationJwt = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("autoria", authorization);
  if (authorization) {
    const token = authorization?.split(" ")[1];
    jwt.verify(token, privateKey, (err, decode) => {
      if (err) {
        return res.status(403).json({ message: err });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "User Authentication Failed" });
  }
};

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
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

app.post("/admin/login", async (req, res) => {
  const { username, password } = req?.headers;

  const admin = await Admin?.findOne({ username });

  if (admin) {
    const token = generateJwtToken(admin);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Authentication Failed" });
  }
});

app.post("/admin/courses", authenticationJwt, async (req, res) => {
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

app.put("/admin/courses/:courseId", authenticationJwt, async (req, res) => {
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

app.get("/admin/courses", authenticationJwt, async (req, res) => {
  // logic to get all courses
  const course = await Courses.find({});
  res.json({ courses: course });
});

// User routes
app.post("/users/signup", async (req, res) => {
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

app.post("/users/login", async (req, res) => {
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

app.get("/users/courses", authenticationJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Courses.find({ published: true });
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticationJwt, async (req, res) => {
  // logic to purchase a course
  // const course_id = parseInt(req?.params?.courseId);
  // const findCourse = COURSES?.find((course) => course?.courseId == course_id);
  const course = await Courses.findById(req.params.courseId);
  if (!course) {
    res.status(403).json({ message: "Course not found" });
  } else {
    const user = await User.findOne({ username: req.user.username });
    console.log("username",req.user.username)
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
});

app.get("/users/purchasedCourses", authenticationJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses')
  const courses = user.purchasedCourses;
  res.json({ purchasedCourses: courses || [] });
});

mongoose.connect("mongodb://localhost:27017/magesDB/courses",{dbName:"courses"});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
