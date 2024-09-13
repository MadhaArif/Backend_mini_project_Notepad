const express = require("express");
const app = express();
const path = require('path');
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Route to display list of files
app.get("/", function (req, res) {
    fs.readdir("./files", function (err, files) {
        if (err) {
            console.error("Error reading files:", err);
            return res.status(500).send("Server Error");
        }
        res.render("index", { files: files });
    });
});

// Route to display a specific file
app.get("/file/:filename", function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("File not found");
        }
        res.render("show", { filedata: filedata, filename: req.params.filename }); // Passing filename and filedata to the view
    });
});

// Example of edit route
app.get('/edit/:filename', (req, res) => {
    res.render('edit', { filename: req.params.filename }); // Ensure that data is passed properly
});

app.post('/edit', (req, res) => {
    const previousFileName = `./files/${req.body.previous}`;
    const newFileName = `./files/${req.body.new}`;

    fs.rename(previousFileName, newFileName, function (err) {
        if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).send("Failed to rename file");
        }
        res.redirect("/");
    });
});


// Route to create a new file
app.post("/create", function (req, res) {
    const fileName = `${req.body.title.replace(/\s+/g, '')}.txt`; // Remove spaces from the title and append ".txt"
    fs.writeFile(`./files/${fileName}`, req.body.details, function (err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Failed to create file");
        }
        res.redirect("/");
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
