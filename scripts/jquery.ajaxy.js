/**
 * @depends nothing
 * @name core.console
 * @package jquery-sparkle
 */

/**
 * Console Emulator
 * We have to convert arguments into arrays, and do this explicitly as webkit (chrome) hates function references, and arguments cannot be passed as is
 * @version 1.0.1
 * @since 1.0.0 June 20, 2010
 * @date July 09, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
if ( typeof window.console !== 'object' || typeof window.console.emulated === 'undefined' ) {
	// Check to see if console exists
	if ( typeof window.console !== 'object' || typeof window.console.log !== 'function' ) {
		// Console does not exist
		window.console = {};
		window.console.log = window.console.debug = window.console.warn = window.console.trace = function(){};
		window.console.error = function(){
			alert("An error has occured. Please use another browser to obtain more detailed information.");
		};
	}
	else {
		// Console is object, and log does exist
		// Check Debug
		if ( typeof window.console.debug === 'undefined' ) {
			window.console.debug = function(){
				var arr = ['console.debug:']; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
			    window.console.log.apply(window.console, arr);
			};
		}
		// Check Warn
		if ( typeof window.console.warn === 'undefined' ) {
			window.console.warn = function(){
				var arr = ['console.warn:']; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
			    window.console.log.apply(window.console, arr);
			};
		} 
		// Check Error
		if ( typeof window.console.error === 'undefined' ) {
			window.console.error = function(){
				var arr = ['console.error']; for(var i = 0; i < arguments.length; i++) { arr.push(arguments[i]); };
			    window.console.log.apply(window.console, arr);
			};
		}
		// Check Trace
		if ( typeof window.console.trace === 'undefined' ) {
			window.console.trace = function(){
			    window.console.error.apply(window.console, ['console.trace does not exist']);
			};
		}
	}
	// We have been emulated
	window.console.emulated = true;
}/**
 * @depends nothing
 * @name core.string
 * @package jquery-sparkle
 */

