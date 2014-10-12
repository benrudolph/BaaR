var Baar = {}


$(document).ready(function() {

  var $panel = $('.panel');
  var $container = $('.container');
  var $slides = $('.slide');
  var windowHeight = $(window).height()
  var windowWidth = $(window).width()
  var fadePadding = .75;
  var EPSILON = 0.001;
  var COLORS = [
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
  var s;

  var sounds = new buzz.group([
    new buzz.sound("audio/0.mp3"),
    new buzz.sound("audio/1.mp3"),
    new buzz.sound("audio/2.mp3"),
    new buzz.sound("audio/3.mp3"),
    new buzz.sound("audio/4.mp3"),
    new buzz.sound("audio/5.mp3"),
    new buzz.sound("audio/6.mp3"),
  ]);

  Baar.initElements = function () {
    windowHeight = $(window).height()
    windowWidth = $(window).width()

    $panel.css('height', windowHeight + 'px');
    $panel.css('width', windowWidth + 'px');
    $panel.css('line-height', windowHeight + 'px');

    $container.css('width', $(document).width() + 'px');
    $container.css('height', $(document).height() + 'px');

    $slides.each(function(index, element) {
      $(element).css('left', windowWidth * index + 'px');
    });

    $container.attr('data-0', 'background-color:' + COLORS[0]);
    $panel.each(function(index, element) {
      $container.attr('data-' + (windowHeight * (index + 1)), 'background-color:' + COLORS[index + 1]);
    });

    s = skrollr.init({
        forceHeight: false
    });
  }





  var currIndex = 0;
  sounds.getSounds()[currIndex].play()

  $(document).on('scroll', function(e) {

    var scrollTop = $(window).scrollTop();
    var index = 0;
    var delta,
        percentage,
        currSound,
        nextSound;

    var fadeOffset = fadePadding * windowHeight

    for (var i = 0; i < offsets.length; i ++) {
      if (scrollTop < offsets[i]) {
        index = i;
        break;
      }
    }

    if (scrollTop + fadeOffset > offsets[currIndex]) {
      delta = (scrollTop + fadeOffset) - offsets[currIndex];
      percentage = 1 - (delta / fadeOffset);

      currSound = sounds.getSounds()[currIndex];
      nextSound = sounds.getSounds()[currIndex + 1];

      sounds.getSounds()[currIndex].setVolume(100 * percentage);
      console.log('setting current: ' + 100 * percentage)


      if (nextSound) {
        console.log('setting next: ' + 100 * (1 - percentage))
        nextSound.play()
        nextSound.setVolume(100 * (1 - percentage));
      }

      if (percentage < EPSILON) {
        currSound.pause();
      }
      if (nextSound && 1 - percentage < EPSILON) {
        nextSound.pause();
      }
    }



    if (currIndex !== index) {
      currIndex = index;
      sounds.getSounds()[currIndex].play()
    }

  });

  $(window).resize(function(e) {
    Baar.initElements();
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



  Baar.initElements();


  $panel.each(function(index, element) {
    offsets.push(s.relativeToAbsolute(element, 'top', 'bottom'))
  });

  // Have to declare in js rather than css due to glitch in skrollr library
  $container.css('overflow-x', 'hidden');

});
