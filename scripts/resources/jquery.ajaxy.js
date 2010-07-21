/**
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
