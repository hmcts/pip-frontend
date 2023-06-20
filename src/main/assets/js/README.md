## Note

This javascript is pulled from the following [github project](https://github.com/alphagov/accessible-autocomplete) alongside the license file with explicit permission to use and modify the script if required.

Note that there is currently an issue where the setting of the style element is blocked by application without the use of `unsafe-inline` in `style-src`. This is causing the result count/indexes to be displayed on the search results for Apple IOS devices. These issues are logged below:
- https://github.com/alphagov/accessible-autocomplete/issues/398
- https://github.com/alphagov/accessible-autocomplete/issues/556

The javascript has been modified by `PIP` to remove the code to set result count/indexes so that they will not be displayed if `unsafe-inline` is not specified.
