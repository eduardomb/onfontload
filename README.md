# onFontLoad Event

This plugin detects when the fonts linked with `font-face` are loaded and ready
to use. It's a very **lightweight** (`1Kb` gzipped) solution to Flash of Unstyled Text
(FOUT).


## Demo

The [Demo Page](https://eduardomb.github.io/onfontload/) shows an example of
how to prevent FOUT and also how to use this plugin with an icon font
(FontAwesome).

## Basic Usage

Use `font-face` to link the fonts you want. In the example below I use Google
Fonts short link in `HTML` but `onFontLoad` also detects fonts loaded via
`javascript` or any other way that uses `font-face`.

```html
<link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
<link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
```

Use `onFontLoad` to detect when the fonts are loaded.

```javascript
onFontLoad([
	{family: 'Open Sans'},
	{family: 'Roboto', weight: 400},
	{family: 'Roboto', weight: 700},
], function() {
	console.log('All fonts loaded');
});
```

## Installation

```sh
bower install onfontload
```

## Options

`onFontLoad` receives a `list` of font descriptors to watch and a `callback`. A
font descriptor is an object with the following keys:

* `family` (required) - the font name
* `weight`(optional) - the font weight, defaults to 400
* `style` (optional) - the font style (italic, oblique, normal), defaults to normal
* `testText` (optional) - the text that will be used to test if the font is
  loaded. Normally the default value `BESbswy` is ok, but for icon fonts
  you might want to pass unicode characters, ex: `&#xf110;`.

A boolean `success` argument is passed to `callback`. If the fonts are not
loaded after 3 seconds the `callback` will be called with `success = false`.


## Why not use webfontloader instead?

[Web Font Loader](https://github.com/typekit/webfontloader) is a robust plugin
that also detects font load. In fact, the method used here to detect when a
font is loaded was extracted from `Web Font Loader` project (details can be
found in this great blog post [More reliable font
events](http://blog.typekit.com/2013/02/05/more-reliable-font-events/)).

The `onFontLoad` advantage is that it's only `1kb` gzipped (`~80%` smaller than
`Web Font Loader`). This is because `onFontLoad` mission is to simply detect
when fonts are loaded. `Web Font Loader` on the other hand also provides a load
mechanism and some other features.

If you want more than just detect the font load event or you don't mind adding
a few extra `kb` to your project, than `Web Font Loader` is a better suite for
you. But if you're freak like me that hates every unused downloaded `kb` in
your web system, then this plugin is for you.
