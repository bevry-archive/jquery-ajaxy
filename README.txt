----
/**
 * This file is part of jQuery Ajaxy
 * Copyright (C) 2008-2010 Benjamin Arthur Lupton
 * http://www.balupton.com/projects/jquery-ajaxy
 *
 * jQuery Ajaxy is free software; You can redistribute it and/or modify it under the terms of
 * the GNU Affero General Public License version 3 as published by the Free Software Foundation.
 * You don't have to do anything special to accept the license and you don’t have to notify
 * anyone which that you have made that decision.
 * 
 * jQuery Ajaxy is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See your chosen license for more details.
 * 
 * You should have received along with jQuery Ajaxy:
 * - A copy of the license used.
 *   If not, see <http://www.gnu.org/licenses/agpl-3.0.html>.
 * - A copy of our interpretation of the license used.
 *   If not, see <http://github.com/balupton/jquery-ajaxy/blob/master/COPYING.txt>.
 * 
 * @version 1.6.1-beta
 * @date October 04, 2010
 * @since v0.1.0-dev, July 24, 2008
 * @category jquery-plugin
 * @package jquery-ajaxy {@link http://www.balupton/projects/jquery-ajaxy}
 * @author Benjamin "balupton" Lupton {@link http://www.balupton.com}
 * @copyright (c) 2008-2010 Benjamin Arthur Lupton {@link http://www.balupton.com}
 * @license GNU Affero General Public License version 3 {@link http://www.gnu.org/licenses/agpl-3.0.html}
 * @example Visit {@link http://www.balupton.com/projects/jquery-ajaxy} for more information.
 */
----

Installation & Usage:
1. Refer to the (demo/index.html) or http://www.balupton.com/projects/jquery-ajaxy if the demo is not included.

Todo:
1. Need to add timeout for AjaxQueue. As in rare circumstances it just never pops out.

Options:
1. Refer to (scripts/resources/jquery.ajaxy.js) at about line 40 you will see the options with their information. 

Known Issues:
- Under Google Chrome, when in postpone or disable mode anchors may not scroll to the correct position when using back and forward buttons. [minor]
- Ajaxy form submit does not care for multiple submit buttons and only uses the last one. Issue due to jQuery's submit function. [minor]

----

Changelog:

v1.6.1-beta, October 04, 2010
- Added a 404 error page demo.
- Got yellow background working for targets in IE.
- Updated response and error proxies. This brings forth a B/C break if you were using the response action for errors. Now the error action contains responseData.
- Error information is now a lot more precise and easier to debug.
- Updated demo for new response and error handling.
- This release is a minor B/C break, please refer to the demo code for the new error handling and actions.
- Added support for ReInvigorate Ajax Tracking.

v1.6.0-beta, August 31, 2010
- Added aliases option.
- Added Ajaxy form demo.
- Added Ajaxy.onReady, Ajaxy.onDocumentReady and Ajaxy.onConfigured promises
- Controllers should now use classname instead of selector. B/C Break.
- $.fn.addAjaxy now supports passing a controller so we can add the Controller.classname to the element(s)
- Added $.fn.addAjaxy and $.fn.removeAjaxy
- State.actionCompleted callback now supports options.
- Added Refresh Action, this is triggered when we click the same Ajaxy link twice. If the refresh action does not exist a log will be outputted, and the Response action will be used instead. B/C Partial Break.
- Improvements to the anchor handling, page tracking and scrolling.
- While in postponed mode, and a anchor is clicked, we will treat the anchor as normal and not perform a redirect.
- Added postpone and disable redirect option values. Postpone will postpone ajaxy functionality until the page is changed. Disable will disable ajaxy functionality all together.
- Made Ajaxy.bind alias Ajaxy.addControllers, and add Ajaxy.addController
- Fixed issue with jQuery UI AutoComplete. Fix due to update of sparkle dependencies.
- We now use jQuery ScrollTo [v1.0.1-beta, August 31, 2010] as our ScrollTo Plugin: http://www.balupton.com/projects/jquery-scrollto
- Updated jQuery History dependencies to [v1.5.0-final, August 31, 2010]
- Updated jQuery Sparkle dependencies to [v1.5.2-beta, August 31, 2010]

v1.5.8-beta, August 23, 2010
- Added root_url to internal link checks
- Improved internal links adding

v1.5.7-beta, August 22, 2010
- Added demo for Ajaxy Forms
- Fixed Ajaxy Forms when used with Controller Selectors

v1.5.6-beta, August 21, 2010
- Updated jQuery Sparkle dependencies to [v1.4.17-final, August 21, 2010]
- Updated jQuery History dependencies to [v1.4.4-final, August 21, 2010]

v1.5.5-beta, August 19, 2010
- Fixed issue with external links. http://getsatisfaction.com/balupton/topics/external_links_dont_work
- Improved installation instructions to make more clear.
- Updated Syntax Highlighter include and initialisation. We use http://www.balupton.com/projects/jquery-syntaxhighlighter
- Code blocks within the demo are now using PRE instead of CODE elements due to an IE bug
- Updated jQuery Sparkle dependencies to [v1.4.13-final, August 19, 2010].
- Updated jQuery History dependencies to [v1.4.3-final, August 19, 2010].

v1.5.4-beta, August 12, 2010
- Updated jQuery History dependencies to [v1.4.2-final, August 12, 2010].
- This is a recommended update for all users.

v1.5.3-beta, August 07, 2010
- The Response.data returned on normal html ajaxy links is now as follows:
	{
		"controller": controller,
		"responseText": responseText, /* raw result */
		"html": html, /* raw result put through Ajaxy.htmlCompat */
		"title": title, /* the text of the title/#ajaxy-title element */
		"head": head, /* the outerHTML of the head/#ajaxy-head element */
		"body": body, /* the outerHTML of the body/#ajaxy-body element */
		"content": content /* the innerHTML of the body/#ajaxy-body element or the html value */
	}
