const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
exports.createdepartment = async (req, res) => {
  const department_name = req.body.department_name;
  const department_req = req.body.department_req;
  const created_by = req.body.created_by;
  const created_at = moment(new Date()).format("YYYY-MM-DD");
  const updated_by = req.body.updated_by;
  const updated_at = moment(new Date()).format("YYYY-MM-DD");
  const company_id = req.body.company_id;
  const insert = `insert into department (department_name,department_req,created_by,created_at,updated_by,updated_at,company_id) value ('${department_name}','${department_req}','${created_by}','${created_at}','${updated_by}','${updated_at}','${company_id}') `;
  db.query(insert, (err, result) => {
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
exports.getdepartment = async (req, res) => {
  const id = req.params.id;
  const insert = `select * from department where company_id=${id}`;
  db.query(insert, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send({
        status: 200,
        data: result,
        count: result.length,
      });
    }
  });
};
exports.getdepartmentdetail = async (req, res) => {
  const id = req.params.id;
  const insert = `select * from department where department_id=${id}`;
  db.query(insert, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send({
        status: 200,
        data: result,
        count: result.length,
      });
    }
  });
};

exports.createdepartment = async (req, res) => {
  const department_name = req.body.department_name;
  const department_req = req.body.department_req;
  const created_by = req.body.created_by;
  const created_at = moment(new Date()).format("YYYY-MM-DD");
  const updated_by = req.body.updated_by;
  const updated_at = moment(new Date()).format("YYYY-MM-DD");
  const company_id = req.body.company_id;
  const insert = `insert into department (department_name,department_req,created_by,created_at,updated_by,updated_at,company_id) value ('${department_name}','${department_req}','${created_by}','${created_at}','${updated_by}','${updated_at}','${company_id}') `;
  db.query(insert, (err, result) => {
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
exports.editdepartment = async (req, res) => {
  const id = req.body.id;
  const department_name = req.body.department_name;
  const department_req = req.body.department_req;
  const updated_by = req.body.updated_by;
  const updated_at = moment(new Date()).format("YYYY-MM-DD");
  const insert = `update department set department_name='${department_name}',department_req='${department_req}',updated_by=${updated_by},updated_at=${updated_at} where department_id=${id}`;
  db.query(insert, (err, result) => {
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
exports.getData = async (req, res) => {
  const id = req.params.id;
  let get = `select * from user where company_id='${id}' and department is null`;
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
exports.getdepartmentdetaildata = async (req, res) => {
  const id = req.params.id;
  let get = `select * from user where department='${id}'`;
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
        count: result.length,
      });
    }
  });
};
exports.inserttodepartment = async (req, res) => {
  const department_id = req.body.department_id;
  const user_id = req.body.user_id;
  let get = `update user set department = ${department_id} where user_id = ${user_id}`;
  db.query(get, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send({
        status: 200,
        data: result,
        count: result.length,
      });
    }
  });
};
exports.deleteoutdepartment = async (req, res) => {
  const user_id = req.body.user_id;
  let get = `update user set department = NULL where user_id = ${user_id}`;
  db.query(get, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(result);
      res.send({
        status: 0,
        data: result,
        count: result.length,
      });
    }
  });
};
