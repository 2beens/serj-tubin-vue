<template>
  <div id="board">
    <div id="board-messages">
    </div>
    <div id="board-controls">
      <input type="text" placeholder="author: anonymous" class="board-input" id="author-input"/>
      <input type="text" placeholder="message ..." v-on:keyup="sendMessage" class="board-input" id="message-input"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')

function addNewMessage (m) {
  const board = document.getElementById('board-messages')
  const msgTs = getTimestampString(new Date(m.timestamp * 1000))
  const msgSection = document.createElement('div')
  msgSection.setAttribute('class', 'board-message')
  msgSection.style.borderBottom = '2px solid white'
  msgSection.style.borderRadius = '2px'
  const msgNode = document.createTextNode(msgTs + ': [' + m.author + '] ' + m.message)
  msgSection.appendChild(msgNode)
  board.appendChild(msgSection)
}

export default {
  data: () => ({
    message: 'Hey!',
    loading: false
  }),
  mounted: function () {
    console.log('mounted ...')

    axios
      .get('http://localhost:9000/board/messages/last/40')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('received null response / data messages')
          return
        }

        const messages = response.data
        messages.forEach(m => {
          addNewMessage(m)
        })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => console.log('axios board messages done'))
  },
  methods: {
    sendMessage () {
      if (event.keyCode === 13) {
        const msgInput = document.getElementById('message-input')
        const msgContent = msgInput.value
        if (msgContent === '') {
          return
        }

        const msgAuthor = document.getElementById('author-input').value

        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }

        const requestBody = {
          author: msgAuthor,
          message: msgContent
        }

        axios.post(
          'http://localhost:9000/board/messages/new',
          qs.stringify(requestBody),
          config
        ).then(function (response) {
          msgInput.value = ''
          addNewMessage({
            timestamp: Math.floor(Date.now() / 1000),
            message: msgContent,
            author: msgAuthor
          })
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    clickMe () {
      this.loading = true
      this.message = 'Wait for it...'
      setTimeout(() => {
        this.loading = false
        this.message = 'Youve clicked me!'
      }, 2000)
    }
  }
}

function getTimestampString (date) {
  const hourInfo = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)

  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  const dateInfo = ('0' + d).slice(-2) + '/' + ('0' + (m + 1)).slice(-2) + '/' + y

  return dateInfo + ' ' + hourInfo
}
</script>

<style scoped>
#board-controls {
  margin-top: 10px;
  margin-bottom: 50px;
}
#author-input {
  margin-left: 10px;
  margin-right: 20px;
}
#message-input {
  min-width: 200px;
  width: 700px;
}
.board-input {
  padding: 4px;
  font-size: 18px;
  border-width: 1px;
  border-color: #f5f2f2;
  background-color: rgb(32, 185, 134);
  color: #000000;
  border-style: groove;
  border-radius: 4px;
  box-shadow: 0px 0px 6px rgba(66,66,66,.50);
  text-shadow: 1px 0px 5px rgba(66,66,66,.75);
}
.board-input:focus {
     outline:none;
}
#board-messages {
  background-color: rgb(32, 185, 134);
  text-align: left;

  margin-left: 10%;
  margin-right: 10%;
  /* margin-bottom: 20%; */

  padding-top: 15px;
  padding-bottom: 15px;
  padding-right: 5px;
  padding-left: 5px;

  max-height: 700px;

  border-radius: 5px;
  overflow: auto;
}
</style>
