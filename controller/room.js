const axios = require("axios");
const db = require("../config/db");
exports.createRoom = async (req, res) => {
  let room_extCommunityUuid = req.body.room_extCommunityUuid;
  let room_uuid = req.body.room_uuid;
  let room_buildingUuid = req.body.room_buildingUuid;
  let room_name = req.body.room_name;
  let createRoom = `insert into room (room_extCommunityUuid,room_uuid,room_buildingUuid,room_name) values ('${room_extCommunityUuid}','${room_uuid}','${room_buildingUuid}','${room_name}')`;
  await axios
    .get(
      `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
    )
    .then(async (result) => {
      let accessToken = result.data.data.accessToken;
      console.log(result.data.data.accessToken);
      await axios
        .post(
          `${process.env.thinmoo}/sqRoom/extapi/add?accessToken=${accessToken}&extCommunityUuid=${room_extCommunityUuid}&buildingUuid=${room_buildingUuid}&name=${room_name}`
        )
        .then(async (result) => {
          let coludresult = result.data;
          console.log(result.data);
          db.query(createRoom, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              res.send(coludresult);
            }
          });
        });
    });
};
exports.getRoom = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      let company_uuid = result[0].company_uuid;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          let accessToken = result.data.data.accessToken;
          await axios
            .get(
              `${process.env.thinmoo}/sqRoom/extapi/list?accessToken=${accessToken}&extCommunityUuid=${company_uuid}`
            )
            .then(async (result) => {
              let coludresult = result.data;
              res.send(coludresult);
            });
        });
    }
  });
};
