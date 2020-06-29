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
      var html = `<div class="feed-tweets" id="tweet-${this.id()}">
      <div class="tweet-actions">
        <i class="fa fa-edit" title="Editar" data-js="edit-tweet" data-tweet-id="${this.id()}"></i>
        <i class="fa fa-trash" title="Remover" data-js="remove-tweet" data-tweet-id="${this.id()}"></i>
      </div>
      <div class="feed-tweets-img">
        <i class="fa fa-user-circle"></i>
      </div>
      <div class="feed-tweets-content">
        <p class="par">${this.name()}
          <span class="tweet-handle">${this.screenName()}</span>
        </p>
        <p id="tweet-body-${this.id()}">${this.body()}</p>
        <div class="edit-tweet-form" data-js="edit-tweet-form" data-target="#tweet-body-${this.id()}">
          <textarea>${this.body()}</textarea>
          <button>Atualizar</button>
        </div>
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
    var tweetsWrapper = doc.querySelector('[data-js="' + options.tweetsSelectorID + '"]');
    var newTweetFormWrapper = doc.querySelector('[data-js="' + options.newTweetFormSelectorID + '"]');

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

    function initializeForms() {
      newTweetFormWrapper.addEventListener('submit', handleForm, false);
    }

    function handleRemoveTweet(e) {
      e.preventDefault();
      var tweetID = e.target.dataset.tweetId;
      console.log('Remover Post', tweetID);

      spinner.start()
      request.delete('/posts/' + tweetID).then(function(response) {
        console.log('Posts removido', response);
        tweetsWrapper.querySelector('#tweet-' + tweetID).remove();
        spinner.stop()
      });
    }

    function handleEditTweet(e) {
      e.preventDefault();
      var tweetID = e.target.dataset.tweetId;
      console.log('Editar Post', tweetID);

      var activeClass = 'active';
      var wrapper = tweetsWrapper.querySelector('#tweet-' + tweetID + ' [data-js="' + options.editTweetFormSelectorID + '"]');
      var btn = wrapper.querySelector('button');
      var input = wrapper.querySelector('textarea');
      var bodyWrapper = tweetsWrapper.querySelector(wrapper.dataset.target);

      wrapper.classList.add(activeClass);
      btn.addEventListener('click', function(ev) {
        ev.preventDefault();
        spinner.start()
        var data = {
          body: input.value,
          slug: newTweetFormWrapper.querySelector('[name="slug"]').value,
          name: newTweetFormWrapper.querySelector('[name="name"]').value,
        }
        request.put('/posts/' + tweetID, data).then(function(response) {
          console.log('Posts atualizado', response);
          bodyWrapper.innerHTML = input.value;
          spinner.stop()
        });

        wrapper.classList.remove(activeClass)
      });
    }

    function initializeLinks() {
      doc.addEventListener('click', function(e) {
        if (!e.target || !e.target.dataset || !e.target.dataset.js) { return }

        switch (e.target.dataset.js) {
          case options.removeTweetLinkSelectorID:
            handleRemoveTweet.apply(this, [e]);
            break;
          case options.editTweetLinkSelectorID:
            handleEditTweet.apply(this, [e]);
            break;
          default:
            break;
        }

      }.bind(this));
    }

    function loadContent() {
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
      initializeForms.apply(this);
      initializeLinks.apply(this);
      loadContent.apply(this);
    }

    initialize.apply(this);
  }

  doc.addEventListener('DOMContentLoaded', function() {
    var _app = new Application({
      baseURL: 'http://localhost:3000',
      tweetsSelectorID: 'tweets',
      newTweetFormSelectorID: 'new-tweet-form',
      editTweetFormSelectorID: 'edit-tweet-form',
      editTweetLinkSelectorID: 'edit-tweet',
      removeTweetLinkSelectorID: 'remove-tweet',
    });
  });

})(document, window.ajax);