import winston from "winston";
import path from "path";

const loggerInstance = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join("logs", "app.log") })
  ]
});

export const logger = (req, res, next) => {
  loggerInstance.info({
    method: req.method,
    url: req.url,
    time: new Date().toISOString()
  });
  next();
};
