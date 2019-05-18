<template>
  <main class="container my-3">
    <div class="form-group">
      <div class="form-group">
        <label for="query">Search {{numQuestions}} questions</label>
        <textarea class="form-control" id="query" placeholder="Type to search"
                  v-model.trim="query" v-on:keyup.enter="blur" ref="queryInput"></textarea>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-warning" v-on:click="reset">Reset</button>
        <button class="btn btn-secondary ml-1" v-on:click="random">Random</button>
      </div>
    </div>

    <div class="list-group">
      <div class="list-group-item" v-for="r in results">
        <p class="mb-1">{{r.q}}</p>
        <small>{{r.a}}</small>
      </div>
    </div>
  </main>
</template>

<script>
  import Fuse from 'fuse.js'
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

  export default {
    data() {
      return {
        numQuestions: questions.length,
        query: randomQuestion,
        results: fuse.search(randomQuestion).slice(0, 10),
      }
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
      reset: function () {
        this.query = '';
        this.$refs.queryInput.focus();
      },
      blur: function (e) {
        e.target.blur();
      },
      random: function () {
        this.query = questions[Math.floor(Math.random() * questions.length)].q;
      },
    },
  };
</script>