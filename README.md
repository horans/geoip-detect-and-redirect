# GEOIP Detect and Redirect

This feature will allow editors to set up the connection between a series of pages,
which are localizations of a same subject.

"GEOIP Detect and Redirect" or "GDNR" in short,
will check user's location and compare with current page's language.
If they are not matched,
a modal/popup will be shown to ask user if they want to jump to the right page.
Once set up, GDNR should be executed automatically,
please check console log if it is not working as expected.

* If user's location is not on code list, the popup will not show.
* If user chooses to cancel the redirection, the popup will not show anymore.

## 1. Upload GDNR to server

Following files should be upload to server in same folder.

* __geoip-code.json__: Language and location mapping codes
* __geoip-link.json__: Page links of all languages
* __geoip-modal.html__: Popup template
* __geoip-redirect.js__: Main script

## 2. Include vendor and main script

GDNR works only for sites with Bootstrap (modal) and jQuery,
and it will need an additional vendor Lodash.

```html
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"></script>
<script src="//sample.com/gdnr/geoip-redirect.js"></script>
```

## 3. Set navigation and language

Make sure you have following main tag on page.
Change data-nav and data-lan to your own value.

```html
<main id="body" data-nav="home"></main>
```

### 4. Test GDNR with VPN

You have to use your own GEOIP API to get user location data.
The `geoip-dummy.json` is only for preview.
We added `localStorage` cache to reduce repeat requests to backend API.

When you are testing GDNR with VPN and switching between countries,
you have to clear your browser cache every single time.

To do that, you can either wipe the whole cache of your browser,
or delete the specific item.

Take `Chrome` for example:

1. Press `F12` to open DevTools, then tab to `Application` panel.
1. And in section of `Storage`, you will find `Local Storage` folder.
1. Locate current website and click, for example "//sample.com/".
1. Find "gdnr-geoip" key on the right, click and press `delete`.
1. You can leave the `DevTools` panel open and quickly remove "gdnr-geoip" cache between switches.
1. If you ever choose to cancel redirection, you will need to remove "gdnr-no" item as well.

## 5. Maintain and update GDNR

Data is stored in `json` files, which is separated from main script.

## 6. Extra

### Vendor

* [Boostrap](https://github.com/twbs/bootstrap)
* [jQuery](https://github.com/jquery/jquery)
* [Lodash](https://github.com/lodash/lodash)

### Linter

* [HTMLHint](https://github.com/yaniswang/HTMLHint)
* [CSSLint](https://github.com/CSSLint/csslint)
* [standard](https://github.com/standard/standard)

### Change Log

__180811__

* initial release