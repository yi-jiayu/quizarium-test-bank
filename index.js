import Fuse from 'fuse.js'
import Vue from 'vue';
import debounce from 'debounce';
import questions from './questions.json'

const randomQuestion = questions[Math.floor(Math.random() * questions.length)].q;

const fuse = new Fuse(questions, {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "q",
  ]
});

new Vue({
  el: '#app',
  data: {
    query: randomQuestion,
    results: fuse.search(randomQuestion).slice(0, 10),
  },
  watch: {
    query: debounce(function () {
      this.updateResults();
    }, 200),
  },
  methods: {
    updateResults: function () {
      this.results = fuse.search(this.query).slice(0, 10);
    },
  },
});
