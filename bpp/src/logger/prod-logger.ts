import { format, createLogger, transports } from 'winston';

const { timestamp, combine, errors, json } = format;

function buildProdLogger() {
    return createLogger({
        format: combine(timestamp(), errors({ stack: true }), json()),
        defaultMeta: { service: 'user-service' },
        transports: [new transports.Console()],
    });
}

export default buildProdLogger;