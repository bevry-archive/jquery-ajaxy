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
	 * @version 1.5.5
	 * @date August 19, 2010
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
				 * For production use, you want to ensure this has been set to true. As we should always want to ensure we are in the correct location.
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
				 * Whether or not we should automatically find all ajaxy links and ajaxify them on the document ready calls.
				 * This should be left to true generally, as it keeps the links working for ajaxed'in content.
				 */
				auto_ajaxify_documentReady: true,
				/**
				 * Whether or not we should automatically sparkle the loaded in content (or page) on the document ready calls.
				 * This only applies if jQuery Sparkle has been detected.
				 */
				auto_sparkle_documentReady: true,
				/**
				 * Whether or not we should add a ajaxy sparkle extension such that we can perform an ajaxify on sparkled content.
				 * This only applies if jQuery Sparkle has been detected.
				 */
				add_sparkle_extension: true,
				/**
				 * The options to pass to $.fn.ScrollTo when we have detected an anchor.
				 */
				scrollto_options: {
					duration:400, /* Set to 0 to have no scroll animation effect */
					easing:'swing' /* unless you are using the jQuery Easing plugin, only [swing] and [linear] are available. */
				},
				/**
				 * Whether or not we should track all the anchors with Ajaxyy (even if they don't have the ajaxy class).
				 * If you are using jQuery Ajaxy to power your entire site, then this should be enabled.
				 */
				track_all_anchors: false,
				/**
				 * Whether or not we should track all the anchors with Ajaxy (even if they don't have the ajaxy class).
				 * If you are using jQuery Ajaxy to power your entire site, then this should be enabled.
				 */
				track_all_internal_links: false,
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
					},
					documentReady: function($el){
						var Ajaxy = $.Ajaxy; var Action = this;
						
						// Fire Ajaxy's stateCompleted
						return Ajaxy.stateCompleted(Action.State,$el);
					}
				},
				
				/**
				 * Default State Structure
				 * All Controllers inherit and are bound to this
				 * State is associated with a particular state
				 */
				State: {
					// Options
					mode: null,
					form: false,
					
					// Parts
					state: '',
					hash: '',
					anchor: '',
					querystring: '',
					
					// System
					controller: null,
					
					/** The Request Object that is used in the $.Ajax */
					Request: {
						url: null,
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
			 * Our Current State
			 */
			currentState: {},
			
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
			 * Ensure we return a valid String value
			 * @param {*} str
			 * @return {String}
			 */
			ensureString: function(str){
				var result = '';
				
				switch ( typeof str ) {
					case 'number':
					case 'string':
						result = String(str);
						break;
					
					default:
						result = '';
				}
				
				return result;
			},
			
			/**
			 * Extract a Relative URL from a URL
			 * @param {String} url
			 */
			extractRelativeUrl: function (url){
				var Ajaxy = $.Ajaxy; var History = $.History;
				
				// Prepare
				url = Ajaxy.ensureString(url);
				
				// Strip urls
				var relative_url = url.stripLeft(Ajaxy.options.root_url).stripLeft(Ajaxy.options.base_url);
				
				// Check
				if ( relative_url === '/' ) relative_url = ''; 
				
				// Return relative_url
				return relative_url;
			},
			
			/**
			 * Extract the State from a URL
			 * Alias for extractRelativeUrl
			 * @param {String} state
			 */
			extractState: function (url) {
				var Ajaxy = $.Ajaxy;
				
				// Strip urls
				var state = Ajaxy.extractRelativeUrl(url);
				
				// Return state
				return state;
			},
			
			/**
			 * Extract the Hash from a State
			 * @param {String} state
			 * @return {String}
			 */
			extractHash: function (state) {
				var Ajaxy = $.Ajaxy;
				
				// Strip urls
				var state = Ajaxy.extractState(state);
				
				// Extract the anchor
				var hash = state.match(/^([^#?]*)/)||'';
				if ( hash && hash.length||false === 2 ) {
					hash = hash[1]||'';
				}
				
				// Return hash
				return hash;
			},
			
			/**
			 * Extract a Anchor from a State
			 * @param {String} state
			 * @return {String}
			 */
			extractAnchor: function (state) {
				var Ajaxy = $.Ajaxy;
				
				// Strip urls
				var state = Ajaxy.extractState(state);
				
				// Extract the anchor
				var anchor = state.replace(/[^#]+#/g,'#').match(/#+([^#\?]*)/)||'';
				if ( anchor && anchor.length||false === 2 ) {
					anchor = anchor[1]||'';
				}
				
				// Check
				if ( anchor === state ) {
					anchor = '';
				}
				
				// Check
				if ( !anchor ) {
					// Extract anchor from QueryString
					var anchor = state.match(/anchor=([a-zA-Z0-9-_]+)/)||'';
					if ( anchor && anchor.length||false === 2 ) {
						anchor = anchor[1]||'';
					}
				}
				
				// Return anchor
				return anchor;
			},
			
			/**
			 * Extract a Querystring from a State
			 * @param {String} state
			 * @return {String}
			 */
			extractQuerystring: function (state) {
				var Ajaxy = $.Ajaxy;
				
				// Strip urls
				var state = Ajaxy.extractState(state);
				
				// Extract the querystring
				var querystring = state.match(/\?(.*)$/)||'';
				if ( querystring && querystring.length||false === 2 ) {
					querystring = querystring[1]||'';
				}
				
				// Return querystring
				return querystring;
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
				var Action = $.extend(true,{},Ajaxy.defaults.Action,{
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
						url: UserState
					};
				}
				
				// Prepare State
				var State = Ajaxy.getState(false,true);
				$.extend(true,State,UserState);
				
				// --------------------------
				// Ensure parts
				
				// Check for !state and url
				if ( !(State.state||false) && (State.url||false) ) {
					State.state	= Ajaxy.extractState(State.url);
				}
				
				// Rebuild the state
				Ajaxy.rebuildState(State);
				
				// Fix anchor
				if ( State.anchor === State.state || State.anchor === State.hash ) {
					State.anchor = '';
				}
				
				// Check for !hash and !querystring and anchor
				var querystring = (State.querystring||'').replace(/anchor=([a-zA-Z0-9-_]+)/g,'');
				if ( !(State.hash||false) && !querystring && (State.anchor||'') ) {
					// We are just an anchor change
					// Let's grab the currentState's hash and use that, as we want to modify the state so we don't actually go to the anchor in the url
					State.hash = Ajaxy.currentState.hash||'';
					State.querystring = querystring;
					
					// Rebuild the state
					Ajaxy.rebuildState(State);
				}
				
				// Check state
				if ( !State.state || (!State.hash && !querystring) ) {
					window.console.warn('Ajaxy.go: No state or (hash and querystring)', [this, arguments], [State]);
					return false;
				}
				delete querystring;
				
				// Ensure mode
				if ( State.mode||false ) {
					State.mode = State.form ? 'silent' : 'default';
				}
				
				// Store it
				Ajaxy.storeState(State);
			
				// --------------------------
				
				// Trigger state
				switch ( State.mode ) {
					case 'silent':
						// Don't log
						// Trigger manually
						Ajaxy.stateChange(State.state)
						break;
					
					case 'default':
					default:
						// Log the history
						// Trigger automaticly
						History.go(State.state);
						break;
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
					Controller = $.extend(true,{},Ajaxy.defaults.Controller);
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
			 * Rebuild a State
			 * @param {&State} State
			 * @return {State}
			 */
			rebuildState: function(State,mode){
				var Ajaxy = $.Ajaxy;
				
				// Extract
				var state = Ajaxy.extractState(State.state),
					hash = Ajaxy.ensureString(State.hash) || Ajaxy.extractHash(state),
					anchor = Ajaxy.ensureString(State.anchor) || Ajaxy.extractAnchor(state),
					querystring = Ajaxy.ensureString(State.querystring) || Ajaxy.extractQuerystring(state);
				
				// Assign the state
				State.state = hash;
				
				// Anchor
				if ( anchor ) {
					// Place anchor into querystring
					var params = querystring.queryStringToJSON();
					params.anchor = anchor;
					querystring = unescape($.param(params));
					delete params;
				}
				
				// Querystring
				if ( querystring ) {
					// Add querystring
					State.state += '?'+querystring;
				}
				
				// Assign the rest
				State.hash = hash;
				State.anchor = anchor;
				State.querystring = querystring; // this may have been updated in the anchor code a few lines above
				
				// Return State
				return State;
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
				
				// Rebuild State
				Ajaxy.rebuildState(State);
				
				// Fetch
				if ( stateType === 'object' && typeof State.state === 'string' ) {
					result = Ajaxy.States[State.state] = State;
				}
				else {
					window.console.error('Ajaxy.storeState: Unkown State Format', [this, arguments]);
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
				state = Ajaxy.extractState((state||{}).state||state);
				var State = undefined,
					type = typeof (state||undefined);
				
				// Fetch
				if ( (type === 'number' || type === 'string') && typeof Ajaxy.States[state] !== 'undefined' ) {
					State = Ajaxy.States[state];
				}
				else if ( create ) {
					State = Ajaxy.createState(state);
				}
				else if ( create === false ) {
					// Don't report couldn't find
				}
				else {
					// Report couldn't find
					window.console.error('Ajaxy.getState: State does not exist', [this, arguments]);
					window.console.trace();
				}
				
				// Rebuild State
				Ajaxy.rebuildState(State);
				
				// Return State
				return State;
			},
			
			/**
			 * Create a new State Object
			 * @param {String|Object} state
			 * @return {Object|undefined}
			 */
			createState: function ( state ) {
				var Ajaxy = $.Ajaxy;
				
				// Prepare
				state = Ajaxy.extractState((state||{}).state||state);
				
				// Create State
				State = $.extend(true,{},Ajaxy.defaults.State,{
					state: state
				});
				
				// Rebuild State
				Ajaxy.rebuildState(State);
				
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
					var url = Ajaxy.options.base_url+(state || '?');
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.track', [this,arguments], [url]);
					pageTracker._trackPageview(url);
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
			
			stateCompleted: function(State,$content){
				var Ajaxy = $.Ajaxy;
				
				// Prepare
				var ajaxify = Ajaxy.options.auto_ajaxify_documentReady;
				
				// Prepare Content
				if ( !(($content||{}).length||false) ) {
					$content = $('body');
				}
				
				// Auto Sparkle
				if ( Ajaxy.options.auto_sparkle_documentReady && $.Sparkle||false ) {
					if ( Ajaxy.options.add_sparkle_extension ) ajaxify = false; // as the sparkle extension will handle this
					$content.sparkle();
				}
				
				// Auto Ajaxify
				if ( ajaxify ) {
					$content.ajaxify();
				}
				
				// Check for Anchor
				var anchor = State.anchor||false;
				if ( anchor ) {
					// Reset the anchor
					State.anchor = false;
					$('.target').removeClass('target');
					// Fire the anchor
					$('#'+anchor).addClass('target').ScrollTo(Ajaxy.options.scrollto_options);
				}
				
				// Return true
				return true;
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
				// Initialise State
				
				// Determine State
				var State = Ajaxy.getState(state,true);
				
				// Check if we were a redirect
				if ( Ajaxy.redirected !== false ) {
					// We were, ignore as we have already been fired
					Ajaxy.redirected = false;
					return;
				}
				
				
				// --------------------------
				// Current State
				
				// Are we a repeat request
				var currentQuerystring = (Ajaxy.currentState.querystring||'').replace(/anchor=([a-zA-Z0-9-_]+)/g,''),
					newQuerystring = State.querystring.replace(/anchor=([a-zA-Z0-9-_]+)/g,'');
				if ( (Ajaxy.currentState.state||false) && Ajaxy.currentState.hash === State.hash && currentQuerystring === newQuerystring ) {
					// We are the same hash and querystring
					
					// Are we the same anchor
					if ( Ajaxy.currentState.anchor !== State.anchor ) {
						// Only the anchor has changed
						// So we only need to fire the stateCompleted to relocate the anchor
						if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request: There has only been an anchor change', [this, arguments], [Ajaxy.currentState,State,state]);
						Ajaxy.stateCompleted(State);
					}
					
					// Update the currentState
					Ajaxy.currentState = State;
					
					// There has been no considerate state change
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.request: There has been no considerable change', [this, arguments], [Ajaxy.currentState,State,state]);
					return true;
				}
				delete currentQuerystring;
				delete newQuerystring;
				
				// Add to AJAX queue
				Ajaxy.ajaxQueue.push(state);
				if ( Ajaxy.ajaxQueue.length !== 1 ) {
					// Already processing an event
					// We will call stateChange when that event finishes
					// Which will call request
					return false;
				}
				// We are now the current event
			
				// Fire the analytics
				if ( Ajaxy.options.analytics ) {
					Ajaxy.track(state);
				}
				
				// Update the currentState
				Ajaxy.currentState = State;
				
				
				// --------------------------
				// Update the State
				
				// Determine controller
				var controller = State.controller || Ajaxy.match(state) || undefined;
				
				// Prepare the State
				State.controller = controller;
				State.Request.url = (State.Request.url || Ajaxy.options.root_url+Ajaxy.options.base_url+(state || '?'));
				
				// Store the State (in case it hasn't been stored yet - eg. we came through somewhere else other than go)
				Ajaxy.storeState(State);
				
				
				// --------------------------
				// Trigger State
				
				// Trigger Request
				Ajaxy.trigger(controller, 'request');
				
				
				// --------------------------
				// Handle Request
				
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
							var newState = Ajaxy.extractState(responseData.Ajaxy.redirected.to);
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
						Ajaxy.ajaxQueue.shift();
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
							var newState = Ajaxy.extractState(XMLHttpRequest.channel.name);
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
								json = $.parseJSON(text);
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
						Request.data = $.extend(true, Request.data, values||{});
						
						// Inform to skip ajax
						skip_ajax = true;
					}
					else {
						// Normal form
						var values = $form.values();
						Request.data = $.extend(true, Request.data, values||{});
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
			 * Convert a HTML document into one compatiable with jQuery
			 * Will remove doctype, and convert html,head,body,title,meta elements to divs.
			 * @param {String} html
			 */
			htmlCompat: function(html){
				var result = String(html)
					.replace(/<\!DOCTYPE[^>]*>/i, '')
					.replace(/<(html|head|body|title|meta)/gi,'<div id="ajaxy-$1"')
					.replace(/<\/(html|head|body|title|meta)/gi,'</div')
				;
				
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
				$.extend(true,request,options);
				
				// Apply Handlers to Request
				request.success = function(responseText, status){
					// Success
					if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.ajax.request.success:', [this, arguments]);
					var Response = {},
						responseData = {};
					
					// Parse
					if ( typeof responseText !== 'object' && Ajaxy.options.support_text && responseText ) {
						// Attempt JSON
						try {
							// Attempt
							responseData = $.parseJSON(responseText);
						}
						// Invalid JSON
						catch (e) {
							// Extract details
							var html = Ajaxy.htmlCompat(responseText),
								$html = $(html),
								$head = $html.find('#ajaxy-head'),
								$body = $html.find('#ajaxy-body'),
								$title = $html.find('#ajaxy-title'),
								$controller = $html.find('#ajaxy-controller'), /* special case support for controller in html pages */
								title = ($title.length ? $title.text() : ''),
								head = ($head.length ? $head.htmlAndSelf() : ''),
								body = ($body.length ? $body.htmlAndSelf() : ''),
								content = ($body.length ? $body.html() : html),
								controller = ($controller.length ? $controller.text().trim() : null);
							
							// Create
							responseData = {
								"controller": controller,
								"responseText": responseText,
								"html": html,
								"title": title,
								"head": head,
								"body": body,
								"content": content
							};
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
							responseData = $.parseJSON(responseText);
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
				Ajaxy.options = $.extend(true, Ajaxy.options, options.options||options);
			
				// Set params
				Ajaxy.bind(Controllers);
				
				// --------------------------
				
				// URLs
				Ajaxy.options.root_url = (Ajaxy.options.root_url || document.location.protocol.toString()+'//'+document.location.hostname.toString()).replace(/\/+$/, '')+'/';
				Ajaxy.options.base_url = (Ajaxy.options.base_url || '');
				Ajaxy.options.relative_url = Ajaxy.extractState(Ajaxy.options.relative_url ||  document.location.pathname.toString());
				
				// Relative as Base
				if ( Ajaxy.options.relative_as_base ) {
					if ( Ajaxy.options.base_url.length === 0 ) {
						Ajaxy.options.base_url = Ajaxy.options.relative_url;
						Ajaxy.options.relative_url = '';
					}
				}
				
				// Adjust finals urls
				Ajaxy.options.root_url = Ajaxy.options.root_url.replace(/\/+$/, '');
				Ajaxy.options.base_url = Ajaxy.options.base_url.replace(/\/+$/, '');
				Ajaxy.options.relative_url = Ajaxy.extractRelativeUrl(Ajaxy.options.relative_url);
				
				// Check
				if ( Ajaxy.options.root_url === '/' ) Ajaxy.options.root_url = ''; 
				if ( Ajaxy.options.base_url === '/' ) Ajaxy.options.base_url = ''; 
				if ( Ajaxy.options.relative_url === '/' ) Ajaxy.options.relative_url = ''; 
				
				// --------------------------
				
				// Debug
				if ( Ajaxy.options.debug ) window.console.debug('Ajaxy.configure:', [this, arguments]);
				
				// Initial redirect
				if ( Ajaxy.options.redirect && Ajaxy.options.relative_url && Ajaxy.options.relative_url !== null  ) {
					var location = Ajaxy.options.root_url+Ajaxy.options.base_url+'#'+Ajaxy.options.relative_url,
						hash = History.getHash();
					if ( hash ) {
						location += '?anchor='+hash;
					}
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
				
				// Check for Sparkle
				if ( $.Sparkle||false && Ajaxy.options.add_sparkle_extension ) {
					// Add Ajaxify to Sparkle
					$.Sparkle.addExtension('ajaxy', function(){
						// Find all internal links, mark them as Ajaxy links
						$(this).ajaxify();
					});
				}
				
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
				
				// Handle special cases
				if ( Ajaxy.options.track_all_internal_links ) {
					$el.findAndSelf('a[href^=/],a[href^=./]').filter(':not(.ajaxy,.no-ajaxy)').addClass('ajaxy');
				}
				if ( Ajaxy.options.track_all_anchors ) {
					$el.findAndSelf('a[href^=#]:not(.ajaxy,.no-ajaxy)').addClass('ajaxy');
				}
				
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
				if ( Controller && (Controller.selector||false) ) {
					// We have a selector
					$(function(){
						// Onload
						var $els = $(Controller.selector);
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
					var href = Ajaxy.extractRelativeUrl($a.attr('href')).replace(/^\/?\.\//,'/');
					var state = Ajaxy.extractState(href);
					var anchor = Ajaxy.extractAnchor(href);
					if ( '/'+anchor === state || anchor === state ) anchor = '';
					var log = !$a.hasClass(Ajaxy.options.no_log_class);
					var controller = $a.data('ajaxy-controller')||null;
					
					// Perform the request
					Ajaxy.go({
						'state': state,
						'controller': controller,
						'log': log,
						'anchor': anchor
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
					var state = Ajaxy.extractState($form.attr('action'));//.replace(/[?\.]?\/?/, '#/');
					
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
