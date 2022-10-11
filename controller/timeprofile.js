const db = require("../config/db");
const moment = require("moment");
const axios = require("axios");
exports.createTimeprofile = async (req, res) => {
  let timeprofile_name = req.body.timeprofile_name;

  let monday = req.body.monday;
  let tuesday = req.body.tuesday;
  let wednesday = req.body.wednesday;
  let thursday = req.body.thursday;
  let friday = req.body.friday;
  let saturday = req.body.saturday;
  let sunday = req.body.sunday;

  let monday_time = moment(req.body.monday_time).format("HH:mm:ss");
  let tuesday_time = moment(req.body.tuesday_time).format("HH:mm:ss");
  let wednesday_time = moment(req.body.wednesday_time).format("HH:mm:ss");
  let thursday_time = moment(req.body.thursday_time).format("HH:mm:ss");
  let friday_time = moment(req.body.friday_time).format("HH:mm:ss");
  let saturday_time = moment(req.body.saturday_time).format("HH:mm:ss");
  let sunday_time = moment(req.body.sunday_time).format("HH:mm:ss");
  let monday_time_to = moment(req.body.monday_time_to).format("HH:mm:ss");
  let tuesday_time_to = moment(req.body.tuesday_time_to).format("HH:mm:ss");
  let wednesday_time_to = moment(req.body.wednesday_time_to).format("HH:mm:ss");
  let thursday_time_to = moment(req.body.thursday_time_to).format("HH:mm:ss");
  let friday_time_to = moment(req.body.friday_time_to).format("HH:mm:ss");
  let saturday_time_to = moment(req.body.saturday_time_to).format("HH:mm:ss");
  let sunday_time_to = moment(req.body.sunday_time_to).format("HH:mm:ss");
  let created_at = moment(req.body.created_at).format("YYYY-MM-DD HH:mm:ss");
  let created_by = req.body.created_by;
  let updated_at = moment(req.body.updated_at).format("YYYY-MM-DD HH:mm:ss");
  let updated_by = req.body.updated_by;
  let company_id = req.body.company_id;
  let insert = `insert into timeprofile (company_id,timeprofile_name,monday_time,tuesday_time,wednesday_time,thursday_time,friday_time,saturday_time,sunday_time,monday_time_to,tuesday_time_to,wednesday_time_to,thursday_time_to,friday_time_to,saturday_time_to,sunday_time_to,created_at,created_by,updated_at,updated_by) value ('${company_id}','${timeprofile_name}','${monday_time}','${tuesday_time}','${wednesday_time}','${thursday_time}','${friday_time}','${saturday_time}','${sunday_time}','${monday_time_to}','${tuesday_time_to}','${wednesday_time_to}','${thursday_time_to}','${friday_time_to}','${saturday_time_to}','${sunday_time_to}','${created_at}','${created_by}','${updated_at}','${updated_by}')`;

  db.query(insert, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      if (monday === true) monday == 1;
      if (tuesday === true) tuesday === 1;
      if (wednesday === true) wednesday === 1;
      if (thursday === true) thursday === 1;
      if (friday === true) friday === 1;
      if (saturday === true) saturday === 1;
      if (sunday === true) sunday === 1;
      if (monday === false) monday === 0;
      if (tuesday === false) tuesday === 0;
      if (wednesday === false) wednesday === 0;
      if (thursday === false) thursday === 0;
      if (friday === false) friday === 0;
      if (saturday === false) saturday === 0;
      if (sunday === false) sunday === 0;
      const update = `update timeprofile set monday=${monday},tuesday=${tuesday},wednesday=${wednesday},thursday=${thursday},friday=${friday},saturday=${saturday},sunday=${sunday} where timeprofile_id = ${result.insertId}`;
      db.query(update, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          res.send({
            status: 200,
            data: result,
          });
        }
      });
    }
  });
};
exports.getTimeprofile = async (req, res) => {
  const id = req.params.id;
  const get = `select * from timeprofile where company_id = ${id}`;
  db.query(get, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send({
        count: result.lenght,
        data: result,
      });
    }
  });
};
exports.edittimeprofile = async (req, res) => {
  let id = req.params.id;
  let timeprofile_name = req.body.timeprofile_name;

  let monday = req.body.monday;
  let tuesday = req.body.tuesday;
  let wednesday = req.body.wednesday;
  let thursday = req.body.thursday;
  let friday = req.body.friday;
  let saturday = req.body.saturday;
  let sunday = req.body.sunday;

  let monday_time = moment(req.body.monday_time).format("HH:mm:ss");
  let tuesday_time = moment(req.body.tuesday_time).format("HH:mm:ss");
  let wednesday_time = moment(req.body.wednesday_time).format("HH:mm:ss");
  let thursday_time = moment(req.body.thursday_time).format("HH:mm:ss");
  let friday_time = moment(req.body.friday_time).format("HH:mm:ss");
  let saturday_time = moment(req.body.saturday_time).format("HH:mm:ss");
  let sunday_time = moment(req.body.sunday_time).format("HH:mm:ss");
  let monday_time_to = moment(req.body.monday_time_to).format("HH:mm:ss");
  let tuesday_time_to = moment(req.body.tuesday_time_to).format("HH:mm:ss");
  let wednesday_time_to = moment(req.body.wednesday_time_to).format("HH:mm:ss");
  let thursday_time_to = moment(req.body.thursday_time_to).format("HH:mm:ss");
  let friday_time_to = moment(req.body.friday_time_to).format("HH:mm:ss");
  let saturday_time_to = moment(req.body.saturday_time_to).format("HH:mm:ss");
  let sunday_time_to = moment(req.body.sunday_time_to).format("HH:mm:ss");
  let updated_at = moment(req.body.updated_at).format("YYYY-MM-DD HH:mm:ss");
  let updated_by = req.body.updated_by;
  const get = `select * from timeprofile_name where timeprofile_id = ${id}`;
  db.query(get, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      if (monday === true) monday == 1;
      if (tuesday === true) tuesday === 1;
      if (wednesday === true) wednesday === 1;
      if (thursday === true) thursday === 1;
      if (friday === true) friday === 1;
      if (saturday === true) saturday === 1;
      if (sunday === true) sunday === 1;
      if (monday === false) monday === 0;
      if (tuesday === false) tuesday === 0;
      if (wednesday === false) wednesday === 0;
      if (thursday === false) thursday === 0;
      if (friday === false) friday === 0;
      if (saturday === false) saturday === 0;
      if (sunday === false) sunday === 0;
      const update = `update timeprofile set timeprofile_name=${timeprofile_name},monday_time=${monday_time},tuesday_time=${tuesday_time},wednesday_time=${wednesday_time},thursday_time=${thursday_time},friday_time=${friday_time},saturday_time=${saturday_time},sunday_time=${sunday_time},monday_time_to=${monday_time_to},tuesday_time_to=${tuesday_time_to},wednesday_time_to=${wednesday_time_to},thursday_time_to=${thursday_time_to},friday_time_to=${friday_time_to},saturday_time_to=${saturday_time_to},sunday_time_to=${sunday_time_to},updated_at=${updated_at},updated_by=${updated_by},monday=${monday},tuesday=${tuesday},wednesday=${wednesday},thursday=${thursday},friday=${friday},saturday=${saturday},sunday=${sunday} where timeprofile_id = ${result.insertId}`;
      db.query(update, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          res.send({
            status: 200,
            data: result,
          });
        }
      });
    }
  });
};
exports.getDetail = async (req, res) => {
  const id = req.params.id;
  const get = `select * from timeprofile where timeprofile_id = ${id}`;
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
exports.getline = async (req, res) => {
  await axios
    .get(`https://notify-bot.line.me/oauth/authorize`, {
      response_type: "code",
      client_id: "8RtZ2oD1KUktnt1DInAs19",
      redirect_uri: "http://localhost:3000/publiclink",
      scope: "notify",
      state: "mylinenotify",
    })
    .then(async (result) => {
      console.log(result)
   res.send(result.data); 
    });
};
