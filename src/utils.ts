/**
 * @param el the target html element
 * @param styles the styles list you want to add to the elemennt
 *
 * Its usage is just like its name
 * Copy the css from styles element to the element
 */
export const copyCss = (el: HTMLElement, styles: CSSStyleDeclaration) => {
	el.style.cssText = Object.values(styles).reduce(
		(css, property) => `${css}${property}:${styles[property]};`
	);
}
