import Fuse from 'fuse.js';
import questions from './questions.json';

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

const randomQuestion = questions[Math.floor(Math.random() * questions.length)].q;
self.postMessage({
  query: randomQuestion,
  results: fuse.search(randomQuestion).slice(0, 10),
});

self.onmessage = function (msg) {
  const query = msg.data;
  const results = fuse.search(query).slice(0, 10);
  self.postMessage(results);
};