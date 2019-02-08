var express = require('express');
var router = express.Router();

const models = require('../models/index');
const Record = models.Record;
const Availability = models.Availability;

const { queryNLBAvailability, queryNLBTitleDetails } = require('../helpers/nlb');

// Get NLB availability (pass in BRN as param)
router.get('/nlb/availability/:brn', function(req, res) {
  const brn = req.params.brn;
  queryNLBAvailability(brn)
    .then((result) => {
      res.json(result);
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
    .then(() => res.status(201).send())
    .catch((error) => res.status(400).send(error))
});

// Get records
router.get('/record', function(req, res) {
  Record.findAll({ order: ['brn'] })
    .then((records) => res.json(records))
});

// Get record (pass in BRN as param)
router.get('/record/:brn', function(req, res) {
  const { brn } = req.params;
  Record.findOne({
    where: { brn: brn },
    include: [{ model: Availability, as: 'availabilities' }],
    order: [[{ model: Availability, as: 'availabilities' }, 'branchName']]
  }).then((result) => {
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

// Create availability (POST method, pass in details as JSON)
router.post('/availability/', function(req, res) {
  const { branchName, callNumber, statusDesc, recordBrn } = req.body;
  Availability.create({ branchName, callNumber, statusDesc, recordBrn })
    .then(() => res.status(201).send())
});

// Delete availabilities (DELETE method, pass in BRN as param)
router.delete('/availability/:brn', function(req, res) {
  const { brn } = req.params;
  Availability.destroy({ where: { recordBrn: brn } })
    .then(() => res.status(200).send())
})

module.exports = router;
