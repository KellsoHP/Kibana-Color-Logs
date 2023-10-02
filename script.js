// ==UserScript==
// @name         Higlight log level for kibana
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dodois.io
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	const rabbitSvg = '<svg width="16px" height="16px" viewBox="-7.5 0 271 271" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M245.44 108.308h-85.09a7.738 7.738 0 0 1-7.735-7.734v-88.68C152.615 5.327 147.29 0 140.726 0h-30.375c-6.568 0-11.89 5.327-11.89 11.894v88.143c0 4.573-3.697 8.29-8.27 8.31l-27.885.133c-4.612.025-8.359-3.717-8.35-8.325l.173-88.241C54.144 5.337 48.817 0 42.24 0H11.89C5.321 0 0 5.327 0 11.894V260.21c0 5.834 4.726 10.56 10.555 10.56H245.44c5.834 0 10.56-4.726 10.56-10.56V118.868c0-5.834-4.726-10.56-10.56-10.56zm-39.902 93.233c0 7.645-6.198 13.844-13.843 13.844H167.69c-7.646 0-13.844-6.199-13.844-13.844v-24.005c0-7.646 6.198-13.844 13.844-13.844h24.005c7.645 0 13.843 6.198 13.843 13.844v24.005z" fill="#F60"/></svg> ';
	const httpSvg = '<svg height="16px" width="16px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"> <circle style="fill:#32BEA6;" cx="256" cy="256" r="256"/> <g> <path style="fill:#FFFFFF;" d="M58.016,202.296h18.168v42.48h0.296c2.192-3.368,5.128-6.152,8.936-8.2 c3.512-2.056,7.76-3.224,12.304-3.224c12.16,0,24.896,8.064,24.896,30.912v42.04H104.6v-39.992c0-10.4-3.808-18.168-13.776-18.168 c-7.032,0-12.008,4.688-13.912,10.112c-0.584,1.472-0.728,3.368-0.728,5.424v42.624H58.016V202.296z"/> <path style="fill:#FFFFFF;" d="M161.76,214.6v20.368h17.144v13.48H161.76v31.496c0,8.64,2.344,13.176,9.224,13.176 c3.08,0,5.424-0.44,7.032-0.872l0.296,13.768c-2.64,1.032-7.328,1.768-13.04,1.768c-6.584,0-12.16-2.2-15.52-5.856 c-3.816-4.112-5.568-10.544-5.568-19.92v-33.544h-10.248V234.96h10.248v-16.12L161.76,214.6z"/> <path style="fill:#FFFFFF;" d="M213.192,214.6v20.368h17.144v13.48h-17.144v31.496c0,8.64,2.344,13.176,9.224,13.176 c3.08,0,5.424-0.44,7.032-0.872l0.296,13.768c-2.64,1.032-7.328,1.768-13.04,1.768c-6.584,0-12.16-2.2-15.52-5.856 c-3.816-4.112-5.568-10.544-5.568-19.92v-33.544h-10.248V234.96h10.248v-16.12L213.192,214.6z"/> <path style="fill:#FFFFFF;" d="M243.984,258.688c0-9.376-0.296-16.992-0.592-23.728h15.832l0.872,10.984h0.296 c5.264-8.056,13.616-12.6,24.464-12.6c16.408,0,30.024,14.064,30.024,36.328c0,25.784-16.256,38.232-32.512,38.232 c-8.936,0-16.408-3.808-20.072-9.512H262v36.904h-18.016V258.688z M262,276.416c0,1.76,0.144,3.368,0.584,4.976 c1.76,7.328,8.2,12.6,15.824,12.6c11.424,0,18.168-9.52,18.168-23.584c0-12.592-6.16-22.848-17.728-22.848 c-7.472,0-14.36,5.424-16.112,13.336c-0.448,1.464-0.736,3.072-0.736,4.536L262,276.416L262,276.416z"/> <path style="fill:#FFFFFF;" d="M327.504,247.12c0-6.744,4.688-11.568,11.136-11.568c6.592,0,10.984,4.832,11.136,11.568 c0,6.592-4.392,11.432-11.136,11.432C332.048,258.552,327.504,253.712,327.504,247.12z M327.504,296.488 c0-6.744,4.688-11.576,11.136-11.576c6.592,0,10.984,4.688,11.136,11.576c0,6.448-4.392,11.424-11.136,11.424 C332.048,307.912,327.504,302.936,327.504,296.488z"/> <path style="fill:#FFFFFF;" d="M355.8,312.16l35.744-106.2h12.6l-35.752,106.2H355.8z"/> <path style="fill:#FFFFFF;" d="M405.176,312.16l35.744-106.2h12.592l-35.728,106.2H405.176z"/> </g> '

	const spansTextForDetectUrlsIcons = ['/API/', '/PAY/']

	const observeDOM = (function(){
			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

			return function( obj, callback ){
					if( !obj || obj.nodeType !== 1 ) return;

					if( MutationObserver ){
							// define a new observer
							var mutationObserver = new MutationObserver(callback)

							// have the observer observe for changes in children
							mutationObserver.observe( obj, { childList:true, subtree:true })
							return mutationObserver
					}
					// browser support fallback
					else if( window.addEventListener ){
							obj.addEventListener('DOMNodeInserted', callback, false)
							obj.addEventListener('DOMNodeRemoved', callback, false)
					}
			}
	})()


	// Observe a specific DOM element:
	observeDOM(document.body, function(m){
			var addedNodes = [];
			m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes));

			if (addedNodes.length > 0) {
					addedNodes.forEach(a => {
							if (a.nodeName == 'TR') {
									let spans = a.querySelectorAll('span')
									if (spans) {
											spans.forEach(span => {
													let spanText = span.textContent.toUpperCase();
													if (spanText == 'INFORMATION') {
															a.style.backgroundColor = 'LightBlue'
													}
													else if (spanText == 'WARNING') {
															a.style.backgroundColor = 'LightYellow'
													}
													else if (spanText == 'ERROR') {
															a.style.backgroundColor = 'LightPink'
													}
													else if (spanText == 'FATAL') {
															a.style.backgroundColor = 'LightCoral'
													}
													else if (spanText == 'DEBUG') {
															a.style.backgroundColor = 'LightGreen'
													}

													if (spanText.endsWith('CONSUMER')) {
															let oldInnetHtml = span.innerHTML;
															span.innerHTML = rabbitSvg + oldInnetHtml;
															span.style.textWrap = 'nowrap';
													}
													else if (spansTextForDetectUrlsIcons.some(t => spanText.startsWith(t))) {
															let oldInnetHtml = span.textContent;
															span.innerHTML = httpSvg + '<span> ' + oldInnetHtml + '</span>';
															span.style.textWrap = 'nowrap';
													}
											})
									}
							}
					})
			}
	});
})();