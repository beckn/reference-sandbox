import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

import { MODELS } from './db/models/index';
import { sequelize } from './db/index';
import { auth } from "./routes/v0/middleware/auth";

(async () => {

  const PORT = process.env.PORT || 8080;

  await sequelize.addModels(MODELS);

  await sequelize.sync();

  app.use('/platform', auth, require("./routes/v0/platform"));
  app.use('/settings', auth, require("./routes/v0/networkSettings"));
  app.use('/user', require("./routes/v0/user"));

  app.listen(PORT, () => {
    console.log(`Beckn admin backend listening on port ${PORT}`);
  });

})();