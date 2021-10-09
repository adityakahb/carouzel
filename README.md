# Carouzel
Carouzel is an Keyboard accessible, jQuery-free and Framework-free carousel slider plugin which is fully responsive, and supports multiple configurations.

## Demo
[https://adityakahb.github.io/carouzel](https://adityakahb.github.io/carouzel/)

## Features
- Available in Vanilla Javascript and CommonJS module.
- Framework-free.
- Can be used as ES6 module import OR direct source.
- Fully responsive.
- With bare minimum css
- Can have multiple instances with multiple configurations.
- Compiled through Typescript.
- Styled through SASS - Source included for customization.
- Object.assign polyfill is added by Typescript! No other polyfills required.

## Installation

### NPM

```bash
npm install amegmen
```
**THEN**
```html
<link href="node_modules/carouzel/dist/styles/carouzel/carouzel.min.css"/>
<script src="node_modules/carouzel/dist/scripts/carouzel.min.js"></script>
```
**OR**
```javascript
import Carouzel from 'carouzel';
```
```sass
@import '~carouzel\src\carouzel\carouzel';
```

### HTML

```html
<!-- Root Element -->

```

### JavaScript

```javascript
var  carouzel_instance = Carouzel.Root.getInstance();
var  carouzel_options = {};
carouzel_instance.init("#__carouzel_root", carouzel_options);

/* You can destroy it as well */
carouzel_instance.destroy("#__carouzel_root");
```


### Options

**activeCls** - CSS Class
Default: `active`
Associated with the root element and its children which get a subnav panel opened or activated



### Methods

**init**
Parameters: CSS Selector
The Root element id or class to be passed to initialize the Megamenu. Example `#root`, `.root`

**destroy**
Parameters: CSS Selector
The Root element id or class to be passed to destroy the Megamenu. Example `#root`, `.root`


### License
MIT