const db = require("../config/db");
const bcrypt = require("bcryptjs");
exports.createpersonal = async (req, res) => {
  let company_id = req.body.company_id;
  let username = req.body.username;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let position = req.body.position;
  let permission = req.body.permission;
  let role = 1;
  let mobile = 1;
  let count = `SELECT COUNT(username)  AS name2 FROM user WHERE username='${username}'`;
  console.log(req.body);
  db.query(count, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result[0].name2 > 0) {
      res.send({
        status: 400,
        data: "มีUserนี่อยู่แล้ว",
      });
    }
    if (result[0].name2 === 0) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.send(err);
        }
        if (hash) {
          if (permission === true) permission === 1;
          if (permission === false) permission === 0;
          let create = `INSERT INTO user (username,first_name,last_name,email,password,company_id,role,mobile,position,qrcode)  VALUES ('${username}','${first_name}','${last_name}','${email}','${hash}',${company_id},${role},${mobile},${position},${permission})`;
          db.query(create, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              res.send({
                status: 200,
                data: result,
              });
            }
          });
        }
      });
    }
  });
};
exports.getData = async (req, res) => {
  const id = req.params.id;
  let get = `select * from user where company_id='${id}'`;
  db.query(get, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length < 0) {
      res.send({
        status: 400,
      });
    }
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    }
  });
};
exports.editperson = async (req, res) => {
  const id = req.params.id;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  let get = `UPDATE user SET first_name = ${first_name}, last_name = ${last_name},email = ${email} WHERE user_id = ${id};`;
  db.query(get, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length < 0) {
      res.send({
        status: 400,
      });
    }
    if (result.length > 0) {
      res.send({
        status: 200,
        data: result,
      });
    }
  });
};
exports.updatepassword = async (req, res) => {
  const id = req.params.id;
  const password = req.body.password;
  let get = `select * from user where user_id = ${id}`;
  db.query(get, (err, result) => {
    if (err) {
      console.log(err);
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
          if (bResult == true) {
            bcrypt.hash(req.body.new_password, 10, (err, hash) => {
              if (err) {
                res.send(err);
              }
              if (hash) {
                console.log(hash);
                let create = `UPDATE user SET password = '${hash}' WHERE user_id = ${id};`;
                db.query(create, (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  if (result) {
                    res.send({
                      status: 200,
                      data: result,
                    });
                  }
                });
              }
            });
          }
          if (bResult !== true) {
            res.send("รหัสผ่านไม่ถูกต้อง");
          }
        }
      );
      console.log(result);
    }
  });
};
