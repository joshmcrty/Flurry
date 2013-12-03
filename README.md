Flurry
======

Flurry is an easy-to-use animated snow plugin for jQuery inspired by jSnow. It uses bullet characters as snowflakes, with no dependencies on images or CSS files.

Usage
-----

To use the default settings:

    $( document ).ready( function() {
        $().flurry();
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

`height` controls how far down the page the flakes will fall in pixels

`density` controls how frequently new flakes are generated in milliseconds

`speed` controls how fast the flakes fall

`small` determines the font size of the smallest flakes in pixels

`large` determines the font size of the largest flakes in pixels

`wind` controls how far to the left the flakes will drift in pixels

`variance` controls how much each flake will randomly drift in pixels using the `wind` as a base

`preventScrolls` determines whether `overflow-x: auto` is applied to the `html` element to prevent horizontal scrolling