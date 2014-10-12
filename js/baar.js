var Baar = {}

$(document).ready(function() {

  var $panel = $('.panel');
  var $container = $('.container');
  var $slides = $('.slide');
  var windowHeight = $(window).height()
  var windowWidth = $(window).width()
  var colors = [
    'rgb(0,0,255);',
    'rgb(0,255,0);',
    'rgb(100,0,0);',
    'rgb(50,0,255);',
    'rgb(100,255,255);',
    'rgb(0,255,255);',
    'rgb(0,255,255);',
    'rgb(100,255,255);',
    'rgb(50,0,255);',
  ]
  var offsets = []

  var sounds = new buzz.group([
    new buzz.sound("audio/0.mp3"),
    new buzz.sound("audio/1.mp3"),
    new buzz.sound("audio/2.mp3"),
    new buzz.sound("audio/3.mp3"),
    new buzz.sound("audio/4.mp3"),
    new buzz.sound("audio/5.mp3"),
    new buzz.sound("audio/6.mp3"),
  ]);

  $panel.css('height', windowHeight + 'px');
  $panel.css('width', $(window).width() + 'px');
  $panel.css('line-height', windowHeight + 'px');




  $container.attr('data-0', 'background-color:' + colors[0]);
  $container.css('width', $(document).width() + 'px');
  $container.css('height', $(document).height() + 'px');

  $slides.each(function(index, element) {
    $(element).css('left', windowWidth * index + 'px');

  });

  $panel.each(function(index, element) {

    $container.attr('data-' + (windowHeight * (index + 1)), 'background-color:' + colors[index + 1]);
  });


  var currIndex = 0;
  sounds.getSounds()[currIndex].play()

  $(document).on('scroll', function(e) {

    var scrollTop = $(window).scrollTop();
    var index = 0;

    for (var i = 0; i < offsets.length; i ++) {
      if (scrollTop < offsets[i]) {
        index = i;
        break;
      }
    }

    if (currIndex !== index) {
      sounds.getSounds()[currIndex].pause()
      currIndex = index;
      sounds.getSounds()[currIndex].play()
    }

  });

  $('.next').click(function(e) {

    if (_.any($slides, function(slide) { return $(slide).offset().left > 0 })) {
      $slides.each(function(index, element) {
        var currLeft = $(element).offset().left
        $(element).css('left', currLeft - windowWidth + 'px');
      });
    }

  });

  $('.prev').click(function(e) {
    if (_.any($slides, function(slide) { return $(slide).offset().left < 0 })) {
      $slides.each(function(index, element) {
        var currLeft = $(element).offset().left
        $(element).css('left', currLeft + windowWidth + 'px');
      });
    }
  });




  var s = skrollr.init({
      forceHeight: false
  });

  $panel.each(function(index, element) {
    offsets.push(s.relativeToAbsolute(element, 'top', 'bottom'))
  });

});
