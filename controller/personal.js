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
  let permission2 = req.body.permission2;
  let permission3 = req.body.permission3;
  let permission4 = req.body.permission4;
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
          if (permission2 === true) permission2 === 1;
          if (permission2 === false) permission2 === 0;
          if (permission3 === true) permission3 === 1;
          if (permission3 === false) permission3 === 0;
          if (permission4 === true) permission4 === 1;
          if (permission4 === false) permission4 === 0;
          let create = `INSERT INTO user (username,first_name,last_name,email,password,company_id,role,mobile,position,qrcode,keycard,bluetooth,pin)  VALUES ('${username}','${first_name}','${last_name}','${email}','${hash}',${company_id},${role},${mobile},${position},${permission},${permission2},${permission3},${permission4})`;
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
exports.updateManyUser = async (req, res) => {
  const id = req.body.id;
  let permission = req.body.permission;
  let permission2 = req.body.permission2;
  let permission3 = req.body.permission3;
  let permission4 = req.body.permission4;
  const newObject2 = Object.assign({}, id);
  const objectArray2 = Object.entries(newObject2);
  let data = [];

  objectArray2.forEach(([key, value]) => {
    if (permission === true) permission === 1;
    if (permission === false) permission === 0;
    if (permission2 === true) permission2 === 1;
    if (permission2 === false) permission2 === 0;
    if (permission3 === true) permission3 === 1;
    if (permission3 === false) permission3 === 0;
    if (permission4 === true) permission4 === 1;
    if (permission4 === false) permission4 === 0;
    console.log(value);
    let get = `update  user set qrcode=${permission},keycard=${permission2},bluetooth=${permission3},pin= ${permission4}  where user_id='${value}'`;
    db.query(get, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        data.push(result);
      }
    });
  });
  res.send({
    status: 200,
  });
};
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  let permission = req.body.permission;
  let permission2 = req.body.permission2;
  let permission3 = req.body.permission3;
  let permission4 = req.body.permission4;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;

  if (permission === true) permission === 1;
  if (permission === false) permission === 0;
  if (permission2 === true) permission2 === 1;
  if (permission2 === false) permission2 === 0;
  if (permission3 === true) permission3 === 1;
  if (permission3 === false) permission3 === 0;
  if (permission4 === true) permission4 === 1;
  if (permission4 === false) permission4 === 0;
  let get = `update  user set qrcode=${permission},keycard=${permission2},bluetooth=${permission3},pin=${permission4},first_name='${first_name}',last_name='${last_name}',email='${email}' where user_id=${id}`;
  db.query(get, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send({
        status: 200,
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
    if (result.length <= 0) {
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
exports.getUser = async (req, res) => {
  const id = req.params.id;
  let get = `select * from user where user_id='${id}'`;
  db.query(get, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length <= 0) {
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
exports.Deletepersonal = async (req, res) => {
  const id = req.params.id;
  let get = `delete from user where user_id='${id}'`;
  db.query(get, (err, result) => {
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
};
exports.DeleteManypersonal = async (req, res) => {
  const id = req.body.id;
  const newObject2 = Object.assign({}, id);
  const objectArray2 = Object.entries(newObject2);
  let data = [];
  objectArray2.forEach(([key, value]) => {
    console.log(value);
    let get = `delete from user where user_id='${value}'`;
    db.query(get, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        data.push(result);
      }
    });
  });
  res.send({
    status: 200,
    data: data,
  });
};
exports.importexcel = async (req, res) => {
  var XLSX = require("xlsx");

  var workbook = XLSX.readFile(req.file.path);
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  const newObject2 = Object.assign({}, xlData);
  const objectArray2 = Object.entries(newObject2);
  let company_id = req.body.company_id;
  let role = 1;
  let mobile = 1;
  objectArray2.forEach(([key, value]) => {
    console.log(value);
    const post = `insert into user (username,first_name,last_name,email,company_id,role,mobile)  VALUES ('${value.Username}','${value["ชื่อ"]}','${value["นามสกุล"]}','${value.Email}',${company_id},${role},${mobile})`;
    db.query(post, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
      }
    });
  });

  res.send(xlData);
};

exports.exportPerson = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from user where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length <= 0) {
      res.send("มีบางอย่างผิดพลาด");
    }
    if (result.length > 0) {

      const output = result;
      const data = [];
      for (let i = 0; i < output.length; i++) {
        const jsonData = [
          {
            ชื่อ: output[i].first_name,
            นามสกุล: output[i].last_name,
            Email: output[i].email,
            Username: output[i].username,
          },
        ];
        data.push(...jsonData);
      }
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
        const filename = "personal.xlsx";
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
