<template>
  <div id="board">
    <div id="board-messages">
      somebody1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum, dui vel tristique convallis, leo lorem faucibus lorem, a molestie mauris est sed magna. Sed ac ipsum sed elit bibendum blandit. Nam convallis egestas sem, nec scelerisque risus hendrerit tempor. Vivamus magna urna, auctor ut turpis quis, ornare lacinia nunc. Mauris eget pellentesque lacus, ultricies venenatis erat. Vestibulum dictum sapien non tortor efficitur, vel auctor erat finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus.
      <hr />ass2: Phasellus eros risus, bibendum sit amet egestas id, venenatis in turpis. Pellentesque gravida, nibh quis rutrum lobortis, sem diam pulvinar lorem, vitae lobortis diam sapien eget ante. Proin aliquam lobortis dui. Nullam posuere felis enim, et molestie lectus facilisis sit amet. Duis finibus nisl quis sapien faucibus tincidunt. Nulla finibus erat ut euismod pretium. Sed imperdiet, magna ut euismod finibus, turpis urna aliquet libero, quis tempus neque odio sit amet lorem. Nam mauris diam, vehicula quis nunc non, ultrices efficitur justo. Vestibulum ut odio elementum, dictum elit vitae, porttitor augue. Praesent aliquet facilisis mauris, ac pulvinar magna rutrum non. Aenean et neque non eros commodo efficitur.
      <hr />dickhead3: Aliquam dictum imperdiet quam, eu bibendum ex dapibus in. Pellentesque vel orci arcu. Quisque convallis, lectus sed sollicitudin cursus, urna eros tincidunt lorem, pharetra lacinia dolor sapien eu purus. Vestibulum quam est, condimentum sit amet leo sit amet, semper dapibus massa. Fusce quis nisi rutrum, commodo lacus nec, tristique felis. Etiam accumsan tellus id libero cursus, vel suscipit risus fermentum. Aenean placerat congue massa, vehicula feugiat leo suscipit ut. Nam a arcu neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
      <hr />somebody1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum, dui vel tristique convallis, leo lorem faucibus lorem, a molestie mauris est sed magna. Sed ac ipsum sed elit bibendum blandit. Nam convallis egestas sem, nec scelerisque risus hendrerit tempor. Vivamus magna urna, auctor ut turpis quis, ornare lacinia nunc. Mauris eget pellentesque lacus, ultricies venenatis erat. Vestibulum dictum sapien non tortor efficitur, vel auctor erat finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus.
      <hr />ass2: Phasellus eros risus, bibendum sit amet egestas id, venenatis in turpis. Pellentesque gravida, nibh quis rutrum lobortis, sem diam pulvinar lorem, vitae lobortis diam sapien eget ante. Proin aliquam lobortis dui. Nullam posuere felis enim, et molestie lectus facilisis sit amet. Duis finibus nisl quis sapien faucibus tincidunt. Nulla finibus erat ut euismod pretium. Sed imperdiet, magna ut euismod finibus, turpis urna aliquet libero, quis tempus neque odio sit amet lorem. Nam mauris diam, vehicula quis nunc non, ultrices efficitur justo. Vestibulum ut odio elementum, dictum elit vitae, porttitor augue. Praesent aliquet facilisis mauris, ac pulvinar magna rutrum non. Aenean et neque non eros commodo efficitur.
      <hr />dickhead3: Aliquam dictum imperdiet quam, eu bibendum ex dapibus in. Pellentesque vel orci arcu. Quisque convallis, lectus sed sollicitudin cursus, urna eros tincidunt lorem, pharetra lacinia dolor sapien eu purus. Vestibulum quam est, condimentum sit amet leo sit amet, semper dapibus massa. Fusce quis nisi rutrum, commodo lacus nec, tristique felis. Etiam accumsan tellus id libero cursus, vel suscipit risus fermentum. Aenean placerat congue massa, vehicula feugiat leo suscipit ut. Nam a arcu neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
      <hr />somebody1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum, dui vel tristique convallis, leo lorem faucibus lorem, a molestie mauris est sed magna. Sed ac ipsum sed elit bibendum blandit. Nam convallis egestas sem, nec scelerisque risus hendrerit tempor. Vivamus magna urna, auctor ut turpis quis, ornare lacinia nunc. Mauris eget pellentesque lacus, ultricies venenatis erat. Vestibulum dictum sapien non tortor efficitur, vel auctor erat finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus.
      <hr />ass2: Phasellus eros risus, bibendum sit amet egestas id, venenatis in turpis. Pellentesque gravida, nibh quis rutrum lobortis, sem diam pulvinar lorem, vitae lobortis diam sapien eget ante. Proin aliquam lobortis dui. Nullam posuere felis enim, et molestie lectus facilisis sit amet. Duis finibus nisl quis sapien faucibus tincidunt. Nulla finibus erat ut euismod pretium. Sed imperdiet, magna ut euismod finibus, turpis urna aliquet libero, quis tempus neque odio sit amet lorem. Nam mauris diam, vehicula quis nunc non, ultrices efficitur justo. Vestibulum ut odio elementum, dictum elit vitae, porttitor augue. Praesent aliquet facilisis mauris, ac pulvinar magna rutrum non. Aenean et neque non eros commodo efficitur.
      <hr />dickhead3: Aliquam dictum imperdiet quam, eu bibendum ex dapibus in. Pellentesque vel orci arcu. Quisque convallis, lectus sed sollicitudin cursus, urna eros tincidunt lorem, pharetra lacinia dolor sapien eu purus. Vestibulum quam est, condimentum sit amet leo sit amet, semper dapibus massa. Fusce quis nisi rutrum, commodo lacus nec, tristique felis. Etiam accumsan tellus id libero cursus, vel suscipit risus fermentum. Aenean placerat congue massa, vehicula feugiat leo suscipit ut. Nam a arcu neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
    </div>
    <div id="board-controls">
      <input type="text" placeholder="author: anonymous" class="board-input" id="author"/>
      <input type="text" placeholder="message ..." v-on:keyup="sendMessage" class="board-input" id="message"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')

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

        const board = document.getElementById('board-messages')
        board.innerHTML = ''

        console.log(response.data)
        const messages = response.data
        messages.forEach(m => {
          console.log(m)
          const msgNode = document.createTextNode(m.author + ': ' + m.message)
          board.appendChild(msgNode)
          board.appendChild(document.createElement('hr'))
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
        const msgInput = document.getElementById('message')
        const msgContent = msgInput.value
        if (msgContent === '') {
          return
        }

        const msgAuthor = document.getElementById('author').value

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
          console.log(response)
          msgInput.value = ''
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
</script>

<style scoped>
#board-controls {
  margin-top: 10px;
  margin-bottom: 50px;
}
#author {
  margin-left: 10px;
  margin-right: 20px;
}
#message {
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
