/**
 * Flurry jQuery Plugin
 *
 * Flurry is an easy-to-use animated snow plugin for jQuery. It takes advantage of CSS transforms and transitions to provide smooth animation for modern browsers.
 *
 * @link      https://github.com/joshmcrty/Flurry
 * @version   1.0
 * @author    Josh McCarty <josh@joshmccarty.com>
 * @copyright 2016 Josh McCarty
 * @license   https://github.com/joshmcrty/Flurry/blob/master/LICENSE GPLv2
 */
;( function( $, window ) {

  $.fn.flurry = function( options ) {

    // Settings
    var settings = $.extend({
        character: "❄",
        color: "white",
        height: ( this.height() > 200 ) ? 200 : this.height(),
        frequency: 100,
        speed: 3000,
        small: 8,
        large: 28,
        wind: 40,
        windVariance: 20,
        rotation: 90,
        rotationVariance: 180,
        startOpacity: 1,
        endOpacity: 0,
        opacityEasing: "cubic-bezier(1,.3,.6,.74)",
        blur: true,
        overflow: "hidden",
        useRelative: this.is( 'body' ) ? false : true, // default to false for the body element and true for all other elements
        zIndex: 9999
    }, options );

    // Ensure settings that should be numbers are numbers
    $.each( settings, function( key, value ) {
      if ( parseInt( value ) ) {
        settings[key] = parseInt( value );
      }
    });

    var $this = this;

    // Set element position to relative if currently static
    if ( settings.useRelative === true && $this.css( "position" ) === "static" ) {
      $this.css({
        "position": "relative"
      });
    }

    // Create element to hold snowflakes
    var $container = $( document.createElement( "div" ) ).addClass( "flurry-container" ).css({
      "margin": 0,
      "padding": 0,
      "position": "absolute",
      "top": 0,
      "right": 0,
      "left": 0,
      "height": settings.height,
      "overflow": settings.overflow,
      "pointer-events": "none"
    }).prependTo( $this );

    // On window resize, recalculate the width used to generate flakes within
    var containerWidth = $container.width();
    $( window ).resize( function() {
      containerWidth = $container.width();
    });

    // Generate a random number within a range provided
    var randomNumberInRange = function( min, max ) {
      return Math.floor( Math.random() * ( max - min + 1 ) + min );
    };

    // Create and animate a flake
    var createFlake = function() {

      // Set the character
      var character = settings.character.length === 1 ? settings.character : settings.character.charAt( Math.round( randomNumberInRange( 0, settings.character.length - 1 ) ) );

      // Set the flake's starting position to a random number between the container width, including additional space for the wind setting
      var startX = randomNumberInRange( -Math.abs( settings.wind ), containerWidth + Math.abs( settings.wind ) );

      // Set the flake's ending X translation to a random number based on the wind and windVariance settings
      var endX = startX + randomNumberInRange( settings.wind - settings.windVariance, settings.wind + settings.windVariance );

      // Set the flake's font size to a random number between the small and large settings
      var fontSize = randomNumberInRange( settings.small, settings.large );

      // Set the flake's speed to a random number based on the speed setting and the randomized fontSize
      var speed = settings.speed / ( ( randomNumberInRange( fontSize * 1.2, fontSize * 0.8 ) - settings.small ) / ( settings.large - settings.small ) + 0.5 );

      // Set the flake's ending Y translation based on the height setting and the randomized fontSize
      var endY = settings.height - fontSize;

      // Set the flake's rotation to a random degree based on the rotation and rotationVariance settings
      var endRotation = randomNumberInRange( settings.wind - settings.windVariance, settings.wind + settings.windVariance );

      // Create object to store final CSS properties for the flake
      var endCSS = {
        "transform": "translateX(" + endX + "px) translateY(" + endY + "px) rotate(" + endRotation + "deg)",
        "opacity": 0
      };

      // Create the flake, set the CSS for it, and animate it
      var $flake = $('<span></span>');
      $flake.html(character).css({
        "filter": !settings.blur || fontSize > (settings.large + settings.small) / 2 ? "none" : "blur(1px)",
        "color": settings.color,
        "line-height": 1,
        "margin": 0,
        "padding": 0,
        "pointer-events": "none",
        "font-size": fontSize + "px",
        "opacity": settings.startTransparency,
        "position": "absolute",
        "top": "-" + (fontSize * 1.2) + "px",
        "transform": "translateX(" + startX + "px) translateY(0px)",
        "transition": "transform " + ( speed / 1000 ) + "s linear, opacity " + ( speed / 1000 ) + "s " + settings.opacityEasing,
        "z-index": settings.zIndex,
      }).appendTo( $container );

      $flake.on( 'transitionend.flurry', function( event ) {
        $( event.target ).remove();
      });

      $flake.offset(); // Get offset to trigger reflow so transition will be triggered
      $flake.css( endCSS ); // Set endCSS to transition to
    };

    // Generate flakes at the interval set by the frequency setting
    var flakeInterval = setInterval( createFlake, settings.frequency );

    return this;
  };
}( jQuery, window, undefined ));
