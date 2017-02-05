/**
 * Flurry jQuery Plugin
 *
 * Flurry is an easy-to-use animated snow plugin for jQuery. It takes advantage
 * of CSS transforms, CSS transitions and requestAnimationFrame to provide
 * smooth animation for modern browsers. Props to Jonathan Nicol @f6design
 * for boilerplate code
 * (see http://jonathannicol.com/blog/2012/05/06/a-jquery-plugin-boilerplate/)
 *
 * @link      https://github.com/joshmcrty/Flurry
 * @version   1.1.0
 * @author    Josh McCarty <josh@joshmccarty.com>
 * @copyright 2016 Josh McCarty
 * @license   https://github.com/joshmcrty/Flurry/blob/master/LICENSE GPLv2
 */
;(function($, undefined) {

  /**
   * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
   *
   * @link https://gist.github.com/lenville/9e13e63af075c145d662
   */
  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - Math.abs(currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  }());

  // Change this to your plugin name.
  var pluginName = 'flurry';

  /**
   * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
   *
   * http://www.joelambert.co.uk
   * Copyright 2011, Joe Lambert.
   * Free to use under the MIT license.
   *
   * @link https://gist.github.com/joelambert/1002116
   * @param {function} fn The callback function
   * @param {int} delay The delay in milliseconds
   */
  function requestInterval(fn, delay) {

    /* jshint -W010 */
    var start = new Date().getTime(),
        handle = new Object();

    function loop() {
      var current = new Date().getTime(),
        delta = current - start;

      if(delta >= delay) {
        fn.call();
        start = new Date().getTime();
      }

      handle.value = window.requestAnimationFrame(loop);
    }

    handle.value = window.requestAnimationFrame(loop);
    return handle;
  }

  /**
   * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
   *
   * http://www.joelambert.co.uk
   * Copyright 2011, Joe Lambert.
   * Free to use under the MIT license.
   *
   * @link https://gist.github.com/joelambert/1002116
   * @param {int|object} fn The callback function
   */
  function clearRequestInterval(handle) {

    /* jshint -W030 */
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame  ? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
    clearInterval(handle);
  }

  /**
   * Detects whether the browser supports CSS transitions (adapted from https://gist.github.com/jonraasch/373874)
   *
   * @return {boolean} True if CSS transitions are supported
   */
  function supportsTransitions() {
    var thisBody = document.body || document.documentElement,
    thisStyle = thisBody.style,
    support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
    return support;
  }

  /**
   * Generate a random integer within a range provided
   *
   * @param  {number} min The lowest number of the range
   * @param  {number} max The highest number of the range
   * @return {number}     The random integer within the range
   */
  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Creates a snowflake with randomized movement based on the options provided
   *
   * @param {object} options    The options set for the plugin
   * @param {object} $container The jQuery element to append each snowflake to.
   */
  function createFlake(options, $container, containerWidth) {

    // Set the character. If multiple characters are provided, randomly select one.
    var character = options.character.length === 1 ? options.character : options.character.charAt(Math.round(randomNumberInRange(0, options.character.length - 1)));

    // Set the flake's starting position to a random number between the container width, including additional space for the wind setting
    var startX = randomNumberInRange(-Math.abs(options.wind), containerWidth + Math.abs(options.wind));

    // Set the flake's ending X translation to a random number based on the wind and windVariance options
    var endX = startX + randomNumberInRange(options.wind - options.windVariance, options.wind + options.windVariance);

    // Set the flake's font size to a random number between the small and large options
    var fontSize = randomNumberInRange(options.small, options.large);

    // Set the flake's speed to a random number based on the speed setting and the randomized fontSize
    var speed = options.speed / ((randomNumberInRange(fontSize * 1.2, fontSize * 0.8) - options.small) / (options.large - options.small) + 0.5);

    // Set the flake's ending Y translation based on the height setting and the randomized fontSize
    var endY = options.height - fontSize;

    // Set the flake's rotation to a random degree based on the rotation and rotationVariance options
    var endRotation = randomNumberInRange(options.rotation - options.rotationVariance, options.rotation + options.rotationVariance);
    
    // Set the flake's color based on color options
    var color = Array.isArray(options.color) ? options.color[Math.floor(Math.random() * options.color.length)] : options.color;

    // Create object to store final CSS properties for the flake
    var endCSS = {
      "transform": "translateX(" + endX + "px) translateY(" + endY + "px) rotateZ(" + endRotation + "deg)",
      "opacity": 0
    };

    // Create the flake, set the CSS for it, and animate it
    var $flake = $('<span></span>');
    $flake.html(character).css({
      "color": options.blur && fontSize < (options.large + options.small) / 2 ? "transparent" : color,
      "text-shadow": options.blur && fontSize < (options.large + options.small) / 2 ? "0 0 1px " + color : "none",
      "display": "inline-block",
      "line-height": 1,
      "margin": 0,
      "padding": "2px",
      "pointer-events": "none",
      "font-size": fontSize + "px",
      "opacity": options.startTransparency,
      "position": "absolute",
      "top": "-" + (options.large * 1.2) + "px",
      "transform": "translateX(" + startX + "px) translateY(0px) rotateZ(" + options.startRotation + "deg)",
      "transition": "transform " + (speed / 1000) + "s linear, opacity " + (speed / 1000) + "s " + options.opacityEasing,
      "z-index": options.zIndex,
    }).appendTo($container);

    if (supportsTransitions) {

      // Remove the flake element when it finishes transitioning
      $flake.on('transitionend.flurry', function(event) {
        $(event.target).remove();
      });

      // Set the endCSS to trigger the transition
      window.requestAnimationFrame(function(){
        $flake.css(endCSS);
      });
    } else {

      // Use jQuery .animate()
      $flake.animate(endCSS, speed, 'linear', function() {
        $(this).remove();
      });
    }
  }

  /**
   * Plugin object constructor.
   * Implements the Revealing Module Pattern.
   */
  function Plugin(element, options) {

    // References to this plugin instance, DOM and jQuery versions of element.
    var self = this;
    var el = element;
    var $el = $(element);

    // Extend default options with those supplied by user.
    options = $.extend({
      height: $el.height() > 200 ? 200 : $el.height(), // default to 200px or the height of the element, whichever is smaller
      useRelative: $el.is('body') ? false : true, // default to false for the body element and true for all other elements
    }, $.fn[pluginName].defaults, options);

    // Ensure options that should be numbers are numbers
    $.each(options, function(key, val) {
      if (parseInt(val)) {
        options[key] = parseInt(val);
      }
    });

    /**
     * Initialize plugin.
     */
    function init() {

      // Add any initialization logic here...

      // Set element position to relative if currently static
      if (options.useRelative === true && $el.css('position') === 'static') {
        $el.css({
          'position': 'relative'
        });
      }

      // Create container element to hold snowflakes
      var $container = $(document.createElement('div')).addClass('flurry-container').css({
        'margin': 0,
        'padding': 0,
        'position': 'absolute',
        'top': 0,
        'right': 0,
        'left': 0,
        'height': options.height,
        'overflow': options.overflow,
        'pointer-events': 'none'
      }).prependTo($el);

      // On window resize, recalculate the width used to generate flakes within
      var containerWidth = $container.width();
      $(window).resize(function() {
        containerWidth = $container.width();
      });

      // Generate flakes at the interval set by the frequency setting
      self.flakeInterval = requestInterval(function() {
        createFlake(options, $container, containerWidth);
      }, options.frequency);

      // Call onInit hook
      hook('onInit');
    }

    /**
     * Get/set a plugin option.
     * Get usage: $('#el').demoplugin('option', 'key');
     * Set usage: $('#el').demoplugin('option', 'key', value);
     */
    function option (key, val) {
      if (val) {
        options[key] = parseInt(val) || val;
      } else {
        return options[key];
      }
    }

    /**
     * Destroy plugin.
     * Usage: $('#el').demoplugin('destroy');
     */
    function destroy() {

      // Iterate over each matching element.
      $el.each(function() {
        var el = this;
        var $el = $(this);

        // Add code to restore the element to its original state...

        // Cancel snowflake generation
        clearRequestInterval(self.flakeInterval);

        // Remove container
        $el.find('.flurry-container').remove();

        // Call onDestroy hook
        hook('onDestroy');

        // Remove Plugin instance from the element.
        $el.removeData('plugin_' + pluginName);
      });
    }

    /**
     * Callback hooks.
     * Usage: In the defaults object specify a callback function:
     * hookName: function() {}
     * Then somewhere in the plugin trigger the callback:
     * hook('hookName');
     */
    function hook(hookName) {
      if (options[hookName] !== undefined) {

        // Call the user defined function.
        // Scope is set to the jQuery element we are operating on.
        options[hookName].call(el);
      }
    }

    // Initialize the plugin instance.
    init();

    // Expose methods of Plugin we wish to be public.
    return {
      option: option,
      destroy: destroy
    };
  }

  /**
   * Plugin definition.
   */
  $.fn[pluginName] = function(options) {

    // If the first parameter is a string, treat this as a call to a public method.
    if (typeof arguments[0] === 'string') {
      var methodName = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1);
      var returnVal;
      this.each(function() {

        // Check that the element has a plugin instance, and that the requested public method exists.
        if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {

          // Call the method of the Plugin instance, and Pass it the supplied arguments.
          returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
        } else {
          throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
        }
      });
      if (returnVal !== undefined){

        // If the method returned a value, return the value.
        return returnVal;
      } else {

        // Otherwise, returning 'this' preserves chainability.
        return this;
      }

    // If the first parameter is an object (options), or was omitted, instantiate a new instance of the plugin.
    } else if (typeof options === "object" || !options) {
      return this.each(function() {

        // Only allow the plugin to be instantiated once.
        if (!$.data(this, 'plugin_' + pluginName)) {

          // Pass options to Plugin constructor, and store Plugin instance in the elements jQuery data object.
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    }
  };

  // Default plugin options.
  // Options can be overwritten when initializing plugin, by
  // passing an object literal, or after initialization:
  // $('#el').demoplugin('option', 'key', value);
  // The `height` and `useRelative` defaults are set in
  // the `Plugin()` function as they rely on the selected
  // element(s) to determine a default value
  $.fn[pluginName].defaults = {
    onInit: function() {},
    onDestroy: function() {},
    /* height: 200, */
    /* useRelative: false, */
    character: "❄",
    color: "white",
    frequency: 100,
    speed: 3000,
    small: 8,
    large: 28,
    wind: 40,
    windVariance: 20,
    rotation: 90,
    rotationVariance: 180,
    startRotation: 0,
    startOpacity: 1,
    endOpacity: 0,
    opacityEasing: "cubic-bezier(1,.3,.6,.74)",
    blur: true,
    overflow: "hidden",
    zIndex: 9999
  };

})(jQuery);
