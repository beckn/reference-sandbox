import express from "express";
import cors from "cors";
import config from "./config/config"

const app = express();

app.use(express.json());
app.use(cors());

const PORT = config.get('port');

app.use('/on_search', require("./routes/v1/on_search"));
app.use('/on_select', require("./routes/v1/on_select"));
app.use('/on_init', require("./routes/v1/on_init"));
app.use('/on_confirm', require("./routes/v1/on_confirm"));
app.use('/on_track', require("./routes/v1/on_track"));
app.use('/on_cancel', require("./routes/v1/on_cancel"));
app.use('/on_update', require("./routes/v1/on_update"));
app.use('/on_status', require("./routes/v1/on_status"));
app.use('/on_rating', require("./routes/v1/on_rating"));
app.use('/on_support', require("./routes/v1/on_support"));

app.use('/trigger', require("./routes/v1/triggers"));

app.use('/admin', require("./routes/v1/admin"));

app.listen(PORT, () => {
  console.log("BAP listening on port " + PORT);
});
