//importing modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const schedule = require('node-schedule');
const axios = require('axios');

//declaring the middlewares
app.use(cors()); //Cross-origin resource sharing
app.use(bodyParser.urlencoded({ extended: false })); //request goes to the server in the url encoded form
app.use(bodyParser.json()); // response data should be in json format

let PORT = 8081;

//Creating Connection to database
const connection = mysql.createConnection({
    host: "localhost",
    user: "arulyan",
    password: "forza",
    database: "kaleyra"
})

//Connection Status
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to DB");
})

//Add reminder
app.post("/add", (req, res) => {
    no = req.body.no;
    task = req.body.task;
    date = req.body.date;
    time = req.body.time;
    let sql = 'insert into reminder (id,task,date,time) values ("' + no + '","' + task + '","' + date + '","' + time + '")';
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        else {
            res.json({
                success: true,
                status: 200
            })
            console.log("Data Inserted");
            let year = date.substr(0, 4);
            let month = date.substr(5, 2);
            let day = date.substr(8, 2);
            let hr = time.substr(0, 2);
            let min = time.substr(3, 2);
            console.log(year + "-" + month + "-" + day + " " + hr + ":" + min);
            const dater = new Date(Number(year), Number(month)-1, Number(day), Number(hr), Number(min), 0);
            const job = schedule.scheduleJob(dater, function () {
                console.log('The world is going to end today.');
                let url = `https://api.kaleyra.io/v1/HXIN1709604395IN/voice/outbound?to=+91${no}&api-key=A7d9a93081fcd9840089b138b995e51c4&bridge=+918046983237&target=[{"message":{"text":"Some of your tasks are due. It's not good to procrastinate."}}]`;
                axios.post(url)
                    .then(function (response) {
                        // console.log(response);
                        console.log("Axios Triggered")
                    })
                    .catch(function (error) {
                        // console.log(error);
                        console.log("Error!")
                    });
            });
        }
    })
})

//modify task
app.post("/modify", (req, res) => {
    no = req.body.no;
    task = req.body.task;
    date = req.body.date;
    time = req.body.time;
    let sql2 = 'update reminder set task="' + task + '" where (id)=("' + no + '")';
    connection.query(sql2, (err, rows) => {
        if (err) throw err;
        else {
            res.json({
                success: true,
                status: 202
            })
        }
    })
})

//show all tasks
app.get("/show", (req, res) => {
    let sql = 'select * from reminder';
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        else {
            res.json(rows);
        }
    })
})

app.listen(PORT);