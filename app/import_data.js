'use strict'

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
const { Matches } = require('./lib/models/index');
const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');
const { MatchSchema } = require('./lib/schemas/index');

let filename = "./matches2d4c40a.csv";

const readCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const result = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', function(data) {
        if(data) {
          result.push(data);
        }
      })
      .on('end', function() {
        console.log(`Count of docs :`, result.length);
        return resolve(result);
      })
      .on('error', function(error) {
        console.log(error);
        reject(error);
      })
  })
}

const validateDatas = async (datas) =>{
  let validationErrors = [];
  for(let i=0; i< datas.length; i++) {
    if(datas[i].date.includes('/')) {
      let split = datas[i].date.split('/');
      let dd = split[0];
      let mm = split[1];
      datas[i].date = datas[i].season+"-"+mm+"-"+dd;
    }
    datas[i].city = datas[i].city == "Bangalore" ? "Bengaluru": datas[i].city
    let options = { abortEarly: false };
    const {error, result} = await MatchSchema.validate(datas[i], options);
    if(error) {
      let validationError = { id: datas[i].id};
      let errors = error.details.map(detail => {
        return detail.message;
      });
      validationError.errors = errors;
      validationErrors.push(validationError)
    }
  }
  return validationErrors;
}
const uploadIPLdata = async (filename) => {
  try {
    let datas = await readCSV(filename);
    let validationErrors = await validateDatas(datas);
    if(validationErrors.length > 0) {
      console.log(`Data is not proper for ${validationErrors.length} records`);
      fs.writeFileSync(__dirname+"/validationErrors.json", JSON.stringify(validationErrors, undefined, 4));
    } else {
      console.log("Data validated successfully");
      console.log("Inserting data into DB")
      await Matches.insertMany(datas);
    }
  } catch(error) {
    console.log("Data upload failed");
    console.log(error);
  }
  process.exit(0);
}

uploadIPLdata(filename);