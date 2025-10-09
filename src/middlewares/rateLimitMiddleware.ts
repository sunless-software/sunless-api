import rateLimit from "express-rate-limit";
import { DEFAULT_ERROR_API_RESPONSE } from "../constants/messages";
import { HTTP_STATUS_CODE_TOO_MANY_REQUEST } from "../constants/httpStatusCodes";

const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || "60"),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ...DEFAULT_ERROR_API_RESPONSE,
    status: HTTP_STATUS_CODE_TOO_MANY_REQUEST,
    message: "Too many requests from your IP",
  },
});

export default rateLimitMiddleware;
