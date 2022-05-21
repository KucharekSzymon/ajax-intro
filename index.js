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
  res.header('Access-Control-Allow-Origin', '*')
 // const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
 // var x = sortObject(await readCSV());

  res.send(await readCSV());
});
app.get('/json/id=:id', async function (req, res) {
  res.header('Access-Control-Allow-Origin', '*')
  var id = req.params.id;
  const jsonAll = await readCSV();
  var jsonID = []
  for(let i = 0; i<jsonAll.length;i++){
    if(jsonAll[i].ID == id){
      jsonID.push(jsonAll[i])
    }
  }
  res.send(jsonID)
});
app.get('/json/type=:type', async function (req, res) {
  res.header('Access-Control-Allow-Origin', '*')
  var type = req.params.type;
  const jsonAll = await readCSV();
  var jsonType = []
  for(let i = 0; i<jsonAll.length;i++){
    if(jsonAll[i].Type == type){
      jsonType.push(jsonAll[i])
    }
  }
  res.send(jsonType)
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
