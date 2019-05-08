
import helper from 'matrix-js-helper'

export default (homeserver) => {
  return load('matrix-sdk_1.0.1.min.js')
  // eslint-disable-next-line
  .then(() => helper(matrixcs)) // loaded by browser script tag
  .then(connect(homeserver))
  .then(matrix => {
    matrix.send = (roomId) => (data) => { // currying...
      const debugText = formatMsg(matrix.getUserId(), data)
      data.sync = 1
      data.updated = 0
      return matrix.sendEvent(roomId, 'm.room.message', {
        data, body: '',
        msgtype: 'm.text',
        formatted_body: debugText,
        format: 'org.matrix.custom.html'
      })
    }
    return matrix
  })
}

const load = (javascript) => {
  return new Promise((win, fail) => {
    const script = document.createElement('script')
    script.setAttribute('src', javascript)
    document.head.appendChild(script)
    script.onerror = fail
    script.onload = win
  })
}

const connect = (homeserver) => (sdk) => {
  let token = JSON.parse(window.sessionStorage.getItem('matrix'))
  if (!token) {
    return sdk.registerUser(homeserver, random(), random())
    .then(t => {
      window.sessionStorage.setItem('matrix', JSON.stringify(t))
      return sdk
    })
    .then(connect(homeserver))
  } else { // reuse stored credentials
    return sdk.getClient(token)
  }
}

const random = () => Math.random().toString(36).replace(/[^a-z]+/g, '')

const formatMsg = (user, data) => {
  const verb = data.updated ? (data.show ? 'updated' : 'deleted') : 'created'
  return `<p><a href="https://matrix.to/#/${user}">${user}</a>
    <em>${verb}</em> ToDo: <strong>${data.title}</strong></p>
    <pre><code class="language-json">${JSON.stringify(data, 0, 2)}</code></pre>`
}
