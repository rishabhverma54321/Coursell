"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const admin_1 = __importDefault(require("./routes/admin"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
const DB_CONNECT = process.env.DATABASE_URL || "";
console.log("dbconnect", DB_CONNECT);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/users", user_1.default);
app.use("/admin", admin_1.default);
mongoose_1.default.connect(DB_CONNECT, { dbName: "courses" });
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
