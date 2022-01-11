import express from "express";
import cors from "cors";
import config from "./config/config";

const app = express();

const PORT = config.get('port');

app.use(express.json());
app.use(cors());

app.use('/on_*', require('./routes/v1/callback'));
app.use('*', require('./routes/v1/proxy'));

app.listen(PORT, () => {
  console.info(`${config.get('bpp_id')} listening on port ${PORT}`);
});