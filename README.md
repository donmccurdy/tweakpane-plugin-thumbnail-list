# Tweakpane thumbnail list plugin

[Tweakpane][tweakpane] plugin for selecting from a thumbnail list.

> **EXPERIMENTAL:**. API is likely to change before stable release.

![Preview](https://github.com/donmccurdy/tweakpane-plugin-thumbnail-list/raw/main/assets/preview.png)

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
  weave: 'p',
};

pane.addBinding(params, 'weave', {
  view: 'thumbnail-list',
  options: [
    {text: 'Plain', value: 'p', src: './plain.png', data: {...}},
    {text: 'Twill', value: 't', src: './twill.png', data: {...}},
    {text: 'Basket', value: 'b', src: './basket.png', data: {...}},
    {text: 'Herringbone', value: 'h', src: './herringbone.png', data: {...}},
  ]
}).on('change', (ev) => {
  console.log(ev.value);
});
```

### Option properties:

| property | type   | required | description                    |
|----------|--------|----------|--------------------------------|
| text     | string | ✓        | Human-readable label.          |
| value    | string | ✓        | Unique identifier.             |
| src      | url    | ✓        | Thumbnail URL.                 |
| data     | any    |          | Any application-specific data. |

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

### Quickstart
- Install dependencies:
  ```
  % npm install
  ```
- Build source codes and watch changes:
  ```
  % npm watch
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
