import {
  LyTheme2, CoreTheme
} from '@alyle/ui';
import {
  ElementRef,
  Inject,
  Injectable,
  Renderer2
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LyButtonService {
  private rootClassName: string;
  private themeClassName: string;
  classes = {
    root: this.coreTheme.setUpStyleSecondary(
      'button', {
        '': rootStyle
      }),
    outlined: this.coreTheme.setUpStyle(
      'btntlnd',
      {'': () => (
        `border: 1px solid currentColor`
      )}
    ),
    buttonContent: this.coreTheme.setUpStyle(
      'buttonContent',
      {'': () => (
        `padding:0;` +
        `display:flex;` +
        `justify-content:inherit;` +
        `align-items:inherit;` +
        `align-content:inherit;` +
        `width: 100%;` +
        `height: 100%;` +
        `box-sizing: border-box;`
      )}
    )
  };
  constructor(
    private coreTheme: CoreTheme
  ) { }
}

function rootStyle() {
  return '-webkit-tap-highlight-color:transparent;' +
  'background-color:rgba(0, 0, 0, 0);' +
  'border:0;' +
  'padding:0 16px;' +
  '-moz-appearance:none;' +
  'min-height:36px;' +
  'height:36px;' +
  'margin:0;' +
  'border-radius:3px;' +
  'outline:none;' +
  'font-weight:500;' +
  'min-width:88px;' +
  'box-sizing:border-box;' +
  'position:relative;' +
  `justify-content:center;` +
  `align-items:center;` +
  `align-content:center;` +
  'display:inline-flex;' +
  'cursor:pointer;' +
  '-webkit-user-select:none;' +
  '-moz-user-select:none;' +
  '-ms-user-select:none;' +
  'user-select:none;' +
  'text-decoration-line:none;' +
  '-webkit-text-decoration-line:none;' +
  'transition:all 375ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;' +
  `overflow: hidden;`;
}
