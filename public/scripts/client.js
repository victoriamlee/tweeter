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


// function used to escape some text and then use it inside $()
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


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
        </article>` 
        console.log($tweet)   
  return $tweet;
};


// loops through given object to create new tweets
const renderTweets = tweets => {
  for (let tweetObj of tweets) {
  $('#posted').prepend(createTweetElement(tweetObj));
  }
}


// sends ajax request to load all tweets
const loadTweets = () => {
  $.ajax({ 
    url: '/tweets',
    method: 'GET'
  }).then((response) => {
    renderTweets(response);
  })
}

const visible = (error) => {
  if(error.is(':visible')) {
    error.slideUp("fast");
}


// used to make functions available after the document is loaded
$(document).ready(function() {


  // submit handler to listen for form submission using jQuery (listens for user to click submit tweet)
  $("#input").submit(function(event) {
    // prevents the default action to occur (specifically: refreshing the page in this case)
    event.preventDefault();
    /* if the input field is empty, then if the error message for too many character is showing, 
    then slide up the error message for too many characters */
    if ($('#tweet-text').val() === "") {
      if($('.too-long').is(':visible')) {
        $('.too-long').slideUp("fast");
      }
        $('.empty').slideDown();
      /* else if there are too many characters in input, then if error message for empty input is showing, 
      then slide up the error message for empty input */
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
      // makes ajax post request
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
