var express = require('express');
var router = express.Router();

const soap = require('strong-soap').soap;
const url = "http://openweb-stg.nlb.gov.sg/ows/CatalogueService.svc?wsdl";
const { API_KEY } = process.env || require('../API_KEY');

const models = require('../models/index');
const Record = models.Record;
const Availability = models.Availability;

function queryNLBAvailability(brn) {
  return new Promise((resolve, reject) => {
    const requestArgs = {
      GetAvailabilityInfoRequest: {
        APIKey: API_KEY,
        BID: brn,
        ISBN: "",
        Modifiers: {}
      }
    };
    soap.createClient(url, {}, (err, client) => {
      if (client === undefined) {
        reject(new Error("Could not connect to NLB client")); return;
      }
      const method = client['CatalogueService']['BasicHttpBinding_ICatalogueService']['GetAvailabilityInfo'];
      method(requestArgs, (err, result, envelope, soapHeader) => {
        // console.log('RESULT: ' + JSON.stringify(result));
        if (err) {
          reject(err);
        } else if (result.Status == "FAIL") {
          reject(new Error("NLB item with BRN " + brn + " does not exist"));
        } else if (result.Status == "OK") {
          resolve(result.Items.Item);
        }
      })
    })
  });
}

function queryNLBTitleDetails(brn) {
  return new Promise((resolve, reject) => {
    const requestArgs = {
      GetTitleDetailsRequest : {
        APIKey: API_KEY,
        BID: brn,
        ISBN: ""
      }
    };
    soap.createClient(url, {}, (err, client) => {
      if (client === undefined) {
        reject(new Error("Could not connect to NLB client")); return;
      }
      const method = client['CatalogueService']['BasicHttpBinding_ICatalogueService']['GetTitleDetails'];
      method(requestArgs, (err, result, envelope, soapHeader) => {
        if (err) {
          reject(err);
        } else if (result.Status == "FAIL") {
          reject(new Error("NLB item with BRN " + brn + " does not exist"));
        } else if (result.Status == "OK") {
          resolve(result.TitleDetail);
        }
      })
    });
  });
}

function filterAvailableBooks(result) {
  return result.filter(book => book.StatusCode == "S");
}

// Get NLB availability (pass in BRN as param)
router.get('/nlb/availability/:brn', function(req, res) {
  const brn = req.params.brn;
  queryNLBAvailability(brn)
    .then((result) => {
      res.json(filterAvailableBooks(result));
    })
    .catch((error) => res.status(400).send({ error: true, errorMessage: error.message }));
});

// Get NLB title details (pass in BRN as param)
router.get('/nlb/title/:brn', function(req, res) {
  const brn = req.params.brn;
  queryNLBTitleDetails(brn)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.status(400).send({ error: true, errorMessage: error.message }));
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
  const { brn } = req.params;
  Record.findOne({ where: { brn: brn }, include: [{ model: Availability, as: 'availabilities' }] })
    .then((result) => {
      if (result === null) res.status(400).send({ error: true, errorMessage: "Record with BRN " + brn + " does not exist" });
      else res.status(200).send(result);
    })
});

// Delete record (DELETE method, pass in BRN as param)
router.delete('/record/:brn', function(req, res) {
  const { brn } = req.params;
  Record.destroy({ where: { brn: brn } })
    .then(() => res.status(200).send())
});

module.exports = router;
