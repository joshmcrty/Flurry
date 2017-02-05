# Flurry

Flurry is an easy-to-use animated snow plugin for jQuery. It takes advantage of CSS transforms, CSS transitions and requestAnimationFrame to provide smooth animation for modern browsers. It uses unicode characters as snowflakes, with no dependencies on images or CSS files. Polyfills are automatically provided for requestAnimationFrame and CSS transitions (falling back to setInterval and jQuery's .animate() feature respectively). Each flake is added to the DOM and then removed when it is finished animating, so please keep in mind the performance implications if you have too many flakes on the screen at once.

Tested in Chrome 54, Firefox 49, IE 11, and Edge 38.

## Usage

To use the default settings:

``` javascript
$( document ).ready( function() {
    $( 'body' ).flurry();
});
```

To specify your own settings:

``` javascript
$( document ).ready( function() {
    $( 'body' ).flurry({
        character: "❄",
        color: "white",
        height: 400,
        frequency: 80,
        speed: 4000,
        small: 8,
        large: 48,
        wind: 60,
        windVariance: 20,
        rotation: 0,
        rotationVariance: 90
    });
});
```

To destroy an instance after it's been created:

``` javascript
$('body').flurry('destroy');
```

## Options

`character` (string) determines the character or html entity to be replicated as a snowflake. Default is `"❄"`. If you set this to a string of several unicode characters Flurry will randomize which flakes use each character (e.g. `"❄❅❆"`).

`color` (string or array) determines the color of the snowflake. Default is `"white"`. You may use any valid [CSS color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). If you set this to an array of colors Flurry will randomly use one of the colors for each flake (e.g. `["white", "silver"]`).

`height` (number) controls how far down the page the flakes will fall in pixels. Default is `200` or the height of the `container`, whichever is smaller.

`frequency` (number) controls how frequently new flakes are generated in milliseconds; lower creates more flakes at a time. Default is `100`.

`speed` (number) controls how long it takes each flake to fall in milliseconds; lower is faster. Default is `3000`.

`small` (number) determines the font size of the smallest flakes in pixels. Default is `8`.

`large` (number) determines the font size of the largest flakes in pixels. Default is `28`.

`blur` (boolean) determines whether a blur effect is applied to smaller flakes. Default is `true`.

`wind` (number) controls how far to the left each flake will drift in pixels. Default is `40`. Use a negative number to make flakes drift to the right.

`windVariance` (number) controls how much each flake will drift in pixels using the `wind` as a base; lower creates less random drift. Default is `20`.

`rotation` (number) controls how much each flake will rotate in degrees while it falls; lower is less rotation. Default is `90`.

`rotationVariance` (number) controls how much each flake's `rotation` will be randomized by in degrees; lower creates less random rotation. Default is `180`.

`startRotation` (number) controls what each flake's initial CSS transform rotation will be. Default is `0`.

`startOpacity` (number) controls how much opacity the snowflakes have when they start to fall. Default is `1` which is fully opaque. You may use any valid [CSS opacity value](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity).

`endOpacity` (number) controls how much opacity the snowflakes have when they finish falling and are removed from the DOM. Default is `0` which is fully transparent. You may use any valid [CSS opacity value](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity).

`opacityEasing` (string) controls the easing function used to transition the flakes from their `startOpacity` to their `endOpacity`. Default is `"cubic-bezier(1,.3,.6,.74)"`. You may use any valid [CSS transition-timing-function value](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function).

`overflow` (string) sets the `overflow` CSS property for the selected element (e.g. the `body` element in the examples above). Default is `hidden`.

`useRelative` (boolean) determines whether `position: relative` is applied to the selected element so flakes are generated within it (useful for generating flakes for only a specific part of the page). Default is `true` for all elements except the `body` element which is `false`.

`zIndex` (number) sets the `z-index` CSS property for the snowflakes. Default is `9999`.

**Note:** Many of the options available are randomized slightly for each flake to make the overall effect appear more natural.

## Methods

`destroy` Call `$('your-element').flurry('destroy');` to destroy the snow after you've start flurry on an element(s) on the page. With this you can easily build a toggle on/off capability for the snow.
