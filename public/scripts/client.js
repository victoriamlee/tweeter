/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// avoid errors with $ for eslint
/* eslint-env jquery, browser */

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
];


// function used to avoid XSS (Cross-Site Scripting)
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


// creates new tweet
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
        </article>`;
  return $tweet;
};


// loops through given object to create new tweets
const renderTweets = tweets => {
  for (let tweetObj of tweets) {
    $('#posted').prepend(createTweetElement(tweetObj));
  }
};


// sends ajax request to load all tweets
const loadTweets = () => {
  $.ajax({
    url: '/tweets',
    method: 'GET'
  }).then((response) => {
    renderTweets(response);
  });
};


// checks to see if either error message is visible, if so then hides the error message
const visible = () => {
  if ($('.empty').is(':visible')) {
    $('.empty').slideUp("fast");
  } else if ($('.too-long').is(':visible')) {
    $('.too-long').slideUp("fast");
  }
};

// checks to see if input is empty
const empty = () => {
  if ($('#tweet-text').val() === "") {
    visible();
    return true;
  } else {
    return false;
  }
}

// const isThereError = () => {
//   if ($('#tweet-text').val() === "") {
//     visible();
//     $('.empty').slideDown();
//   } else if ($('#tweet-text').val().length > 140) {
//     visible();
//     $('.too-long').slideDown();
//   }
// }


// used to make functions available after the document is loaded
$(document).ready(function() {

  // submit handler to listen for form submission using jQuery (listens for user to click submit tweet)
  $("#input").submit(function(event) {
    event.preventDefault();
    if (empty()) {
      // visible();
      $('.empty').slideDown();
    } else if ($('#tweet-text').val().length > 140) {
      visible();
      $('.too-long').slideDown();
    } else {
      visible();
      // makes ajax post request
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: $(this).serialize()
      }).then((response) => {
        loadTweets();
        $('#tweet-text').val("");
        $('.counter').text(140);
      });
    }
  });
  
  renderTweets(data);

  loadTweets();
});