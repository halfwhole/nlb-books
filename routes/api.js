var express = require('express');
var router = express.Router();

const soap = require('strong-soap').soap;
const url = "http://openweb-stg.nlb.gov.sg/ows/CatalogueService.svc?wsdl";
const { api_key } = process.env.API_KEY || require('../API_KEY');

const models = require('../models/index');
const Record = models.Record;

function queryBRNAvailability(brn) {
  return new Promise((resolve, reject) => {
    const requestArgs = {
      GetAvailabilityInfoRequest: {
        APIKey: api_key,
        BID: brn,
        ISBN: "",
        Modifiers: {}
      }
    };
    soap.createClient(url, {}, (err, client) => {
      const method = client['CatalogueService']['BasicHttpBinding_ICatalogueService']['GetAvailabilityInfo'];
      method(requestArgs, (err, result, envelope, soapHeader) => {
        // TODO: error handling. If cannot connect to server...
        if (err) { reject(err) }
        // TODO: error handling. If result.Status is fail, should reject & send error message
        // console.log('result: ' + JSON.stringify(result));
        resolve(result.Items.Item);
      })
    })
  });
}

function queryBRNTitleDetails(brn) {
  return new Promise((resolve, reject) => {
    const requestArgs = {
      GetTitleDetailsRequest : {
        APIKey: api_key,
        BID: brn,
        ISBN: ""
      }
    };
    soap.createClient(url, {}, (err, client) => {
      const method = client['CatalogueService']['BasicHttpBinding_ICatalogueService']['GetTitleDetails'];
      method(requestArgs, (err, result, envelope, soapHeader) => {
        // TODO: error handling
        if (err) { reject(err) }
        resolve(result.TitleDetail);
      })
    });
  });
}

function filterAvailableBooks(result) {
  return result.filter(book => book.StatusCode == "S");
}

// Get availability (pass in BRN as param)
router.get('/brn/availability/:brn', function(req, res) {
  const brn = req.params.brn;
  queryBRNAvailability(brn)
    .then((result) => {
      res.json(filterAvailableBooks(result));
    })
});

// Get title details (pass in BRN as param)
router.get('/brn/title/:brn', function(req, res) {
  const brn = req.params.brn;
  queryBRNTitleDetails(brn)
    .then((result) => {
      res.json(result);
    })
});

// Create record (POST method, pass in details as JSON)
router.post('/record', function(req, res) {
  const { brn, title, author } = req.body;
  Record.create({ brn, title, author })
    .then((record) => res.status(201).send(record))
    .catch((error) => res.status(400).send(error))
});

// Get records
router.get('/record', function(req, res) {
  Record.findAll()
    .then((records) => res.json(records))
});

// Get record (pass in BRN as param)
router.get('/record/:brn', function(req, res) {
  Record.findOne({ where: { brn: req.params.brn } })
    .then((result) => res.status(200).send(result))
});

// Delete record (DELETE method, pass in BRN as param)
router.delete('/record/:brn', function(req, res) {
  Record.destroy({ where: { brn: req.params.brn } })
    .then(() => res.status(200).send())
});

module.exports = router;
