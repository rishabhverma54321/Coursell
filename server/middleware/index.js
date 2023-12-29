"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = exports.authenticationJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const privateKey = process.env.SECRET_KEY || "";
const authenticationJwt = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
        jsonwebtoken_1.default.verify(token, privateKey, (err, decode) => {
            if (err) {
                return res.status(403).json({ message: err });
            }
            else {
                req.user = decode;
                next();
            }
        });
    }
    else {
        res.status(401).json({ message: "User Authentication Failed" });
    }
};
exports.authenticationJwt = authenticationJwt;
const generateJwtToken = (user) => {
    return jsonwebtoken_1.default.sign({ username: user === null || user === void 0 ? void 0 : user.username }, privateKey, {
        expiresIn: "1hr",
    });
};
exports.generateJwtToken = generateJwtToken;
