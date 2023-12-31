"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseInput = exports.loginInput = exports.signupInput = void 0;
const zod_1 = require("zod");
exports.signupInput = zod_1.z.object({
    username: zod_1.z.string().min(6).max(20),
    password: zod_1.z.string().min(4).max(20),
});
exports.loginInput = zod_1.z.object({
    username: zod_1.z.string().min(6).max(20),
    password: zod_1.z.string().min(4).max(20),
});
exports.courseInput = zod_1.z.object({
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().min(12),
    price: zod_1.z.number().min(1),
    imageLink: zod_1.z.string().min(4),
    published: zod_1.z.boolean(),
});