- Updated jQuery Sparkle dependencies to [v1.4.10-beta, August 07, 2010]

v1.5.2-beta, August 07, 2010
- Added the Ajaxy.htmlCompat function which will convert a html document into a jQuery compatible document.
  This is based on old functionality and includes fixes.
  The Response.data returned on normal html ajaxy links is now as follows:
	{
		"controller": controller,
		"responseText": responseText, /* raw result */
		"html": html, /* raw result put through Ajaxy.htmlCompat */
		"title": title, /* the value of the title element, or #ajaxy-title */
		"head": head, /* the value of the head element, or #ajaxy-head */
		"body": body, /* the value of the body element, or #ajaxy-body */
		"content": content /* the value of the body element, or #ajaxy-body, or the html */
	}
- It is a backwards compatible release
- Changed the demo to always use the unminified version, and included the minified version in a HTML comment
- Added the HTML5 doctype and the utf8 meta element to the demo pages

v1.5.1-beta, August 05, 2010
- Fixed a redirection issue
- Support for anchors is now complete. We can now detect all types of anchors and adjust the page and state accordingly.
- Able to detect the severity of the page change, and if it is not considerable (such as only an anchor change) then do not both performing the request. 
- $.fn.SrollTo can now take the options argument. We also have a $.Ajaxy.options.scrollto_options for this.
- Added the options [track_all_anchors] and [track_all_internal_links] to keep your Ajaxy website in sync; these are set to false by default.
- A few more options added, should refer to the documentation about these.
- Introduces a minor known issue that the ScrollTo plugin does no always scroll with animation.
- Updated jQuery History dependencies to [v1.4.1-beta, August 05, 2010]

v1.5.0-beta, August 03, 2010
- Renamed format to extractHash. This change may break backwards compatibility in advanced cases.
- Added support for anchors. This now requires a call to [var Action = this; this.documentReady()] once the content has updated to inform Ajaxy that it can take care of anchors now. See the updated JavaScript in the demo for more information. To do this we have included Ariel Flesler's $.fn.scrollTo with Balupton's $.fn.ScrollTo extension.
- Added auto_ajaxify_documentReady option
- Added auto_sparkle_documentReady option
- Removed dependency on JSON2, instead we use jQuery's parseJSON
- Fixed track providing 3 slashes issue
- Fixed redirect issue
- History requirement is now bundled into built jQuery Ajaxy script, so no need to include both anymore. This saves space as History and Ajax share some dependencies.
- Updated jQuery History dependencies to [v1.4.0-beta, August 03, 2010]
- This release may be a final release if no bugs are found.

v1.4.0-beta, August 01, 2010
- Updated licensing information. Still using the same license, as it is the best there is, but just provided some more information on it to make life simpler.
- A very large redo and IS NOT backwards compatible
- Added Controller.matches feature
- Changed naming convention to Google's Javascript Standards for everything but options
- Added #current to demo, to be similar to the jQuery History demo
- Fixed SEO in the demo by using [./] on the pages instead of [/]
- Added support for relative Ajaxy links
- The Controller, State and Action are now separate entities. Instead of doing [this.response_data] or [this.data.response] you now do [this.State.Response.data]
- All references to Hash have been renamed to State appropriately
- We now support loading in complete HTML documents. Will find content and title automatically.
- Updated jQuery Sparkle dependencies to [v1.4.8-beta, August 01, 2010]
- Updated jQuery History dependencies to [v1.3.0-beta, August 01, 2010]
- Quite close to a final release

v1.3.2-dev, July 28, 2010
- Track now includes base_url - this is a fix for certain circumstances.

v1.3.1-dev, July 22, 2010
- Updated demo to go into great detail

v1.3.0-dev, July 22, 2010
- Added demo
- Added [redirect, relative_as_base, no_history_class, no_history_class, support_text] options
- Added support for text responses
- Added support for default controllers
- Fixed an issue where request would fire twice for ajaxified controllers
- Cleaned and now uses sparkle dependencies with makefile

v1.2.0-beta, August 3, 2009
- Moved base/root/relative url functionality inside
- Fixed issue with A elements continuing link
- Improvements to form submission
- Debug improvements

v1.1.0-beta, July 25, 2009
- Added support for hash callbacks

v1.0.1-final, July 11, 2009
- Restructured a little bit
- Documented
- Added get and set functions for misc
- Added support for Ajaxy error headers
- Cleaned go/request

v1.0.0-final, June 19, 2009
- Been stable for over a year now, pushing live.

v0.1.0-dev, July 24, 2008
- Initial Release

----

Special Thanks:
- jQuery {@link http://jquery.com/}
- jQuery UI History - Klaus Hartl {@link http://www.stilbuero.de/jquery/ui_history/}
- Really Simple History - Brian Dillard and Brad Neuberg {@link http://code.google.com/p/reallysimplehistory/}
- jQuery History Plugin - Taku Sano (Mikage Sawatari) {@link http://www.mikage.to/jquery/jquery_history.html}
- jQuery History Remote Plugin - Klaus Hartl {@link http://stilbuero.de/jquery/history/}
- Content With Style: Fixing the back button and enabling bookmarking for ajax apps - Mike Stenhouse {@link http://www.contentwithstyle.co.uk/Articles/38/fixing-the-back-button-and-enabling-bookmarking-for-ajax-apps}
- Bookmarks and Back Buttons {@link http://ajax.howtosetup.info/options-and-efficiencies/bookmarks-and-back-buttons/}
- Ajax: How to handle bookmarks and back buttons - Brad Neuberg {@link http://dev.aol.com/ajax-handling-bookmarks-and-back-button}
