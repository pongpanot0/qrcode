const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const XLSX = require("xlsx");
exports.createbuild = async (req, res) => {
  let uuid = uuidv4();
  let name = req.body.name;
  let code = req.body.code;
  let create_by = req.body.create_by;
  let company_id = req.params.company_id;

  let select = `select * from company where company_id=${company_id}`;
  db.query(select, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      let extCommunityUuid = result[0].company_uuid;
      let createBuilding = `insert into building (build_extCommunityUuid,build_name,build_uuid,build_code,create_by) value ('${extCommunityUuid}','${name}','${uuid}','${code}',${create_by})`;
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
              const URI = `${process.env.thinmoo}/sqBuilding/extapi/add?extCommunityUuid=${extCommunityUuid}&name=${name}&uuid=${uuid}&code=${code}&accessToken=${accessToken}`;
              const encodedURI = encodeURI(URI);
              await axios.post(encodedURI).then(async (result) => {
                res.send(result.data);
              });
            });
        }
      });
    }
  });
};
exports.getbuildunit = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
    if (err) {
      console.log(err.message);
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
  let company_id = req.params.company_id;
  let uuids = req.params.uuids;
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
              `${process.env.thinmoo}/sqBuilding/extapi/get?accessToken=${accessToken}&extCommunityUuid=${company_uuid}&uuid=${uuids}`
            )
            .then(async (result) => {
              let coludresult = result.data;
              res.send(coludresult);
            });
        });
    }
  });
};

exports.deletebuilding = async (req, res) => {
  let id = req.params.id;
  let uuid = req.params.uuid;
  let getbuild = `select * from company where company_id = ${id}`;
  db.query(getbuild, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      let extCommunityUuid = result[0].company_uuid;
      await axios
        .get(
          `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
        )
        .then(async (result) => {
          let accessToken = result.data.data.accessToken;
          axios
            .post(
              `${process.env.thinmoo}/sqBuilding/extapi/delete?accessToken=${accessToken}&extCommunityUuid=${extCommunityUuid}&uuids=${uuid}`
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
exports.exportsBuilding = async (req, res) => {
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
              const output = result.data.data.list;

              const data = [];
              for (let i = 0; i < output.length; i++) {
                const jsonData = [
                  {
                    name: output[i].name,
                    roomNum: output[i].roomNum,
                    communityName: output[i].communityName,
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
            });
        });
    }
  });
};
exports.exportsBuilding2query = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  const data1 = [];
  const data2 = [];
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
              `${process.env.thinmoo}/sqBuilding/extapi/list?accessToken=${accessToken}&extCommunityUuid=${company_uuid}`
            )
            .then(async (result) => {
              await axios
                .get(
                  `${process.env.thinmoo}/sqRoom/extapi/list?accessToken=${accessToken}&extCommunityUuid=${company_uuid}&pageSize=1000`
                )
                .then(async (result) => {
                  let coludresult2 = result.data.data.list;

                  const binInfoData = coludresult2.map((doc) => doc);
                  data1.push(...binInfoData);
                });

              let coludresult = result.data;
              const binData = coludresult.data.list.map((doc) => ({
                id: doc.id,
                ...doc,
              }));
              data2.push(...binData);
            });

          //data2communuty
          //communityId46020

          const data = data2.map((bin) => {
            const det = data1.filter((doc) => doc.buildingId === bin.id);

            return { ...bin, det };
          });
          res.send(data);
        });
    }
  });
};
exports.getcommunity = async (req, res) => {
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
              `${process.env.thinmoo}//sqCommunity/extapiAdmin/get?accessToken=${accessToken}&uuid=${company_uuid}`
            )
            .then(async (result) => {
              let coludresult = result.data;
              res.send(coludresult);
            });
        });
    }
  });
};
