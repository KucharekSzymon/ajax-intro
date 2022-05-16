const express = require("express");
const fs = require("fs");
const csv = require("fast-csv");
const path = require("path");

const app = express();
const port = 3000;

async function readCSV() {
  var queryParameter = () =>
    new Promise((resolve) => {
      let returnLit = [];
      csv
        .parseFile(path.resolve(__dirname, "files", "printers.csv"), {
          headers: true,
        })
        .on("data", (data) => {
          returnLit.push(data);
        })
        .on("end", () => {
          resolve(returnLit);
        });
    });
  let mainList = [];
  await queryParameter().then((res) => (mainList = res));
  return mainList;
}

app.get("/json", async (req, res) => {
  res.send(await readCSV());
});
app.get("/xml", async (req, res) => {
  const json = await readCSV();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<shop>\n';
  json.forEach((val, key) => {
    xml += "<printer>\n";
    Object.keys(val).forEach((key) => {
      xml += `\t<${key}>${val[key]}</${key}>\n`;
    });
    xml += "</printer>\n";
  });
  xml += "</shop>";
  res.send(await xml);
});

app.listen(port, () => {
  console.log(`Example app on port ${port}`);
});
