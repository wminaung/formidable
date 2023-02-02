const http = require("http");
const formidable = require("formidable");
const { readFileSync, renameSync, mkdirSync, existsSync } = require("fs");
const path = require("path");

try {
  if (!existsSync("files")) {
    mkdirSync("files");
  }
} catch (err) {
  console.error(err);
} ///////create files dir if not exist

const server = http.createServer((req, res) => {
  console.log(req.url);
  if (req.url === "/fileupload" && req.method === "POST") {
    console.count("fileupload block");
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.end(JSON.stringify("something wroung"));
      }
      if (files.upload.originalFilename === "") {
        return res.end(JSON.stringify("There is no such file"));
      }
      if (Array.isArray(files.upload)) {
        // multiple file upload
        const allFiles = files.upload;
        allFiles.forEach((file) => {
          const oldPath = file.filepath;
          const newPath = path.join(
            __dirname,
            "files",
            `${new Date().getTime()}${file.originalFilename}`
          );
          renameSync(oldPath, newPath);
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify("Success multiple files upload"));
      } else {
        // single file upload
        const singleFile = files.upload;
        const oldPath = singleFile.filepath;
        const newPath = path.join(
          __dirname,
          "files",
          `${new Date().getTime()}${singleFile.originalFilename}`
        );
        renameSync(oldPath, newPath);

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify("Success single file upload"));
      }
    });
  } else {
    const data = readFileSync("index.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    return res.end();
  }
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000/ ...");
});
