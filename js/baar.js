var Baar = {}

$(document).ready(function() {

  var $panel = $('.panel');
  var $container = $('.container');
  var windowHeight = $(window).height()
  var colors = [
    'rgb(0,0,255);',
    'rgb(0,255,0);',
    'rgb(20,0,0);',
    'rgb(50,0,255);',
    'rgb(100,255,255);',
    'rgb(0,255,255);',
    'rgb(0,255,255);'
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

  console.log(sounds);
  $panel.css('height', windowHeight + 'px');
  $panel.css('width', $(window).width() + 'px');
  $panel.css('line-height', windowHeight + 'px');




  $container.attr('data-0', 'background-color:' + colors[0]);

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




  var s = skrollr.init({
      forceHeight: false
  });

  $panel.each(function(index, element) {
    offsets.push(s.relativeToAbsolute(element, 'top', 'bottom'))
  });

});
