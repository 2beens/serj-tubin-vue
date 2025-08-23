<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="board-header">
          <v-icon color="primary" class="mr-2">mdi-message-text-outline</v-icon>
          <h2>Visitor Board</h2>
        </div>
        <h5 class="board-subtitle">Feel free to leave your message here 💌</h5>

        <div id="board" data-app="true">
          <div id="board-messages" class="board-messages">
            <div
              v-for="message in messages"
              :key="message.id"
              class="board-message"
            >
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
                  <v-icon dark>mdi-minus</v-icon>
                </v-btn>
                <span class="message-date">
                  {{ getTimestampString(new Date(message.created_at)) }}
                </span>
                <span class="message-author">[{{ message.author }}]</span>
                <strong class="message-text">{{ message.message }}</strong>
              </p>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <div id="board-controls" class="board-controls-sticky">
      <input
        v-model="authorInput"
        type="text"
        placeholder="author: anonymous"
        class="board-input"
        autocomplete="off"
      />
      <input
        v-model="messageInput"
        type="text"
        placeholder="message ..."
        class="board-input message-input"
        autocomplete="off"
        @keyup.enter="sendMessage"
      />
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VisitorBoardView',
  data() {
    return {
      messages: [],
      theRoot: this.$root,
      loading: false,
      authorInput: '',
      messageInput: '',
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
    async sendMessage(event) {
      if (event.keyCode !== 13 || !this.messageInput) {
        return
      }

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_ENDPOINT}/board/messages/new`,
          {
            author: this.authorInput || 'anonymous',
            message: this.messageInput,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (response.data?.startsWith('added:')) {
          const newMessageId = response.data.split(':')[1]
          this.messages.push({
            id: newMessageId,
            created_at: Date.now(),
            message: this.messageInput,
            author: this.authorInput || 'anonymous',
          })
          this.messageInput = '' // Clear the message input after sending
          this.updateMessagesScroll()
        } else {
          console.warn('Invalid response:', response)
        }
      } catch (error) {
        console.error('Error sending message:', error)
      }
    },
    deleteMessage: function (id, message) {
      if (
        !confirm(
          'Are you sure you want to remove message [' +
            id +
            '] [' +
            message +
            ']?'
        )
      ) {
        return
      }

      const vm = this
      axios
        .delete(
          process.env.VUE_APP_API_ENDPOINT + '/board/messages/delete/' + id,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
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
            console.error(
              'delete message - invalid response received: ' + response.data
            )
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
    },
  },
}

function updateMessagesScroll() {
  const messagesBoard = document.getElementById('board-messages')
  messagesBoard.scrollTop = messagesBoard.scrollHeight
}
</script>

<style scoped>
.board-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #007acc;
}

/* Theme-aware header colors */
.theme--light .board-header {
  color: #1976d2;
}

.theme--light .board-header h2 {
  color: #1976d2;
}

.board-subtitle {
  color: #4fc3f7;
  margin-bottom: 20px;
  text-align: center;
}

/* Theme-aware subtitle color */
.theme--light .board-subtitle {
  color: #1976d2;
}

.board-messages {
  background-color: rgba(0, 122, 204, 0.1);
  text-align: left;
  margin: 0 10%;
  padding: 20px;
  max-height: calc(100vh - 300px);
  border-radius: 8px;
  overflow: auto;
  margin-bottom: 120px;
}

/* Theme-aware board messages */
.theme--light .board-messages {
  background-color: rgba(25, 118, 210, 0.05);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.board-message {
  margin-bottom: 6px;
  transition: all 0.2s ease;
}

.board-message:hover {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

/* Theme-aware hover effects */
.theme--light .board-message:hover {
  background: rgba(25, 118, 210, 0.08);
  border-radius: 4px;
}

.message-content {
  padding: 8px;
  margin: 0;
}

.message-date {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9em;
  color: #4fc3f7;
}

/* Theme-aware message date */
.theme--light .message-date {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976d2;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.message-author {
  color: #007acc;
  margin: 0 8px;
}

/* Theme-aware message author */
.theme--light .message-author {
  color: #1976d2;
}

.message-text {
  margin-left: 4px;
}

/* Theme-aware message text */
.theme--light .message-text {
  color: #212121;
}

.board-controls-sticky {
  position: fixed;
  bottom: 52px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 20px;
  text-align: center;
  border-top: 1px solid rgba(79, 195, 247, 0.3);
  z-index: 99;
}

/* Theme-aware controls */
.theme--light .board-controls-sticky {
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(25, 118, 210, 0.3);
}

.board-input {
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid rgba(79, 195, 247, 0.5);
  background-color: rgba(0, 122, 204, 0.15);
  color: #ffffff;
  border-radius: 4px;
  margin: 0 8px;
  transition: all 0.2s ease;
  box-shadow: 0 0 0 1px rgba(79, 195, 247, 0.1);
}

.board-input:focus {
  outline: none;
  border-color: #4fc3f7;
  background-color: rgba(0, 122, 204, 0.25);
  box-shadow: 0 0 0 2px rgba(79, 195, 247, 0.2);
}

.board-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Theme-aware input fields */
.theme--light .board-input {
  border: 1px solid rgba(25, 118, 210, 0.5);
  background-color: rgba(25, 118, 210, 0.05);
  color: #212121;
  box-shadow: 0 0 0 1px rgba(25, 118, 210, 0.1);
}

.theme--light .board-input:focus {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.theme--light .board-input::placeholder {
  color: rgba(33, 33, 33, 0.6);
}

.message-input {
  min-width: 300px;
  width: 50%;
}

/* Custom scrollbar */
#board-messages::-webkit-scrollbar {
  width: 8px;
}

#board-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

#board-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 122, 204, 0.3);
  border-radius: 4px;
}

#board-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 122, 204, 0.5);
}
</style>
