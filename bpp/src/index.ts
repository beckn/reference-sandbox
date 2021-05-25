import express from "express";
import cors from "cors";
import config from "./config/config";
import logger from "./logger"

const app = express();

const PORT = config.get('port');

app.use(express.json());
app.use(cors());

app.use('/search', require("./routes/v1/search"));
app.use('/select', require("./routes/v1/select"));
app.use('/init', require("./routes/v1/init"));
app.use('/confirm', require("./routes/v1/confirm"));
app.use('/status', require("./routes/v1/status"));
app.use('/track', require("./routes/v1/track"));
app.use('/cancel', require("./routes/v1/cancel"));
app.use('/update', require("./routes/v1/update"));
app.use('/rating', require("./routes/v1/rating"));
app.use('/support', require("./routes/v1/support"));

app.use('/admin', require("./routes/v1/admin"));

app.listen(PORT, () => {
  logger.info(`${config.get('bpp_id')} listening on port ${PORT}`);
});