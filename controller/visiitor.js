const axios = require("axios");
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
exports.createVisitor = async (req, res) => {
  let id = req.params.id;
  let get = `select * from company where company_id = ${id}`;
  let devsns = req.body.devsns;
  let usableCount = req.body.usableCount;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  console.log(moment(startDate).format("DD-MM-YYYY HH:mm:ss"));
  db.query(get, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      let uuid = result[0].company_uuid;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          await axios
            .post(
              `${
                process.env.thinmoo
              }/accVisitorTempPwd/extapi/add?accessToken=${
                result.data.data.accessToken
              }&extCommunityUuid=${uuid}&devSns=${devsns}&usableCount=${usableCount}&startDate=${moment(
                startDate
              ).format("DD-MM-YYYY HH:mm:ss")}&endDate=${moment(endDate).format(
                "DD-MM-YYYY HH:mm:ss"
              )}`
            )
            .then(async (result) => {
              let qrresult = result.data.data;
              let qrcode = result.data.data.qrCode;
              let visitor_name = req.body.visitor_name;
              let created_by = req.body.created_by;
              let tempPwd = result.data.data.tempPwd;
              let saveLog = `insert into visitor_log (company_id,device_devSn,qrcode,start,end,usableCount,visitor_name,tempPwd,created_by) value (${id},${devsns},'${qrcode}','${moment(
                startDate
              ).format("DD-MM-YYYY HH:mm:ss")}','${moment(endDate).format(
                "DD-MM-YYYY HH:mm:ss"
              )}','${usableCount}','${visitor_name}','${tempPwd}','${created_by}')`;
              db.query(saveLog, (err, result) => {
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
            });
        });
    }
  });
};
exports.getVisitor = async (req, res) => {
  let id = req.params.id;
  let get = `select * from visitor_log where company_id = ${id}`;
  db.query(get, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send({
        status: 200,
        count: result.length,
        data: result,
      });
    }
  });
};
exports.getVisitorId = async (req, res) => {
    let id = req.params.id;
    let get = `select * from visitor_log where visitorlog_id = ${id}`;
    db.query(get, async (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.send({
          status: 200,
          count: result.length,
          data: result,
        });
      }
    });
  };
