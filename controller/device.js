const axios = require("axios");
const db = require("../config/db");
exports.getDevice = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
    console.log(result);
    if (err) {
      res.send(err);
    }
    if (result.length <= 0) {
      res.send("มีบางอย่างผิดพลาด");
    }
    if (result.length > 0) {
      let uuid = result[0].company_uuid;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          let AccessToken = result.data.data.accessToken;
          await axios
            .get(
              `${process.env.thinmoo}/devDevice/extapi/list?accessToken=${AccessToken}&extCommunityUuid=${uuid}`
            )
            .then(async (result) => {
              console.log(result.data);
              res.send(result.data);
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
};
exports.createdevice = async (req, res) => {
  let company_id = req.params.company_id;
  let get = `select * from company where company_id = ${company_id}`;
  db.query(get, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      let create_by = req.body.create_by;
      let uuid = result[0].company_uuid;
      let devSn = req.body.devSn;
      let name = req.body.name;
      let accDoorNo = req.body.accDoorNo;
      let positionuuid = req.body.positionuuid;

      let count = `SELECT COUNT(device_devSn)  AS name2 FROM device WHERE device_devSn='${devSn}'`;
      db.query(count, async (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result[0].name2 >= 1) {
          console.log("มี Device อยู่แล้ว");
        }
        if (result[0].name2 == 0) {
          await axios
            .get(
              `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
            )
            .then(async (result) => {
              let key = result.data.data.accessToken;
              let createdevice = `insert into device (device_devSn,device_name,create_by) values ('${devSn}','${name}','${create_by}')`;
              db.query(createdevice, async (err, result) => {
                if (err) {
                  console.log(err);
                }
                if (result) {
                  console.log(result);
                  await axios
                    .post(
                      `${process.env.thinmoo}/devDevice/extapi/add?accessToken=${key}&devSn=${devSn}&extCommunityUuid=${uuid}&name=${name}&accDoorNo=${accDoorNo}&positionuuid=${positionuuid}`
                    )
                    .then((result) => {
                      console.log(result.data);
                      res.send(result.data);
                    });
                }
              });
            });
        }
      });
    }
  });
};
exports.removeDevice = async (req, res) => {
  let company_id = req.params.company_id;
  let get = `select * from company where company_id = ${company_id}`;
  db.query(get, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      let uuid = result[0].company_uuid;
      let devSn = req.params.devSn;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          let key = result.data.data.accessToken;
          let createdevice = `DELETE FROM device WHERE device_devSn=${devSn};`;
          db.query(createdevice, async (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              console.log(result);
        
              await axios
                .post(
                  `${process.env.thinmoo}/devDevice/extapi/delete?accessToken=${key}&devSns=${devSn}&extCommunityUuid=${uuid}`
                )
                .then((result) => {
                  console.log(result.data);
                  res.send(result.data);
                });
            }
          });
        });
    }
  });
};
