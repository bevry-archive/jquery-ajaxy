/**
 * @depends jquery, core.console, core.string, jquery.extra
 * @name jquery.ajaxy
 * @package jquery-ajaxy {@link http://www.balupton/projects/jquery-ajaxy}
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
	 * jQuery Ajaxy
	 * @version 1.4.0
	 * @date August 01, 2010
	 * @since 0.1.0-dev, July 24, 2008
     * @package jquery-ajaxy {@link http://www.balupton/projects/jquery-ajaxy}
	 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
	 * @copyright (c) 2008-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
	 * @license GNU Affero General Public License version 3 {@link http://www.gnu.org/licenses/agpl-3.0.html}
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
				no_log_class: 'ajaxy-no_log',
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
				 * If this is set to true and text was sent back on a Ajax request, then responseData will have the following structure:
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
				debug: true,
				/**
				 * The Controllers to use
				 */
				Controllers: {}
			},
		
			// -----------------
			// Variables
			
			/**
			 * Default Structures
			 */
			defaults: {
				/**
				 * Default Controller Structure
				 * All Controllers inherit and are bound to this
				 */
				Controller: {
					// Options
					selector: null,
					matches: null,
					
					// System
					controller: null,
					
					// Actions
					response: null,
					request: null,
					error: null
				},
				
				Action: {
					// Options
					propagate: true,
					
					// System
					action: null,
					state: null,
					State: null,
					controller: null,
					Controller: null,
					
					// Ajaxy Helper Functions
					forward: function(){
						window.console.error('Ajaxy.Action.forward: Forward never defined.', [this, arguments]);
						window.console.trace();
					},
					trigger: function(){
						window.console.error('Ajaxy.Action.trigger: Trigger never defined.', [this, arguments]);
						window.console.trace();
					},
					stopPropagation: function(){
						this.propagate = false;
					},
					preventDefault: function(){
						this.propagate = false;
					}
				},
				
				/**
				 * Default State Structure
				 * All Controllers inherit and are bound to this
				 * State is associated with a particular state
				 */
				State: {
					// Options
					log: null,
					form: false,
					
					// System
					state: null,
					controller: null,
					
					/** The Request Object that is used in the $.Ajax */
					Request: {
						data: {}
					},
					
					/* The Response Object which is returned in our Ajax Request */
					Response: {
						callback: null,
						data: {}
					},
					
					/* The Response Object which is returned from an Error in our Ajax Request */
					Error: {
						callback: null,
						data: {}
					},
					
					/* Any user data specific to the state should go in here. This is not used by Ajaxy. */
					User: {
						data: {}
					}
				}
			},
			
			/**
			 * Have we been constructed
			 */
			constructed: false,
		
			/**
			 * Collection of Controllers
			 */
			Controllers: {},
		
			/**
			 * Collection of states
			 */
			States: {},
			
			/**
			 * Queue for our events
			 * @param {Object} state
			 */
			ajaxQueue: [],
		
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
			 * Format a state accordingly
			 * @param {String} state
			 */
			format: function (state){
				var Ajaxy = $.Ajaxy; var History = $.History;
				
				// Strip urls
				state = state.replace(/^\//, '').strip(Ajaxy.options.root_url).strip(Ajaxy.options.base_url);
				
				// History format
				state = History.format(state);
				
				// Slash
				if ( state ) state = '/'+state;
				
				// All good
				return state;
			},
		
			/**
			 * Bind controllers
			 * Either via Ajaxy.bind(controller, options), or Ajaxy.bind(controllers)
			 * @param {String} controller
			 * @param {Object} Controller
			 */
			bind: function ( controller, Controller ) {
				var Ajaxy = $.Ajaxy;
				
				// Add a controller
				if ( typeof Controller === 'undefined' && typeof controller === 'object' ) {
					// Array of controllers
					$.each(controller,Ajaxy.bind);
					return true;
				}
				else if ( typeof Controller === 'function' ) {
					// We just have the response handler
					Controller = {
						'response': Controller
					}
				}
				else if ( typeof Controller !== 'object' ) {
					// Unknown handlers
					window.console.error('Ajaxy.bind: Unknown option type', [this, arguments]);
					window.console.trace();
					return false;
				}
				
				// Create the Controller
				if ( typeof Ajaxy.getController(controller,false) === 'undefined' ) {
					Ajaxy.storeController(
						$.prepareObject(
							Ajaxy.defaults.Controller,
							{
								'controller': controller
							},
							Controller
						)
					);
				}
				else {
					// Already bound
					window.console.error('Ajaxy.bind: Controller already bound.', [this, arguments]);
					window.console.trace();
					return false;
				}
				
				// Ajaxify the Controller
				if ( Ajaxy.options.auto_ajaxify ) {
					Ajaxy.ajaxifyController(controller);
					return true; // prevent closure complaint
				}
			
				// Done
				return true;
			},
			
			/**
			 * Trigger the action for the particular controller
			 * @param {String} controller
			 * @param {String} action
			 * @param {Object} State
			 */
			trigger: function ( controller, action, state ) {
				var Ajaxy = $.Ajaxy;
				if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.trigger: ', [this, arguments]);
				
				// Prepare
				var i, n, list, call_generic = true;
				
				// Check Input
				if ( !controller ) {
					window.console.warn('Ajaxy.trigger: No controller was passed, reset to _generic.', [this, arguments]);
					controller = '_generic';
				}
				
				// --------------------------
				// Fetch
				
				// Fetch Controller
				var Controller = Ajaxy.getController(controller);
				
				// Fetch Controller Action
				var ControllerAction = Ajaxy.getControllerAction(controller,action,false);
				
				// Fetch the State
				var State = Ajaxy.getState(state,true),
					state = State.state||undefined;
				
				// --------------------------
				// Checks
				
				// Check Controller
				if ( typeof Controller === 'undefined' ) {
					// No Controller
					window.console.error('Ajaxy.trigger: Controller does not exist', [this, arguments]);
					window.console.trace();
					if ( controller !== '_generic' ) {
						Ajaxy.trigger('_generic', 'error', State);
					}
					return false;
				}
				
				// Check Controller Action
				if ( typeof ControllerAction === 'undefined' ) {
					// No Action
					window.console.error('Ajaxy.trigger: No Controller Action', [this, arguments]);
					window.console.trace();
					if ( controller !== '_generic' ) {
						Ajaxy.trigger('_generic', 'error', State);
					}
					return false;
				}
				
				// --------------------------
				// Prepare Action
				
				// Generate Action
				var Action = $.extend({},Ajaxy.defaults.Action,{
					'action':action,
					'controller':controller,
					'Controller':Controller,
					'state':state,
					'State':State
				});
				
				// Setup up the Trigger + Forward Actions
				Action.forward = Action.trigger = function(_controller, _action, _state){
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.Action.trigger:', [this, arguments]);
					
					// Prepare
					_controller = _controller||controller;
					_action = _action||action;
					_state = _state||state;
					
					// Trigger
					Ajaxy.trigger(_controller, _action, _state);
					
					// Return true
					return true;
				};
				
				// --------------------------
				// Fire
				
				// Fire the ControllerAction Handler
				var result = ControllerAction.apply(Action, []);
				
				// Should we continue to Propagate through
				if ( Action.propagate === false ) {
					// Break
					call_generic = false;
				}
				
				// Fire generic?
				if ( call_generic && controller !== '_generic' ) {
					// Fire generic
					Action.forward('_generic');
				}
				
				// --------------------------
				
				// Return true
				return true;
			},
		
			/**
			 * Get a piece of data
			 * @param {Object} name
			 */
			get: function ( name ) {
				var Ajaxy = $.Ajaxy;
				
				// Fetch data
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
			 * @param {String|Object} UserState
			 */
			go: function ( UserState ) {
				var Ajaxy = $.Ajaxy; var History = $.History;
				if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.go:', [this, arguments]);
			
				// --------------------------
				
				// Ensure format
				if ( typeof UserState === 'string' ) {
					// We have just a state
					UserState = {
						state: UserState
					};
				}
				
				// Prepare State
				var State = $.extend(true,{},Ajaxy.defaults.State,UserState);
				
				// --------------------------
				
				// Ensure state and log
				if ( !State.state && State.url ) {
					State.state = Ajaxy.format(State.url);
					// We have a URL
					// Don't log by default
					if ( State.log === null || State.log === undefined ) {
						State.log = false;
					}
				} else if ( State.form ) {
					// We have a form
					// Don't log by default
					if ( State.log === null || State.log === undefined ) {
						State.log = false;
					}
				} else {
					// We are normal
					// Do log by default
					if ( State.log === null || State.log === undefined ) {
						State.log = true;
					}
				}
			
				// Ensure log is a boolean (never null)
				State.log = State.log ? true : false
			
				// --------------------------
				
				// Check state
				if ( !State.state ) {
					window.console.error('Ajaxy.go: No state', [this, arguments]);
					return false;
				} else {
					State.state = Ajaxy.format(State.state);
				}
				
				// Figure it out
				if ( State.state === History.getHash() && Ajaxy.options.debug ) {
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.go: Trigger but no change.', State.state);
				}
				
				// Store it
				Ajaxy.storeState(State);
			
				// --------------------------
				
				// Trigger state
				if ( State.log ) {
					// Log the history
					// Trigger automaticly
					History.go(State.state);
				} else {
					// Don't log
					// Trigger manually
					Ajaxy.stateChange(State.state);
				}
				
				// --------------------------
				
				// Return true
				return true;
			},
			
			/**
			 * Get the Controller Action
			 * @param {String|Object} controller
			 * @return {Object|undefined}
			 */
			getControllerAction: function ( controller, action, create ) {
				var Ajaxy = $.Ajaxy;
				
				// Prepare
				var ControllerAction = undefined,
					Controller = Ajaxy.getController(controller,false);
				
				// Fetch
				if ( typeof Controller === 'undefined' ) {
					if ( create === false ) {
						// Don't report couldn't find
					}
					else {
						window.console.error('Ajaxy.getControllerAction: Controller does not exist', [this, arguments]);
						window.console.trace();
					}
				}
				else {
					var controllerActionType = typeof (Controller[action]||undefined);
					if ( controllerActionType === 'function' || controllerActionType === 'object' ) {
						ControllerAction = Controller[action];
					}
					else if ( create === false ) {
						// Don't report couldn't find
					}
					else {
						window.console.error('Ajaxy.getControllerAction: Controller Action does not exist', [this, arguments]);
						window.console.trace();
					}
				}
				
				// Return ControllerAction
				return ControllerAction;
			},
			
			/**
			 * Store a Controller Object
			 * @param {Object} Controller
			 */
			storeController: function ( Controller ) {
				var Ajaxy = $.Ajaxy;
				
				// Prepare
				var result = true,
					controllerType = typeof (Controller||undefined);
					
				// Fetch
				if ( controllerType === 'object' && typeof Controller.controller === 'string' ) {
					result = Ajaxy.Controllers[Controller.controller] = Controller;
				}
				else {
					window.console.error('Ajaxy.getController: Unkown Controller Format', [this, arguments]);
					window.console.trace();
					result = false;
				}
			
				// Return result
				return result;
			},
			
			/**
			 * Get the controller's Controller Object
			 * @param {String|Object} controller
			 * @return {Object|undefined}
			 */
			getController: function ( controller, create ) {
				var Ajaxy = $.Ajaxy;
				
				// Prepare
				var Controller = undefined,
					controllerType = typeof (controller||undefined);
				
				// Fetch
				if ( (controllerType === 'number' || controllerType === 'string') && typeof Ajaxy.Controllers[controller] !== 'undefined' ) {
					Controller = Ajaxy.Controllers[controller];
				}
				else if ( controllerType === 'object' && typeof controller.controller === 'string' ) {
					Controller = Ajaxy.getController(controller.controller,create);
				}
				else if ( create ) {
					Controller = $.extend({},Ajaxy.defaults.Controller);
				}
				else if ( create === false ) {
					// Don't report couldn't find
				}
				else {
					// Report couldn't find
					window.console.error('Ajaxy.getController: Controller does not exist', [this, arguments]);
					window.console.trace();
				}
			
				// Return Controller
				return Controller;
			},
			
			/**
			 * Store a State Object
			 * @param {Object} state
			 */
			storeState: function ( State ) {
				var Ajaxy = $.Ajaxy;
				
				// Prepare
				var result = true,
					stateType = typeof (State||undefined);
				
				// Fetch
				if ( stateType === 'object' && typeof State.state === 'string' ) {
					result = Ajaxy.States[State.state] = State;
				}
				else {
					window.console.error('Ajaxy.getState: Unkown State Format', [this, arguments]);
					window.console.trace();
					result = false;
				}
			
				// Return result
				return result;
			},
			
			/**
			 * Get the state's State Object
			 * @param {String|Object} state
			 * @return {Object|undefined}
			 */
			getState: function ( state, create ) {
				var Ajaxy = $.Ajaxy;
				
				// Prepare
				var State = undefined,
					stateType = typeof (state||undefined);
				
				// Fetch
				if ( (stateType === 'number' || stateType === 'string') && typeof Ajaxy.States[state] !== 'undefined' ) {
					State = Ajaxy.States[state];
				}
				else if ( stateType === 'object' && typeof state.state === 'string' ) {
					State = Ajaxy.getState(state.state,create);
				}
				else if ( create ) {
					State = $.extend({},Ajaxy.defaults.State);
				}
				else if ( create === false ) {
					// Don't report couldn't find
				}
				else {
					// Report couldn't find
					window.console.error('Ajaxy.getState: State does not exist', [this, arguments]);
					window.console.trace();
				}
			
				// Return State
				return State;
			},
			
			/**
			 * Track a state change in Google Analytics
			 * @param {String} state
			 */
			track: function ( state ) {
				var Ajaxy = $.Ajaxy;
			
				// Inform Google Analytics of a state change
				if ( typeof pageTracker !== 'undefined' ) {
					pageTracker._trackPageview(Ajaxy.options.base_url+'/'+state);
					// ^ we do not use root url here as google doesn't want that
					//   but it does want the base url here
					//   http://www.google.com/support/googleanalytics/bin/answer.py?answer=55521
				}
				
				// Done
				return true;
			},
			
			/**
			 * Determines the result of a matches against a state
			 * @param {Regex|Array|String} matches
			 * @param {String} state
			 */
			matches: function ( matches, state ) {
				var Ajaxy = $.Ajaxy;
				var isAMatch = false;
				
				// Handle matches
				switch ( typeof matches ) {
					// Objects
					case 'function':
					case 'object':
						if ( matches.test||false && matches.exec||false ) {
							// Regular Expression
							isAMatch = matches.test(state);
							break;
						}
					case 'array':
						$.each(matches, function(i,match){
							isAMatch = Ajaxy.matches(match,state);
							if ( isAMatch ) return false; // break out of $.each
						});
						break;
					
					// Exact
					case 'number':
					case 'string':
						isAMatch = (String(matches) === state);
						break;
				}
				
				// Return isAMatch
				return isAMatch;
			},
			
			/**
			 * Match the state against the controllers
			 * @param {String} state
			 */
			match: function ( state ) {
				var Ajaxy = $.Ajaxy;
				var matchedController = false;
				
				// Cycle through
				$.each(Ajaxy.Controllers, function(controller,Controller){
					// Check for matches
					var matches = Ajaxy.matches(Controller.matches||false, state);
					// Did we find a match?
					if ( matches ) {
						matchedController = controller;
						return false; // break out of $.each
					}
				});
				
				// Return matchedController
				return matchedController;
			},
			
			/**
			 * Send an Ajaxy Request
			 * @param {Object} state
			 */
			request: function (state) {
				var Ajaxy = $.Ajaxy; var History = $.History;
				if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request:', [this, arguments]);
				
				// Prepare variables
				var skip_ajax = false;
				
				// --------------------------
				
				// Format the state
				state = Ajaxy.format(state);
			
				// Check if we were a redirect
				if ( Ajaxy.redirected !== false ) {
					// We were, ignore as we have already been fired
					Ajaxy.redirected = false;
					return;
				}
			
				// Add to AJAX queue
				Ajaxy.ajaxQueue.push(state);
				if ( Ajaxy.ajaxQueue.length !== 1 ) {
					// Already processing an event
					return false;
				}
			
				// Fire the analytics
				if ( Ajaxy.options.analytics ) {
					Ajaxy.track(state);
				}
				
				// --------------------------
				
				// Determine State
				var State = Ajaxy.getState(state,true);
				
				// Determine controller
				var controller = State.controller || Ajaxy.match(state) || undefined;
				
				// --------------------------
				
				// Prepare the State
				State.state = state;
				State.controller = controller;
				State.Request.url = (State.Request.url || Ajaxy.options.root_url+Ajaxy.options.base_url+(state.replace(/^\//, '') || '?'));
				
				// Store the State
				Ajaxy.storeState(State);
				
				// --------------------------
				
				// Trigger Request
				Ajaxy.trigger(controller, 'request');
				
				// --------------------------
				
				// Define handlers
				var Request = {
					data: State.Request.data,
					url: State.Request.url,
					type: 'post',
					success: function(responseData, status){
						// Success
						if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request.success:', [this, arguments]);
					
						// Prepare
						responseData = $.extend(true,{},Ajaxy.defaults.State.Response.data,responseData);
						responseData.Ajaxy = responseData.Ajaxy || {};
						
						// Check for redirect
						if ( responseData.Ajaxy.redirected ) {
							// A redirect was performed, set a option so we know what to do
							var newState = Ajaxy.format(responseData.Ajaxy.redirected.to);
							Ajaxy.redirected = {
								status: true,
								from: state,
								to: newState
							};
							// Update the history, not ajaxy
							History.go(newState);
							// We do the redirect check up the top, so no worries here, this one flows through like normal
						};
						
						// Success function
						Ajaxy.ajaxQueue.shift()
						var queueState = Ajaxy.ajaxQueue.pop();
						if (queueState && queueState !== state) {
							Ajaxy.ajaxQueue = []; // abandon others
							Ajaxy.stateChange(queueState);
							return false; // don't care for this
						}
						
						// Prepare
						State.Response.data = responseData;
						State.Error.data = {};
						
						// Fetch controller
						var controller = responseData.controller || State.controller || null;
						
						// Check controller
						if ( controller === null ) {
							// Default
							controller = '_generic';
							// Issue warning
							window.console.warn(
								'Ajaxy.request.success.controller: The controller was unable to be determined, defaulted to _generic.',
								[this, arguments],
								[responseData.controller, State.controller]
							);
						}
						
						// Fire User Specified Callback (specified with Ajaxy.go)
						// Halts if callback returns true, or if controller is set to 'callback'
						if ( State.Response.callback ) {
							if ( State.Response.callback.apply(State, arguments) || controller === 'callback' ) {
								// We are done
								return true;
							}
							// We fired the callback and we want to continue on
						}
						
						// Trigger handler
						return Ajaxy.trigger(controller, 'response', State);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown, responseData){
						// Error
						if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request.error:', [this, arguments]);
					
						// Prepare
						if ( !responseData ) {
							// Should already be handled, but in the rare case it isn't
							responseData = {
								responseText: XMLHttpRequest.responseText.trim()||false
							}
						}
					
						// Handler queue
						Ajaxy.ajaxQueue.shift()
						var queueState = Ajaxy.ajaxQueue.pop();
						if (queueState && queueState !== state) {
							Ajaxy.ajaxQueue = []; // abandon others
							Ajaxy.stateChange(queueState);
							return false; // don't care for this
						}
					
						// Prepare
						var errorData = {
							XMLHttpRequest: XMLHttpRequest,
							textStatus: textStatus,
							errorThrown: errorThrown
						};
					
						// Prepare
						State.Request.XMLHttpRequest = XMLHttpRequest;
						State.Response.data = responseData;
						State.Error.data = {};
					
						// Fetch controller
						var controller = responseData.controller || State.controller || null;
						
						// Check controller
						if ( controller === null ) {
							// Default
							controller = '_generic';
							// Issue warning
							window.console.warn(
								'Ajaxy.request.error.controller: The controller was unable to be determined, defaulted to _generic.',
								[this, arguments],
								[responseData.controller, State.controller]
							);
						}
						
						// Fire User Specified Callback (specified with Ajaxy.go)
						// Halts if callback returns true, or if controller is set to 'callback'
						if ( State.Error.callback ) {
							if ( State.Error.callback.apply(State, arguments) || controller === 'callback' ) {
								// We are done
								return true;
							}
							// We fired the callback and we want to continue on
						}
						
						// Trigger handler
						return Ajaxy.trigger(controller, 'error', State);
					},
				
					complete:	function ( XMLHttpRequest, textStatus ) {
						// Request completed
						if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request.complete:', [this, arguments]);
						// Set XMLHttpRequest
						State.Request.XMLHttpRequest = XMLHttpRequest;
						// Ignore for some reason
						if ( false && this.url !== XMLHttpRequest.channel.name ) {
							// A redirect was performed, set a option so we know what to do
							var newState = Ajaxy.format(XMLHttpRequest.channel.name);
							Ajaxy.redirected = {
								status: true,
								from: state,
								to: newState
							};
							// Update the history, not ajaxy
							History.go(newState);
						};
					}
				};
			
				// --------------------------
				
				// Handle form if need be
				if ( State.form ) {
					var $form = $(State.form);
					
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
								window.console.error('Ajaxy.request.form: Invalid Response.', [this, arguments], [text]);
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
						Request.data = $.extend(Request.data, values||{});
						
						// Inform to skip ajax
						skip_ajax = true;
					}
					else {
						// Normal form
						var values = $form.values();
						Request.data = $.extend(Request.data, values||{});
					}
				}
				
				// --------------------------
				
				// Prepare Result
				var result = true;
				
				// Update
				State.Request = Request;
				
				// Perform AJAX request
				if ( !skip_ajax ) {
					result = Ajaxy.ajax(Request);
				}
				
				// Return result
				return result;
			},
		
		
			/**
			 * Wrapper for Ajaxy Request
			 * @param {Object} data
			 */
			ajax: function(options){
				var Ajaxy = $.Ajaxy; var History = $.History;
				if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax:', [this, arguments]);
				
				// --------------------------
				
				// Move handlers into callbacks
				// Use defaults if they do not exist
				var callbacks = {};
				callbacks.success = options.success || function (data, status) {
					// Success
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.callbacks.success:', [this, arguments]);
					// Handle
					$('.error').empty();
				};
				callbacks.error = options.error || function (XMLHttpRequest, textStatus, errorThrown, data) {
					// Error
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.callbacks.error:', [this, arguments]);
					// Handle
					$('.error').html(errorThrown);
				};
				callbacks.complete = options.complete || function(XMLHttpRequest, textStatus){
					// Request completed
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.callbacks.complete:', [this, arguments]);
				};
				
				// Delete from options
				delete options.success;
				delete options.error;
				delete options.complete;
			
				// --------------------------
				
				// Prepare Ajax Request
				var request = {
					type:		'post',
					dataType:	(Ajaxy.options.support_text ? 'text' : 'json')
				};
				$.extend(request,options);
				
				// Apply Handlers to Request
				request.success = function(responseText, status){
					// Success
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.request.success:', [this, arguments]);
					var Response = {},
						responseData = {};
					
					// Parse
					if ( typeof responseText !== 'object' && Ajaxy.options.support_text && responseText ) {
						try {
							// Try JSON
							responseData = JSON.parse(responseText);
						} catch (e) {
							// Not Valid JSON
							responseData = {
								content: responseText
							};
						} finally {
							// Is Valid, so already assigned
						}
					}
					else {
						// Using JSON
						responseData = responseText;
					}
					
					// Apply
					Response.data = responseData;
					
					// Debug
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.success:', [this, arguments]);
					
					// Check
					if ( typeof responseData.controller === 'undefined' && ((typeof responseData.success !== 'undefined' && !responseData.success) || (typeof responseData.error !== 'undefined' && responseData.error)) ) {
						// Error on simple Ajax request, not Ajaxy
						return callbacks.error.apply(this, [null, status, responseData.error||true, responseData]);
					}
					
					// Fire
					return callbacks.success.apply(this, [responseData, status]);
				};
				request.error = function(XMLHttpRequest, textStatus, errorThrown) {
					// Error
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.request.error:', [this, arguments]);
				
					// Prepare Response
					var responseText = XMLHttpRequest.responseText||false;
					if ( responseText ) responseText = responseText.trim();
					if ( !responseText ) responseText = false;
				
					// Prepare Data
					var responseData = {
						error: errorThrown||true,
						responseText: responseText
					};
					
					// Check if Response
					if ( responseText ) {
						try {
							// Try JSON
							responseData = JSON.parse(responseText);
						} catch (e) {
							// Not Valid JSON
						} finally {
							// Is Valid, so Move
							return this.success.apply(this, [responseData, textStatus]);
						}
					}
					
					// Apply
					return callbacks.error.apply(this, [XMLHttpRequest, textStatus, errorThrown, responseData]);
				};
			
				// Send the Request
				return $.ajax(request);
			},
		
		
			/**
			 * Handler for a stateChange
			 * @param {Object} state
			 */
			stateChange: function ( state ) {
				var Ajaxy = $.Ajaxy; var History = $.History;
			
				// Perform the Request
				Ajaxy.request(state);
			},
		
			// --------------------------------------------------
			// Constructors
		
			/**
			 * Configure Ajaxy
			 * @param {Object} options
			 */
			configure: function ( options ) {
				var Ajaxy = $.Ajaxy; var History = $.History;
				options = options||{};
				
				// --------------------------
				
				// Prepare
				var Controllers = options.Controllers||options.controllers||options;
				
				// Set options
				Ajaxy.options = $.extend(Ajaxy.options, options.options||options||{});
			
				// Set params
				Ajaxy.bind(Controllers);
				
				// --------------------------
				
				// URLs
				Ajaxy.options.root_url = (Ajaxy.options.root_url || document.location.protocol.toString()+'//'+document.location.hostname.toString()).replace(/\/$/, '')+'/';
				Ajaxy.options.base_url = (Ajaxy.options.base_url || '');
				Ajaxy.options.relative_url = Ajaxy.format(Ajaxy.options.relative_url || document.location.pathname.toString().replace(/^\//, ''));
				
				// Relative as Base
				if ( Ajaxy.options.relative_as_base ) {
					if ( Ajaxy.options.base_url.length === 0 ) {
						Ajaxy.options.base_url = Ajaxy.options.relative_url;
						Ajaxy.options.relative_url = "";
					}
				}
				
				// Adjust finals urls
				if ( Ajaxy.options.base_url ) {
					Ajaxy.options.base_url = Ajaxy.options.base_url.replace(/^\/|\/$/g, '')+'/';
				}
				
				// --------------------------
				
				// Debug
				if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.configure:', [this, arguments]);
				
				// Initial redirect
				if ( Ajaxy.options.redirect && Ajaxy.options.relative_url && Ajaxy.options.relative_url !== null  ) {
					var location = Ajaxy.options.root_url+Ajaxy.options.base_url+'#'+Ajaxy.options.relative_url;
					document.location = location;
				}
				
				// --------------------------
				
				// Return true
				return true;
			},
		
			/**
			 * Construct Ajaxy
			 * @param {Object} options
			 */
			construct: function ( ) {
				// Construct our Plugin
				var Ajaxy = $.Ajaxy; var History = $.History;
				
				// --------------------------
				
				// Check if we've been constructed
				if ( Ajaxy.constructed ) {
					return;
				} else {
					Ajaxy.constructed = true;
				}
				
				// --------------------------
				
				// Set AJAX History Handler
				History.bind(function(state){
					// History Handler
					return Ajaxy.stateChange(state);
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
				
				// --------------------------
				
				// All done
				return true;
			},
		
			/**
			 * Perform any DOM manipulation
			 */
			domReady: function ( ) {
				// We are good
				var Ajaxy = $.Ajaxy;
				
				// --------------------------
				
				// Return true
				return true;
			},
		
			/**
			 * Ajaxify an Element
			 * Eg. $('#id').ajaxify();
			 * @param {Object} options
			 */
			ajaxify: function ( options ) {
				var Ajaxy = $.Ajaxy;
				
				// --------------------------
				
				// Prepare
				var $el = $(this);
				
				// Ajaxify the controllers
				$.each(Ajaxy.Controllers, function(controller,Controller){
					Ajaxy.ajaxifyController(controller);
				});
				
				// Add the onclick handler for ajax compatiable links
				$el.findAndSelf('a.ajaxy').once('click',Ajaxy.ajaxify_helpers.a);
				
				// Add the onclick handler for ajax compatiable forms
				$el.findAndSelf('form.ajaxy').once('submit',Ajaxy.ajaxify_helpers.form);
				
				// --------------------------
				
				// Chain
				return $el;
			},
		
			/**
			 * Ajaxify a particullar controller
			 * @param {String} controller
			 */
			ajaxifyController: function(controller) {
				var Ajaxy = $.Ajaxy;
				
				// --------------------------
				
				// Fetch Controller
				var Controller = Ajaxy.getController(controller);
				
				// Do selector
				if ( Controller && typeof Controller['selector'] !== 'undefined' ) {
					// We have a selector
					$(function(){
						// Onload
						var $els = $(Controller['selector']);
						$els.data('ajaxy-controller',controller).once('click',Ajaxy.ajaxify_helpers.a);
					});
				}
				
				// --------------------------
				
				// Return true
				return true;
			},
			
			/**
			 * Ajaxify Helpers for particular types of elements
			 */
			ajaxify_helpers: {
				a: function(event){
					var Ajaxy = $.Ajaxy;
					
					// --------------------------
					
					// Fetch
					var $a = $(this);
					
					// Prepare
					var state = Ajaxy.format($a.attr('href').replace(/^\/?\.\//,'/'));
					var log = !$a.hasClass(Ajaxy.options.no_log_class);
					var controller = $a.data('ajaxy-controller')||null;
					
					// Perform the request
					Ajaxy.go({
						'state': state,
						'controller': controller,
						'log': log
					});
					
					// --------------------------
					
					// Prevent
					event.stopPropagation();
					event.preventDefault();
					return false;
				},
				form: function(event){
					var Ajaxy = $.Ajaxy;
					
					// --------------------------
					
					// Fetch
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
					
					// Generate the state
					var state = Ajaxy.format($form.attr('action'));//.replace(/[?\.]?\/?/, '#/');
					
					// Perform the request
					Ajaxy.go({
						'state': state,
						'form':	this
					});
					
					// --------------------------
					
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
