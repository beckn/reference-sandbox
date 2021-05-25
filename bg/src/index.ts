import express from "express";
import cors from "cors";
import config from "./config/config"

const app = express();

app.use(express.json());
app.use(cors());

const PORT = config.port;

app.use('/search', require("./routes/v1/search"));
app.use('/on_search', require("./routes/v1/on_search"));

app.listen(PORT, () => {
  console.log("Beckn Gateway listening on port " + PORT);
});
