// const mysqlconnection = require("../model/databaseconncetivity")

const express = require("express")
const mysql = require("mysql")
const bodyparser = require("body-parser")
const { query } = require("express")
const path = require("path")
const app = express()
var mysqlconnection = mysql.createConnection(
    {
        host: 'by59qgkgtip5p358uwli-mysql.services.clever-cloud.com',
        user: 'ugpgztx7leeszzit',
        password: 'JyYlZ2HheQD5e8zt82Ho',
        database: 'by59qgkgtip5p358uwli'
    }
);

// var mysqlconnection = mysql.createConnection(
//     {
//         host: 'localhost',
//         user: 'root',
//         password: 'amogh555kashyap',
//         database: 'sql_store'
//     }
// );
mysqlconnection.connect(function (err) {
    if (!err) {
        console.log("no error while connecting db")
    } else {
        console.log(err)
    }
})
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(express.static("../public"))
// function to send home page
app.get("/", function (req, res) {
    // mysqlconnection.query('SELECT * FROM sql_store.customers;', (err, row, fields) => {
    //     if (!err) {
    //         // console.log(row)
    //         let headers = res.getHeaderNames()
    //         // console.log(res.headers)
    //         console.log(row)
    //         res.setHeader("Access-Control-Allow-Origin", '*')
    //         res.send(row)

    //     } else {
    //         console.log(err)
    //     }

    // })
    dummystr = path.resolve(__dirname, "..", "public", "index.html")
    res.sendFile(dummystr)

})
// function to send rec login page
app.get("/reclogin", function (req, res) {
    res.sendFile(path.resolve(__dirname, "..", "public", "login2.html"))
})
// function to login
app.get("/viewPatient.html", function (req, res) {
    res.sendFile(path.resolve(__dirname, "..", "public", "viewPatient.html"))
})
// function to send options page
app.get("/options", function (req, res) {
    res.sendFile(path.resolve(__dirname, "..", "public", "options.html"))
})
app.get("/detailentry.html", function (req, res) {
    res.sendFile(path.resolve(__dirname, "..", "public", "detailentry.html"))
})
var dummyid = -1;
app.post("/update", function (req, res) {
    dummyid = parseInt(req.body.pid)
    console.log(dummyid)
    res.sendFile(path.resolve(__dirname, "..", "public", "update.html"))
})
app.post("/updatedata", function (req, res) {
    pid = req.body.pid;
    pname = req.body.pname;
    page = req.body.page;
    pnumber = req.body.pnumber;
    pbloodgroup = req.body.pbloodgroup;
    pweight = req.body.pweight;
    pgender = req.body.gender;

    paddress = req.body.paddress;
    padmissiondate = req.body.padmissiondate
    updatequerry = `update patient set pname='${pname}',p_age=${page},p_number=${pnumber},pgender='${pgender}',blood_group='${pbloodgroup}',weight=${pweight},address='${paddress}',admission_date='${padmissiondate}' 
       where pno=${pid}`
    mysqlconnection.query(updatequerry, function (err, row, field) {
        if (err) {
            console.log("error has occured near line 71 index.js")
        }
    })
    res.send("updated")

})
app.get("/getpidsdetail", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", '*')
    mysqlconnection.query(`select * from patient where pno=${dummyid}`, function (err, row, field) {
        console.log(dummyid)
        if (err) {
            console.log("something went wrong")
        } else {
            console.log(row)
            res.send(row)
        }
    })
})
// function to store data details into db
app.post('/doctorentry', function (req, res) {
    drname = req.body.drname;
    drqu = req.body.drqu;
    squery = `insert into doctor (dr_name,qua) value ('${drname}','${drqu}');`
    mysqlconnection.query(squery, function (err, row, fields) {
        if (err) {
            console.log("error near line 107", err)
        }
        else {
            console.log(row)
        }
    })
    res.send("doctor has been entered")


})
// function to getdoctor details
app.get("/getdoctor", function (req, res) {
    squery = `select * from doctor`
    res.setHeader("Access-Control-Allow-Origin", '*')
    mysqlconnection.query(squery, function (err, row, field) {
        if (err) {
            console.log("error at line 122", err)
        } else {
            console.log(row)
            res.send(row)
        }

    })

})

app.post("/savedata", function (req, res) {
    // pid = req.body.pid;
    pname = req.body.pname;
    page = req.body.page;
    pnumber = req.body.pnumber;
    pbloodgroup = req.body.pbloodgroup;
    pweight = req.body.pweight;
    pgender = req.body.gender;

    paddress = req.body.paddress;
    padmissiondate = req.body.padmissiondate
    dr_id = req.body.sel1
    // for (let opt of sel.options) {
    //     if (opt.selected) {
    //         console.log(opt.value)
    //     }
    // }
    console.log(dr_id)
    console.log(pgender)
    console.log(paddress)
    insertquerry = `insert into  patient(pname,p_age,p_number,pgender,blood_group,weight,address,admission_date,dr_id) values ('${pname}',${page},${pnumber},'${pgender}','${pbloodgroup}',${pweight},'${paddress}','${padmissiondate}',${dr_id})`;
    // insertquerry = `insert into  patient values (7,'${pname}',${page},${pnumber},'${pgender}','${pbloodgroup}',${pweight},'${paddress}','${padmissiondate}',${dr_id})`;
    var pid
    mysqlconnection.query(insertquerry, function (err, row, fiels) {
        if (!err) {
            pid = row['insertId']
            mysqlconnection.query(`insert into room (pno) values(${pid})`, function (err, row, fields) {
                if (!err) {
                    console.log("room inserted for a particular patient")
                }
            })

        } else {
            console.log(err, "error near /savedata")
        }
    })
    // insertquerry2=`insert into room(pno) values()`
    res.send("form submited")
    console.log(pid, "hi line 177")

})
// all related to profile
var id = -1
app.get("/patientprofile/:pid", function (req, res) {
    id = req.params.pid;
    res.sendFile(path.resolve(__dirname, "..", "public", "patient-profile.html"))

})
// function to delete a patient
app.get("/deleteprofile/:pid", function (req, res) {
    id = req.params.pid
    mysqlconnection.query(`delete from patient where pno=${id};`, function (err, row, field) {
        if (err) {
            console.log("error at line 196 while doing delete")
        } else {
            console.log(row)
            res.sendFile(path.resolve(__dirname, "..", "public", "viewPatient.html"))
            // res.send("deleted")
        }
    })
})
app.get("/profiledata", function (req, res) {
    console.log(id)
    res.setHeader("Access-Control-Allow-Origin", '*')
    squery = `select pno, pname ,admission_date,dr_name from patient p, doctor d
 where d.dr_id=p.dr_id and p.pno=${id}; `
    mysqlconnection.query(squery, function (err, row, field) {
        if (err) {
            console.log("error at line 175", err)
        } else {
            console.log(row)
            res.send(row)

        }
    })
})
app.get("/getdata", function (req, res) {
    mysqlconnection.query('select * from patient;', function (err, row, fields) {
        if (!err) {
            // console.log(row.length)
            console.log(row)
            // console.log((row[11]["admission_date"]))
            // d = row[11]["admission_date"]
            // str = d.toISOString().split('T')[0]
            // console.log(str)
            res.setHeader("Access-Control-Allow-Origin", '*')
            res.send(row)
        }
    })
})
app.listen(80, function () {
    console.log("server started")
})









