import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Config } from './config';

function isVisible(dom: JSDOM, element: Element) {
    const style = dom.window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
}
  
export function getVisibleText(page: string): string {
    let visibleText = "";
    const dom = new JSDOM(page);
    const node = dom.window.document.body;

    function traverse(node: Node): void {
      if (node.nodeType === dom.window.Node.TEXT_NODE && node.parentElement && isVisible(dom, node.parentElement)) {
        visibleText += node.textContent;
      } else if (node.nodeType === dom.window.Node.ELEMENT_NODE) {
        for (const child of node.childNodes) {
          traverse(child);
        }
      }
    }
  
    traverse(node);
    return visibleText;
}
  
export async function getDOM(url: string, userAgent: string): Promise<JSDOM> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
      },
    });
    return new JSDOM(await response.text());
}

export async function grabText(config: Config): Promise<string> {
  const result = await fetchPage(config);
  if (result == undefined)
    throw new Error('Failed to fetch page');
  if (config.onlyVisibleText)
    return getVisibleText(result);
  return result;
}


async function fetchPage(config: Config): Promise<string | undefined> {
  try {
      return (await axios.create().get(config.url, {
          headers: {
              'User-Agent': config.userAgent,
          },
      })).data;
  } catch (error) {
      console.error(error);
      return undefined;
  }
}

export function divideString(str: string, delimeter: string): string {
  const index = str.indexOf(delimeter);
  if (index !== -1) {
    return str.substring(index + delimeter.length);
  }
  return str;
}