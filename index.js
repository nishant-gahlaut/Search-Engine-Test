const express = require("express");
const ejs = require("ejs");
const path = require("path");


var TfIdf = require('node-tfidf');
var tfidf = new TfIdf();
const fs = require('fs');


const contact = fs.readFileSync('contact.html');

var fs1 = require("fs");
var texturl = fs1.readFileSync("./Problems/problem_urls.txt", "utf-8");
var urltext = texturl.split("\n");

// console.log(urltext[0]);


var fs2 = require("fs");
var texttitle = fs2.readFileSync("./Problems/problem_titles.txt", "utf-8");
var titletext = texttitle.split("\n");


const app = express();

app.use(express.json());



app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/contact", (req, res) => {
    res.end(contact)
});
app.get("/home", (req, res) => {
    res.render("index");
});




app.get("/search", (req, res) => {
    const query = req.query;

    const question = query.question;



    const map1 = new Map();

    var flag = 0;

    for (let i = 1; i <= 2225; i++) {
        tfidf.addFileSync(`./Problems/problem${i}.txt`);
    }

    let txt = [];

    for (let i = 1; i <= 2225; i++) {
        let data = fs.readFileSync(`./Problems/problem${i}.txt`, 'utf-8');
        txt.push(data);
    }


    tfidf.tfidfs(question, function (i, measure) {
        map1.set(i + 1, measure);
    });
    const sortedNumDesc = new Map([...map1].sort((a, b) => b[1] - a[1]));

    let data_array = [];

    for (const [key, value] of sortedNumDesc.entries()) {
        if (flag < 5 && value != 0) {
            let my_object = {
                title: titletext[key - 1],
                url: urltext[key - 1],
                statement: txt[key - 1]
            };
            flag += 1;
            data_array.push(my_object);
        }
        else {
            break;
        }
    }
    
    setTimeout(() => {
        res.json(data_array);
    }, 3000);
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});