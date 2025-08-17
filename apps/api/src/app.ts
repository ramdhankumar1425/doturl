import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsConfig from "./config/cors.config.js";
import {
	UserAgentMiddleware,
	LogMiddleware,
	ErrorMiddleware,
} from "./middlewares/index.js";
import * as Routes from "./routes/index.js";

const app = express();

// global middlewares
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// global user agent parser
app.use(UserAgentMiddleware.parseUserAgent);

// global logger
app.use(LogMiddleware.logger);

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
app.use(ErrorMiddleware.handleApiError);

export default app;
