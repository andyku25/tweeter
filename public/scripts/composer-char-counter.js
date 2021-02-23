$(document).ready(function() {
  $("#tweet-text").on("input", function() {
    console.log(this);
    const textArea = $(this).val();
    const $parent = $(this).closest("div");
    const $counterOutput = $parent.find(".counter");
    
    let charCount = 140 - textArea.length;

    if (charCount < 0) {
      $counterOutput.addClass("negative-count");
    } else {
      $counterOutput.removeClass("negative-count");
    }
    
    $counterOutput.text(charCount);
  })
}); // document ready

