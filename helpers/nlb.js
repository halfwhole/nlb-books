const soap = require('strong-soap').soap;
const URL = "http://openweb-stg.nlb.gov.sg/ows/CatalogueService.svc?wsdl";
const API_KEY = process.env.API_KEY || require('../API_KEY').API_KEY;

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
    soap.createClient(URL, {}, (err, client) => {
      if (client === undefined) {
        reject(new Error("Could not connect to NLB client")); return;
      }
      const method = client['CatalogueService']['BasicHttpBinding_ICatalogueService']['GetAvailabilityInfo'];
      method(requestArgs, (err, result, envelope, soapHeader) => {
        if (err) {
          reject(err);
        } else if (result.Status == "ERROR") {
          reject(new Error("NLB API key invalid or not found"));
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
    soap.createClient(URL, {}, (err, client) => {
      if (client === undefined) {
        reject(new Error("Could not connect to NLB client")); return;
      }
      const method = client['CatalogueService']['BasicHttpBinding_ICatalogueService']['GetTitleDetails'];
      method(requestArgs, (err, result, envelope, soapHeader) => {
        if (err) {
          reject(err);
        } else if (result.Status == "ERROR") {
          reject(new Error("NLB API key invalid or not found"));
        } else if (result.Status == "FAIL") {
          reject(new Error("NLB item with BRN " + brn + " does not exist"));
        } else if (result.Status == "OK") {
          resolve(result.TitleDetail);
        }
      })
    });
  });
}

module.exports = {
  queryNLBAvailability, queryNLBTitleDetails
}
