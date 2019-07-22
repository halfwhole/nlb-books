const soap = require('strong-soap').soap;
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const SERVICE_URL = 'http://openweb-stg.nlb.gov.sg/ows/CatalogueService.svc?wsdl';
const CATALOGUE_URL_BASE = 'https://catalogue.nlb.gov.sg';
const CATALOGUE_URL = CATALOGUE_URL_BASE + '/cgi-bin/spydus.exe/MSGTRN/WPAC/COMB';

const API_KEY = process.env.API_KEY || require('../config/config').API_KEY;
const USE_API = process.env.USE_API || require('../config/config').USE_API;

// Returns an array of hashes, where each hash has at least these 3 keys: BranchName, CallNumber, StatusDesc
function queryNLBAvailability(brn) {
  return USE_API ? queryNLBAvailabilityAPI(brn) : queryNLBAvailabilityNoAPI(brn);
}

function queryNLBAvailabilityAPI(brn) {
  return new Promise((resolve, reject) => {
    const requestArgs = {
      GetAvailabilityInfoRequest: {
        APIKey: API_KEY,
        BID: brn,
        ISBN: "",
        Modifiers: {}
      }
    };
    soap.createClient(SERVICE_URL, {}, (err, client) => {
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

function queryNLBAvailabilityNoAPI(brn) {
  return (async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const page_content = await searchBRN(page, brn);
    const availability_url = cheerio.load(page_content)('.card-text.availability').first().find('a').attr('href');

    await page.goto(CATALOGUE_URL_BASE + availability_url);

    const availability_content = await page.content();
    const $ = cheerio.load(availability_content);

    const availabilities = $('tbody').find('tr').map(function() {
      const objects = $(this).find('td').map(function() {
       switch($(this).attr('data-caption')) {
         case 'Library':
           return { BranchName: $(this).find('a').find('span').text() };
         case 'Section/Shelf Location':
           return { ShelfLocation: $(this).find('book-location').text() };
         case 'Call Number':
           return { CallNumber: $(this).find('span').map(function() { return $(this).text(); }).get().join(' ') };
         case 'Item Status':
           return { StatusDesc: $(this).find('span').text() };
       }
      }).get();
      return objects.reduce((acc, object) => ({ ...acc, ...object }), {});
    }).get();

    await browser.close();
    return availabilities;
  })();
}

// Returns a hash with at least these 2 keys: TitleName, Author
function queryNLBTitleDetails(brn) {
  return USE_API ? queryNLBTitleDetailsAPI(brn) : queryNLBTitleDetailsNoAPI(brn);
}

function queryNLBTitleDetailsAPI(brn) {
  return new Promise((resolve, reject) => {
    const requestArgs = {
      GetTitleDetailsRequest : {
        APIKey: API_KEY,
        BID: brn,
        ISBN: ""
      }
    };
    soap.createClient(SERVICE_URL, {}, (err, client) => {
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

function queryNLBTitleDetailsNoAPI(brn) {
  return (async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const page_content = await searchBRN(page, brn);
    const details_url = cheerio.load(page_content)('.card-title').first().find('a').attr('href');

    await page.goto(CATALOGUE_URL_BASE + details_url);

    const details_content = await page.content();
    const $ = cheerio.load(details_content);

    const titleDetails = {
      TitleName: $('#divtabRECDETAILS').find('a').eq(0).find('span').text(),
      Author:    $('#divtabRECDETAILS').find('a').eq(1).find('span').text()
    }

    await browser.close();
    return titleDetails;
  })();
}

// Helper function for searching for BRN without API
function searchBRN(page, brn) {
  return (async() => {
    await page.goto(CATALOGUE_URL, { waitUntil: 'load' });
    await page.select('#ENTRY4_NAME', 'BRN');
    await page.type('#ENTRY4', brn);
    await Promise.all([page.click('#submitButton'), page.waitForNavigation()]);
    return await page.content();
  })();
}

module.exports = {
  queryNLBAvailability, queryNLBTitleDetails
}
