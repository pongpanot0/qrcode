const axios = require("axios");
const db = require("../config/db");
const XLSX = require("xlsx");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

exports.getDevice = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
    if (err) {
      res.send(err.data);
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
              res.send(result.data);
            })
            .catch(function (error) {
              console.log(error.data);
            });
        })
        .catch(function (error) {
          console.log(error.data);
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
      let positionuuids = req.body.positionuuids;
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

              const URI = `${process.env.thinmoo}/devDevice/extapi/add?accessToken=${key}&devSn=${devSn}&extCommunityUuid=${uuid}&name=${name}&positionId=${positionuuids}&positionType=1`;
              const encodedURI = encodeURI(URI);
              await axios.post(encodedURI).then((result) => {
                console.log(result);
                if (result.data.code === 10400) {
                  res.send({
                    status: 401,
                    data: "มี Device อยู่แล้ว",
                  });
                }
                if (result.data.code === 0) {
                  let createdevice = `insert into device (device_devSn,device_name,create_by) values ('${devSn}','${name}','${create_by}')`;
                  db.query(createdevice, async (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    if (result) {
                      res.send({
                        code: 0,
                        data: result.data,
                      });
                    }
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
              await axios
                .post(
                  `${process.env.thinmoo}/devDevice/extapi/delete?accessToken=${key}&devSns=${devSn}&extCommunityUuid=${uuid}`
                )
                .then((result) => {
                  res.send(result.data);
                });
            }
          });
        });
    }
  });
};
exports.removemanyDevice = async (req, res) => {
  let company_id = req.params.company_id;
  const newObject2 = Object.assign({}, req.body.id);
  const objectArray2 = Object.entries(newObject2);

  objectArray2.forEach(([key, value]) => {
    let get = `select * from company where company_id = ${company_id}`;
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
            let key = result.data.data.accessToken;
            let createdevice = `DELETE FROM device WHERE device_devSn=${value};`;
            db.query(createdevice, async (err, result) => {
              if (err) {
                console.log(err);
              }
              if (result) {
                await axios
                  .post(
                    `${process.env.thinmoo}/devDevice/extapi/delete?accessToken=${key}&devSns=${value}&extCommunityUuid=${uuid}`
                  )
                  .then((result) => {});
              }
            });
          });
      }
    });
    res.send({
      data: 200,
    });
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

