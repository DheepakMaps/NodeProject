const express = require('express');
const bodyParser = require("body-parser");
const db = require('mysql2');
const cors = require("cors");

const app = express(); 
app.use(bodyParser.json())
app.use(cors())
const connection = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Maps@1234',
    database: "nodeTest"
});


//  test db connection
// connection.connect(function(err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Connection successful');
//     }
// });

// create DB

// connection.query("CREATE DATABASE nodeTest", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });

// create table

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     connection.query("create TABLE user  (id BIGINT AUTO_INCREMENT PRIMARY KEY ,user_name VARCHAR(100),status INT)", function (err, result) {
//       if (err) throw err;
//       console.log("table student created ");
//     });
//   });

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     connection.query("CREATE TABLE parent (id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
            // " name VARCHAR(100), user_id BIGINT,student_id BIGINT, status int" +
            // " FOREIGN KEY (user_id) REFERENCES user(id),  FOREIGN KEY (student_id) REFERENCES student(id))",
//      function (err, result) {
//       if (err) throw err;
//       console.log("table parent created ");
//     });
//   });

let UserCount = 0;


// create  user api 
app.post("/api/student/create", (req, res) => {

    connection.query("SELECT COUNT(*) AS userCount FROM user", function (err, result) {
        if (err) {
            throw err;
        } else {
            UserCount = result[0].userCount;
            console.log(UserCount);

            let userIdCount = UserCount + 1;
            let userCreate = {
                user_name: "USERNODE00" + userIdCount,
                status: 1,

            };
            let userId;
            let userSql = "INSERT INTO user SET ?";
            connection.query(userSql, userCreate, (error, userResul) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(userResul);
                    // res.send({ data: userResul });
                    userId = userResul.insertId;

                    let studentUser = {
                        name: req.body.name,
                        user_id: userId,
                        status: 1

                    }
                    let studentId;
                    let studentSql = "INSERT INTO student SET ?";
                    connection.query(studentSql, studentUser, (error, studRes) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(studRes);
                            // res.send({ data: studRes });
                            studentId = studRes.insertId;
                            console.log("studentId" + studentId);
                            let parentUser = {
                                name: req.body.parentName,
                                user_id: userId,
                                student_id: studentId,
                                status: 1,
                            }
                            console.log("parentUser", parentUser);
                            let parentSql = "INSERT INTO parent SET ?";
                            connection.query(parentSql, parentUser, (error, parentRes) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(parentRes);
                                    // res.send({ data: parentRes });

                                    let responseSql = " select * from student where id =?"
                                    connection.query(responseSql, studentId, (error, final) => {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log(final);
                                            res.send({ data: final });
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            });



        }
    });



})

// get all student

app.get("/api/students",(req,res)=>{

    connection.query("select * from student ",function(err,resut){
        if(err){
            console.log(err);
        }else{
            res.send({data:resut})
        }
    })
})

// get all parent
app.get("/api/parents",(req,res)=>{

    connection.query("select * from parent ",function(err,resut){
        if(err){
            console.log(err);
        }else{
            res.send({data:resut})
        }
    })
})

// get student by id

app.get("/api/student/:id",(req,res)=>{

    connection.query("select * from student ",req.params.id,function(err,resut){
        if(err){
            console.log(err);
        }else{
            res.send({data:resut})
        }
    })
})

// get parent by id
app.get("/api/parent/:id",(req,res)=>{

    connection.query("select * from parent ",req.params.id,function(err,resut){
        if(err){
            console.log(err);
        }else{
            res.send({data:resut})
        }
    })
})

//  delete parent by id
app.delete("/api/parent/:id",(req,res)=>{

    connection.query("delete from parent where id =? ",req.params.id,function(err,resut){
        if(err){
            console.log(err);
        }else{
            res.send({data:resut})
        }
    })
})

// delete student by id
app.delete("/api/student/:id",(req,res)=>{

    connection.query("Delete from student where id =? ",req.params.id,function(err,resut){
        if(err){
            console.log(err);
        }else{
            res.send({data:resut})
        }
    })
})

app.listen(8081, () => {
    console.log('Server is running on port 8081');
});

