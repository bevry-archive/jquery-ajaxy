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
 * @version 1.5.0-beta
 * @date August 03, 2010
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
- None! Youhou!

Options:
1. Refer to (scripts/resources/jquery.ajaxy.js) at about line 40 you will see the options with their information. 

Known Issues:
- None! Youhou!

----

Changelog:

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
