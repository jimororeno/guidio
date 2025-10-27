import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import locationsRouter from "./routes/locations.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
// Rutas
app.use("/locations", locationsRouter);
app.get("/", (_, res) => res.send("API OK ✅"));
console.log({}); // solo para que compile
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
