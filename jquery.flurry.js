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
        height: 150,
        density: 100,
        speed: 3000,
        small: 12,
        large: 20,
        wind: 40,
        variance: 20,
        preventScroll: true,
        character: "&bull;",
        transparency: 1
    }, options );
    
    // Prevent browser horizontal scrolling
    if ( settings.preventScroll === true ) {
      $( 'html' ).css({
        "overflow-x": "hidden"
      });
    }
    
    // On window resize, recalculate the width used to generate flakes within
    var windowWidth = $( window ).width();
    $( window ).resize( function() {
      windowWidth = $( window ).width();
    });
    
    // Generate a random number within a range provided
    var randomNumberInRange = function( min, max ) {
      return Math.random() * ( max - min ) + min;
    };

    // Create and animate a flake
    var createFlake = function() {
      
      // Set the flake's starting position to a random number between the window width, including additional space for the wind setting
      var left = randomNumberInRange( 0 - Math.abs( settings.wind ), windowWidth + Math.abs( settings.wind ) );
      
      // Create the flake, set the CSS for it, and animate it
      var flake = '<span>' + settings.character + '</span>';
      $( flake ).css({
        "color": "rgba(255, 255, 255, " + settings.transparency + ")",
        "font-size": randomNumberInRange( settings.small, settings.large ) + "px",
        "position": "absolute",
        "top": "-" + settings.large + "px",
        "left": left + "px",
        "z-index": "999"
      }).appendTo( 'body' ).animate({
        "top": settings.height + "px",
        "left": ( left + randomNumberInRange( settings.wind - settings.variance, settings.wind + settings.variance ) ) + "px",
        "opacity": 0
      }, randomNumberInRange( settings.speed - 400, settings.speed + 400 ), "linear", function() {
        $( this ).remove();
      });

    };
    
    // Generate flakes at the interval set by the density setting
    setInterval( createFlake, settings.density );
  };
}( jQuery, window, undefined ));