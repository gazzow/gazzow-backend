import { createLogger, format, transports } from "winston";
import { env } from "../infrastructure/config/env.js";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const consoleTransport = new transports.Console();

const logger = createLogger({
  level: env.node_env ? "info" : "debug",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    consoleTransport,
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// Remove console logs only in production
if (process.env.NODE_ENV === "production") {
  logger.remove(consoleTransport);
}

export default logger;
