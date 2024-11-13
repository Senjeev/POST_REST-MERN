import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { login, register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import { verify } from "./middleware/auth.js";
import postRoutes from "./routes/posts.js";
import {createPost} from "./controllers/posts.js"
// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Storage for files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });
//Routes with files

app.post("/auth/register",upload.single("picture"),register);
// app.post("/auth/login", login);
app.post("/posts",upload.single("picture"),verify,createPost);
//Routes

app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);

app.use("/assets", (req, res) => {

});

// MongoDB Connection
const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server Port: ${PORT}`);
    });
}).catch((error) => console.log(`${error} did not connect`));
