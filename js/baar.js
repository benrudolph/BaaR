var Baar = {}

$(document).ready(function() {

  var $panel = $('.panel');
  var $containers = $('.container');
  var $slides = $('.slide');
  var $down = $('.down');
  var windowHeight = $(window).height()
  var windowWidth = $(window).width()
  var fadePadding = .75;
  var soundOn = true;
  var EPSILON = 0.001;
  var COLORS = [
    // per slide
    [
    'rgb(240, 240, 240);', // Logo
    'rgb(150, 40, 27);', // Drama
    'rgb(10, 197, 244);', // Hope
    'rgb(230, 126, 34);', // Joy
    'rgb(31, 58, 147);', // Deep
    'rgb(0, 0, 0);', // Fear
    'rgb(48, 17, 50);', // Love
    ],
  ]
  var offsets = []
  var s;

  var opts = { formats: ['ogg', 'mp3'] };

  var sounds = new buzz.group([
    new buzz.sound("audio/silence.mp3"), // for no music
    new buzz.sound("audio/drama", opts),
    new buzz.sound("audio/hope", opts),
    new buzz.sound("audio/joy", opts),
    new buzz.sound("audio/deep", opts),
    new buzz.sound("audio/fear", opts),
    new buzz.sound("audio/love", opts),
    new buzz.sound("audio/silence.mp3"), // for no music
    new buzz.sound("audio/silence.mp3"), // for no music
    new buzz.sound("audio/silence.mp3"), // for no music
  ]);

  // Which indices are dark enough to switch color of control panel
  var darkIndices = [1, 2, 4, 5, 6];

  Baar.initElements = function () {
    windowHeight = $(window).height()
    windowWidth = $(window).width()

    $panel.css('height', windowHeight + 'px');
    $panel.css('width', windowWidth + 'px');


    $containers.css('width', $(document).width() + 'px');
    $containers.css('height', $(document).height() + 'px');

    $slides.each(function(index, element) {
      $(element).css('left', windowWidth * index + 'px');
    });

    $down.attr('data-' + windowHeight / 2, 'opacity:0');

    $containers.each(function(idx, ele) {
        var colors = COLORS[idx];
        var $container = $(ele);
        var $colorPanels = $container.find('.color-panel');
        $container.attr('data-0', 'background-color:' + colors[0]);
        $colorPanels.each(function(index, element) {
            var $wrapper = $(element).find('.text-wrapper');
            var wrapperHeight = $wrapper.height();

            if (colors[index + 1]) {
                $container.attr('data-' + (windowHeight * (index + 1)),
                    'background-color:' + colors[index + 1]);
            }
            $wrapper.css('padding-top', (windowHeight / 2 - wrapperHeight / 2) + 'px');
        });

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
    // if the slide doesn't have music, don't play any
    if (!$slides.not('.gone').hasClass('music'))
        return
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
            nextSound.play().loop()
            nextSound.setVolume(100 * (1 - percentage));
        }
      }

      if (percentage < EPSILON) {
        currSound.pause();
      }
      if (nextSound && 1 - percentage < EPSILON) {
        nextSound.pause();
      }

      // All other sounds should stop
      _.each(sounds.getSounds(), function(sound, idx) {
          if (idx !== currIndex && idx !== currIndex + 1) {
              sound.pause();
          }
      });
    }



    if (currIndex !== index) {
      currIndex = index;
      if (soundOn) {
          sounds.getSounds()[currIndex].play().loop()
      }
      Baar.setControlPanelColor(currIndex);
    }
  };



  var currIndex = 0;
  if (soundOn) {
      sounds.getSounds()[currIndex].play().loop()
  }

  $(document).on('scroll', Baar.onScroll)
  $(document).on('touchmove', Baar.onScroll)

  $(window).resize(function(e) {
    Baar.initElements();
  });

  $('.control-panel .fa').hover(
      function(e) { $(this).addClass('wobble') },
      function(e) { $(this).removeClass('wobble') }
  )

  $('.control-panel .volume').click(function(e) {
      $el = $(this);
      soundOn = !$el.hasClass('fa-volume-up')
      if (soundOn) {
          $el.removeClass('fa-volume-off').addClass('fa-volume-up');
          Baar.onScroll();
          sounds.getSounds()[currIndex].play().loop()
      } else {
          $el.removeClass('fa-volume-up').addClass('fa-volume-off');
          buzz.all().pause()
      }
  })

  $('.control-panel .info').click(function(e) {
        $('html, body').animate({
            scrollTop: $("#about").offset().top
        }, 500);
  });

  Baar.initElements();


  $panel.each(function(index, element) {
    offsets.push(s.relativeToAbsolute(element, 'top', 'bottom'))
  });

  // Have to declare in js rather than css due to glitch in skrollr library
  $containers.css('overflow-x', 'hidden');

});
