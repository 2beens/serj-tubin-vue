<template>
  <v-container fluid>
    <h5>
      Dear visitors, feel free to leave any junk messages here, and let's see if this board can be
      hacked and screwed 🤔👀🤷‍♂️
    </h5>
    <div
      id="board"
      data-app="true"
    >
      <div id="board-messages">
        <div
          v-for="message in messages"
          :key="message.id"
          class="board-message"
        >
          <div :id="'message-' + message.id">
            <p class="message-content">
              <v-btn
                v-if="theRoot.loggedIn"
                class="mx-1"
                fab
                dark
                x-small
                color="error"
                @click="deleteMessage(message.id, message.message)"
              >
                <v-icon dark>
                  mdi-minus
                </v-icon>
              </v-btn>
              <span class="message-date">{{
                getTimestampString(new Date(message.timestamp * 1000))
              }}</span>: [{{ message.author }}]
              <strong>{{ message.message }}</strong>
            </p>
          </div>
        </div>
      </div>
      <div id="board-controls">
        <input
          id="author-input"
          type="text"
          placeholder="author: anonymous"
          class="board-input"
          autocomplete="off"
        >
        <input
          id="message-input"
          type="text"
          placeholder="message ..."
          class="board-input"
          autocomplete="off"
          @keyup="sendMessage"
        >
      </div>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Board',
  data: function () {
    return {
      messages: [],
      theRoot: this.$root,
      loading: false
    }
  },
  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/board/messages/last/140')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('received null response / data messages')
          return
        }
        vm.messages = response.data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => updateMessagesScroll())
  },
  methods: {
    sendMessage() {
      if (event.keyCode !== 13) {
        return
      }

      const msgInput = document.getElementById('message-input')
      const msgContent = msgInput.value
      if (!msgContent) {
        return
      }

      const requestBody = {
        author: document.getElementById('author-input').value,
        message: msgContent
      }

      const vm = this
      axios
        .post(process.env.VUE_APP_API_ENDPOINT + '/board/messages/new', requestBody, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function (response) {
          if (response.data === null || !response.data.startsWith('added:')) {
            console.warn(response)
            // TODO: show error
            return
          }

          msgInput.value = ''
          let msgCreator = 'anon'
          if (requestBody.author) {
            msgCreator = requestBody.author
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
    },
    deleteMessage: function (id, message) {
      if (!confirm('Are you sure you want to remove message [' + id + '] [' + message + ']?')) {
        return
      }

      const vm = this
      axios
        .delete(process.env.VUE_APP_API_ENDPOINT + '/board/messages/delete/' + id, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('delete message - received null response / data')
            return
          }
          if (response.data === false) {
            console.warn('message seems like not deleted')
            return
          }
          if (response.data !== true) {
            console.error('delete message - invalid response received: ' + response.data)
            return
          }

          let removedMessageIndex = -1
          let i
          for (i = 0; i < vm.messages.length; i++) {
            if (vm.messages[i].id === id) {
              removedMessageIndex = i
              break
            }
          }

          if (removedMessageIndex >= 0) {
            vm.messages.splice(removedMessageIndex, 1)
          } else {
            console.error('failed to find deleted post')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}

function updateMessagesScroll() {
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
  background-color: #26a69a;
  color: #000000;
  border-style: groove;
  border-radius: 4px;
  box-shadow: 0px 0 6px rgba(66, 66, 66, 0.5);
  text-shadow: 1px 0 5px rgba(66, 66, 66, 0.75);
}
.board-input:focus {
  outline: none;
}
#board-messages {
  background-color: #26a69a;
  text-align: left;

  margin-left: 10%;
  margin-right: 10%;

  padding: 15px 5px 10px;

  max-height: 700px;

  border-radius: 5px;
  overflow: auto;
}
.board-message {
  margin-left: 5px;
  margin-bottom: 5px;
}
.message-content {
  padding: 0;
  margin: 0;
}
.message-date {
  background-color: #000000;
  padding: 3px;
  border-radius: 10px;
}
</style>
