const axios = require("axios");
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const XLSX = require("xlsx");
exports.createVisitor = async (req, res) => {
  let id = req.params.id;
  let get = `select * from company where company_id = ${id}`;
  let devsns = req.body.devsns;
  let usableCount = req.body.usableCount;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let visitor_name = req.body.visitor_name;
  let visipeople = req.body.visipeople;
  let created_by = req.body.created_by;

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
              )
                .add(1, "hours")
                .format("YYYY-MM-DD HH:mm:ss")}&endDate=${moment(endDate)
                .add(1, "hours")
                .format("YYYY-MM-DD HH:mm:ss")}`
            )

            .then(async (result) => {
              let qrcode = result.data.data.qrCode;
              let tempPwd = result.data.data.tempPwd;
              let saveLog = `insert into visitor_log (company_id,device_devSn,qrcode,start,end,usableCount,visitor_name,tempPwd,created_by,visipeople,date) value (${id},${devsns},'${qrcode}','${moment(
                startDate
              ).format("YYYY-MM-DD HH:mm:ss")}','${moment(endDate).format(
                "YYYY-MM-DD HH:mm:ss"
              )}','${usableCount}','${visitor_name}','${tempPwd}','${created_by}','${visipeople}','${moment(
                startDate
              ).format("YYYY-MM-DD")}')`;
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
exports.getVisitorlenght = async (req, res) => {
  let id = req.params.id;
  let get = `select * from visitor_log where company_id = ${id} and date='${moment(new Date()).format("YYYY-MM-DD")}'`;
  console.log(moment(new Date()).format("YYYY-MM-DD"))
  console.log(get)
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
exports.exportsvisitor = async (req, res) => {
  let id = req.params.id;
  let get = `select * from visitor_log where company_id = ${id}`;
  db.query(get, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      const data = [];
      for (let i = 0; i < result.length; i++) {
        const jsonData = [
          {
            visitor_name: result[i].visitor_name,
            device_devSn: result[i].device_devSn,
            usableCount: result[i].usableCount,
            start: result[i].start,
            end: result[i].end,
            tempPwd: result[i].tempPwd,
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
