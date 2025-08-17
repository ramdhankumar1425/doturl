import { Router } from "express";
import {
	ValidateMiddleware,
	AuthMiddleware,
	UserAgentMiddleware,
} from "../middlewares/index.js";
import { UrlsSchema } from "../validations/index.js";
import { UrlsController } from "../controllers/index.js";

const router = Router();

// short a url for anonymous users
router.post(
	"/anon",
	ValidateMiddleware.validateBody(UrlsSchema.shortUrlSchema.body),
	UrlsController.shortUrlAnon
);

// short a url for authenticated users
router.post(
	"/",
	AuthMiddleware.authenticateUser,
	ValidateMiddleware.validateBody(UrlsSchema.shortUrlSchema.body),
	UrlsController.shortUrl
);

// redirect to original url
router.get(
	"/:shortCode",
	ValidateMiddleware.validateParams(UrlsSchema.redirectSchema.params),
	UserAgentMiddleware.parseUserAgent,
	UrlsController.redirect
);

// get all urls for anonymous users
router.get("/anon", UrlsController.getAllUrlsAnon);

// get all urls for authenticated users
router.get("/", AuthMiddleware.authenticateUser, UrlsController.getAllUrls);

export default router;
