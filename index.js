import Vue from 'vue';

// Check if the Web Workers API is supported
const worker = !!window.Worker;

// Dynamically load these things only if Web Workers are not supported
let Fuse;
let debounce;
let questions;
let fuse;
if (!worker) {
  Fuse = require('fuse.js');
  debounce = require('debounce');
  questions = require('./questions.json');

  fuse = new Fuse(questions, {
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
}

// Send the query to a worker to be processed
function updateResultsAsync(query) {
  this.$worker.postMessage(query);
}

// Do the search in the main thread
function updateResultsSync(query) {
  this.results = fuse.search(query).slice(0, 10);
}

// Pick the implementation to use based on whether workers are supported
const updateResults = worker ?
    updateResultsAsync :
    // Need to debounce if we are doing the searching in the main thread
    debounce(updateResultsSync, 200);

new Vue({
  el: '#app',
  data: {
    query: '',
    results: [],
  },
  watch: {
    query: updateResults,
  },
  methods: {
    reset: function () {
      this.query = '';
      this.$refs.queryInput.focus();
    },
    blur: function (e) {
      e.target.blur();
    }
  },
  mounted() {
    if (worker) {
      // Initialise the worker
      this.$worker = new Worker('worker.js');
      this.$worker.onmessage = msg => {
        // The first message from the worker is the initial query and results to show
        const {query, results} = msg.data;
        this.query = query;
        this.results = results;
        // Change the onmessage handler to just update the results
        this.$worker.onmessage = msg => {
          this.results = msg.data;
        }
      }
    } else {
      // Initialise the initial query and results
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)].q;
      this.query = randomQuestion;
      this.results = fuse.search(randomQuestion).slice(0, 10);
    }
  }
});
