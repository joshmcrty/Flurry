Flurry
======

Flurry is an easy-to-use animated snow plugin for jQuery inspired by jSnow. It uses bullet characters as snowflakes, with no dependencies on images or CSS files.

Usage
-----

To use the default settings:

    $( document ).ready( function() {
        $('body').flurry();
    });

To specify your own settings:

    $( document ).ready( function() {
        $().flurry({
            height: 200,
            speed: 2400,
            wind: 100,
            variance: 80
        });
    });

Options
-------

`height` controls how far down the page the flakes will fall in pixels. Default is `150` or the height of the container, whichever is smaller.

`density` controls how frequently new flakes are generated in milliseconds; lower is more dense. Default is `100`.

`speed` controls how fast the flakes fall; lower is faster. Default is `3000`.

`small` determines the font size of the smallest flakes in pixels. Default is `12`.

`large` determines the font size of the largest flakes in pixels. Default is `20`.

`wind` controls how far to the left the flakes will drift in pixels. Default is `40`. Use a negative number to make flakes drift to the right.

`variance` controls how much each flake will randomly drift in pixels using the `wind` as a base.

`preventScroll` determines whether `overflow: hidden` is applied to the selected element to prevent horizontal scrolling. Default is `true`.

`useRelative` determines whether `position: relative` is applied to the selected element so flakes are generated within it (useful for generating flakes for a specific part of the page). Default is `true`.

`useTransitions` determines whether CSS transitions are used to animate the flakes instead of jQuery `animate()`. Checks for browser support and falls back to `.animate()` if necessary. Default is `true`.

`character` determines the character or html entity to be replicated as a snowflake. Default is `&bull;`.

`transparency` determines the alpha value of color of the character. Default is `1`.
