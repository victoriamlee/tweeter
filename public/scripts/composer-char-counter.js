// avoid errors with $ for eslint
/* eslint-env jquery, browser */

// used to make functions available after the document is loaded
$(document).ready(function() {

  // event handler for keyup event using jQuery
  $('#tweet-text').on('keyup', function(event) {
    const typed = $(this).val().length;
    const counter = $(this).closest('.new-tweet').find('.counter');
    counter.val(140 - typed);
    $(this).closest('.new-tweet').find('.counter').each(function() {
      if (typed > 140) {
        $(counter).addClass('NEGATIVE');
      } else {
        $(counter).removeClass('NEGATIVE');
      }
    });
  });
});