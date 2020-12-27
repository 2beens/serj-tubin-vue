<template>
  <div id="board">
    <h5>Let's see if this board can be hacked and screwed 🤔👀🤷‍♂️</h5>
    <div id="board-messages">
      <div class="board-message" v-for="message in messages" :key="message.id">
        <div v-bind:id="'message-' + message.id">
          <p class="message-content"><span class="message-date">{{ getTimestampString(new Date(message.timestamp * 1000)) }}</span>: [{{ message.author }}] <strong>{{ message.message }}</strong></p>
        </div>
      </div>
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

export default {
  data: () => ({
    message: 'Hey!',
    messages: [],
    loading: false
  }),
  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/board/messages/last/140')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('received null response / data messages')
          return
        }
        vm.messages = response.data
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

        const vm = this
        axios
          .post(
            process.env.VUE_APP_API_ENDPOINT + '/board/messages/new',
            qs.stringify(requestBody))
          .then(function (response) {
            if (response.data === null || !response.data.startsWith('added:')) {
              console.warn(response)
              // TODO: show error
              return
            }

            msgInput.value = ''
            let msgCreator = 'anon'
            if (msgAuthor !== '') {
              msgCreator = msgAuthor
            }

            const newMessageId = response.data.split(':')[1]
            vm.messages.push({
              id: newMessageId,
              timestamp: Math.floor(Date.now() / 1000),
              message: msgContent,
              author: msgCreator
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
  background-color: #26A69A;
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
  background-color: #26A69A;
  text-align: left;

  margin-left: 10%;
  margin-right: 10%;
  /* margin-bottom: 20%; */

  padding-top: 15px;
  padding-bottom: 10px;
  padding-right: 5px;
  padding-left: 5px;

  max-height: 700px;

  border-radius: 5px;
  overflow: auto;
}
.board-message {
  margin-left: 15px;
  margin-bottom: 5px;
}
.message-content {
  padding: 0px;
  margin: 0px;
}
.message-date{
  background-color: #000000;
  padding: 3px;
  border-radius: 10px;
}
</style>
