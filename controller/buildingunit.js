const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
exports.createbuild = async (req, res) => {
  let extCommunityUuid = req.body.extCommunityUuid;
  let uuid = uuidv4();
  let name = req.body.name;
  let code = req.body.code;
  let createBuilding = `insert into building (build_extCommunityUuid,build_name,build_uuid,build_code) value ('${extCommunityUuid}','${name}','${uuid}','${code}')`;
  db.query(createBuilding, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          let accessToken = result.data.data.accessToken;
          await axios
            .get(
              `${process.env.thinmoo}/sqBuilding/extapi/add?extCommunityUuid=${extCommunityUuid}&name=${name}&uuid=${uuid}&code=${code}&accessToken=${accessToken}`
            )
            .then(async (result) => {
              res.send(result.data);
            });
        });
    }
  });
};
exports.getbuildunit = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
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
          let accessToken = result.data.data.accessToken;
          axios
            .get(
              `${process.env.thinmoo}/sqBuilding/extapi/list?accessToken=${accessToken}&extCommunityUuid=${uuid}`
            )
            .then(async (result) => {
              res.send({
                data: result.data,
              });
            });
        });
    }
  });
};
exports.getonebuildunit = async (req, res) => {
  let id = req.params.id;
  let getbuild = `select * from building where id = ${id}`;
  db.query(getbuild, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(result[0].uuid);
      let extCommunityUuid = result[0].extCommunityUuid;
      let uuid = result[0].uuid;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          let accessToken = result.data.data.accessToken;
          axios
            .get(
              `${process.env.thinmoo}/sqBuilding/extapi/get?accessToken=${accessToken}&extCommunityUuid=${extCommunityUuid}&uuid=${uuid}`
            )
            .then(async (result) => {
              res.send({
                data: result.data,
              });
            });
        });
    }
  });
};
