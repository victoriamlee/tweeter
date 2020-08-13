/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
]


const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const createTweetElement = tweetObj => {
  const $tweet = `
  <article class="tweet">
          <div class="header">
            <div class="user">
            <img class="image" src="${escape(tweetObj.user.avatars)}">
            <span>${escape(tweetObj.user.name)}</span>
          </div>
            <span class="username">${escape(tweetObj.user.handle)}</span>
          </div>
          <div class="body">
            <span>${escape(tweetObj.content.text)}</span>
          </div>
          <div class="footer">
          <p class='date'> ${moment(tweetObj.created_at).fromNow()} </p>
            <span class="symbols">
              <span class="fab fa-font-awesome-flag"></span>
              <i class="fas fa-retweet"></i>
              <i class="fas fa-heart"></i>
            </span>
          </div>
        </article>` 
        console.log($tweet)   
  return $tweet;
};


const renderTweets = tweets => {
  for (let tweetObj of tweets) {
  $('#posted').prepend(createTweetElement(tweetObj));
  }
}


const loadTweets = () => {
  $.ajax({ 
    url: '/tweets',
    method: 'GET'
  }).then((response) => {
    renderTweets(response);
  })
}





$(document).ready(function() {


  $("#input").submit(function(event) {
    event.preventDefault();
    if ($('#tweet-text').val() === "") {
      if($('.too-long').is(':visible')) {
        $('.too-long').slideUp("fast");
      }
        $('.empty').slideDown();
    } else if ($('#tweet-text').val().length > 140){
      if($('.empty').is(':visible')) {
        $('.empty').slideUp("fast");
      }
      $('.too-long').slideDown();
    } else {
      if ($('.empty').is(':visible')) {
        $('.empty').slideUp();
      } else if ($('.too-long').is(':visible')) {
        $('.too-long').slideUp();
      }
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: $(this).serialize()
      }).then((response) => {
        loadTweets();
        $('#tweet-text').val("");
        $('.counter').text(140);
      })
    }
  })
  
  renderTweets(data);

  loadTweets();

  
  
});
