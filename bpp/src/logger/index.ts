import buildDevLogger from './dev-logger';
import buildProdLogger from './prod-logger';

const logger = process.env.NODE_ENV === 'development' ? buildDevLogger() : buildProdLogger();

export default logger;