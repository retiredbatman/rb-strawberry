var strawberry = (function() {
	var getElementOffset = function getElementOffset(element) {
		var rect = element.getBoundingClientRect();
		var body = document.body;
		var documentElem = document.documentElement;
		var oWidth = element.offsetWidth;
		var oHeight = element.offsetHeight;
		var scrollTop = window.pageYOffset || documentElem.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || documentElem.scrollLeft || body.scrollLeft;
		var clientTop = documentElem.clientTop || body.clientTop || 0;
		var clientLeft = documentElem.clientLeft || body.clientLeft || 0
		var top = rect.top + scrollTop - clientTop;
		var left = rect.left + scrollLeft - clientLeft;
		var bottom = top + oHeight;
		var right = left + oWidth;
		return {
			top: Math.round(top),
			left: Math.round(left),
			bottom: Math.round(bottom),
			right: Math.round(right)
		};
	};

	var normalizeEvent = function normalizeEvent(e) {
		e = e || window.event;
		if (!e.target) {
			e.target = e.srcElement;
		}
		return e;
	};

	//stops the event from bubbling up the DOM
	var stopBubbling = function stopBubbling(e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	};

	// add a class to the element
	var addClass = function addClass(element, classToAdd) {
		var currentClassValue = element.className;

		if (currentClassValue.indexOf(classToAdd) == -1) {
			if ((currentClassValue == null) || (currentClassValue === "")) {
				element.className = classToAdd;
			} else {
				element.className += " " + classToAdd;
			}
		}
	};

	//remove a class from the element
	var removeClass = function removeClass(element, classToRemove) {
		var currentClassValue = element.className;

		if (currentClassValue == classToRemove) {
			element.className = "";
			return;
		}

		var classValues = currentClassValue.split(" ");
		var filteredList = [];

		for (var i = 0; i < classValues.length; i++) {
			if (classToRemove != classValues[i]) {
				filteredList.push(classValues[i]);
			}
		}

		element.className = filteredList.join(" ");
	};

	// find if the element has a class
	var hasClass = function hasClass(element, classNameToTestFor) {
		var classNames = element.className.split(' ');
		for (var i = 0; i < classNames.length; i++) {
			if (classNames[i].toLowerCase() == classNameToTestFor.toLowerCase()) {
				return true;
			}
		}
		return false;
	};

	//add an event handler to the element
	// obj is the DOM element
	//type is the type of event
	// fn is the event handler function
	var addEvent = function addEvent(obj, type, fn, useCapture) {
		if (obj.attachEvent) {
			obj['e' + type + fn] = fn;
			obj[type + fn] = function() {
				obj['e' + type + fn](window.event);
			}
			obj.attachEvent('on' + type, obj[type + fn]);
		} else
			obj.addEventListener(type, fn, useCapture);
	};


	//remove an event handler to the element
	// obj is the DOM element
	//type is the type of event
	// fn is the event handler function
	var removeEvent = function removeEvent(obj, type, fn, useCapture) {
		if (obj.detachEvent) {
			obj.detachEvent('on' + type, obj[type + fn]);
			obj[type + fn] = null;
		} else
			obj.removeEventListener(type, fn, useCapture);
	};

	//check if an element inside another element
	var isChildOf = function isChildOf(child, parent) {
		if (child.parentNode === parent) {
			return true;
		} else if (child.parentNode === null) {
			return false;
		} else {
			return isChildOf(child.parentNode, parent);
		}
	};

	//function to remove all the event listeners on an element
	var removeEvents = function removeEvents(elem) {
		var old_element = elem;
		var new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);
		return new_element;
	};

	var debounce = function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this,
				args = arguments;
			var eventCopy = {};
			for (var i in args[0]) {
				eventCopy[i] = args[0][i];
			}
			args[0] = eventCopy;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	var mouseCoords = function mouseCoords(ev) {
		var evDoc, doc, body;
		if (!ev.pageX && ev.clientX) {
			evDoc = (ev.target && ev.target.ownerDocument) || document;
			doc = evDoc.documentElement;
			body = evDoc.body;

			ev.pageX = ev.clientX +
				(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
				(doc && doc.clientLeft || body && body.clientLeft || 0);
			ev.pageY = ev.clientY +
				(doc && doc.scrollTop || body && body.scrollTop || 0) -
				(doc && doc.clientTop || body && body.clientTop || 0);
		}
		return {
			x: ev.pageX,
			y: ev.pageY
		};
	};

	var emptyElem = function emptyElem(elem) {
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
	};

	var getScrollTop = function getScrollTop() {
		if (typeof pageYOffset != 'undefined') {
			//most browsers except IE before #9
			return pageYOffset;
		} else {
			var B = document.body; //IE 'quirks'
			var D = document.documentElement; //IE with doctype
			D = (D.clientHeight) ? D : B;
			return D.scrollTop;
		}
	};

	var getScrollLeft = function getScrollLeft() {
		if (typeof pageXOffset != 'undefined') {
			//most browsers except IE before #9
			return pageXOffset;
		} else {
			var B = document.body; //IE 'quirks'
			var D = document.documentElement; //IE with doctype
			D = (D.clientWidth) ? D : B;
			return D.scrollLeft;
		}
	};

	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function arrayForEach(callback, thisArg) {

			var T, k;

			if (this == null) {
				throw new TypeError(' this is null or not defined');
			}

			// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
			var O = Object(this);

			// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0;

			// 4. If IsCallable(callback) is false, throw a TypeError exception.
			// See: http://es5.github.com/#x9.11
			if (typeof callback !== "function") {
				throw new TypeError(callback + ' is not a function');
			}

			// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if (arguments.length > 1) {
				T = thisArg;
			}

			// 6. Let k be 0
			k = 0;

			// 7. Repeat, while k < len
			while (k < len) {

				var kValue;

				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				if (k in O) {

					// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
					kValue = O[k];

					// ii. Call the Call internal method of callback with T as the this value and
					// argument list containing kValue, k, and O.
					callback.call(T, kValue, k, O);
				}
				// d. Increase k by 1.
				k++;
			}
			// 8. return undefined
		};
	}

	if (!Array.prototype.some) {
		Array.prototype.some = function arraySome(fun /*, thisArg*/ ) {
			'use strict';

			if (this == null) {
				throw new TypeError('Array.prototype.some called on null or undefined');
			}

			if (typeof fun !== 'function') {
				throw new TypeError();
			}

			var t = Object(this);
			var len = t.length >>> 0;

			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++) {
				if (i in t && fun.call(thisArg, t[i], i, t)) {
					return true;
				}
			}

			return false;
		};
	}

	if (!Array.prototype.filter) {
		Array.prototype.filter = function(fun /*, thisArg*/ ) {
			'use strict';

			if (this === void 0 || this === null) {
				throw new TypeError();
			}

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== 'function') {
				throw new TypeError();
			}

			var res = [];
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++) {
				if (i in t) {
					var val = t[i];

					// NOTE: Technically this should Object.defineProperty at
					//       the next index, as push can be affected by
					//       properties on Object.prototype and Array.prototype.
					//       But that method's new, and collisions should be
					//       rare, so use the more-compatible alternative.
					if (fun.call(thisArg, val, i, t)) {
						res.push(val);
					}
				}
			}

			return res;
		};
	}

	if (!Array.prototype.findIndex) {
		Array.prototype.findIndex = function(predicate) {
			if (this === null) {
				throw new TypeError('Array.prototype.findIndex called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0;
			var thisArg = arguments[1];
			var value;

			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return i;
				}
			}
			return -1;
		};
	}


	return {
		getElementOffset: getElementOffset,
		addEvent: addEvent,
		debounce: debounce,
		normalizeEvent: normalizeEvent,
		addClass: addClass,
		mouseCoords: mouseCoords,
		removeClass: removeClass,
		emptyElem: emptyElem,
		removeEvents: removeEvents,
		hasClass: hasClass,
		getScrollTop: getScrollTop,
		getScrollLeft: getScrollLeft
	};
})();


module.exports = strawberry;