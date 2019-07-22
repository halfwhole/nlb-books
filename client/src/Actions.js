import { ago } from "./tinyAgo";

// The following functions query the NLB API
export function getNLBAvailabilities(brn) {
  return fetch('/api/nlb/availability/' + brn)
    .then(res => res.json())
}

export function getNLBTitleDetails(brn) {
  return fetch('/api/nlb/title/' + brn)
    .then(res => res.json())
}

// The following functions query the database (Records and Availabilities)
export function getRecord(brn) {
  return fetch('/api/record/' + brn)
    .then(res => res.json())
}

export function getRecords() {
  return fetch('/api/record')
    .then(res => res.json())
}

export function createRecord(brn) {
  // If record already exists, just delete it
  deleteRecord(brn);
  const titleDetails = getNLBTitleDetails(brn)
  const availabilities = getNLBAvailabilities(brn)
  return Promise.all([titleDetails, availabilities]).then((values) => {
    const titleDetails = values[0]
    const availabilities = values[1]
    // If availabilities/title details gives an error, just return
    // Format if it gives an error --- { error: true, errorMessage: ... } (test with 203004004)
    if (titleDetails.error === true || availabilities.error === true) return;
    Promise.all([createRecordOnly(brn, titleDetails)]).then(() => createAvailabilitiesOnly(brn, availabilities))
  })
}

export function deleteRecord(brn) {
  return fetch('/api/record/' + brn, { method: 'delete' })
}

export function getLibraries() {
  return fetch('/api/library')
    .then(res => res.json())
}

export function getLastUpdatedAll() {
  return fetch('/api/lastUpdatedAll')
    .then(res => res.json())
    .then(res => ago(new Date(res).getTime()));
}

export function getLastUpdated(brn) {
  return fetch('/api/lastUpdated/' + brn)
    .then(res => res.json())
    .then(res => ago(new Date(res).getTime()));
}

export function updateAvailabilities(brn) {
  const getNewAvailabilities = getNLBAvailabilities(brn)
  const deleteOldAvailabilities = fetch('/api/availability/' + brn, { method: 'delete' })
  return Promise.all([getNewAvailabilities, deleteOldAvailabilities]).then((values) => {
    const availabilities = values[0]
    createAvailabilitiesOnly(brn, availabilities)
  })
}

export function updateAllAvailabilities() {
  return getRecords().then(records => {
    return Promise.all(records.map(record => updateAvailabilities(record.brn) ))
  })
}

// Helper functions
export function createRecordOnly(brn, titleDetails) {
  return fetch('/api/record', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      brn: brn,
      title: titleDetails.TitleName,
      author: titleDetails.Author
    })
  })
}

export function createAvailabilitiesOnly(brn, availabilities) {
  return Promise.all(availabilities.map(availability => {
    return fetch('/api/availability', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        branchName: availability.BranchName,
        callNumber: availability.CallNumber,
        statusDesc: availability.StatusDesc,
        recordBrn: brn
      })
    })
  }))
}
