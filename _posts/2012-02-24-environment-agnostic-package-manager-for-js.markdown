---
layout: post
title: "Environment agnostic package manager for JS?"
date: 2012-02-24 08:02:08
---
I want a universal package system for all Javascript packages! Each package should be able to express any environment requirements it may have through something like [package.json](http://npmjs.org/doc/json.html) (the engines field of the [package.json spec](http://wiki.commonjs.org/wiki/Packages/1.0) is intended for something like this).

Last night, [I asked](http://twitter.com/rasmusrn/status/172812287390908416) [Alex MacCaw](http://twitter.com/maccman) why he wanted a new [npm](http://npmjs.org/)-like package manager designed solely for browser packages. Why not just use [npm](http://npmjs.org/)? [He replied](http://twitter.com/maccman/status/172812745643786240):

> Because there's so many npm packages already, and it means you have to rename the jquery package as jquerify, for example.

The reason we need to create a new package for [jQuery](http://jquery.com/) is that, the "real" jQuery npm package requires [jsdom](https://github.com/tmpvar/jsdom) which can't run in the browser.

Learning about this really made me sad. It's awesome that jQuery works with [jsdom](https://github.com/tmpvar/jsdom), but since it is intended for the browser it shouldn't be *requiring* it.

The reason [jsdom](https://github.com/tmpvar/jsdom) is a hard dependency is presumably that jQuery requires a `DOMWindow` defined in the global scope at runtime.

In my opinion, such assumptions is bad practice in modern Javascript. And worse, it force us to create and maintain custom versions of jQuery for certain environments. In npm/node.js, we even have to add a hard dependency on a package that can't run in the browser.

What if jQuery didn't *require* DOMWindow at runtime? Instead, you'd be able to pass it one through something like `jQuery.initialize(window);`.

Of course, for backwards compatibility, jQuery would use `window` defined in the global scope automatically, if present.

It would then be up to the user of the jQuery package whether to run it in an environment that has a global `window` object - or to pass a window object manually created via something like [jsdom](https://github.com/tmpvar/jsdom).

We'd then only have to maintain only one jQuery package. The same idea can be applied to all Javascript libraries that are intended for the browser but bound to node.js due to some dependency.

By using the same mechanism for managing dependencies in server and browser apps, we make reusing and sharing code much easier.
