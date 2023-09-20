import pino from "pino";
import config from "config";
import dayjs from "dayjs";

export default pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    },
    level: config.get("logLevel"),
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
})