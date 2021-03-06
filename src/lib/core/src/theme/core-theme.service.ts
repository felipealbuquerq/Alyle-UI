import { Injectable, Optional, Inject, Renderer2, RendererFactory2, isDevMode } from '@angular/core';
import { THEME_CONFIG, ThemeConfig, THEME_CONFIG_EXTRA, LY_THEME_CONFIG, LyThemeConfig } from './theme-config';
import { DOCUMENT } from '@angular/common';
import { StyleContent, StyleData, DataStyle, Style, mergeDeep, MultipleStyles } from '../theme.service';
import { Platform } from '../platform';
import { InvertMediaQuery, transformMediaQuery } from '../media/invert-media-query';

let classId = 0;

@Injectable({
  providedIn: 'root'
})
export class CoreTheme {
  renderer: Renderer2;
  primaryStyleContainer: HTMLElement;
  secondaryStyleContainer: HTMLElement;
  private _themeMap = new Map<string, ThemeConfig>();
  private _styleMap = new Map<string, Map<string, DataStyle>>();
  private _styleCoreMap = new Map<string, DataStyle>();
  constructor(
    @Optional() @Inject(LY_THEME_CONFIG) themeConfig: LyThemeConfig,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document: any,
  ) {
    if (!themeConfig) {
      throw new Error('LY_THEME_CONFIG undefined');
    }
    this.renderer = this.rendererFactory.createRenderer(null, null);
    if (Platform.isBrowser) {
      const primaryStyleContainer = _document.body.querySelector('ly-primary-style-container');
      const secondaryStyleContainer = _document.body.querySelector('ly-secondary-style-container');
      if (primaryStyleContainer) {
        primaryStyleContainer.innerHTML = '';
        secondaryStyleContainer.innerHTML = '';
      }
    }
    this.primaryStyleContainer = this.renderer.createElement('ly-primary-style-container');
    this.secondaryStyleContainer = this.renderer.createElement('ly-secondary-style-container');
    this.renderer.insertBefore(_document.body, this.primaryStyleContainer, _document.body.firstChild);
    this.renderer.insertBefore(_document.body, this.secondaryStyleContainer, this.primaryStyleContainer);
    this.setCoreStyle();
    if (themeConfig) {
      themeConfig.themes.forEach(item => {
        this.add(new item);
      });
    }
  }

  /**
   * add new theme
   * @param theme: ThemeConfig
   */
  add(theme: ThemeConfig) {
    this._themeMap.set(theme.name, theme);
    this._styleMap.set(theme.name, new Map());
  }

  get(name: string) {
    return this._themeMap.get(name);
  }
  getStyleMap(name: string) {
    return this._styleMap.get(name);
  }

  setUpStyle(
    key: string,
    styles: Style,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    return this._ĸreateStyle(key, styles, this._styleCoreMap, 'root', this.primaryStyleContainer, media, invertMediaQuery);
  }
  setUpStyleSecondary(
    key: string,
    styles: Style,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    return this._ĸreateStyle(key, styles, this._styleCoreMap, 'root', this.secondaryStyleContainer, media, invertMediaQuery);
  }

  _ĸreateStyle(key, style: Style, mapStyles: Map<string, DataStyle>, _for: string, _in: any, _media?: string, invertMediaQuery?: InvertMediaQuery) {
    if (mapStyles.has(key)) {
      return mapStyles.get(key).id;
    } else {
      const id = `k${(classId++).toString(36)}`;
      const styleElement = this.renderer.createElement('style');
      const media = transformMediaQuery(_media, invertMediaQuery);
      const styleContent = this.renderer.createText(this._createStyleContent(style, id, media));
      this.renderer.appendChild(styleElement, styleContent);
      this.renderer.appendChild(_in, styleElement);
      if (isDevMode()) {
        this.renderer.setAttribute(styleElement, 'style_data', `${_for}···${id}···${key}`);
      }
      const dataStyle = {
        id,
        style,
        styleElement,
        media
      };
      mapStyles.set(key, dataStyle);
      return id;
    }
  }

  /** #style */
  _createStyleContent(styles: Style, id: string, media?: string | string[]) {
    const typf = typeof styles;
    if (typf === 'string') {
      return toMedia(`.${id}{${styles}}`, media);
    } else if (typf === 'function') {
      return toMedia(`.${id}{${(styles as StyleContent)()}}`, media);
    }
    let content = '';
    // tslint:disable-next-line:forin
    for (const key$ in styles as MultipleStyles) {
      const val = styles[key$];
      const text = typeof val === 'function' ? val() : val;
      content += `.${id}${key$}{${text}}`;
    }
    return toMedia(content, media);
  }

  private setCoreStyle() {
    const classname = this.setUpStyle('rootbody', {
      '': () => (
        `margin:0;`
      )
    });
    this.renderer.addClass(this._document.body, classname);
  }

  updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    if (oldClassname) {
      renderer.removeClass(element, oldClassname);
    }
    renderer.addClass(element, newClassname);
  }

}

/**
 * Converter to media query if `media` is present
 * @param text style content
 * @param media media query
 */
function toMedia(text: string, media?: string | string[]) {
  if (typeof media === 'string') {
    return `@media ${media}{${text}}`;
  } else if (Array.isArray(media)) {
    let result = '';
    media.forEach(_ => result += `@media ${_}{${text}}`);
    return result;
  }
  return text;
}
