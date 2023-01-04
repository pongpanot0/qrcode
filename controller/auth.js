const db = require("../config/db");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const axios = require("axios");
exports.register = async (req, res) => {
  let name = req.body.name;
  let uuid = uuidv4();
  let username = name;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let company = name;
  let position = req.body.position;
  let role = 0;
  let mobile = 1;
  let count = `SELECT COUNT(username)  AS name2 FROM user WHERE username='${name}'`;
  db.query(count, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result[0].name2 >= 1) {
      console.log("มีUsername นี่แล้ว");
    }
    if (result[0].name2 == 0) {
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          let createcompany = `insert into company (company_name,company_uuid) values('${company}','${uuid}')`;
          const accessToken = result.data.data.accessToken;
          db.query(createcompany, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              let company_id = result.insertId;
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  console.log(err);
                }
                if (hash) {
                  let create = `INSERT INTO user (username,first_name,last_name,email,password,company_id,position,role,mobile)  VALUES ('${username}','${first_name}','${last_name}','${email}','${hash}',${company_id},${position},${role},${mobile})`;
                  db.query(create, (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    if (result) {
                      axios
                        .post(
                          `${process.env.thinmoo}/sqCommunity/extapiAdmin/add?accessToken=${accessToken}&name=${name}&uuid=${uuid}`
                        )
                        .then((result) => {
                          res.send({
                            data: result.data,
                          });
                        });
                    }
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
};

exports.login = async (req, res) => {
  let email = req.body.email;
  db.query(
    `select * from user  WHERE username = '${email}'`,
    async (err, result) => {
  
      if (err) {
        res.send({
          status: 400,
          message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
        });
        return;
      }
      if (result[0] === null || result[0] === [] || result[0] === undefined) {
        res.send({
          status: 400,
          message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
        });
        return;
      }
      if (result) {
        bcrypt.compare(
          req.body.password,
          result[0]["password"],
          (bErr, bResult) => {
            if (bErr) {
              throw bErr;
              return res.status(401).send({
                msg: "Email or password is incorrect!",
              });
            }
            if (bResult) {
              const token = jwt.sign(
                {
                  user_id: result[0].user_id,
                  uuid: result[0].uuid,
                  first_name: result[0].first_name,
                  last_name: result[0].last_name,
                  email: result[0].email,
                  company_id: result[0].company_id,
                  position: result[0].position,
                },
                "zuHbAry/7IrrSQaynzj4c8i8n1iO+CCqzdyeXgRNlfDdQBUJcX9yrYGc98fqp169/ELDSLwtvzebeQ0nf6WkOiXUhOdStRMhPykd/nJwEdmENXThvX9Map7k1gwvXvciZ48DYVc7nntfN82k+ZXSRX2+rTN8YEK3S7tP/0csBYdQwB6OS5FzMHM1gQvK3VX4QAlC6nDbvLsYOBqZcYsDlvlL/Uglw57wNNpLfwjQQC+zXBFvGnROVNLh//yyBl1kB+YmIZXrnkrUkNbLm7QteW+6nXUWZ1gQOEatjCr9NnYxaY4Ve0QABq0sHzifZ65Bz4HVFptun97VS4LSTJmxeQ==",
                { expiresIn: "1h" }
              );
              res.send({
                status: 200,
                token: token,
                user: result,
              });
            } else {
              return res.send({
                status: 400,
                message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
              });
            }
          }
        );
      }
    }
  );
};
