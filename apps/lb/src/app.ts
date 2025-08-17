import express from "express";
import cors from "cors";
import corsConfig from "./config/cors.config.js";
import balancer from "./balancer/index.js";
import AdminRouter from "./admin/admin.routes.js";

const app = express();

// global cors middleware
app.use(cors(corsConfig));

// admin routes
app.use("/admin", AdminRouter);

// load balancer
app.use(balancer);

export default app;
