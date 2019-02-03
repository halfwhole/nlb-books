// This one is different from the rest: it queries NLB (should be renamed)
export function getRecord(brn, callback = () => {}) {
  fetch('/api/brn/' + brn)
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
  fetch('/api/record', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      brn: brn
    })
  }).then(callback)
}
