<template>
<div id="main">
  <h3> [ {{ state }} ] </h3>
  <img v-if="state != 'matrix'"
     src="./assets/loading.gif" />
  <ul>
    <li>
      <input type="text" v-model="title" @keyup.enter="add"/>
      <button class="add" @click="add">NEW</button>
    </li>
    <transition-group name="fade" :duration="270">
    <li v-for="todo in list" :key="todo.title"
      :class="todo.status" @click="done(todo)">
      {{ todo.title }}
      <img v-show="todo.sync" class="sync"
            src="./assets/dots.svg"/>
      <button @click.stop="remove(todo)">
        <img src="./assets/remove.png"/>
      </button>
    </li>
    </transition-group>
  </ul>
</div>
</template>

<script>
import matrix from './matrix'

export default {
  data () {
    return {
      latest: '',
      state: 'connecting...',
      todos: {},
      title: ''
    }
  },
  computed: {
    list () {
      return Object.values(this.todos)
      .filter(t => t.show && t.title)
      .sort((a, b) => b.updated - a.updated)
      .sort((a, b) => b.status.localeCompare(a.status))
    }
  },
  methods: {
    add () {
      if (this.title.length === 0) return
      const todo = {
        title: this.title, status: 'todo',
        show: 0, sync: 1,
        created: Date.now(),
        updated: Date.now()
      }
      this.$set(this.todos, todo.title, todo)
      this.$nextTick(() => {
        todo.show = true
        this.send(todo)
      })
      this.title = ''
    },
    done (todo) {
      if (todo.status === 'todo') {
        todo.status = 'done'
      } else {
        todo.status = 'todo'
      }
      todo.updated = Date.now()
      this.send({...todo})
    },
    remove (todo) {
      todo.status = 'done'
      this.$nextTick(() => {
        todo.show = false
        this.send({...todo})
      })
    }
  },
  async created() {
    const mx = await matrix('fairteil.de')
    this.state = 'matrix'
    const name = window.location.hash || '#test'
    mx.findOrCreateRoom(name).then(room => {
      document.title = '2nix ' + room.name
      this.send = mx.send(room.roomId)
      mx.keepRoomInSync(room)
    }).catch(e => console.log('ERROR', e))
    mx.on('data', (todo) => {
      if (!this.todos[todo.title] || // new OR newer version
        this.todos[todo.title].updated < todo.updated) {
          todo.sync = 0 // hide syncing progress dots
          this.$set(this.todos, todo.title, todo)
        }
      })
    mx.on('sync', (state) => {
      if (state === 'SYNCING') {
        this.state = 'matrix'
      } else {
        this.state = state
      }
    })
  }
}
</script>

<style>
@font-face {
  font-family: 'Indie Flower';
  src: local('Indie Flower'), local('IndieFlower'), url("./assets/indie_flower.woff2") format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2212, U+2215;
}
#main {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: .1em;
}
ul {
  padding: 0;
}
li {
  font-family: "Indie Flower";
  background-color: lightgrey;
  margin: .2em;
  padding-left: .4em;
  font-size: 2.3em;
  display: flex;
  justify-content: space-between;
}
li:hover {
  background-color: #42b983;
  cursor: pointer;
}
li:active {
  background-color: #42b9ff;
}
li.done {
  text-decoration: line-through;
}
.sync {
  margin: .6em;
  height: .3em;
}
input {
  width: 68%;
  font-family: "Indie Flower";
  font-size: 1em;
}
button {
  border: 0;
  color: white;
  border-radius: .1em;
  margin-left: 1.3em;
  background-color: darkgrey;
}
button:hover {
  background-color: grey;
}
button:active {
  background-color: black;
}
button.add {
  width: 10em
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
