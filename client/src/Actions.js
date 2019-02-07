// The following functions query the NLB API
export function getNLBAvailabilities(brn) {
  return fetch('/api/nlb/availability/' + brn)
    .then(res => res.json())
}

export function getNLBTitleDetails(brn) {
  return fetch('/api/nlb/title/' + brn)
    .then(res => res.json())
}

// The following functions query Record from the database
export function getRecord(brn) {
  return fetch('/api/record/' + brn)
    .then(res => res.json())
}

export function getRecords() {
  return fetch('/api/record')
    .then(res => res.json())
}

export function createRecord(brn) {
  // TODO: please refactor me (split into smaller methods)
  // TODO: validate that BRN is unique
  const titleDetails = getNLBTitleDetails(brn)
  const availabilities = getNLBAvailabilities(brn)
  return Promise.all([titleDetails, availabilities]).then((values) => {
    // TODO: error handling --- if result.error, then ...
    const titleDetails = values[0]
    const availabilities = values[1]
    return fetch('/api/record', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        brn: brn,
        title: titleDetails.TitleName,
        author: titleDetails.Author
      })
    }).then(() => {
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
    })
  })
}

export function deleteRecord(brn) {
  return fetch('/api/record/' + brn, { method: 'delete' })
}
