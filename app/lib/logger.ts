import { createLogger, format, transports } from "winston"

const logger = createLogger({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	format: format.combine(
		format.timestamp(),
		format.json()
	),
	defaultMeta: { service: "payment-gateway" },
	transports: [new transports.Console()]
})

export default logger