<template>
  <div id="board">
    <h5>Let's see if this board can be hacked and screwed 🤔👀🤷‍♂️</h5>
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

// TODO: make configurable
// const host = 'https://www.serj-tubin.com'
const host = 'http://localhost:9000'

export default {
  data: () => ({
    message: 'Hey!',
    loading: false
  }),
  mounted: function () {
    axios
      .get(host + '/board/messages/last/140')
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
      .finally(() => updateMessagesScroll())
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

        const requestBody = {
          author: msgAuthor,
          message: msgContent
        }

        axios
          .post(
            host + '/board/messages/new',
            qs.stringify(requestBody))
          .then(function (response) {
            msgInput.value = ''
            addNewMessage({
              timestamp: Math.floor(Date.now() / 1000),
              message: msgContent,
              author: msgAuthor
            })
          })
          .catch(function (error) {
            console.log(error)
          })
          .finally(() => updateMessagesScroll())
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

function updateMessagesScroll () {
  const messagesBoard = document.getElementById('board-messages')
  messagesBoard.scrollTop = messagesBoard.scrollHeight
}

function addNewMessage (m) {
  const msgTs = getTimestampString(new Date(m.timestamp * 1000))

  const msgSection = document.createElement('div')
  msgSection.setAttribute('class', 'board-message')
  msgSection.style.borderBottom = '2px solid white'
  msgSection.style.borderRadius = '2px'

  const msgNode = document.createTextNode(msgTs + ': [' + m.author + '] ' + m.message)
  msgSection.appendChild(msgNode)

  document.getElementById('board-messages').appendChild(msgSection)
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
