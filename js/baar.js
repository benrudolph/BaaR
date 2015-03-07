var Baar = {}

$(document).ready(function() {

  var $panel = $('.panel');
  var $colorPanels = $('.color-panel');
  var $container = $('.container');
  var $slides = $('.slide');
  var windowHeight = $(window).height()
  var windowWidth = $(window).width()
  var fadePadding = .75;
  var soundOn = true;
  var EPSILON = 0.001;
  var COLORS = [
    'rgb(0, 0, 0);', // Drama
    'rgb(10, 197, 244)', // Hope
    'rgb(43,43,130);', // Joy
    'rgb(145, 146, 152);', // Deep
    'rgb(192, 57, 43)', // Fear
    'rgb(48, 17, 50);', // Love
  ]
  var offsets = []
  var s;

  var sounds = new buzz.group([
    new buzz.sound("audio/drama.ogg"),
    new buzz.sound("audio/hope.ogg"),
    new buzz.sound("audio/joy.ogg"),
    new buzz.sound("audio/deep.ogg"),
    new buzz.sound("audio/fear.ogg"),
    new buzz.sound("audio/love.ogg"),
  ]);

  // Which indices are dark enough to switch color of control panel
  var darkIndices = [0, 1, 2, 5];

  Baar.initElements = function () {
    windowHeight = $(window).height()
    windowWidth = $(window).width()

    $panel.css('height', windowHeight + 'px');
    $panel.css('width', windowWidth + 'px');


    $container.css('width', $(document).width() + 'px');
    $container.css('height', $(document).height() + 'px');

    $slides.each(function(index, element) {
      $(element).css('left', windowWidth * index + 'px');
    });

    $container.attr('data-0', 'background-color:' + COLORS[0]);
    $colorPanels.each(function(index, element) {
        var $wrapper = $(element).find('.text-wrapper');
        var wrapperHeight = $wrapper.height();

        if (COLORS[index + 1]) {
            $container.attr('data-' + (windowHeight * (index + 1)),
                'background-color:' + COLORS[index + 1]);
        }
        $wrapper.css('padding-top', (windowHeight / 2 - wrapperHeight / 2) + 'px');
    });

    Baar.setControlPanelColor(currIndex);
    s = skrollr.init({
        forceHeight: false
    });
  }

  Baar.setControlPanelColor = function(index) {
      if (darkIndices.indexOf(index) !== -1) {
        $('.control-panel').addClass('control-panel-light');
      } else {
        $('.control-panel').removeClass('control-panel-light');
      }
  }


  Baar.onScroll = function() {
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
      // console.log('setting current: ' + 100 * percentage)


      if (nextSound) {
        // console.log('setting next: ' + 100 * (1 - percentage))
        if (soundOn) {
            nextSound.play()
            nextSound.setVolume(100 * (1 - percentage));
        }
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
      if (soundOn) {
          sounds.getSounds()[currIndex].play()
      }
      Baar.setControlPanelColor(currIndex);
    }
  };



  var currIndex = 0;
  if (soundOn) {
      sounds.getSounds()[currIndex].play()
  }

  $(document).on('scroll', Baar.onScroll)

  $(window).resize(function(e) {
    Baar.initElements();
  });

  $('.next').click(function(e) {

    $slides.removeClass('gone');
    if (_.any($slides, function(slide) { return $(slide).offset().left > 0 })) {
      $slides.each(function(index, element) {
        var currLeft = $(element).offset().left
        var newLeft = currLeft - windowWidth;
        $(element).css('left', newLeft + 'px');
        if (newLeft !== 0) {
            $(element).addClass('gone');
        }
      });
    }

  });

  $('.prev').click(function(e) {
    $slides.removeClass('gone');
    if (_.any($slides, function(slide) { return $(slide).offset().left < 0 })) {
      $slides.each(function(index, element) {
        var currLeft = $(element).offset().left
        $(element).css('left', currLeft + windowWidth + 'px');
      });
    }
  });

  $('.fa').hover(
      function(e) { $(this).addClass('wobble') },
      function(e) { $(this).removeClass('wobble') }
  )

  $('.control-panel .volume').click(function(e) {
      $el = $(this);
      soundOn = !$el.hasClass('fa-volume-up')
      if (soundOn) {
          $el.removeClass('fa-volume-off').addClass('fa-volume-up');
          Baar.onScroll();
          sounds.getSounds()[currIndex].play()
      } else {
          $el.removeClass('fa-volume-up').addClass('fa-volume-off');
          buzz.all().pause()
      }
  })

  Baar.initElements();


  $panel.each(function(index, element) {
    offsets.push(s.relativeToAbsolute(element, 'top', 'bottom'))
  });

  // Have to declare in js rather than css due to glitch in skrollr library
  $container.css('overflow-x', 'hidden');

});
