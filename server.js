const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", function (req, res) {
    let obj = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
    return res.json(obj);
});

app.post("/api/notes", function (req, res) {
    let note = req.body;
    fs.readFile('db/db.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let obj = JSON.parse(data);
            obj.push(note);
            let json = JSON.stringify(obj, null, 2);
            fs.writeFile('db/db.json', json, 'utf8', function (err, data) {
                if (err) throw err;
            });
        }
    });
    return res.sendStatus(201);
});

app.delete('/api/notes/:id', function (req, res) {
    function processDelete(noteID) {
        fs.readFile('db/db.json', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data);
                obj.forEach(el => {
                    if (el.id === noteID) {
                        let foundNote = obj.indexOf(el);
                        obj.splice(foundNote, 1)
                        let json = JSON.stringify(obj, null, 2); 
                        fs.writeFile('db/db.json', json, 'utf8', function (err, data) {
                            if (err) throw err;
                        });
                    } else {
                        return
                    }
                })
            }
        });
    }
    processDelete(req.params.id)
    return res.sendStatus(200)
});

