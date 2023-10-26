export abstract class HtmlUtilities {
	static elementFromString(htmlString: string): HTMLElement {
		let div: HTMLElement = document.createElement('div');
		div.innerHTML = htmlString.trim();
		return div.firstChild! as HTMLElement;
	}

	// static removeClassFromElements(querySelector: string, className: string): void {
	// 	document.querySelectorAll(querySelector).forEach((el: Element) => {
	// 		el.classList.remove(className);
	// 	});
	// }

	// static addClassFromElements(querySelector: string, className: string): void {
	// 	document.querySelectorAll(querySelector).forEach((el: Element) => {
	// 		el.classList.add(className);
	// 	});
	// }

	// static liveBind(eventType, elementQuerySelector, cb) {
	// 	//document.removeEventListener(eventType, handler);
	// 	document.addEventListener(eventType, event => {
	// 		let el = event.target.closest(elementQuerySelector);
	// 		if (el) {
	// 			cb.call(this, el, event);
	// 		}
	// 	});
	// }

	// static shake(el: HTMLElement): void {
	// 	el.classList.add('shake');
	// 	setTimeout(() => {
	// 		el.classList.remove('shake');
	// 	}, 350);
	// }
}