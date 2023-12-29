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
const courseInput = zod_1.z.object({
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().min(12),
    price: zod_1.z.number().min(1),
    imageLink: zod_1.z.string().min(4),
    published: zod_1.z.boolean(),
});
// Admin routes
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to sign up admin
    const parsedsignupInput = signupInput.safeParse(req.body);
    if (!(parsedsignupInput === null || parsedsignupInput === void 0 ? void 0 : parsedsignupInput.success)) {
        return res.status(411).json({
            msg: parsedsignupInput.error,
        });
    }
    const { username, password } = parsedsignupInput === null || parsedsignupInput === void 0 ? void 0 : parsedsignupInput.data;
    const existingAdmin = yield (db_1.Admin === null || db_1.Admin === void 0 ? void 0 : db_1.Admin.findOne({ username }));
    if (existingAdmin) {
        res.status(403).json({ message: "Admin already exists" });
    }
    else {
        const newAdmin = new db_1.Admin({ username, password });
        yield newAdmin.save();
        const token = (0, middleware_1.generateJwtToken)(parsedsignupInput === null || parsedsignupInput === void 0 ? void 0 : parsedsignupInput.data);
        res.json({ message: "Admin created successfully", token });
    }
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
    const admin = yield (db_1.Admin === null || db_1.Admin === void 0 ? void 0 : db_1.Admin.findOne({ username }).maxTimeMS(30000));
    const isAuthenticate = (admin === null || admin === void 0 ? void 0 : admin.password) === password;
    if (isAuthenticate) {
        const token = (0, middleware_1.generateJwtToken)(admin);
        res.json({ message: "Logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "Authentication Failed" });
    }
}));
router.post("/courses", middleware_1.authenticationJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to create a course
    const parsedInput = courseInput.safeParse(req.body);
    if (!(parsedInput === null || parsedInput === void 0 ? void 0 : parsedInput.success)) {
        res.status(411).json({
            msg: parsedInput.error,
        });
        return;
    }
    const course = new db_1.Courses(parsedInput === null || parsedInput === void 0 ? void 0 : parsedInput.data);
    yield course.save();
    res.json({ message: "Course created successfully", courseId: course.id });
}));
router.put("/courses/:courseId", middleware_1.authenticationJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = courseInput.safeParse(req.body);
    if (!(parsedInput === null || parsedInput === void 0 ? void 0 : parsedInput.success)) {
        res.status(411).json({
            msg: parsedInput.error,
        });
        return;
    }
    // logic to edit a course
    const course = yield db_1.Courses.findByIdAndUpdate(req.params.id, parsedInput === null || parsedInput === void 0 ? void 0 : parsedInput.data, {
        new: true,
    });
    if (course) {
        res.json({ message: "Course updated successfully" });
    }
    else {
        res.status(403).json({ message: "Course ID not found" });
    }
}));
router.get("/courses", middleware_1.authenticationJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to get all courses
    const course = yield db_1.Courses.find({});
    res.json({ courses: course });
}));
exports.default = router;
