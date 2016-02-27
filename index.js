(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['./strawberry'], function(strawberry) {
			return factory(strawberry);;
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('./strawberry'));
	} else {
		root.strawberry = factory(root.strawberry);
	}
})(this, function(strawberry) {
	'use strict';

	return strawberry;
});