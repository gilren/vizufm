import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import Firebase from 'firebase'

let config = {
  apiKey: 'AIzaSyCKj9-Tu5AymRR3y0VTpPKbu535NMW8VlE',
  authDomain: 'vizufm.firebaseapp.com',
  databaseURL: 'https://vizufm.firebaseio.com',
  storageBucket: 'vizufm.appspot.com'
}
// firebase.initializeApp(config)

let firebase = Firebase.initializeApp(config)
console.log(firebase)

Vue.use(VueResource)

'use strict'
/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
