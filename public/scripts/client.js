/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// append data to the articles section
const createTweetElement = tweetObj => {
  return `<article class="tweet">
    <header>
      <div class="tweet-profile-details">
        <img class="tweet-img" src="${tweetObj.user.avatars}" alt="${tweetObj.user.handle}">
        <span>${tweetObj.user.name}</span>
      </div> 
      <div class="username">
        ${tweetObj.user.handle}
      </div>
    </header>
    <div class="tweet-content">
      ${tweetObj.content.text}
    </div>
    <hr class="tweet-row">
    <footer>
      <small>${tweetObj.created_at}</small>
      <div>
        <i class="far fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="far fa-heart"></i>
      </div>
    </footer>
  </article>`;
};

const renderTweets = tweetObjs => {
  let allTweets = "";
  for (const tweetObj of tweetObjs) {
    allTweets += createTweetElement(tweetObj);
  }
  $("#tweets-container").append(allTweets);
};

$(document).ready(function() {
  // empty the tweets-container
  $("tweets-container").empty();
  
  const loadTweets = () => {
    $.ajax({
      method: "GET",
      url: "http://localhost:8080/tweets"
    })
    .done(data => {
      $("#tweets-container").empty();
      renderTweets(data);
    })
    .fail(err => {
      console.log(err);
    })
    .always(() => {
      console.log("Tweets loaded")
    })
  };
  loadTweets();
  // Handling new post  submissions
  $("#new-tweet").on("submit", function(event) {
    event.preventDefault();
    let $textarea = $(this).find("textarea");
    const $tweetContent = $textarea.serialize();
    console.log($tweetContent);
    
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $tweetContent
    })
    .done((data) => {
      console.log(data);
      loadTweets();
    })
    .fail((err) => {
      console.log(err);
    })
    .always(() => {
      console.log("Complete");
    })
    
    // make the textarea box back to blank once form is submitted
    $textarea.val("");
  });

  // Test Method: add tweetsObjs from json file
  // const tweetsData = [
  //   {
  //     "user": {
  //       "name": "Newton",
  //       "avatars": "https://i.imgur.com/73hZDYK.png",
  //       "handle": "@SirIsaac"
  //     },
  //     "content": {
  //       "text": "If I have seen further it is by standing on the shoulders of giants"
  //     },
  //     "created_at": 1614014982252
  //   },
  //   {
  //     "user": {
  //       "name": "Descartes",
  //       "avatars": "https://i.imgur.com/nlhLi3I.png",
  //       "handle": "@rd"
  //     },
  //     "content": {
  //       "text": "Je pense , donc je suis"
  //     },
  //     "created_at": 1614101382252
  //   }
  // ];

  // renderTweets(tweetsData);
  
  // Future Method: get tweet object data via ajax
  // $.ajax({
  //   url,
  //   method: "GET"
  // })  
});