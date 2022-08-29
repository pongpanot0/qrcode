const axios = require("axios");
const db = require("../config/db");
const XLSX = require("xlsx");
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

      let count = `SELECT COUNT(device_devSn)  AS name2 FROM device WHERE device_devSn='${devSn}'`;
      db.query(count, async (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result[0].name2 >= 1) {
          res.send({
            status: 400,
            data: "มี Device อยู่แล้ว",
          });
        }
        if (result[0].name2 == 0) {
          await axios
            .get(
              `${process.env.thinmoo}/platCompany/extapi/getAccessToken?appId=7ba40b7c8f88492aa8afe5aad19fc0a4&appSecret=7cd85e69b6a18e62985f463fa67c4088`
            )
            .then(async (result) => {
              let key = result.data.data.accessToken;
              const URI = `${process.env.thinmoo}/devDevice/extapi/add?accessToken=${key}&devSn=${devSn}&extCommunityUuid=${uuid}&name=${name}&accDoorNo=${accDoorNo}`;
              const encodedURI = encodeURI(URI);
              await axios.post(encodedURI).then((result) => {
                console.log(result.data);
                res.send(result.data);
              });
              let createdevice = `insert into device (device_devSn,device_name,create_by) values ('${devSn}','${name}','${create_by}')`;
              db.query(createdevice, async (err, result) => {
                if (err) {
                  console.log(err);
                }
                if (result) {
                  console.log(result);
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
exports.exportsDevice = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
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
              console.log(result.data.data.list);
              const output = result.data.data.list;
              const data = [];
              for (let i = 0; i < output.length; i++) {
                const jsonData = [
                  {
                    name: output[i].name,
                    deviceModelName: output[i].deviceModelName,
                    positionFullName: output[i].positionFullName,
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
exports.getDeviceLenght = async (req, res) => {
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
              res.send(result.data.data);
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
exports.openDevice = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  const devSn = req.params.devSn;
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
              `${process.env.thinmoo}/sqDoor/extapi/remoteOpenDoor?accessToken=${AccessToken}&extCommunityUuid=${uuid}&devSn=${devSn}`
            )
            .then(async (result) => {
              res.send({
                status: 200,
                data: result.data,
              });
              return;
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
exports.ConfigDevice = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  const devSn = req.params.devSn;
  const devAccSupperPassword = req.params.devAccSupperPassword;
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
              `${process.env.thinmoo}/devDevice/extapi/updateParams?accessToken=${AccessToken}&extCommunityUuid=${uuid}&devSn=${devSn}&devAccSupperPassword=${devAccSupperPassword}`
            )
            .then(async (result) => {
              res.send({
                status: 200,
                data: result.data,
              });
              return;
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
exports.getLogDevice = async (req, res) => {
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
              `${process.env.thinmoo}/normalOpenDoorlog/extapi/list?accessToken=${AccessToken}&extCommunityUuid=${uuid}&pageSize=9999`
            )
            .then(async (result) => {
              res.send({
                status: 200,
                data: result.data,
              });
              return;
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
exports.exportslogdevice = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
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
              `${process.env.thinmoo}/normalOpenDoorlog/extapi/list?accessToken=${AccessToken}&extCommunityUuid=${uuid}&pageSize=9999`
            )
            .then(async (result) => {
              console.log(result.data.data.list);
              const output = result.data.data.list;
              const data = [];
              for (let i = 0; i < output.length; i++) {
                const jsonData = [
                  {
                    name: output[i].name,
                    deviceModelName: output[i].deviceModelName,
                    positionFullName: output[i].positionFullName,
                    eventTime:output[i].eventTime
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
