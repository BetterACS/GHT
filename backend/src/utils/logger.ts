/**
 * @fileoverview Logger class. Used to log messages to the console and a file.
 */
import winston from "winston";

export default class Logger {
  private static INSTANCE: Logger;
  private static LOGGER: winston.Logger;

  private constructor() {
    const logger = winston.createLogger({
      // Log only if level is less than (meaning more severe) or equal to this.
      level: "info",
      // Use timestamp and printf to create a standard log format.
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info: winston.Logform.TransformableInfo) =>
            `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
      transports: [
        // Log to the console.
        new winston.transports.Console(),
        // Add log to a file.
        new winston.transports.File({ filename: "logs/app.log" }),
      ],
    });
    Logger.LOGGER = logger;
    logger.info("[logger]:constructor - Logger initialized");
  }

  public static instance() {
    if (!Logger.INSTANCE) {
      Logger.INSTANCE = new Logger();
    }
    return Logger.INSTANCE;
  }

  public logger() {
    return Logger.LOGGER;
  }
}
