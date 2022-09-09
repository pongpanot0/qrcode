const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");


exports.getdevice = async (req, res) => {
  let user_id = 19;
  let get = `select * from user where user_id = ${user_id}`;
  db.query(get, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      let uuid = result[0].uuid;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          await axios
            .post(
              `${process.env.thinmoo}/devDevice/extapi/list?accessToken=${result.data.data.accessToken}&extCommunityUuid=${uuid}`
            )
            .then((result) => {
              res.send(result.data);
            });
        });
    }
  });
};
exports.opendoorwithapp = async (req, res) => {
  let user_id = 19;
  let get = `select * from user where user_id = ${user_id}`;
  db.query(get, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
  
      let uuid = result[0].uuid;
      let devSn = 4280784269;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          await axios
            .post(
              `${process.env.thinmoo}/sqDoor/extapi/remoteOpenDoor?accessToken=${result.data.data.accessToken}&extCommunityUuid=${uuid}&devSn=${devSn}`
            )
            .then((result) => {
              res.send(result.data);
            });
        });
    }
  });
};

exports.createqrcodevisitor = async (req, res) => {
  let user_id = 4;
  let get = `select * from user where user_id = ${user_id}`;
  db.query(get, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
  
      let uuid = result[0].uuid;
      let devSn = 4280784269;
      let usableCount = req.body.usableCount;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          await axios
            .post(
              `${process.env.thinmoo}/accVisitorTempPwd/extapi/add?accessToken=${result.data.data.accessToken}&extCommunityUuid=${uuid}&devSns=${devSn}&usableCount=${usableCount}&startDate=2022-08-04 12:00:00&endDate=2022-08-08 16:25:00`
            )
            .then((result) => {
              res.send(result.data);
            });
        });
    }
  });
};
exports.createqrcodeemployee = async (req, res) => {
  let user_id = 4;
  let get = `select * from user where user_id = ${user_id}`;
  db.query(get, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {

      let uuid = result[0].uuid;
      let devSn = 4280784269;
      let usableCount = req.body.usableCount;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          await axios
            .post(
              `${process.env.thinmoo}/accVisitorTempPwd/extapi/add?accessToken=${result.data.data.accessToken}&extCommunityUuid=${uuid}&devSns=${devSn}&usableCount=999999&startDate=2022-08-04 12:00:00&endDate=2022-08-08 16:25:00`
            )
            .then((result) => {
              res.send(result.data);
            });
        });
    }
  });
};
exports.getcommunity = async (req, res) => {
  let company_id = req.params.company_id;
  let get = `select * from company where company_id = ${company_id}`;
  db.query(get, async (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      let uuid = result[0].company_uuid;

      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          let token = result.data.data.accessToken;

          await axios
            .get(
              `${process.env.thinmoo}/sqBuilding/extapi/list?accessToken=${token}&extCommunityUuid=${uuid}`
            )
            .then((result) => {
              res.send(result.data);
            });
        });
    }
  });
};
