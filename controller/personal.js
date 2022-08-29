const db = require("../config/db");
const bcrypt = require("bcryptjs");
const XLSX = require("xlsx");
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
        length: result.length,
      });
    }
  });
};
exports.getOnedata = async (req, res) => {
  const id = req.params.id;
  let get = `select * from user where user_id='${id}'`;
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
      console.log(result)
      res.send({
        status: 200,
        data: result,
        length: result.length,
      });
    }
  });
};
exports.exportdata = async (req, res) => {
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
      const data = [];
      for (let i = 0; i < result.length; i++) {
        const jsonData = [
          {
            username: result[i].username,
            first_name: result[i].first_name,
            last_name: result[i].last_name,
            email: result[i].email,
          },
        ];
        data.push(...jsonData);
      }
      console.log(data);

      const convertJsonToexcel2 = () => {
        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, workSheet, "HouseData");
        //binary buffer
        XLSX.write(workBook, {
          bookType: "xlsx",
          type: "buffer",
        });
        //binary string
        const fs = require("fs");
        const filename = "users.xlsx";
        const wb_opts = { bookType: "xlsx", type: "binary" }; // workbook options
        XLSX.writeFile(workBook, filename, wb_opts); // write workbook file
        const stream = fs.createReadStream(filename); // create read stream
        stream.on("open", function () {
          // This just pipes the read stream to the response object (which goes to the client)
          stream.pipe(res);
        });
      };
      convertJsonToexcel2();
      return;
    }
  });
};
