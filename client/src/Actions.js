// The following functions query the NLB API
export function getNLBAvailability(brn, callback = () => {}) {
  fetch('/api/nlb/availability/' + brn)
    .then(res => res.json())
    .then(callback)
}

export function getNLBTitleDetails(brn, callback = () => {}) {
  fetch('/api/nlb/title/' + brn)
    .then(res => res.json())
    .then(callback)
}

// The following functions query Record from the database
export function getRecord(brn, callback = () => {}) {
  fetch('/api/record/' + brn)
    .then(res => res.json())
    .then(callback)
}

export function getRecords(callback = () => {}) {
  fetch('/api/record')
    .then(res => res.json())
    .then(callback)
}

export function createRecord(brn, callback = () => {}) {
  // TODO: validate that BRN is unique
  getNLBTitleDetails(brn, (result) => {
    // TODO: error handling --- if result.error, then ...
    fetch('/api/record', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        brn: brn,
        title: result.TitleName,
        author: result.Author
      })
    }).then(callback)
  });
}

export function deleteRecord(brn, callback = () => {}) {
  fetch('/api/record/' + brn, { method: 'delete' })
    .then(callback)
}
