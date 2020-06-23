(function(doc, ajax) {
  'use strict';

  // Efeito de Loading na página
  function Spinner() {
    var options = {
      className: 'loading',
    }
    var wrapper = doc.querySelector('body');

    this.start = function() {
      wrapper.classList.add(options.className);
    }

    this.stop = function() {
      wrapper.classList.remove(options.className);
    }

    function initialize() {
      this.start();
    }

    initialize.apply(this);
  }

  function Tweet(attributes) {
    this.id = function() { return attributes.id; }
    this.name = function() { return attributes.name; }
    this.slug = function() { return attributes.slug; }
    this.body = function() { return attributes.body; }
    this.screenName = function() {
      return '@' + this.slug();
    }

    this.element = function() {
      var html = `<div class="feed-tweets" id="user-${this.id()}">
      <div class="feed-tweets-img">
        <i class="fa fa-user-circle"></i>
      </div>
      <div class="feed-tweets-content">
        <p class="par">${this.name()}<span class="tweet-handle">${this.screenName()}</span></p>
        <p>${this.body()}</p>
      </div>
    </div>`;
      var node = document.createElement('div');
      node.innerHTML = html;
      return node;
    }

    function initialize() {
      // After initialize callback
    }

    initialize.apply(this);
  }

  // Objeto principal que gerencia a página
  function Application(options) {
    // Variáveis Privadas
    var request = ajax({
      baseUrl: options.baseURL,
    });
    var spinner = new Spinner();
    var tweetsWrapper = doc.querySelector(options.tweetsSelector);
    var tweetFormWrapper = doc.querySelector(options.tweetFormSelector);

    // Variáveis Públicas
    function handleForm(event) {
      event.preventDefault();

      var slug = event.target.querySelector('[name="slug"]').value;
      var name = event.target.querySelector('[name="name"]').value;
      var bodyField = event.target.querySelector('[name="body"]');
      var body = bodyField.value;

      spinner.start();
      request.post('/posts', {
        slug: slug,
        name: name,
        body: body,
      }).then(function(json) {
        console.log('Post criado', json);
        var tweet = new Tweet(json);
        tweetsWrapper.prepend(tweet.element())

        spinner.stop();
        bodyField.value = '';
      });
    }

    function initializeForm() {
      tweetFormWrapper.addEventListener('submit', handleForm, false);
    }

    function loadPosts() {
      request.get('/posts').then(function(posts) {
        console.log('Posts recebido', posts);
        posts.forEach(function(json) {
          var tweet = new Tweet(json);
          tweetsWrapper.appendChild(tweet.element())
        });

        spinner.stop();
      });
    }

    function initialize() {
      initializeForm.apply(this);
      loadPosts.apply(this);
    }

    initialize.apply(this);
  }

  doc.addEventListener('DOMContentLoaded', function() {
    var app = new Application({
      baseURL: 'http://localhost:3000',
      tweetsSelector: '[data-js="tweets"]',
      tweetFormSelector: '[data-js="tweet-form"]'
    });
  });

})(document, window.ajax);