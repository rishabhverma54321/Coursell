"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const zod_1 = require("zod");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
const signupInput = zod_1.z.object({
    username: zod_1.z.string().min(6).max(20),
    password: zod_1.z.string().min(4).max(20),
});
const loginInput = zod_1.z.object({
    username: zod_1.z.string().min(6).max(20),
    password: zod_1.z.string().min(4).max(20),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedsignupInput = signupInput.safeParse(req.body);
    if (!(parsedsignupInput === null || parsedsignupInput === void 0 ? void 0 : parsedsignupInput.success)) {
        return res.status(411).json({
            msg: parsedsignupInput.error,
        });
    }
    const { username, password } = parsedsignupInput === null || parsedsignupInput === void 0 ? void 0 : parsedsignupInput.data;
    const existingUser = yield db_1.User.findOne({ username });
    if (existingUser) {
        res.json({ message: "User already exists" });
    }
    else {
        const user = new db_1.User(req.body);
        yield user.save();
        const token = (0, middleware_1.generateJwtToken)(user);
        res.json({ message: "User created successfully", token: token });
    }
    // logic to sign up user
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = loginInput.safeParse(req.headers);
    if (!(parsedInput === null || parsedInput === void 0 ? void 0 : parsedInput.success)) {
        res.status(411).json({
            msg: parsedInput.error,
        });
        return;
    }
    const { username, password } = parsedInput === null || parsedInput === void 0 ? void 0 : parsedInput.data;
    const user = yield db_1.User.findOne({ username });
    const isAuthenticate = (user === null || user === void 0 ? void 0 : user.password) === password;
    if (isAuthenticate) {
        const token = (0, middleware_1.generateJwtToken)(user);
        res.json({ message: "Logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "LoggIn failed" });
    }
    // logic to log in user
}));
router.get("/courses", middleware_1.authenticationJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to list all courses
    const courses = yield db_1.Courses.find({ published: true });
    res.json({ courses });
}));
router.post("/courses/:courseId", middleware_1.authenticationJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to purchase a course
    // const course_id = parseInt(req?.params?.courseId);
    // const findCourse = COURSES?.find((course) => course?.courseId == course_id);
    const course = yield db_1.Courses.findById(req.params.courseId);
    if (!course) {
        res.status(403).json({ message: "Course not found" });
    }
    else {
        const user = yield db_1.User.findOne({ username: req.user.username });
        if (user) {
            user.purchasedCourses.push(course);
            yield user.save();
            res.json({ message: "Course purchased successfully" });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
}));
router.get("/purchasedCourses", middleware_1.authenticationJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to view purchased courses
    const user = yield db_1.User.findOne({
        username: req.user.username,
    }).populate("purchasedCourses");
    const courses = user.purchasedCourses;
    res.json({ purchasedCourses: courses || [] });
}));
exports.default = router;
