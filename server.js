const express = require("express");
const path = require("path");
const app = express(),
  bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

const packageJSON = require("./package.json");

port = 3000;

app.use(
  "/api",
  createProxyMiddleware({
    target: packageJSON.proxy,
    changeOrigin: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
