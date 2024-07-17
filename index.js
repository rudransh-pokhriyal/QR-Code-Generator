import express from "express";
import qr from "qr-image";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
let isgenerated = false;

function image_gen(req, res, next) {
  const url = req.body["qr-url"];
  if (url !== undefined) {
    let qr_img = qr.image(url);
    qr_img.pipe(fs.createWriteStream(__dirname + '/public/qr-code.png'));
    isgenerated = true;
  }
  next();
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit",image_gen, (req, res) => {
    if(isgenerated)
    res.sendFile(__dirname + "/public/qrcode.html");
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
