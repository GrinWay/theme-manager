@grinway/theme-manager
======

This npm package describes the logic of theme changing on a web application (web-site with css)

After installation (prerequisite)
------
1. You have to set css styles essentially via CSS VARIABLEs for :root (`:root {...}`)
1. You have to set same css VARIABLEs in your `html[data-themeManager.themePrefix-theme="theme"]` for various themes (like: `"dark"`, `"light"`)

Philosophy
------
> Change theme with css variables

When you use main API `set` method:

* If "theme" STRING passed, it sets `html[data-themeManager.themePrefix-theme]` attribute with "theme" value
* If "theme" STRING was not passed, it checks if "bgColor", "color" are STRINGS and if any of them are it sets `:root` css variables respectively then sets html[data-themeManager.themePrefix-theme] attribute to empty string

This way you get "theme" styles if you have a "theme" string
or you can set colors by setting "bgColor", "color"

> themeManager will `READ` and `WRITE` css variables of `:root`

> themeManager will only `READ` css variables of `html[data-themeManager.themePrefix-theme]`

You can always get won theme colors via `callback` using `set` method

Installation
------
```console
npm i @grinway/theme-manager
```

Usage
------

### When you know theme string representation
```js
// Somehow you got the information about theme string representation
const theme = 'dark'
// That's not essential but you can save the theme color "#??????" representation from your css
let colorBgValue = null

// callback is needed to get the theme "#??????" color value that won (html[data-themeManager.themePrefix-theme="<theme>"] or :root css vars)
const callback = wonThemeEl => colorBgValue = themeManager.getStyleProp(wonThemeEl, themeManager.themeBgColorCssVar)
// MAGIC IS HERE
themeManager.set({ theme, callback })

// With the help of callback you have access to the color associated with theme
this.someObj.someBgSetter1(colorBgValue)
this.someObj.someBgSetter2(colorBgValue)
this.someObj.someBgSetter3(colorBgValue)
```

### When you know background color or just color (no theme name)
```js
// ...
themeManager.set({ bgColor, color, callback })
// ...
```

Reference
------

| Getters | Description |
| ------------- |:-------------:|
| [themeManager.themePrefix](https://github.com/GrinWay/theme-manager/blob/main/dist/main.js) | You can change it to make the other attribute name of html element |
| [themeManager.themeBgColorCssVar](https://github.com/GrinWay/theme-manager/blob/main/dist/main.js) | css variable name of background color, described in `:root`, `html[data-themeManager.themePrefix-theme=""]` |
| [themeManager.themeColorCssVar](https://github.com/GrinWay/theme-manager/blob/main/dist/main.js) | css variable name of color, described in `:root`, `html[data-themeManager.themePrefix-theme=""]` |

| Method | Description |
| ------------- |:-------------:|
| [themeManager.set\(\)](https://github.com/GrinWay/theme-manager/blob/main/dist/main.js) | Main API method, see usage above |
| [themeManager.getStyleProp\(\)](https://github.com/GrinWay/theme-manager/blob/main/dist/main.js) | Getter for css variable \(property\) |
| [themeManager.setStyleProp\(\)](https://github.com/GrinWay/theme-manager/blob/main/dist/main.js) | Setter for css variable \(property\) |

Advanced
------

### Change dynamic prefix html[data-`app`-theme] to html[data-`my-scope`-theme]

Extend the basic ThemeManager class and overwrite themeManager getter
```
import { ThemeManager } from '@grinway/theme-manager'

class MyThemeManager extends ThemeManager {
    get themePrefix() {
        return 'my-scope'
    }
}

const themeManager = new MyThemeManager()

export { MyThemeManager as ThemeManager, themeManager }
```

Your css variables must be like this
```css
:root {
  --my-scope-theme-bg-color: #??????;
  --my-scope-theme-color: #??????;
}

html body {
  background-color: var(--my-scope-theme-bg-color);
  color: var(--my-scope-theme-color);
}

html[data-my-scope-theme="light"] body {
  --my-scope-theme-bg-color: #??????;
  --my-scope-theme-color: #??????;
}

html[data-my-scope-theme="dark"] body {
  --my-scope-theme-bg-color: #??????;
  --my-scope-theme-color: #??????;
}
```

At last html `data` attribute
```html
<html data-my-scope-theme="dark"></html>
```

> Note: We changed `html` data attribute naming as well as css variables\' ones