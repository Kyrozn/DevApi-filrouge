import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import AdminRoutes from "./routes/admin.routes";
import swaggerSpec from "./config/swagger"
import EventRoutes from "./routes/event.routes"
import sportsRoutes from "./routes/sports.routes"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route Swagger
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", AdminRoutes);
app.use("/event", EventRoutes);
app.use("/sports", sportsRoutes);

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

export default app;