import * as Promise from 'bluebird';
import * as $ from 'jquery';

import { isFn } from './type';
import { GOOGLE_MAPS_KEY } from '../env';

let googleMapsScriptTask: Promise<HTMLScriptElement>;

/**
 * @stable [14.06.2018]
 * @param {string} tag
 * @param {Element} parent
 * @returns {TElement}
 */
export const createElement = <TElement extends HTMLElement = HTMLElement>(tag = 'div',
                                                                          parent: Element = document.body): TElement => {
  const el: TElement = document.createElement(tag) as TElement;
  addChild(el, parent);
  return el;
};

/**
 * @stable [31.07.2018]
 * @param {{} | HTMLScriptElement} cfg
 * @returns {Bluebird<HTMLScriptElement>}
 */
export const createScript = (cfg: {} | HTMLScriptElement): Promise<HTMLScriptElement> => new Promise<HTMLScriptElement>((resolve) => {
  const el = createElement<HTMLScriptElement>('script');
  el.type = 'text/javascript';
  el.onload = () => resolve(el);
  Object.assign(el, cfg);
});

/**
 * @stable [31.07.2018]
 * @param {{} | HTMLScriptElement} cfg
 * @returns {Bluebird<HTMLScriptElement>}
 */
export const getGoogleMapsScript = (cfg?: {} | HTMLScriptElement) =>
  googleMapsScriptTask = googleMapsScriptTask || createScript({
    ...cfg,
    src: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`,
  });

/**
 * @stable [30.07.2018]
 * @param {Element} element
 * @param {string} clsName
 */
export const addClassNameToElement = (element: Element, ...clsName: string[]): void =>
  element.classList.add(...clsName);

/**
 * @stable [30.07.2018]
 * @param {Element} element
 * @param {string} clsName
 */
export const removeClassNameFromElement = (element: Element, ...clsName: string[]): void =>
  element.classList.remove(...clsName);

export const addClassNameToBody = (clsName: string): void => addClassNameToElement(document.body, clsName);

export const removeClassNameFromBody = (clsName: string): void => removeClassNameFromElement(document.body, clsName);

/**
 * @stable [28.06.2018]
 * @param {Element} child
 * @param {Element} parent
 * @returns {Element}
 */
export const addChild = (child: Element, parent: Element = document.body): Element => parent.appendChild(child);

/**
 * @stable [28.06.2018]
 * @param {Element} child
 * @param {Element} parent
 * @returns {Element}
 */
export const removeChild = (child: Element, parent: Element = document.body): Element => parent.removeChild(child);

/**
 * @stable [14.06.2018]
 * @param {string} images
 */
export const createPreloadedImg = (...images: string[]): void => {
  const preloadedWrapper = createElement();
  preloadedWrapper.style.width = '0px';
  preloadedWrapper.style.height = '0px';

  images.forEach((src) => {
    const el = createElement<HTMLImageElement>('img', preloadedWrapper);
    el.src = src;
    el.style.height = '0px';
    el.style.width = '0px';
  });
};

/**
 * @stable [30.07.2018]
 * @param {HTMLElement} source
 * @param {Element} sourceAnchor
 */
export const setAbsoluteOffset = (source: HTMLElement, sourceAnchor: Element): void => {
  const offset0 = $(sourceAnchor).offset();
  const anchor = $(sourceAnchor);
  setAbsoluteOffsetByCoordinates(source, offset0.left, offset0.top + anchor.height());
};

/**
 * @stable [30.07.2018]
 * @param {HTMLElement} source
 * @param {number | (() => number)} left
 * @param {number | (() => number)} top
 */
export const setAbsoluteOffsetByCoordinates = (source: HTMLElement,
                                               left: number | (() => number),
                                               top: number | (() => number)): void => {
  source.style.position = 'absolute';
  source.style.left = `${isFn(left) ? (left as () => number)() : left}px`;
  source.style.top = `${isFn(top) ? (top as () => number)() : top}px`;
};

/**
 * @stable [16.06.2018]
 * @param {HTMLElement} source
 * @param {Element} sourceAnchor
 */
export const adjustWidth = (source: HTMLElement, sourceAnchor: Element): void => {
  const anchor = $(sourceAnchor);
  source.style.width = `${anchor.width()}px`;
};

/**
 * @stable [23.06.2018]
 * @returns {boolean}
 */
export const isDocumentHasFocus = (): boolean => isFn(document.hasFocus) && document.hasFocus();

/**
 * @stable [28.06.2018]
 * @param {string} fileName
 * @param {Blob} blob
 */
export const downloadFile = (fileName: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);

  try {
    const loader = createElement<HTMLAnchorElement>('a');
    addClassNameToElement(loader, 'rac-invisible');

    loader.href = url;
    loader.download = fileName;
    loader.click();

    removeChild(loader);
  } finally {
    URL.revokeObjectURL(url);
  }
};

/**
 * @stable [30.07.2018]
 * @returns {() => boolean}
 */
export const preventContextMenu = () => document.body.oncontextmenu = () => false;
