import { typeChecker } from "@grinway/type-checker"
import * as changeCase from "change-case"

/**
 * Usage:
 *     const theme = 'dark'
 *     let bgColorVar = null
 *     const callback = wonThemeEl => bgColorVar = themeManager.getStyleProp(wonThemeEl, themeManager.themeBgColorCssVar)
 *     themeManager.set({ theme, callback })
 *     // you saved bgColorVar use it outside :)
 */
class ThemeManager {
    constructor() {
        this.#refreshElements()
    }

    /**
     * PREFIX FOR body[data-<this.themePrefix>-theme]
     */
    get themePrefix() {
        return 'app'
    }

    /**
     * CSS VARIABLE
     */
    get themeBgColorCssVar() {
        return `--${this.themePrefix}-theme-bg-color`
    }

    /**
     * CSS VARIABLE
     */
    get themeColorCssVar() {
        return `--${this.themePrefix}-theme-color`
    }

    /**
     * API
     * Pass "theme", "callback" if you know the theme name OR "bgColor", "color", "callback" if you know only colors
     *
     * Usage:
     *
     *         const theme = 'dark'
     *         let colorBgValue = null
     *
     *         // callback is needed to get the theme "#??????" color value that won
     *         const callback = wonThemeEl => colorBgValue = themeManager.getStyleProp(wonThemeEl, themeManager.themeBgColorCssVar)
     *         themeManager.set({ theme, callback })
     *
     *         // Imagine you have outside places where you need to set theme colors
     *         this.someObj.someBgSetter1(colorBgValue)
     *         this.someObj.someBgSetter2(colorBgValue)
     *         this.someObj.someBgSetter3(colorBgValue)
     *
     * @param string theme Has priority over bgColor, color
     * @param callback callback Use to get the won theme some color: themeManager.getStyleProp(wonThemeEl, themeManager.themeBgColorCssVar) for instance
     */
    set({ theme, bgColor, color, callback }) {
        this.#refreshElements()

        if (typeChecker.isNotFunction(callback)) {
            callback = wonThemeEl => {
            }
        }

        let wonThemeEl = null

        // theme string always wins over others
        if (typeChecker.isString(theme)) {
            this.#setBodyStyle({ theme })
            wonThemeEl = this.bodyEl
            callback(wonThemeEl)
            return this
        }

        this.#setRootStyle({ bgColor, color })
        wonThemeEl = this.rootEl
        callback(wonThemeEl)
        return this
    }

    /**
     * API
     *
     * Works well inside callback of this.set method
     */
    getStyleProp(el, property) {
        if (typeChecker.isObject(el) && typeChecker.isString(property)) {
            return getComputedStyle(el)?.getPropertyValue(property)
        }
        return null
    }

    /**
     * API
     *
     * Sets style (css) property with value
     * @return bool Whether or not property was set with passed value
     */
    setStyleProp(el, property, value) {
        if (typeChecker.isNotObject(el) || typeChecker.isNotString(property) || typeChecker.isNotString(value)) {
            return false
        }
        try {
            el.style.setProperty(property, value)
        } catch (e) {
            return false
        }
        return true
    }

    #setBodyStyle({ theme }) {
        if (typeChecker.isString(theme)) {
            this.bodyEl.dataset[this.#getDatasetThemeKey()] = theme
        }
        return this
    }

    #setRootStyle({ bgColor, color }) {
        const bgColorWasSet = this.setStyleProp(this.rootEl, this.themeBgColorCssVar, bgColor)
        const colorWasSet = this.setStyleProp(this.rootEl, this.themeColorCssVar, color)
        if (true === bgColorWasSet || true === colorWasSet) {
            this.bodyEl.dataset[this.#getDatasetThemeKey()] = ''
        }
        return this
    }

    #getDatasetThemeKey() {
        const themePrefix = changeCase.camelCase(this.themePrefix)
        return `${themePrefix}Theme`
    }

    #refreshElements() {
        this.#refreshBody()
        this.#refreshRoot()
    }

    #refreshBody() {
        this.bodyEl = document.querySelector('body')
    }

    #refreshRoot() {
        this.rootEl = document.querySelector(':root')
    }
}

const themeManager = new ThemeManager

export { ThemeManager, themeManager }
