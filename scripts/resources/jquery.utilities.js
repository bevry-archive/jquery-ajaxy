/**
 * @depends jquery
 * @name jquery.utilities
 * @package jquery-sparkle {@link http://balupton.com/projects/jquery-sparkle}
 */

/**
 * jQuery Aliaser
 */
(function($){

	/**
	 * Creates a new object, which uses baseObject's structure, and userObject's values when applicable
	 * @params {Object} baseObject
	 * @params {Object} userObject
	 * @params {Object} ...
	 * @return {Object} newObject
	 * @version 1.0.0
	 * @date August 01, 2010
	 * @since 1.0.0
     * @package jquery-sparkle {@link http://balupton.com/projects/jquery-sparkle}
	 * @author Benjamin "balupton" Lupton {@link http://balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://balupton.com}
	 * @license MIT License {@link http://creativecommons.org/licenses/MIT/}
	 */
	$.prepareObject = $.prepareObject || function(baseObject,userObject) {
		var newObject = {};
		var skipValue = '$.prepareObject.skipValue';

		// Extend newObject
		$.extend(newObject,baseObject||{});

		// Intercept with the userObject
		$.intercept(true,newObject,userObject);

		// Handle additional params
		var objects = arguments;
		objects[0] = objects[1] = skipValue;

		// Cycle through additional objects
		$.each(objects,function(i,object){
			// Check if we want to skip
			if ( object === skipValue ) return true; // continue
			// Intercept with the object
			$.intercept(true,newObject,object);
		});

		// Return the newObject
		return newObject;
	};

	/**
	 * Intercept two objects
	 * @params [deep], &object1, object2, ...
	 * @version 1.0.0
	 * @date August 01, 2010
	 * @since 1.0.0
     * @package jquery-sparkle {@link http://balupton.com/projects/jquery-sparkle}
	 * @author Benjamin "balupton" Lupton {@link http://balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://balupton.com}
	 * @license MIT License {@link http://creativecommons.org/licenses/MIT/}
	 */
	$.intercept = $.intercept || function() {
		// Prepare
		var objects = arguments,
			object,
			deep = false,
			copy = false;
		var skipValue = '$.intercept.skipValue';

		// Check Deep
		if ( typeof objects[0] === 'boolean' ) {
			deep = objects[0];
			objects[0] = skipValue;
			// Check Copy
			if ( typeof objects[1] === 'boolean' ) {
				copy = objects[1];
				objects[1] = skipValue;
				// Handle Copy
				if ( copy ) {
					object = {};
				}
				else {
					object = objects[2];
					objects[2] = skipValue;
				}
			}
			else {
				object = objects[1];
				objects[1] = skipValue;
			}
		}
		else {
			object = objects[0];
			objects[0] = skipValue;
		}

		// Grab Keys
		var keys = {};
		$.each(object,function(key){
			keys[key] = true;
		});

		// Intercept Objects
		if ( deep ) {
			// Cycle through objects
			$.each(objects, function(i,v){
				// Check if we want to skip
				if ( v === skipValue ) return true; // continue
				// Cycle through arguments
				$.each(v, function(key,value){
					// Check if the key exists so we can intercept
					if ( typeof keys[key] === 'undefined' ) return true; // continue
					// It exists, check value type
					if ( typeof value === 'object' && !(value.test||false && value.exec||false) ) {
						// Extend this object
						$.extend(object[key],value||{});
					}
					else {
						// Copy value over
						object[key] = value;
					}
				});
			})
		}
		else {
			// Cycle through objects
			$.each(objects, function(i,v){
				// Cycle through arguments
				$.each(v, function(key,value){
					// Check if the key exists so we can intercept
					if ( typeof keys[key] === 'undefined' ) return true; // continue
					// It exists, check value type
					if ( typeof value === 'object' && !(value.test||false && value.exec||false) ) {
						// Intercept this object
						$.intercept(true,object[key],value);
					}
					else {
						// Copy value over
						object[key] = value;
					}
				});
			})
		}

		// Return object
		return object;
	};

	/**
	 * Handle a Promise
	 * @param {Object} options.object
	 * @param {String} options.handlers
	 * @param {String} options.flag
	 * @param {Funtion} options.handler
	 * @return {Boolean} Whether or not the promise is ready
	 * @version 1.0.0
	 * @date August 31, 2010
	 * @since 1.0.0
     * @package jquery-sparkle {@link http://balupton.com/projects/jquery-sparkle}
	 * @author Benjamin "balupton" Lupton {@link http://balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://balupton.com}
	 * @license MIT License {@link http://creativecommons.org/licenses/MIT/}
	 */
	$.promise = $.promise || function(options){
		// Extract
		var	object = options.object||this;

		// Check
		if ( typeof object[options.handlers] === 'undefined' ) {
			object[options.handlers] = [];
		}
		if ( typeof object[options.flag] === 'undefined' ) {
			object[options.flag] = false;
		}

		// Extract
		var	handlers = object[options.handlers],
			flag = object[options.flag],
			handler = options.arguments[0];

		// Handle
		switch ( typeof handler ) {
			case 'boolean':
				// We want to set the flag as true or false, then continue on
				flag = object[options.flag] = handler;
				// no break, as we want to continue on

			case 'undefined':
				// We want to fire the handlers, so check if the flag is true
				if ( flag && handlers.length ) {
					// Fire the handlers
					$.each(handlers, function(i,handler){
						handler.call(object);
					});
					// Clear the handlers
					object[options.handlers] = [];
				}
				break;

			case 'function':
				// We want to add or fire a handler, so check the flag
				if ( flag ) {
					// Fire the event handler
					handler.call(object);
				}
				else {
					// Add to the handlers
					object[options.handlers].push(handler);
				}
				break;

			default:
				window.console.error('Unknown arguments for $.promise', [this, arguments]);
				break;
		}

		// Return flag
		return flag;
	}

})(jQuery);