exports.restartDevice = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  const devSn = req.params.devSn;
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
              `${process.env.thinmoo}/devDevice/extapi/restart?accessToken=${AccessToken}&extCommunityUuid=${uuid}&devSns=${devSn}`
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
exports.openDevice = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  const devSn = req.params.devSn;
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
              const output = result.data.data.list;
              const data = [];
              for (let i = 0; i < output.length; i++) {
                const jsonData = [
                  {
                    name: output[i].name,
                    deviceModelName: output[i].deviceModelName,
                    positionFullName: output[i].positionFullName,
                    eventTime: output[i].eventTime,
                  },
                ];
                data.push(...jsonData);
              }
              const convertJsonToexcel2 = () => {
                const workSheet = XLSX.utils.json_to_sheet(data);
                const workBook = XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(workBook, workSheet, "Logdata");
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
exports.exportslogdevicewithdate = async (req, res) => {
  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  const startDateTime = moment(req.params.startDateTime).format(
    "YYYY-MM-DD 00:00:00"
  );

  const endDateTime = moment(req.params.endDateTime).format(
    "YYYY-MM-DD 00:00:00"
  );
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
              `${process.env.thinmoo}/normalOpenDoorlog/extapi/list?accessToken=${AccessToken}&extCommunityUuid=${uuid}&pageSize=9999&startDateTime=${startDateTime}&endDateTime=${endDateTime}`
            )
            .then(async (result) => {
              const output = result.data.data.list;
              const data = [];
              for (let i = 0; i < output.length; i++) {
                const jsonData = [
                  {
                    name: output[i].name,
                    deviceModelName: output[i].deviceModelName,
                    positionFullName: output[i].positionFullName,
                    eventTime: output[i].eventTime,
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

exports.devicegroup = async (req, res) => {
  let uuid = uuidv4();
  let company_id = req.params.company_id;
  const body = req.body;
  let created_by = "1";
  let created_at = "rest";

  const newObject2 = Object.assign({}, body.targetKeys);
  const objectArray2 = Object.entries(newObject2);
  objectArray2.forEach(([key, value]) => {
    const insertgroup = `insert into devicegroup (company_id,devicegroup_name,devicegroup_device,devicegroup_uuid,created_by,created_at) value ('${company_id}','${body.groupname}','${value}','${uuid}','${created_by}','${created_at}')`;
    db.query(insertgroup, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
      }
    });
  });
  const newObject = Object.assign({}, body.targetKeys2);
  const objectArray = Object.entries(newObject);
  objectArray.forEach(([key, value]) => {
    const updategroup = `insert into groupuser(company_id,devicegroup_id,groupuser_userid,groupuser_name,created_at,created_by) value ('${company_id}','${uuid}','${value}','${body.groupname}','${created_at}','${created_by}')`;
    db.query(updategroup, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
      }
    });
  });
};
exports.getdevicegroup = async (req, res) => {
  let id = req.params.id;
  let view = `select g.*,d.* from groupuser g left outer join devicegroup d ON (g.devicegroup_id=d.devicegroup_uuid) where g.company_id=${id} GROUP BY d.devicegroup_uuid`;
  db.query(view, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send({ data: result });
    }
  });
};
exports.getdevicegroupcompanyid = async (req, res) => {
  let id = req.params.id;
  let view = `select * from groupuser where devicegroup_id='${id}'`;
  let viewdevice = `select * from devicegroup where devicegroup_uuid='${id}'`;
  db.query(view, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      let result1 = result;
      db.query(viewdevice, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          res.send({
            count: result.length,
            data: result1,
            device: result,
          });
        }
      });
    }
  });
};
exports.deletepermisiion = async (req, res) => {
  const id = req.params.id;

  const newObject2 = Object.assign({}, req.body.moveKeys);
  const objectArray2 = Object.entries(newObject2);

  objectArray2.forEach(([key, value]) => {
    let dele = `delete  from devicegroup where devicegroup_uuid='${id}' and devicegroup_device=${value}`;
    db.query(dele, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
      }
    });
  });
};
exports.deletepermisiionuser = async (req, res) => {
  const id = req.params.id;

  const newObject2 = Object.assign({}, req.body.moveKeys);
  const objectArray2 = Object.entries(newObject2);
  objectArray2.forEach(([key, value]) => {
    let dele = `delete  from groupuser where devicegroup_id='${id}' and groupuser_userid=${value}`;
    db.query(dele, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
      }
    });
  });
};
exports.addpermision = async (req, res) => {
  const id = req.body.id;
  const newObject = Object.assign({}, req.body.targetKeys);
  const objectArray = Object.entries(newObject);
  let created_at = new Date();
  objectArray.forEach(([key, value]) => {
    const search = `SELECT COUNT(devicegroup_device) AS device FROM devicegroup WHERE devicegroup_uuid='${id}' and devicegroup_device='${value}';`;
    const insertgroup = `insert into devicegroup (company_id,devicegroup_name,devicegroup_device,devicegroup_uuid,created_by,created_at) value ('${req.body.company_id}','${req.body.groupname}','${value}','${id}','${req.body.created_by}','${created_at}')`;
    db.query(search, (err, result) => {
      if (err) {
        console.log(err);
      }

      for (i = 0; i < result.length; i++) {
        if (result[i].device > 0) {
          return;
        }
        if (result[i].device == 0) {
          db.query(insertgroup, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              return;
            }
          });
        }
      }
    });
  });
  const newObject2 = Object.assign({}, req.body.targetKeys2);
  const objectArray2 = Object.entries(newObject2);
  objectArray2.forEach(([key, value]) => {
    const search = `SELECT COUNT(groupuser_userid) AS people FROM groupuser WHERE groupuser_userid='${value}' and devicegroup_id='${id}';`;
    const updategroup = `insert into groupuser(company_id,devicegroup_id,groupuser_userid,groupuser_name,created_at,created_by) value ('${req.body.company_id}','${id}','${value}','${req.body.groupname}','${created_at}','${req.body.created_by}')`;
    db.query(search, (err, result) => {
      if (err) {
        console.log(err);
      }
      for (i = 0; i < result.length; i++) {
        if (result[i].people > 0) {
          return;
        }
        if (result[i].people == 0) {
          db.query(updategroup, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              return;
            }
          });
        }
      }
    });
  });
};
exports.editDevice = async (req, res) => {
  const id = req.params.id;
  const device_name = req.body.device_name;
  let positionuuids = req.body.positionuuids;
  let dele = `update device set device_name='${device_name}' where device_devSn='${id}'`;

  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
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
          let accessToken = result.data.data.accessToken;
          const URI = `${process.env.thinmoo}/devDevice/extapi/update?accessToken=${accessToken}&extCommunityUuid=${uuid}&devSn=${id}&name=${device_name}&positionId=${positionuuids}&positionType=1`;
          const encodedURI = encodeURI(URI);
          axios
            .post(encodedURI)
            .then(async (result) => {
              console.log(result.data);
              db.query(dele, (err, result) => {
                if (err) {
                  console.log(err);
                }
                if (result) {
                  res.send(result);
                }
              });
            });
        });
    }
  });
};
exports.getoneDevice = async (req, res) => {
  const id = req.params.id;
  const device_name = req.body.device_name;
  let dele = `update device set device_name=${device_name} where device_devSn='${id}'`;

  let company_id = req.params.company_id;
  let getbuild = `select * from company where company_id = ${company_id}`;
  db.query(getbuild, async (err, result) => {
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
          let accessToken = result.data.data.accessToken;
          axios
            .post(
              `${process.env.thinmoo}/devDevice/extapi/get?accessToken=${accessToken}&extCommunityUuid=${uuid}&devSn=${id}`
            )
            .then(async (result) => {
              res.send(result.data);
            });
        });
    }
  });
};
