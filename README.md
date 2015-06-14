# PostCSS Chunk [![Build Status][ci-img]][ci]

[PostCSS] plugin to split larger CSS files into smaller chunks based on target selector count. Supports pnested atrules, and processing multiple files in one stream..

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/mattfysh/postcss-chunk.svg
[ci]:      https://travis-ci.org/mattfysh/postcss-chunk

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-chunk') ])
```

See [PostCSS] docs for examples for your environment.
