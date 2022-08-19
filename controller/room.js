const axios = require("axios");
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
exports.createRoom = async (req, res) => {
  let room_uuid = uuidv4()
  let company_id = req.params.company_id
  let room_buildingUuid = req.body.room_buildingUuid;
  let room_name = req.body.room_name;
  let code = req.body.code
  let created_by = req.body.created_by
  let get = `select * from company where company_id = ${company_id}`;
  db.query(get, async(err,result)=>{
    if(err){
      res.send(err)
    }
    if(result){
      let company_uuid = result[0].company_uuid
      let createRoom = `insert into room (room_extCommunityUuid,room_uuid,room_buildingUuid,room_name,created_by) values ('${company_uuid}','${room_uuid}','${room_buildingUuid}','${room_name}',${created_by})`;
      await axios
      .get(
        `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
      )
      .then(async (result) => {
        let accessToken = result.data.data.accessToken;
        const URI = `${process.env.thinmoo}/sqRoom/extapi/add?accessToken=${accessToken}&extCommunityUuid=${company_uuid}&buildingId=${room_buildingUuid}&name=${room_name}&code=${code}&uuid=${room_uuid}`;
        const encodedURI = encodeURI(URI);
        await axios
          .post(
            encodedURI
          )
          .then(async (result) => {
            let coludresult = result.data;
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
    }
  })

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
              `${process.env.thinmoo}/sqRoom/extapi/list?accessToken=${accessToken}&extCommunityUuid=${company_uuid}&pageSize=1000`
            )
            .then(async (result) => {
              let coludresult = result.data;
              res.send(coludresult);
            });
        });
    }
  });
};
exports.deleteroom = async (req, res) => {
  let company_id = req.params.company_id;
  let uuids = req.params.uuids
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
              `${process.env.thinmoo}/sqRoom/extapi/list?accessToken=${accessToken}&extCommunityUuid=${company_uuid}&uuids=${uuids}`
            )
            .then(async (result) => {
              let coludresult = result.data;
              res.send(coludresult);
            });
        });
    }
  });
};

exports.getoneRoom = async (req, res) => {
  let company_id = req.params.company_id;
  let uuids = req.params.uuids
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
              `${process.env.thinmoo}/sqRoom/extapi/get?accessToken=${accessToken}&extCommunityUuid=${company_uuid}&uuid=${uuids}`
            )
            .then(async (result) => {
              let coludresult = result.data;
              res.send(coludresult);
            });
        });
    }
  });
};