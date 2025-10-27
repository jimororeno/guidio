import express from "express";
import cors from "cors";
import { usersRouter } from "./routes/userRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { categoryRouter} from "./routes/categoryRoutes.js";
import { poiRouter } from "./routes/poiRoutes.js";
import { entryRouter } from "./routes/entryRoutes.js";
import { voteRouter } from "./routes/voteRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import { contactRouter } from "./routes/contactRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/pois", poiRouter);
app.use("/api/entry", entryRouter);
app.use("/api/vote", voteRouter);
app.use("/api/contact", contactRouter);


// Servir las imágenes estáticamente
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log("Static path:", path.join(__dirname, "../uploads"));

app.get("/", (req, res) => res.send("API GUIDIO funcionando 🚀"));

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
