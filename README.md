# Tweakpane thumbnail list plugin

[Tweakpane][tweakpane] plugin for selecting from a thumbnail list.

> **NOTICE:** _IN DEVELOPMENT_. Not yet ready for use.

## Installation

### Browser
```html
<script src="tweakpane.min.js"></script>
<script src="tweakpane-plugin-thumbnail-list.min.js"></script>
<script>
  const pane = new Tweakpane.Pane();
  pane.registerPlugin(TweakpaneThumbnailListPlugin);
</script>
```


### Package
```js
import { Pane } from 'tweakpane';
import * as TweakpaneThumbnailListPlugin from 'tweakpane-plugin-thumbnail-list';

const pane = new Pane();
pane.registerPlugin(TweakpaneThumbnailListPlugin);
```


## Usage
```js
const params = {
  weave: 'plain',
};

pane.addInput(params, 'weave', {
  view: 'thumbnail-list',
  options: [
    {value: 'plain', src: './plain.png'},
    {value: 'twill', src: './twill.png'},
    {value: 'basket', src: './basket.png'},
    {value: 'herringbone', src: './herringbone.png'},
  ]
}).on('change', (ev) => {
  console.log(ev.value);
});
```

## CSS Theming

Inherits CSS variables from [Tweakpane's theming system](https://cocopon.github.io/tweakpane/theming.html), with the following additions:

```css
:root {
  /** Max height of dropdown panel. */
  --tp-plugin-thumbnail-list-height: 400px;

  /** Fixed width of dropdown panel. */
  --tp-plugin-thumbnail-list-width: 200px;

  /** Width/height of (square) thumbnail. */
  --tp-plugin-thumbnail-list-thumb-size: 20px;
}
```

## Contributing

### Quick start
- Install dependencies:
  ```
  % npm install
  ```
- Build source codes and watch changes:
  ```
  % npm start
  ```
- Open `test/browser.html` to see the result.


### File structure
```
|- src
|  |- sass ............ Plugin CSS
|  |- index.ts ........ Entrypoint
|  |- plugin.ts ....... Plugin
|  |- controller.ts ... Controller for the custom view
|  `- view.ts ......... Custom view
|- dist ............... Compiled files
`- test
   `- browser.html .... Plugin labo
```


[tweakpane]: https://github.com/cocopon/tweakpane/
