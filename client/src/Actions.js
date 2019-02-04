// The following functions query the NLB database
export function getBRNAvailability(brn, callback = () => {}) {
  fetch('/api/brn/availability/' + brn)
    .then(res => res.json())
    .then(callback)
}

export function getBRNTitleDetails(brn, callback = () => {}) {
  fetch('/api/brn/title/' + brn)
    .then((result) => result.json())
    .then(callback)
}

// The following functions query the record directly (from database)
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

export function deleteRecord(brn, callback = () => {}) {
  fetch('/api/record/' + brn, { method: 'delete' })
    .then(callback)
}

export function createRecord(brn, callback = () => {}) {
  getBRNTitleDetails(brn, (titleDetails) => {
    fetch('/api/record', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        brn: brn,
        title: titleDetails.TitleName,
        author: titleDetails.Author
      })
    }).then(callback)
  });
}
