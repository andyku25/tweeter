/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  // empty the tweets-container
  $("#tweets-container").empty();
  

  // Initial Load
  const loadTweets = () => {
    $.ajax({
      method: "GET",
      url: "http://localhost:8080/tweets"
    })
      .done(data => {
        $("#tweets-container").empty();
        data.sort((a, b) => b.created_at - a.created_at);
        renderTweets(data);
      })
      .fail(err => {
        console.log(err);
      })
      .always(() => {
        console.log("Tweets loaded");
      });
  };
  loadTweets();


  // Toggle the compose new tweet section display
  $(".nav-compose").on("click", toggleCompose);


  // Handling new tweet submissions
  $("#new-tweet").on("submit", function(event) {
    $(".err-msg").slideUp(30);
    event.preventDefault();

    let $textarea = $(this).find("textarea");
    const $tweetLength = $textarea.val().length;
    const $tweetContent = $textarea.serialize();
    
    if (!$tweetLength) {
      $(".err-msg").text("❗ Error: Cannot have an empty tweet");
      $(".err-msg").slideDown();
    } else if ($tweetLength > 140) {
      $(".err-msg").text("❗ Error: Your tweet is greater than the 140 character limit");
      $(".err-msg").slideDown();
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: $tweetContent
      })
        .done((data) => {
          console.log(data);
          loadTweets();
          $(".counter").text(140);
        })
        .fail((err) => {
          console.log(err);
        })
        .always(() => {
          console.log("Complete");
        });

      // make the textarea box back to blank once form is submitted
      $textarea.val("");
    }
  });


  // Display the "move to top" clickable icon
  $(window).on("scroll", () => {
    if (document.documentElement.scrollTop > 0) {
      $(".page-top").addClass("show");
    } else {
      $(".page-top").removeClass("show");
    }
  });


  // click event on the scroll to top icon
  $(".page-top").on("click", window.scrollTo(0, 0));
});



// Helper functions
// compile all tweets and add to HTML
const renderTweets = tweetObjs => {
  let allTweets = "";
  for (const tweetObj of tweetObjs) {
    allTweets += createTweetElement(tweetObj);
  }
  $("#tweets-container").append(allTweets);
};


// Create the new tweet element
const createTweetElement = tweetObj => {
  // Check XSS and escape
  const time = getTimeElapsed(tweetObj);

  // Method #1: jquery .text
  // console.log($("<div>").text(tweetObj.content.text)[0].innerHTML);

  // Method #2: using escape function
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const safeHTML = escape(tweetObj.content.text);

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
      ${safeHTML}
    </div>
    <hr class="tweet-row">
    <footer>
      <small>${time}</small>
      <div>
        <i class="far fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="far fa-heart"></i>
      </div>
    </footer>
  </article>`;
};


// append data to the articles section
const getTimeElapsed = tweetObj => {
  const currentTime = Date.now();
  const timeElapsed = (currentTime - tweetObj.created_at) / 1000;
  
  if (timeElapsed < 60) {
    return `${Math.floor(timeElapsed)} seconds ago`;
  } else if (timeElapsed < 3600) {
    return `${Math.floor(timeElapsed / 60)} minutes ago`;
  } else if (timeElapsed < 86400) {
    return `${Math.floor(timeElapsed / 3600)} hours ago`;
  } else if (timeElapsed < 604600) {
    return `${Math.floor(timeElapsed / 86400)} days ago`;
  } else if (timeElapsed < 2929743) {
    return `${Math.floor(timeElapsed / 604600)} weeks ago`;
  } else if (timeElapsed < 31556926) {
    return `${Math.floor(timeElapsed / 2929743)} months ago`;
  } else {
    return `${Math.floor(timeElapsed / 31556926)} years ago`;
  }
};


// compose new tweet animation/toggle display
const toggleCompose = () => {
  $("#new-tweet").slideToggle();
  $("#tweet-text").focus();
};
