const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api", routes);

app.get("/", (req, res) => {
    res.sendFile(path.json(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
    console.log("server is running...");
});