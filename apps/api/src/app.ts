import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsConfig from "./config/cors.config.js";
import * as Middlewares from "./middlewares/index.js";
import * as Routes from "./routes/index.js";

const app = express();

// global middlewares
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// admin metrics collector
app.use(Middlewares.MetricsMiddleware.collectMetrics);

// global user agent parser
app.use(Middlewares.UserAgentMiddleware.parseUserAgent);

// global logger
app.use(Middlewares.LogMiddleware.logger);

// routes
app.get("/", (req, res) => {
	res.send("OK!");
});

app.use("/api/v1/auth", Routes.AuthRouter);
app.use("/api/v1/urls", Routes.UrlsRouter);
app.use("/api/v1/users", Routes.UsersRouter);
app.use("/api/v1/dashboard", Routes.DashboardRouter);

// health route for lb
app.use("/health", Routes.HealthRouter);

// global error handler
app.use(Middlewares.ErrorMiddleware.handleApiError);

export default app;
