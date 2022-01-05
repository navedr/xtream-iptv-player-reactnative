import { vsprintf } from 'sprintf-js';

const DefaultUserLang = 'en';

function getLangFile(code) {

	let loadLang = null;

	if (code === 'en') {
		// english
		loadLang = require('./locales/english.json');
	} else if (code === 'pt') {
		// portuguese
		loadLang = require('./locales/portuguese.json');
	} else {
		// fallback
		loadLang = require('./locales/english.json');
	}

	return loadLang;
}

function getTranslatedString(key, fallback=null, args=null, lang=null) {
	lang = lang || DefaultUserLang;

	key = key.trim();

	// try to get translated string
	let lookup = extKey(getLangFile(lang), key);
	if (!lookup && lang !== 'en') {
		// try fallback to english
		lookup = extKey(getLangFile('en'), key);
	}

	if (!lookup) {
		return fallback || key + ' untranslated in ' + lang + ' and en JSON';
	}

	if (args && args.constructor === Array) {
		lookup = vsprintf(lookup, args);
	}

	return lookup;
}

function extKey(obj, str) {
	str = str.replace(/\[(\w+)\]/g, '.$1'); // let's convert indexes to properties
	str = str.replace(/^\./, ''); // gets rid of leading dot

	const a = str.split('.');

	for (let i = 0, n = a.length; i < n; i++) {
		const key = a[i];

		if (key in obj) {
			obj = obj[key];
		} else {
			return null;
		}
	}
	return obj;
}

export default getTranslatedString;
