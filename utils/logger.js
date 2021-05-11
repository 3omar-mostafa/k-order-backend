const { createLogger, format, transports } = require('winston');
const path = require("path");
 
const { combine, timestamp, printf, json, metadata, label, prettyPrint   } = format;
 
// const myFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} - ${level}: ${message}`;
// });

const logger = createLogger({
  level: 'info',
  format: combine(
		timestamp(),
		label({label: path.basename(require.main.filename)}),
		metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  transports: [
    new transports.File({ filename: path.resolve(__dirname,'../logs/error.log'), level: 'error', format: combine(
			json(),
			prettyPrint()
		) }),
    new transports.File({ filename: path.resolve(__dirname,'../logs/all.log'), handleExceptions: true, handleRejections: true, format: combine(
			json(),
			prettyPrint()
		) }),
  ],
});

//
// If we're not in production then log to the `console`
//



if(process.env.NODE_ENV !== "production") {

  logger.add(new transports.Console({
		format: combine(
			json(),
			prettyPrint()
		)
	}));
}

module.exports = logger;