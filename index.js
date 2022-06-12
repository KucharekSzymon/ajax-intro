const express = require("express");
const fs = require("fs");
const csv = require("fast-csv");
const path = require("path");
var cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

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

app.get("/json", cors(), async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  res.send(await readCSV());
});
app.get("/json/id=:id", async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.params.id;
  const jsonAll = await readCSV();
  var jsonID = [];
  for (let i = 0; i < jsonAll.length; i++) {
    if (jsonAll[i].ID == id) {
      jsonID.push(jsonAll[i]);
    }
  }
  jsonFound.sort((x, y) => x.Price - y.Price);
  res.send(jsonID);
});
app.get("/json/types", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var allTypes = [];

  var x = await readCSV();
  for (let i = 0; i < x.length; i++) {
    if (!allTypes.some((code) => code.Type === x[i].Type)) {
      allTypes.push({ Type: x[i].Type });
    }
  }

  res.json(allTypes);
});
app.get("/json/producents", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var allProducents = [];

  var x = await readCSV();
  for (let i = 0; i < x.length; i++) {
    if (!allProducents.some((code) => code.Producent === x[i].Producent)) {
      allProducents.push({ Producent: x[i].Producent });
    }
  }

  res.json(allProducents);
});

app.get("/json/sortby=", async function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  var x = req.query;

  const jsonAll = await readCSV();
  var jsonFound = [];
  for (let i = 0; i < jsonAll.length; i++) {
    if (x.Type && x.Producent) {
      if (jsonAll[i].Type == x.Type && jsonAll[i].Producent == x.Producent)
        jsonFound.push(jsonAll[i]);
    } else {
      if (jsonAll[i].Type == x.Type || jsonAll[i].Producent == x.Producent)
        jsonFound.push(jsonAll[i]);
    }
  }
  if (jsonFound.length == 0) jsonFound = jsonAll;

  if (x.Price) {
    if (x.Price == "ASC") {
      jsonFound.sort((x, y) => x.Price - y.Price);
    } else if (x.Price == "DESC") {
      jsonFound.sort((x, y) => y.Price - x.Price);
    }
  }
  res.json(jsonFound);
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