/**
 * Return a new string with any spaces trimmed the left and right of the string
 * @version 1.0.0
 * @date June 30, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
String.prototype.trim = String.prototype.trim || function() {
	// Trim off any whitespace from the front and back
	return this.replace(/^\s+|\s+$/g, '');
};

/**
 * Return a new string with the value stripped from the left and right of the string
 * @version 1.1.1
 * @date July 22, 2010
 * @since 1.0.0, June 30, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
String.prototype.strip = String.prototype.strip || function(value,regex){
	// Strip a value from left and right, with optional regex support (defaults to false)
	value = String(value);
	var str = this;
	if ( value.length ) {
		if ( !(regex||false) ) {
			// We must escape value as we do not want regex support
			value = value.replace(/([\[\]\(\)\^\$\.\?\|\/\\])/g, '\\$1');
		}
		str = str.replace(eval('/^'+value+'+|'+value+'+$/g'), '');
	}
	return String(str);
}

/**
 * Return a new string with the value stripped from the left of the string
 * @version 1.1.1
 * @date July 22, 2010
 * @since 1.0.0, June 30, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
String.prototype.stripLeft = String.prototype.stripLeft || function(value,regex){
	// Strip a value from the left, with optional regex support (defaults to false)
	value = String(value);
	var str = this;
	if ( value.length ) {
		if ( !(regex||false) ) {
			// We must escape value as we do not want regex support
			value = value.replace(/([\[\]\(\)\^\$\.\?\|\/\\])/g, '\\$1');
		}
		str = str.replace(eval('/^'+value+'+/g'), '');
	}
	return String(str);
}

/**
 * Return a new string with the value stripped from the right of the string
 * @version 1.1.1
 * @date July 22, 2010
 * @since 1.0.0, June 30, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
String.prototype.stripRight = String.prototype.stripRight || function(value,regex){
	// Strip a value from the right, with optional regex support (defaults to false)
	value = String(value);
	var str = this;
	if ( value.length ) {
		if ( !(regex||false) ) {
			// We must escape value as we do not want regex support
			value = value.replace(/([\[\]\(\)\^\$\.\?\|\/\\])/g, '\\$1');
		}
		str = str.replace(eval('/'+value+'+$/g'), '');
	}
	return String(str);
}

/**
 * Return a int of the string
 * @version 1.0.0
 * @date June 30, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
String.prototype.toInt = String.prototype.toInt || function(){
	// Convert to a Integer
	return parseInt(this,10);
};

/**
 * Return a new string of the old string wrapped with the start and end values
 * @version 1.0.0
 * @date June 30, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
String.prototype.wrap = String.prototype.wrap || function(start,end){
	// Wrap the string
	return start+this+end;
};

/**
 * Return a new string of a selection of the old string wrapped with the start and end values
 * @version 1.0.0
 * @date June 30, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
String.prototype.wrapSelection = String.prototype.wrapSelection || function(start,end,a,z){
	// Wrap the selection
	if ( typeof a === 'undefined' || a === null ) a = this.length;
	if ( typeof z === 'undefined' || z === null ) z = this.length;
	return this.substring(0,a)+start+this.substring(a,z)+end+this.substring(z);
};

/**
 * Return a new string of the slug of the old string
 * @version 1.1.0
 * @date July 16, 2010
 * @since 1.0.0, June 30, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
String.prototype.toSlug = String.prototype.toSlug || function(){
	// Convert a string to a slug
	return this.toLowerCase().replace(/[\s_]/g, '-').replace(/[^-a-z0-9]/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g,'');
}

/**
 * Return a new JSON object of the old string.
 * Turns:
 * 		file.js?a=1&amp;b.c=3.0&b.d=four&a_false_value=false&a_null_value=null
 * Into:
 * 		{"a":1,"b":{"c":3,"d":"four"},"a_false_value":false,"a_null_value":null}
 * @version 1.1.0
 * @date July 16, 2010
 * @since 1.0.0, June 30, 2010
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 */
String.prototype.queryStringToJSON = String.prototype.queryStringToJSON || function ( )
{	// Turns a params string or url into an array of params
	// Prepare
	var params = String(this);
	// Remove url if need be
	params = params.substring(params.indexOf('?')+1);
	// params = params.substring(params.indexOf('#')+1);
	// Change + to %20, the %20 is fixed up later with the decode
	params = params.replace(/\+/g, '%20');
	// Do we have JSON string
	if ( params.substring(0,1) === '{' && params.substring(params.length-1) === '}' )
	{	// We have a JSON string
		return eval(decodeURIComponent(params));
	}
	// We have a params string
	params = params.split(/\&(amp\;)?/);
	var json = {};
	// We have params
	for ( var i = 0, n = params.length; i < n; ++i )
	{
		// Adjust
		var param = params[i] || null;
		if ( param === null ) { continue; }
		param = param.split('=');
		if ( param === null ) { continue; }
		// ^ We now have "var=blah" into ["var","blah"]
		
		// Get
		var key = param[0] || null;
		if ( key === null ) { continue; }
		if ( typeof param[1] === 'undefined' ) { continue; }
		var value = param[1];
		// ^ We now have the parts
		
		// Fix
		key = decodeURIComponent(key);
		value = decodeURIComponent(value);
		try {
		    // value can be converted
		    value = eval(value);
		} catch ( e ) {
		    // value is a normal string
		}
		
		// Set
		// window.console.log({'key':key,'value':value}, split);
		var keys = key.split('.');
		if ( keys.length === 1 )
		{	// Simple
			json[key] = value;
		}
		else
		{	// Advanced (Recreating an object)
			var path = '',
				cmd = '';
			// Ensure Path Exists
			$.each(keys,function(ii,key){
				path += '["'+key.replace(/"/g,'\\"')+'"]';
				jsonCLOSUREGLOBAL = json; // we have made this a global as closure compiler struggles with evals
				cmd = 'if ( typeof jsonCLOSUREGLOBAL'+path+' === "undefined" ) jsonCLOSUREGLOBAL'+path+' = {}';
				eval(cmd);
				json = jsonCLOSUREGLOBAL;
				delete jsonCLOSUREGLOBAL;
			});
			// Apply Value
			jsonCLOSUREGLOBAL = json; // we have made this a global as closure compiler struggles with evals
			valueCLOSUREGLOBAL = value; // we have made this a global as closure compiler struggles with evals
			cmd = 'jsonCLOSUREGLOBAL'+path+' = valueCLOSUREGLOBAL';
			eval(cmd);
			json = jsonCLOSUREGLOBAL;
			delete jsonCLOSUREGLOBAL;
			delete valueCLOSUREGLOBAL;
		}
		// ^ We now have the parts added to your JSON object
	}
	return json;
};
/**
 * @depends jquery
 * @name jquery.events
 * @package jquery-sparkle
 */

/**
 * jQuery Aliaser
 */
(function($){
	
	/**
	 * Bind a event, with or without data
	 * Benefit over $.bind, is that $.binder(event, callback, false|{}|''|false) works.
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.binder = $.fn.binder || function(event, data, callback){
		// Help us bind events properly
		var $this = $(this);
		// Handle
		if ( (callback||false) ) {
			$this.bind(event, data, callback);
		} else {
			callback = data;
			$this.bind(event, callback);
		}
		// Chain
		return $this;
	};
	
	/**
	 * Bind a event only once
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.once = $.fn.once || function(event, data, callback){
		// Only apply a event handler once
		var $this = $(this);
		// Handle
		if ( (callback||false) ) {
			$this.unbind(event, callback);
			$this.bind(event, data, callback);
		} else {
			callback = data;
			$this.unbind(event, callback);
			$this.bind(event, callback);
		}
		// Chain
		return $this;
	};
	
	/**
	 * Event for pressing the enter key
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.enter = $.fn.enter || function(data,callback){
		return $(this).binder('enter',data,callback);
	};
	$.event.special.enter = $.event.special.cancel || {
		setup: function( data, namespaces ) {
			$(this).bind('keypress', $.event.special.enter.handler);
		},
		teardown: function( namespaces ) {
			$(this).unbind('keypress', $.event.special.enter.handler);
		},
		handler: function( event ) {
			// Prepare
			var $el = $(this);
			// Setup
			var enterKey = event.keyCode === 13;
			if ( enterKey ) {
				// Our event
				event.type = 'enter';
				$.event.handle.apply(this, [event]);
				return true;
			}
			// Not our event
			return;
		}
	};
	
	/**
	 * Event for pressing the escape key
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.cancel = $.fn.cancel || function(data,callback){
		return $(this).binder('cancel',data,callback);
	};
	$.event.special.cancel = $.event.special.cancel || {
		setup: function( data, namespaces ) {
			$(this).bind('keyup', $.event.special.cancel.handler);
		},
		teardown: function( namespaces ) {
			$(this).unbind('keyup', $.event.special.cancel.handler);
		},
		handler: function( event ) {
			// Prepare
			var $el = $(this);
			// Setup
			var moz = typeof event.DOM_VK_ESCAPE === 'undefined' ? false : event.DOM_VK_ESCAPE;
			var escapeKey = event.keyCode === 27;
			if ( moz || escapeKey ) {
				// Our event
				event.type = 'cancel';
				$.event.handle.apply(this, [event]);
				return true;
			}
			// Not our event
			return;
		}
	};
	
	/**
	 * Event for the last click for a series of one or more clicks
	 * @version 1.0.0
	 * @date July 16, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.lastclick = $.fn.lastclick || function(data,callback){
		return $(this).binder('lastclick',data,callback);
	};
	$.event.special.lastclick = $.event.special.lastclick || {
		setup: function( data, namespaces ) {
			$(this).bind('click', $.event.special.lastclick.handler);
		},
		teardown: function( namespaces ) {
			$(this).unbind('click', $.event.special.lastclick.handler);
		},
		handler: function( event ) {
			// Setup
			var clear = function(){
				// Fetch
				var Me = this;
				var $el = $(Me);
				// Fetch Timeout
				var timeout = $el.data('lastclick-timeout')||false;
				// Clear Timeout
				if ( timeout ) {
					clearTimeout(timeout);
				}
				timeout = false;
				// Store Timeout
				$el.data('lastclick-timeout',timeout);
			};
			var check = function(event){
				// Fetch
				var Me = this;
				clear.call(Me);
				var $el = $(Me);
				// Store the amount of times we have been clicked
				$el.data('lastclick-clicks', ($el.data('lastclick-clicks')||0)+1);
				// Handle Timeout for when All Clicks are Completed
				var timeout = setTimeout(function(){
					// Fetch Clicks Count
					var clicks = $el.data('lastclick-clicks');
					// Clear Timeout
					clear.apply(Me,[event]);
					// Reset Click Count
					$el.data('lastclick-clicks',0);
					// Fire Event
					event.type = 'lastclick';
					$.event.handle.apply(Me, [event,clicks])
				},500);
				// Store Timeout
				$el.data('lastclick-timeout',timeout);
			};
			// Fire
			check.apply(this,[event]);
		}
	};
	
	/**
	 * Event for the first click for a series of one or more clicks
	 * @version 1.0.0
	 * @date July 16, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.firstclick = $.fn.firstclick || function(data,callback){
		return $(this).binder('firstclick',data,callback);
	};
	$.event.special.firstclick = $.event.special.firstclick || {
		setup: function( data, namespaces ) {
			$(this).bind('click', $.event.special.firstclick.handler);
		},
		teardown: function( namespaces ) {
			$(this).unbind('click', $.event.special.firstclick.handler);
		},
		handler: function( event ) {
			// Setup
			var clear = function(event){
				// Fetch
				var Me = this;
				var $el = $(Me);
				// Fetch Timeout
				var timeout = $el.data('firstclick-timeout')||false;
				// Clear Timeout
				if ( timeout ) {
					clearTimeout(timeout);
				}
				timeout = false;
				// Store Timeout
				$el.data('firstclick-timeout',timeout);
			};
			var check = function(event){
				// Fetch
				var Me = this;
				clear.call(Me);
				var $el = $(Me);
				// Update the amount of times we have been clicked
				$el.data('firstclick-clicks', ($el.data('firstclick-clicks')||0)+1);
				// Check we are the First of the series of many
				if ( $el.data('firstclick-clicks') === 1 ) {
					// Fire Event
					event.type = 'firstclick';
					$.event.handle.apply(Me, [event])
				}
				// Handle Timeout for when All Clicks are Completed
				var timeout = setTimeout(function(){
					// Clear Timeout
					clear.apply(Me,[event]);
					// Reset Click Count
					$el.data('firstclick-clicks',0);
				},500);
				// Store Timeout
				$el.data('firstclick-timeout',timeout);
			};
			// Fire
			check.apply(this,[event]);
		}
	};
	
	/**
	 * Event for performing a singleclick
	 * @version 1.1.0
	 * @date July 16, 2010
	 * @since 1.0.0, June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.singleclick = $.fn.singleclick || function(data,callback){
		return $(this).binder('singleclick',data,callback);
	};
	$.event.special.singleclick = $.event.special.singleclick || {
		setup: function( data, namespaces ) {
			$(this).bind('click', $.event.special.singleclick.handler);
		},
		teardown: function( namespaces ) {
			$(this).unbind('click', $.event.special.singleclick.handler);
		},
		handler: function( event ) {
			// Setup
			var clear = function(event){
				// Fetch
				var Me = this;
				var $el = $(Me);
				// Fetch Timeout
				var timeout = $el.data('singleclick-timeout')||false;
				// Clear Timeout
				if ( timeout ) {
					clearTimeout(timeout);
				}
				timeout = false;
				// Store Timeout
				$el.data('singleclick-timeout',timeout);
			};
			var check = function(event){
				// Fetch
				var Me = this;
				clear.call(Me);
				var $el = $(Me);
				// Update the amount of times we have been clicked
				$el.data('singleclick-clicks', ($el.data('singleclick-clicks')||0)+1);
				// Handle Timeout for when All Clicks are Completed
				var timeout = setTimeout(function(){
					// Fetch Clicks Count
					var clicks = $el.data('singleclick-clicks');
					// Clear Timeout
					clear.apply(Me,[event]);
					// Reset Click Count
					$el.data('singleclick-clicks',0);
					// Check Click Status
					if ( clicks === 1 ) {
						// There was only a single click performed
						// Fire Event
						event.type = 'singleclick';
						$.event.handle.apply(Me, [event])
					}
				},500);
				// Store Timeout
				$el.data('singleclick-timeout',timeout);
			};
			// Fire
			check.apply(this,[event]);
		}
	};
	

})(jQuery);/**
 * @depends jquery
 * @name jquery.extra
 * @package jquery-sparkle
 */

/**
 * jQuery Aliaser
 */
(function($){
	
	/**
	 * Opacity Fix for Text without Backgrounds
	 * Fixes the text corrosion during opacity effects by forcing a background-color value on the element.
	 * The background-color value is the the same value as the first parent div which has a background-color.
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.opacityFix = $.fn.opacityFix || function(){
		var $this = $(this);
		
		// Check if this fix applies
		var color = $this.css('background-color');
		if ( color && color !== 'rgba(0, 0, 0, 0)' ) {
			return this;
		}
		
		// Apply the background colour of the first parent which has a background colour
		var $parent = $this;
		while ( $parent.inDOM() ) {
			$parent = $parent.parent();
			color = $parent.css('background-color');
			if ( color && color !== 'rgba(0, 0, 0, 0)' ) {
				$this.css('background-color',color);
				break;
			}
		}
		
		// Chain
		return this;
	};
	
	/**
	 * Get all elements above ourself which match the selector, and include ourself in the search
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.parentsAndSelf = $.fn.parentsAndSelf || function(selector){
		var $this = $(this);
		return $this.parents(selector).andSelf().filter(selector);
	};
	
	/**
	 * Get all elements within ourself which match the selector, and include ourself in the search
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.findAndSelf = $.fn.findAndSelf || function(selector){
		var $this = $(this);
		return $this.find(selector).andSelf().filter(selector);
	};
	
	/**
	 * Find the first input, and include ourself in the search
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.firstInput = $.fn.firstInput || function(){
		var $this = $(this);
		return $this.findAndSelf(':input').filter(':first');
	};
	
	/**
	 * Select a option within options, checkboxes, radios and selects.
	 * Rather than setting the actual value of a element which $el.val does.
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.choose = $.fn.choose||function(value){
		var $this = $(this);
		if ( typeof value === 'undefined' ) {
			value = $this.val();
		} else if ( $this.val() !== value ) {
			// Return early, don't match
			return this;
		}
		switch ( true ) {
			case this.is('option'):
				$this.parents('select:first').choose(value);
				break;
			case $this.is(':checkbox'):
				$this.attr('checked', true);
				break;
			case $this.is(':radio'):
				$this.attr('checked', true);
				break;
			case $this.is('select'):
				$this.val(value);
				break;
			default:
				break;
		}
		return this;
	};
	
	/**
	 * Deselect a option within options, checkboxes, radios and selects.
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.unchoose = $.fn.unchoose||function(){
		var $this = $(this);
		switch ( true ) {
			case $this.is('option'):
				$this.parents(':select:first').unchoose();
				break;
			case $this.is(':checkbox'):
				$this.attr('checked', false);
				break;
			case $this.is(':radio'):
				$this.attr('checked', false);
				break;
			case $this.is('select'):
				$this.val($this.find('option:first').val());
				break;
			default:
				break;
		}
		return this;
	};
	
	/**
	 * Checks if the element would be passed with the form if the form was submitted.
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.wouldSubmit = $.fn.wouldSubmit || function(){
		var $input = $(this).findAndSelf(':input');
		var result = true;
		if ( !$input.length || !($input.attr('name')||false) || ($input.is(':radio,:checkbox') && !$input.is(':selected,:checked')) ) {
			result = false;
		}
		return result;
	};
	
	/**
	 * Grab all the values of a form in JSON format if the form would be submitted.
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.values = $.fn.values || function(){
		var $inputs = $(this).findAndSelf(':input');
		var values = {};
		$inputs.each(function(){
			var $input = $(this);
			var name = $input.attr('name') || null;
			var value = $input.val();
			// Skip if wouldn't submit
			if ( !$input.wouldSubmit() ) {
				return true;
			}
			// Set value
			if (name.indexOf('[]') !== -1) {
				// We want an array
				if (typeof values[name] === 'undefined') {
					values[name] = [];
				}
				values[name].push(value);
			}
			else {
				values[name] = value;
			}
		});
		return values;
	};
	
	/**
	 * Submit the form which the element is associated with.
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.submitForm = $.fn.submitForm || function(){
		// Submit the parent form or our form
		var $this = $(this);
		// Handle
		var $form = $this.parentsAndSelf('form:first').trigger('submit');
		// Chain
		return $this;
	};
	
	/**
	 * Checks if the element is attached within the DOM
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.inDOM = function(){
		var $ancestor = $(this).parent().parent();
		return $ancestor.size() && ($ancestor.height()||$ancestor.width());
	};
	
	/**
	 * Wrap the element's value with the passed start and end text
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.valWrap = function(start,end){
		// Wrap a value
		var $field = $(this);
		return $field.val($field.val().wrap(start,end));
	};
	
	/**
	 * Wrap a selection of the element's value with the passed start and end text
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.valWrapSelection = function(start,end,a,z){
		// Wrap the selected text
		var $field = $(this);
		var field = $field.get(0);
		start = start||'';
		end = end||'';
		if ( a || z ) {
			$field.val($field.val().wrapSelection(start,end,a,z));
		}
		else {
			var a = field.selectionStart,
				z = field.selectionEnd;
			if ( document.selection) {
				field.focus();
				var sel = document.selection.createRange();
				sel.text = start + sel.text + end;
			}
			else {
				var scrollTop = field.scrollTop;
				$field.val($field.val().wrapSelection(start,end,a,z));
				field.focus();
				field.selectionStart = a+start.length;
				field.selectionEnd = z+start.length;
				field.scrollTop = scrollTop;
			}
		}
		return $field;
	};
	
	/**
	 * Find (with regards to the element) the first visible input element, and give focus to it
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.giveFocus = function(){
		// Give focus to the current element
		var $this = $(this);
		var selector = ':input:visible:first';
		$this.findAndSelf(selector).focus();
		return this;
	};
	
	/**
	 * Perform the highlight effect
	 * @version 1.0.0
	 * @date June 30, 2010
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 */
	$.fn.highlight = function(duration){
		// Perform the Highlight Effect
		return $(this).effect('highlight', {}, duration||3000);
	};
	

})(jQuery);/**
 * @depends jquery, core.console, core.string, jquery.extra
 * @name jquery.ajaxy
 * @package jquery-ajaxy
 */

/**
 * jQuery Aliaser
 */
(function($){
	// Create our Plugin function, with $ as the argument (we pass the jQuery object over later)
	// More info: http://docs.jquery.com/Plugins/Authoring#Custom_Alias
	
	/**
	 * Prepare Body
	 */
	$(document.body).addClass('js');

	/**
	 * jQuery Ajaxy - jQuery's DRY Effect Library
	 * @version 1.2.0
	 * @date July 11, 2010
	 * @since 1.0.0, June 30, 2010
 	 * @copyright (c) 2009-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 	 * @license GNU Affero General Public License - {@link http://www.gnu.org/licenses/agpl.html}
	 */
	if ( !($.Ajaxy||false) ) {
		/**
		 * Ajaxy
		 */
		$.Ajaxy = {
		
			// -----------------
			// Options
		
			/**
			 * User configuration
			 */
			options: {
				/**
				 * The hostname our application is using.
				 * For production use, you want to ensure this has been set.
				 */
				root_url: '',
				/**
				 * The base url our application is using.
				 * For production use, you want to ensure this has been set.
				 */
				base_url: '',
				/**
				 The short url of the page we are using. */
				relative_url: '',
				
				/**
				 * The CSS class that can be attached to a Ajaxy link to indicate we should not log this page in history.
				 */
				no_history_class: 'ajaxy-no_history,ajaxy__no_history', // __ for b/c
				/**
				 * Whether or not we should default to use the request controller if not controller was returned in the response.
				 * For production use, you want to ensure this has been set to false. As we should always send the controller to be used with the response.
				 */
				use_request_controller_as_default: true,
				/**
				 * Whether or not we should perform the initial redirect if we have detected we are on a page.
				 * For production use, you want to ensure this has been set to false. As we should always want to ensure we are in the correct location.
				 */
				redirect: false,
				/**
				 * Whether or not we want to set the initial relative_url as the base_url if we are too lasy to configure this properly.
				 * For production use, you want to ensure this has been set to false. As we should always have our urls configured correctly.
				 */
				relative_as_base: true,
				/**
				 * Whether or not we should support plain text responses in our Ajax requests, as well as the standard JSON.
				 * If this is set to true and text was sent back on a Ajax request, then response_data will have the following structure:
				 * 		{
				 * 			content: responseText
				 * 		}
				 * For production use, you want to ensure this has been set to false. As we should always be returning JSON instead of text.
				 */
				support_text: true,
				/**
				 * Whether or not we should automatically inform Google Analytics of a Ajaxy request, if GA has been detected.
				 */
				analytics: true,
				/**
				 * Whether or not we should automatically find all ajaxy links and ajaxify them on DOM ready.
				 */
				auto_ajaxify: true,
				/**
				 * Whether or not we should output as much debugging information as possible.
				 * For production use, you want to ensure this has been set to false. As we should always never want the client to see debug information.
				 */
				debug: true
			},
		
			// -----------------
			// Variables
		
			/**
			 * Have we been constructed
			 */
			constructed: false,
		
			/**
			 * Collection of Controllers
			 */
			controllers: {},
		
			/**
			 * Collection of hashes
			 */
			hashes: {},
		
			/**
			 * Queue for our events
			 * @param {Object} hash
			 */
			ajaxqueue: [],
		
			/**
			 * Our assigned data
			 * @param {Object} data
			 */
			data: {},
			
			/**
			 * Contains any redirect data in case we were
			 * @param {Object} redirected
			 */
			redirected: false,
			
			// --------------------------------------------------
			// Functions
		
			/**
			 * Format a hash accordingly
			 * @param {String} hash
			 */
			format: function (hash){
				var Ajaxy = $.Ajaxy; var History = $.History;
				// Strip urls
				hash = hash.replace(/^\//, '').strip(Ajaxy.options.root_url).strip(Ajaxy.options.base_url);
				// History format
				hash = History.format(hash);
				// Slash
				if ( hash ) hash = '/'+hash;
				// All good
				return hash;
			},
		
			/**
			 * Bind controllers
			 * Either via Ajaxy.bind(controller, options), or Ajaxy.bind(controllers)
			 * @param {String} controller
			 * @param {Object} options
			 */
			bind: function ( controller, options ) {
				var Ajaxy = $.Ajaxy;
				// Add a controller
				if ( typeof options === 'undefined' && typeof controller === 'object' ) {
					// Array of controllers
					for (index in controller) {
						Ajaxy.bind(index, controller[index]);
					}
					return true;
				} else if ( typeof options === 'function' ) {
					// We just have the response handler
					options = {
						'response': options
					}
				} else if ( typeof options !== 'object' ) {
					// Unknown handlers
					window.console.error('AJAXY: Bind: Unknown option type', controller, options);
					return false;
				}
			
				// Create the controller
				if ( typeof Ajaxy.controllers[controller] === 'undefined' ) {
					Ajaxy.controllers[controller] = {
						trigger:function(action){
							return Ajaxy.trigger(controller, action);
						},
						ajaxy_data: {},
						response_data: {},
						request_data: {},
						error_data: {}
					};
				}
			
				// Bind the handlers to the controller
				for ( option in options ) {
					Ajaxy.controllers[controller][option] = options[option];
				}
			
				// Ajaxify the controller
				Ajaxy.ajaxifyController(controller);
			
				// Done
				return true;
			},
			
			/**
			 * Trigger the action for the particular controller
			 * @param {Object} controller
			 * @param {Object} action
			 * @param {Object} args
			 * @param {Object} params
			 */
			trigger: function ( controller, action, args, params ) {
				var Ajaxy = $.Ajaxy;
				// Trigger
				if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.trigger: ', [this, arguments, params]);
			
				// Fire the state handler
				params = params || {};
				args = args || [];
				var i, n, list, call_generic;
				call_generic = true;
			
				// Check Controller
				if ( typeof controller === 'undefined' || controller === null ) {
					window.console.info('Ajaxy.trigger: Controller Reset', [controller, action], [this, arguments]);
					controller = '_generic';
				}
				if ( typeof Ajaxy.controllers[controller] === 'undefined' ) {
					// No Controller
					window.console.error('Ajaxy.trigger: No Controller', [controller, action], [this, arguments]);
					window.console.trace();
					if ( controller !== '_generic' ) {
						Ajaxy.trigger('_generic', 'error', args, params);
					}
					return false;
				}
			
				// Check Controller Action
				if ( typeof Ajaxy.controllers[controller][action] === 'undefined' ) {
					// No Action
					window.console.error('Ajaxy.trigger: No Controller Action', [controller, action], [this, arguments]);
					window.console.trace();
					if ( controller !== '_generic' ) {
						Ajaxy.trigger('_generic', 'error', args, params);
					}
					return false;
				}
			
				// Apply the Params to the Controller
				params.propagate = (typeof params.propagate === 'undefined' || params.propagate) ? true : false;
				params.state = params.hash = params.hash||null;
				params.controller = params.controller||null;
				params.form = params.form||null;
				params.request_data = params.request_data||{};
				params.request_data = params.request_data||{};
				params.response_data = params.response_data||{};
				params.error_data = params.error_data||{};
				params.user_data = params.user_data||{};
				params.ajaxy_data = $.extend({},{
					controller: controller,
					action: action
				}, params.ajaxy_data||{});
			
				// Apply
				Ajaxy.controllers[controller].state = params.hash;
				Ajaxy.controllers[controller].hash = params.hash;
				Ajaxy.controllers[controller].controller = params.controller;
				Ajaxy.controllers[controller].form = params.form;
				Ajaxy.controllers[controller].propagate = params.propagate;
				Ajaxy.controllers[controller].request_data = params.request_data;
				Ajaxy.controllers[controller].response_data = params.response_data;
				Ajaxy.controllers[controller].error_data = params.error_data;
				Ajaxy.controllers[controller].user_data = params.user_data;
				Ajaxy.controllers[controller].ajaxy_data = params.ajaxy_data;
			
				// Forward
				Ajaxy.controllers[controller].forward = function(_controller, _action, _args, _params){
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.triger.forward:', [controller, action, args, params], [this, arguments]);
					_action = _action||action;
					_args = _args||args;
					_params = _params||this;
					Ajaxy.trigger(_controller, _action, _args, _params);
					return true;
				}
			
				// Fire the specific handler
				var handler = Ajaxy.controllers[controller][action];
				var result = handler.apply(Ajaxy.controllers[controller], args);
				//if ( result === false ) {
				if ( Ajaxy.controllers[controller].propagate === false ) {
					// Break
					call_generic = false;
				}
			
				// Fire generic
				if ( call_generic && controller !== '_generic' ) {
					// Fire generic
					Ajaxy.controllers[controller].forward('_generic');
				}
				
				// Return true
				return true;
			},
		
			/**
			 * Get a piece of data
			 * @param {Object} name
			 */
			get: function ( name ) {
				var Ajaxy = $.Ajaxy;
			
				//
				if ( typeof Ajaxy.data[name] !== 'undefined' ) {
					return Ajaxy.data[name];
				} else {
					return undefined;
				}
			},
		
			/**
			 * Set a piece (or pieces) of data
			 * Ajaxy.set(data), Ajaxy.set(name, value)
			 * @param {Object} data
			 * @param {Object} value
			 */
			set: function ( data, value ) {
				var Ajaxy = $.Ajaxy;
			
				// Set route data
				if ( typeof value === 'undefined' ) {
					if ( typeof data === 'object' ) {
						Ajaxy.data.extend(true, data);
					}
				} else {
					Ajaxy.data[data] = value;
				}
			},
		
			/**
			 * Refresh
			 */
			refresh: function(){
				var Ajaxy = $.Ajaxy; var History = $.History;
				// Go
				return Ajaxy.go(History.getHash());
			},
		
			/**
			 * Perform an Ajaxy Request
			 * @param {Object} data
			 */
			go: function ( data ) {
				var Ajaxy = $.Ajaxy; var History = $.History;
				// Go
				if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.go:', [this, arguments]);
			
				// Ensure format
				if ( typeof data === 'string' ) {
					// We have just a hash
					data = {
						hash: data
					};
				}
			
				// Ensure callbacks
			
				// Prepare
				var hashdata = {
					url: 			data.url || null,
					hash: 			data.hash || null,
					controller: 	data.controller || null,
					form: 			data.form || null,
					data: 			data.data || {},
					history:		typeof data.history === 'undefined' ? null : data.history,
					response: 		data.response || data.success || null,
					request:		data.request || null,
					error: 			data.error || null
				};
			
				// Ensure hash
				if ( !hashdata.hash && hashdata.url ) {
					hashdata.hash = Ajaxy.format(hashdata.url);
					// We have a URL
					// Don't log by default
					if ( hashdata.history === null ) {
						hashdata.history = false;
					}
				} else if ( hashdata.form ) {
					// We have a form
					// Don't log by default
					if ( hashdata.history === null ) {
						hashdata.history = false;
					}
				} else {
					// We are normal
					// Do log by default
					if ( hashdata.history === null ) {
						hashdata.history = true;
					}
				}
			
				// Ensure
				hashdata.history = hashdata.history ? true : false
			
				// Check hash
				if ( !hashdata.hash ) {
					window.console.error('Ajaxy.request: No hash');
					return false;
				} else {
					hashdata.hash = Ajaxy.format(hashdata.hash);
				}
			
				// Figure it out
				if ( hashdata.hash !== History.getHash() && Ajaxy.options.debug ) {
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request: Trigger but no change.', hashdata.hash);
				}
			
				// Assign data for reuse
				Ajaxy.hashes[hashdata.hash] = hashdata;
			
				// Trigger hash
				if ( hashdata.history ) {
					// Log the history
					// Trigger automaticly
					History.go(hashdata.hash);
				} else {
					// Don't log
					// Trigger manually
					Ajaxy.hashchange(hashdata.hash);
				}
			
				// Done
				return true;
			},
		
			/**
			 * Track a state change in Google Analytics
			 * @param {String} state
			 */
			track: function ( state ) {
				var History = $.History;
			
				// Inform Google Analytics of a state change
				if ( typeof pageTracker !== 'undefined' ) {
					pageTracker._trackPageview('/'+state);
				}
			},
		
			/**
			 * Send an Ajaxy Request
			 * @param {Object} hash
			 */
			request: function (hash) {
				var Ajaxy = $.Ajaxy; var History = $.History;
			
				// Format the hash
				hash = Ajaxy.format(hash);
			
				// Check if we were a redirect
				if ( Ajaxy.redirected !== false ) {
					// We were, ignore as we have already been fired
					Ajaxy.redirected = false;
					return;
				}
			
				// Add to AJAX queue
				Ajaxy.ajaxqueue.push(hash);
				if ( Ajaxy.ajaxqueue.length !== 1 ) {
					// Already processing an event
					return false;
				}
			
				// Fire the analytics
				if ( this.options.analytics ) {
					Ajaxy.track(hash);
				}
			
				// Ensure the hashdata
				var hashdata;
				hashdata = Ajaxy.hashes[hash] = Ajaxy.hashes[hash] || {};
				hashdata.url = (hashdata.url || Ajaxy.options.root_url+Ajaxy.options.base_url+(hash.replace(/^\//, '') || '?'));
				hashdata.hash = hash;
				hashdata.controller = hashdata.controller || null;
				hashdata.form = hashdata.form || null;
				hashdata.data = hashdata.data || {};
				hashdata.data.Ajaxy = true;
				hashdata.response = hashdata.response || null;
				hashdata.request = hashdata.request || null;
				hashdata.error = hashdata.error || null;
				hashdata.request_data = hashdata.request_data||{};
				hashdata.response_data = hashdata.response_data||{};
				hashdata.error_data = hashdata.error_data||{};
			
				// Trigger Request
				Ajaxy.trigger('_generic', 'request');
			
				// Define handlers
				var request;
				request = {
					data: hashdata.data,
					url: hashdata.url,
					type: 'post',
					success: function(response_data, status){
						// Success
						if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request.success:', [this, arguments]);
					
						// Prepare
						response_data = response_data || {};
						response_data.Ajaxy = response_data.Ajaxy || {};
					
						// Check for redirect
						if ( response_data.Ajaxy.redirected ) {
							// A redirect was performed, set a option so we know what to do
							var newhash = Ajaxy.format(response_data.Ajaxy.redirected.to);
							Ajaxy.redirected = {
								status: true,
								from: hash,
								to: newhash
							};
							// Update the history, not ajaxy
							History.go(newhash);
							// We do the redirect check up the top, so no worries here, this one flows through like normal
						};
					
						// Success function
						Ajaxy.ajaxqueue.shift()
						var queue_hash = Ajaxy.ajaxqueue.pop();
						if (queue_hash && queue_hash !== hash) {
							Ajaxy.ajaxqueue = []; // abandon others
							Ajaxy.hashchange(queue_hash);
							return false; // don't care for this
						}
					
						// Prepare
						hashdata.response_data = response_data;
						hashdata.error_data = {};
					
						// Check controller
						var controller = response_data.controller || null;
					
						// Default Controller?
						if ( !controller && Ajaxy.options.use_request_controller_as_default ) {
							controller = hashdata.controller;
						}
						
						// Fire callback
						if ( hashdata.response ) {
							if ( hashdata.response.apply(hashdata, arguments) || controller === 'callback' ) {
								// Ignore the rest
								return true;
							}
							if ( !controller ) {
								// If we are continueing on, ignore missing controller
								controller = '_generic';
							}
						}
					
						// Trigger handler
						return Ajaxy.trigger(controller, 'response', [], hashdata);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown, response_data){
						// Error
						if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request.error:', [this, arguments]);
					
						// Prepare
						if ( !response_data ) {
							// Should already be handled, but in the rare case it isn't
							response_data = {
								responseText: XMLHttpRequest.responseText.trim()||false
							}
						}
					
						// Handler queue
						Ajaxy.ajaxqueue.shift()
						var queue_hash = Ajaxy.ajaxqueue.pop();
						if (queue_hash && queue_hash !== hash) {
							Ajaxy.ajaxqueue = []; // abandon others
							Ajaxy.hashchange(queue_hash);
							return false; // don't care for this
						}
					
						// Prepare
						var error_data = {
							XMLHttpRequest: XMLHttpRequest,
							textStatus: textStatus,
							errorThrown: errorThrown
						};
					
						// Prepare
						hashdata.request_data.XMLHttpRequest = XMLHttpRequest;
						hashdata.response_data = response_data;
						hashdata.error_data = {};
					
						// Check controller
						var controller = response_data.controller || null;
					
						// Fire callback
						if ( hashdata.response ) {
							if ( hashdata.response.apply(hashdata, arguments) || controller === 'callback' ) {
								// Ignore the rest
								return true;
							}
							if ( !controller ) {
								// If we are continueing on, ignore missing controller
								controller = '_generic';
							}
						}
					
						// Trigger handler
						return Ajaxy.trigger(controller, 'error', [], hashdata);
					},
				
					complete:	function ( XMLHttpRequest, textStatus ) {
						// Request completed
						if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request.complete:', [this, arguments]);
						// Set XMLHttpRequest
						hashdata.request_data.XMLHttpRequest = XMLHttpRequest;
						// Ignore for some reason
						if ( false && this.url !== XMLHttpRequest.channel.name ) {
							// A redirect was performed, set a option so we know what to do
							var newhash = Ajaxy.format(XMLHttpRequest.channel.name);
							Ajaxy.redirected = {
								status: true,
								from: hash,
								to: newhash
							};
							// Update the history, not ajaxy
							History.go(newhash);
						};
					}
				};
			
				// Handle form if need be
				if ( hashdata.form ) {
					var $form = $(hashdata.form);
					
					// Determine form type
					var enctype = $form.attr('enctype');
					if ( enctype === 'multipart/form-data' ) {
						// We are a complicated form
						// Submit via target
					
						// Generate iframe
						var iframe_id = 'ajaxy_form_iframe_' + Math.floor(Math.random() * 99999);
						var $iframe = $('<iframe style="display:none" src="about:blank" id="'+iframe_id+'" name="'+iframe_id+'" >').appendTo('body').hide();
						var $ajax = $('<input type="hidden" name="ajax" value="true"/>').appendTo($form);
						var $hidden = $('<input type="hidden" name="Ajaxy[form]" value="true"/>').appendTo($form);
					
						// Event
						$iframe.bind('load', function(){
							var iframe = this.document || this.currentDocument || this.contentWindow.document;
						
							// Check location
							if ( iframe.location.href === 'about:blank' ) {
								return true;
							}
						
							// Fire handler
							var text = $iframe.contents().find('.response').val();
							var json = false;
							try {
								json = JSON.parse(text);
							} catch ( e ) {
								window.console.error('Invalid response: ', text, [this, arguments]);
							}
							if ( json ) {
								request.success(json);
							} else {
								request.error(json);
							}
						
							// Clean up
							$form.removeAttr('target');
							$iframe.remove();
							$ajax.remove();
							$hidden.remove();
						});
					
						// Adjust the form
						$form.attr('target', iframe_id);
					
						// Submit the form
						$form.submit();

						// Update
						var values = $form.values();
						request.data = hashdata.data = $.extend(request.data, values);
						hashdata.request_data = request;
					
						// Done with this
						return true;
					}
					else {
						// Normal form
						var values = $form.values();
						request.data = hashdata.data = $.extend(request.data, values);
					}
				}
			
				// Update
				hashdata.request_data = request;
			
				// Perform AJAX request
				return Ajaxy.ajax(request);
			},
		
		
			/**
			 * Wrapper for Ajaxy Request
			 * @param {Object} data
			 */
			ajax: function(options){
				var Ajaxy = $.Ajaxy; var History = $.History;
				// Defaults
				var callbacks = {};
				callbacks.success = options.success || function (response_data, status) {
					// Success
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.callbacks.success:', [this, arguments]);
					// Handle
					$('.error').empty();
				};
				callbacks.error = options.error || function (XMLHttpRequest, textStatus, errorThrown, response_data) {
					// Error
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.callbacks.error:', [this, arguments]);
					// Handle
					$('.error').html(errorThrown);
				};
				callbacks.complete = options.complete || function(XMLHttpRequest, textStatus){
					// Request completed
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.callbacks.complete:', [this, arguments]);
				};
				delete options.success;
				delete options.error;
				delete options.complete;
			
				// Prepare
				var request = $.extend({
					type:		'post',
					dataType:	(Ajaxy.options.support_text ? 'text' : 'json')
				}, options || {});
				
				// Handlers
				request.success = function(responseText, status){
					// Success
					var response_data = {};
					
					// Parse
					if ( Ajaxy.options.support_text ) {
						if ( responseText ) {
							try {
								// Try JSON
								response_data = JSON.parse(responseText);
							} catch (e) {
								// Not Valid JSON
								response_data = {
									content: responseText
								};
							} finally {
								// Is Valid, so already assigned
							}
						}
					}
					else {
						// Using JSON
						response_data = responseText;
					}
					
					// Debug
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.success:', [this, arguments], [Ajaxy, response_data, responseText]);
					
					// Check
					if ( typeof response_data.controller === 'undefined' && ((typeof response_data.success !== 'undefined' && !response_data.success) || (typeof response_data.error !== 'undefined' && response_data.error)) ) {
						// Error on simple Ajax request, not Ajaxy
						return callbacks.error.apply(this, [null, status, response_data.error||true, response_data]);
					}
					
					// Fire
					return callbacks.success.apply(this, [response_data, status]);
				};
				request.error = function(XMLHttpRequest, textStatus, errorThrown) {
					// Error
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.error:', [this, arguments]);
				
					// Prepare Response
					var responseText = XMLHttpRequest.responseText||false;
					if ( responseText ) responseText = responseText.trim();
					if ( !responseText ) responseText = false;
				
					// Prepare Data
					var response_data = {
						error: errorThrown||true,
						responseText: responseText
					};
					
					// Check if Response
					if ( responseText ) {
						try {
							// Try JSON
							response_data = JSON.parse(responseText);
						} catch (e) {
							// Not Valid JSON
						} finally {
							// Is Valid, so Move
							return this.success.apply(this, [response_data, textStatus]);
						}
					}
					
					// Apply
					return callbacks.error.apply(this, [XMLHttpRequest, textStatus, errorThrown, response_data]);
				};
			
				// Send the Request
				return $.ajax(request);
			},
		
		
			/**
			 * Handler for a hashchange
			 * @param {Object} hash
			 */
			hashchange: function ( hash ) {
				var Ajaxy = $.Ajaxy; var History = $.History;
			
				// Perform the Request
				Ajaxy.request(hash);
			},
		
			// --------------------------------------------------
			// Constructors
		
			/**
			 * Configure Ajaxy
			 * @param {Object} options
			 */
			configure: function ( options ) {
				var Ajaxy = $.Ajaxy; var History = $.History;
			
				// Extract
				var controllers, routes;
				if ( typeof options.controllers !== 'undefined' ) {
					controllers = options.controllers; delete options.controllers;
				}
				if ( typeof options.routes !== 'undefined' ) {
					routes = options.routes; delete options.routes;
				}
			
				// Set options
				Ajaxy.options = $.extend(Ajaxy.options, options);
			
				// Set params
				Ajaxy.bind(controllers);
			
			
				// URLs
				Ajaxy.options.root_url = (Ajaxy.options.root_url || document.location.protocol.toString()+'//'+document.location.hostname.toString()).replace(/\/$/, '')+'/';
				Ajaxy.options.base_url = (Ajaxy.options.base_url || '').replace(/^\/|\/$/g, '');
				if ( Ajaxy.options.base_url ) Ajaxy.options.base_url += '/';
				Ajaxy.options.relative_url = Ajaxy.format(Ajaxy.options.relative_url || document.location.pathname.toString().replace(/^\//, ''));
				
				// Relative as Base
				if ( Ajaxy.options.relative_as_base ) {
					if ( Ajaxy.options.base_url.length === 0 ) {
						Ajaxy.options.base_url = Ajaxy.options.relative_url;
						Ajaxy.options.relative_url = "";
					}
				}
				
				// Debug
				if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.configure:', [this, arguments]);
				
				// Initial redirect
				if ( Ajaxy.options.redirect && Ajaxy.options.relative_url && Ajaxy.options.relative_url !== null  ) {
					var location = Ajaxy.options.root_url+Ajaxy.options.base_url+'#'+Ajaxy.options.relative_url;
					document.location = location;
				}
			
				// Done
				return true;
			},
		
			/**
			 * Construct Ajaxy
			 * @param {Object} options
			 */
			construct: function ( ) {
				// Construct our Plugin
				var Ajaxy = $.Ajaxy; var History = $.History;
			
				// Check if we've been constructed
				if ( Ajaxy.constructed ) {
					return;
				} else {
					Ajaxy.constructed = true;
				}
			
				// Set AJAX History Handler
				History.bind(function(hash){
					// History Handler
					return Ajaxy.hashchange(hash);
				});
			
				// Bind fn functions
				$.fn.ajaxify = Ajaxy.ajaxify;
				$.fn.ajaxy = Ajaxy.ajaxify;
			
				// Modify the document
				$(function(){
					// On document ready
					Ajaxy.domReady();
					History.domReady();
				});
			
				// All done
				return true;
			},
		
			/**
			 * Perform any DOM manipulation
			 */
			domReady: function ( ) {
				// We are good
				var Ajaxy = $.Ajaxy;
			
				// Auto ajaxify?
				if ( Ajaxy.options.auto_ajaxify ) {
					$('body').ajaxify();
				}
			
				// All done
				return true;
			},
		
			/**
			 * Ajaxify an Element
			 * Eg. $('#id').ajaxify();
			 * @param {Object} options
			 */
			ajaxify: function ( options ) {
				var Ajaxy = $.Ajaxy;
				var $this = $(this);
				// Ajaxify the controllers
				for ( var controller in $.Ajaxy.controllers ) {
					$.Ajaxy.ajaxifyController(controller);
				}
				// Add the onclick handler for ajax compatiable links
				$this.findAndSelf('a.ajaxy').once('click',Ajaxy.ajaxify_helpers.a);
				// Add the onclick handler for ajax compatiable forms
				$this.findAndSelf('form.ajaxy').once('submit',Ajaxy.ajaxify_helpers.form);
				// And chain
				return this;
			},
		
			/**
			 * Ajaxify a particullar controller
			 * @param {String} controller
			 */
			ajaxifyController: function(controller) {
				var Ajaxy = $.Ajaxy; var History = $.History;
				// Do selector
				if ( typeof this.controllers[controller]['selector'] !== 'undefined' ) {
					// We have a selector
					$(function(){
						// Onload
						var $els = $(Ajaxy.controllers[controller]['selector']);
						$els.data('ajaxy-controller',controller).once('click',Ajaxy.ajaxify_helpers.a);
					});
				}
			},
			
			/**
			 * Ajaxify Helpers for particular types of elements
			 */
			ajaxify_helpers: {
				a: function(event){
					var Ajaxy = $.Ajaxy;
					// We have a ajax link
					var $this = $(this);
					var hash = Ajaxy.format($this.attr('href'));
					var history = !$this.hasClass(Ajaxy.options.no_history_class);
					var controller = $this.data('ajaxy-controller')||null;
					var result = Ajaxy.go({
						'hash': hash,
						'controller': controller,
						'history': history
					});
					// Prevent
					event.stopPropagation();
					event.preventDefault();
					return false;
				},
				form: function(event){
					var Ajaxy = $.Ajaxy;
					// Get the form
					var $form = $(this);
					// Check
					var disabled = $form.attr('disabled'); disabled = disabled || disabled === 'false';
					if ( disabled ) {
						return false;
					}
					// See if we are in the middle of a request
					if ( $form.attr('target') ) {
						// We are, so proceed with the request
						return true;
					}
					// Generate the hash
					var hash = $.Ajaxy.format($form.attr('action'));//.replace(/[?\.]?\/?/, '#/');
					// Perform request
					Ajaxy.go({
						'hash':	hash,
						'form':	this
					});
					// Prevent
					event.stopPropagation();
					event.preventDefault();
					return false;
				}
			}
	
		};
	
		// Construct
		$.Ajaxy.construct();
	}
	else {
		window.console.warn('$.Ajaxy has already been defined...');
	}
	
// Finished definition
})(jQuery); // We are done with our plugin, so lets call it with jQuery as the argument
