import { JSDOM } from 'jsdom';
import { Config } from './config';

function isVisible(dom: JSDOM, element: Element) {
    const style = dom.window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
}
  
export function getVisibleText(dom: JSDOM, node: Node): string {
    let visibleText = "";
  
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
  const dom: JSDOM = await getDOM(config.url, config.userAgent);
  if (config.onlyVisibleText) return getVisibleText(dom, dom.window.document.body);
  return dom.serialize();
}