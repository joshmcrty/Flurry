/**
 * Flurry jQuery Plugin
 *
 * Flurry is an easy-to-use animated snow plugin for jQuery inspired by jSnow.
 *
 * @link      https://github.com/joshmcrty/Flurry
 * @author    Josh McCarty <josh@joshmccarty.com>
 * @copyright 2013 Josh McCarty
 * @license   https://github.com/joshmcrty/Flurry/blob/master/LICENSE GPLv2
 */
;( function( $, window ) {

  $.fn.flurry = function( options ) {

    // Settings
    var settings = $.extend({
        height: ( this.height() > 150 ) ? 150 : this.height(),
        density: 100,
        speed: 3000,
        small: 12,
        large: 20,
        wind: 40,
        variance: 20,
        preventScroll: true,
        useRelative: true,
        useTransitions: true,
        character: "&bull;",
        transparency: 1
    }, options );

    var $container = this;

    // Prevent scrolling
    if ( settings.preventScroll === true ) {
      $container.css({
        "overflow": "hidden"
      });
    }

    // Set container position to relative
    if ( settings.useRelative === true ) {
      $container.css({
        "position": "relative"
      });
    }

    // Detects whether the browser supports CSS transitions (adapted from https://gist.github.com/jonraasch/373874)
    function supportsTransitions() {
      var thisBody = document.body || document.documentElement,
      thisStyle = thisBody.style,
      support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
      return support;
    }

    // On window resize, recalculate the width used to generate flakes within
    var containerWidth = $container.width();
    $( window ).resize( function() {
      containerWidth = $container.width();
    });

    // Generate a random number within a range provided
    var randomNumberInRange = function( min, max ) {
      return Math.random() * ( max - min ) + min;
    };

    // Create and animate a flake
    var createFlake = function() {

      // Set the flake's starting position to a random number between the container width, including additional space for the wind setting
      var startLeft = randomNumberInRange( $container.offset().left - Math.abs( settings.wind ), containerWidth + Math.abs( settings.wind ) );

      // Set the flake's speed to a random number based on the speed setting
      var speed = randomNumberInRange( settings.speed - 400, settings.speed + 400 );

      // Set the flake's ending position to a random number based on the wind and variance settings
      var endLeft = startLeft + randomNumberInRange( settings.wind - settings.variance, settings.wind + settings.variance );

      // Create object to store final CSS properties for the flake
      var endCSS = {
        "top": settings.height + "px",
        "left": endLeft + "px",
        "opacity": 0
      };

      // Create the flake, set the CSS for it, and animate it
      var $flake = $('<span></span>');
      $flake.html(settings.character).css({
        "color": "rgba(255, 255, 255, " + settings.transparency + ")",
        "font-size": randomNumberInRange( settings.small, settings.large ) + "px",
        "position": "absolute",
        "top": "-" + settings.large + "px",
        "left": startLeft + "px",
        "z-index": "999",
      }).appendTo( $container );

      // Determine whether to use CSS transitions or jQuery .animation()
      if ( settings.useTransitions && supportsTransitions() ) {
        $flake.css({
          "transition": "all " + ( speed / 1000 ) + "s linear"
        }).on( 'transitionend.flurry', function( event ) {
          $( this ).remove();
        });

        // Get offset to trigger reflow so transition will be triggered
        $flake.offset();
        $flake.css( endCSS );
      }
      else {
        $flake.animate( endCSS, speed, "linear", function() {
          $( this ).remove();
        });
      }
    };

    // Generate flakes at the interval set by the density setting
    setInterval( createFlake, settings.density );

    return this;
  };
}( jQuery, window, undefined ));
