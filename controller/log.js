const db = require('../config/db')
const axios =require('axios')
exports.getlogs = async (req, res) => {
  let id = req.params.id;
  let getbuild = `select * from company where company_id = ${id}`;
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
              `${process.env.thinmoo}/normalOpenDoorlog/extapi/list?accessToken=${accessToken}&extCommunityUuid=${company_uuid}&pageSize=1000`
            )
            .then(async (result) => {
              let coludresult = result.data;
              res.send(coludresult);
            });
        });
    }
  });
};

