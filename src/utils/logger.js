import winston from "winston";

// Determine log level (info in production, debug/verbose in development)
const level = process.env.NODE_ENV === "production" ? "info" : "debug";

// Format for console (development - colorized and human-readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }), // Captures stack traces
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] [${level}]: ${stack || message}`;
  })
);

// Format for files (production - JSON format for log analyzers)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: level,
  defaultMeta: { service: "ecommerce-api" },
  transports: [
    // Standard winston file transport for errors (with built-in size rotation)
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error", // Only error events
      maxsize: 5242880, // 5MB limit per file
      maxFiles: 5, // Keep up to 5 archived log files
      tailable: true, // filename always points to the newest logs
      format: fileFormat,
    }),
    // Standard winston file transport for all logs (combined)
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 10485760, // 10MB limit per file
      maxFiles: 5, // Keep up to 5 archived log files
      tailable: true,
      format: fileFormat,
    }),
  ],
});

// Print to console only if we are NOT in production
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

export default logger;
