import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Config, ineqRegex } from './config';

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
  if (config.onlyVisibleText)
    return getVisibleText(result);
  return result;
}


async function fetchPage(config: Config): Promise<string> {
  return (await axios.create().get(config.url, {
      headers: {
          'User-Agent': config.userAgent,
      },
  })).data;
}

export function divideString(str: string, delimeter: string): string {
  const index = str.indexOf(delimeter);
  if (index !== -1) {
    return str.substring(index + delimeter.length);
  }
  return str;
}

export function parseInequality(config: Config): [string, number] {
  // Assuming str has already been validated
  if (!config.numericInequality) throw new Error('Missing inequality');

  const str = config.numericInequality;
  const inequality = ineqRegex.exec(str)?.[0] as string;

  const number = Number(str.substring(inequality.length).replace(",", ""));
  return [inequality, number];
}

export function execInequality(config: Config, match: string | null): boolean {
  if (!match) return false;
  match = match.replace(/[^\d.,]/g, ''); // Remove all characters except numbers, commas, and decimal points.
  let num = Number(match.replace(",", "")); // Normal 22,333.50
  if (config.decimalComma) num = Number(match.replace(".", "").replace(",", ".")); // DecimalComma, 22.333,50

  if (isNaN(num)) return false;
  const [inequality, number] = parseInequality(config);
  return compareNumbers(inequality, num, number);
}

function compareNumbers(inequality: string, a: number, b: number): boolean {
  switch (inequality) {
    case '<':
      return a < b;
    case '<=':
      return a <= b;
    case '>':
      return a > b;
    case '>=':
      return a >= b;
    case '=':
      return a === b;
    default:
      return false;
  }
}