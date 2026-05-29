function t(t,e,i,s){var n,o=arguments.length,a=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(o<3?n(a):o>3?n(e,i,a):n(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",y=m.reactiveElementPolyfillSupport,v=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},_=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??_)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,y?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,P=`<${M}>`,N=document,U=()=>N.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,z="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,R=/>/g,D=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,F=/"/g,I=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),G=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),V=new WeakMap,W=N.createTreeWalker(N,129);function Z(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Q=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",a=H;for(let e=0;e<i;e++){const i=t[e];let r,l,h=-1,c=0;for(;c<i.length&&(a.lastIndex=c,l=a.exec(i),null!==l);)c=a.lastIndex,a===H?"!--"===l[1]?a=L:void 0!==l[1]?a=R:void 0!==l[2]?(I.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=D):void 0!==l[3]&&(a=D):a===D?">"===l[0]?(a=n??H,h=-1):void 0===l[1]?h=-2:(h=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?D:'"'===l[3]?F:j):a===F||a===j?a=D:a===L||a===R?a=H:(a=D,n=void 0);const d=a===D&&t[e+1].startsWith("/>")?" ":"";o+=a===H?i+P:h>=0?(s.push(r),i.slice(0,h)+E+i.slice(h)+C+d):i+C+(-2===h?e:d)}return[Z(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[l,h]=Q(t,e);if(this.el=J.createElement(l,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=h[o++],i=s.getAttribute(t).split(C),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:n,name:a[2],strings:i,ctor:"."===a[1]?et:"?"===a[1]?it:"@"===a[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(C)&&(r.push({type:6,index:n}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),W.nextNode(),r.push({type:2,index:++n});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===M)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)r.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const i=N.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===G)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=T(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=K(t,n._$AS(t,e.values),n,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??N).importNode(e,!0);W.currentNode=s;let n=W.nextNode(),o=0,a=0,r=i[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new X(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new nt(n,this,t)),this._$AV.push(e),r=i[++a]}o!==r?.index&&(n=W.nextNode(),o++)}return W.currentNode=N,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),T(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new J(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new X(this.O(U()),this.O(U()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=K(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const s=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=K(this,s[i+a],e,a),r===G&&(r=this._$AH[a]),o||=!T(r)||r!==this._$AH[a],r===B?t=B:t!==B&&(t+=(r??"")+n[a+1]),this._$AH[a]=r}o&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class st extends tt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??B)===G)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(J,X),(w.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;let rt=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new X(e.insertBefore(U(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};rt._$litElement$=!0,rt.finalized=!0,at.litElementHydrateSupport?.({LitElement:rt});const lt=at.litElementPolyfillSupport;lt?.({LitElement:rt}),(at.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ct={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:_},dt=(t=ct,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}const mt=1;class ft{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const gt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ft{constructor(t){if(super(t),t.type!==mt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return G}});var yt,vt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(yt||(yt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(vt||(vt={}));var $t=function(t,e,i,s){s=s||{},i=i??{};var n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n};const _t=!0,bt=!1,xt=!1,wt=!0,At={pm25:{min:0,max:150,severity:{good:9,moderate:35.4,unhealthy_sensitive:55.4,unhealthy:150}},pm10:{min:0,max:300,severity:{good:54,moderate:154,unhealthy_sensitive:254,unhealthy:300}},pm1:{min:0,max:75,severity:{good:8,moderate:20,unhealthy_sensitive:35,unhealthy:75}},co2:{min:400,max:5e3,severity:{good:800,moderate:1500,unhealthy_sensitive:2e3,unhealthy:5e3}},voc:{min:0,max:2e3,severity:{good:500,moderate:1e3,unhealthy_sensitive:1500,unhealthy:2e3}},hcho:{min:0,max:500,severity:{good:50,moderate:100,unhealthy_sensitive:200,unhealthy:500}},temperature:{min:0,max:50,severity:{good:26,moderate:30,unhealthy_sensitive:35,unhealthy:50}},humidity:{min:0,max:100,severity:{good:60,moderate:70,unhealthy_sensitive:80,unhealthy:100}}},kt={good:"#4caf50",moderate:"#ffeb3b",unhealthy_sensitive:"#ff9800",unhealthy:"#f44336",very_unhealthy:"#9c27b0",hazardous:"#7e0023",unknown:"#9e9e9e"},St={good:"Good",moderate:"Moderate",unhealthy_sensitive:"Sensitive",unhealthy:"Unhealthy",very_unhealthy:"Very Unhealthy",hazardous:"Hazardous",unknown:"Unknown"},Et=["hazardous","very_unhealthy","unhealthy","unhealthy_sensitive","moderate","good"],Ct={pm25:"mdi:air-filter",pm10:"mdi:air-filter",pm1:"mdi:air-filter",co2:"mdi:molecule-co2",voc:"mdi:flask-outline",hcho:"mdi:chemical-weapon",temperature:"mdi:thermometer",humidity:"mdi:water-percent",aqi:"mdi:weather-hazy",no2:"mdi:molecule",o3:"mdi:molecule",so2:"mdi:molecule",co:"mdi:molecule-co",formaldehyde:"mdi:chemical-weapon"};function Mt(t,e){if(null==t||isNaN(t))return{level:"unknown",label:St.unknown,color:kt.unknown};if(e){for(const i of[...Et].reverse()){const s=e[i];if(void 0!==s&&t<=s)return{level:i,label:St[i],color:kt[i]}}const i=Et.find(t=>void 0!==e[t])||"unknown";return{level:i,label:St[i],color:kt[i]}}return{level:"unknown",label:St.unknown,color:kt.unknown}}function Pt(t){const e=t.toLowerCase();return e.includes("pm25")||e.includes("pm2.5")||e.includes("pm2_5")?"pm25":e.includes("pm10")?"pm10":!e.includes("pm1")||e.includes("pm10")||e.includes("pm25")||e.includes("pm2")?e.includes("co2")||e.includes("carbon_dioxide")?"co2":e.includes("voc")||e.includes("volatile")?"voc":e.includes("hcho")||e.includes("formaldehyde")?"hcho":e.includes("temp")?"temperature":e.includes("humid")?"humidity":e.includes("aqi")||e.includes("air_quality")?"aqi":e.includes("no2")||e.includes("nitrogen")?"no2":e.includes("o3")||e.includes("ozone")?"o3":e.includes("co")&&!e.includes("co2")?"co":"":"pm1"}function Nt(t,e,i){const s=e.states[t.entity],n=!s||"unavailable"===s.state||"unknown"===s.state,o=s?.state??"",a=""!==o&&"unavailable"!==o&&"unknown"!==o?parseFloat(o):null,r=t.unit??s?.attributes?.unit_of_measurement??"",l=t.name??s?.attributes?.friendly_name??t.entity,h=t.icon??s?.attributes?.icon??function(t){const e=Pt(t);return Ct[e]||"mdi:gauge"}(t.entity),c=function(t){const e=Pt(t);return At[e]}(t.entity),d=Mt(a,t.severity??c?.severity),p=t.min??c?.min??0,u=t.max??c?.max??(null!==a?Math.max(1.5*a,100):100);return{config:{...t,min:p,max:u},state:o,stateNumeric:a,unit:r,name:l,icon:h,severity:d,history:i,unavailable:n}}function Ut(t,e){if(null===t||isNaN(t))return"—";const i=Math.abs(t)<10?1:0;return t.toFixed(i)}function Tt(t,e,i,s,n){return n+(t-e)/(i-e||1)*s}function Ot(t,e,i,s=2,n,o,a,r){if(t.length<2)return"";const l=t.map(t=>t.value),h=a??Math.min(...l),c=(r??Math.max(...l))-h||1,d=e-2*s,p=i-2*s,u=n??t[0].timestamp,m=o??t[t.length-1].timestamp;return t.map((t,e)=>{const i=Tt(t.timestamp,u,m,d,s),n=s+p-(t.value-h)/c*p;return`${0===e?"M":"L"} ${i.toFixed(1)} ${n.toFixed(1)}`}).join(" ")}function zt(t,e,i,s=2,n=.3,o,a,r,l){if(t.length<2)return"";if(2===t.length)return Ot(t,e,i,s,o,a,r,l);const h=t.map(t=>t.value),c=r??Math.min(...h),d=(l??Math.max(...h))-c||1,p=e-2*s,u=i-2*s,m=o??t[0].timestamp,f=a??t[t.length-1].timestamp,g=t.map(t=>({x:Tt(t.timestamp,m,f,p,s),y:s+u-(t.value-c)/d*u})),y=[`M ${g[0].x.toFixed(1)} ${g[0].y.toFixed(1)}`];for(let t=0;t<g.length-1;t++){const e=g[Math.max(0,t-1)],i=g[t],s=g[t+1],o=g[Math.min(g.length-1,t+2)],a=i.x+(s.x-e.x)*n/3,r=i.y+(s.y-e.y)*n/3,l=s.x-(o.x-i.x)*n/3,h=s.y-(o.y-i.y)*n/3;y.push(`C ${a.toFixed(1)} ${r.toFixed(1)} ${l.toFixed(1)} ${h.toFixed(1)} ${s.x.toFixed(1)} ${s.y.toFixed(1)}`)}return y.join(" ")}function Ht(t,e,i,s=2,n,o,a,r){if(t.length<2)return"";const l=t.map(t=>t.value),h=a??Math.min(...l),c=(r??Math.max(...l))-h||1,d=e-2*s,p=i-2*s,u=n??t[0].timestamp,m=o??t[t.length-1].timestamp,f=[];for(let e=0;e<t.length;e++){const i=Tt(t[e].timestamp,u,m,d,s),n=s+p-(t[e].value-h)/c*p;if(0===e)f.push(`M ${i.toFixed(1)} ${n.toFixed(1)}`);else{const o=s+p-(t[e-1].value-h)/c*p;f.push(`L ${i.toFixed(1)} ${o.toFixed(1)}`),f.push(`L ${i.toFixed(1)} ${n.toFixed(1)}`)}}return f.join(" ")}let Lt=class extends rt{setConfig(t){this._config=t}_valueChanged(t){const e=t.target,i=e.dataset.configValue;if(!i)return;let s=e.value;"number"===e.type&&(s=""===s?void 0:Number(s),void 0!==s&&isNaN(s))||("checkbox"===e.type&&(s=e.checked),this._config&&this._config[i]===s||(this._config={...this._config,[i]:s},$t(this,"config-changed",{config:this._config})))}_entityChanged(t,e){this._updateEntity(t,{entity:e.detail.value})}_entityFieldChanged(t,e,i){let s=i.target.value;("min"!==e&&"max"!==e||(s=""===s?void 0:Number(s),void 0===s||!isNaN(s)))&&("name"===e&&(s=s||void 0),"show_sparkline"!==e&&"show_unit"!==e||(s=i.target.checked),this._updateEntity(t,{[e]:s}))}_updateEntity(t,e){const i=this._config?.entities?.map((i,s)=>s===t?{...i,...e}:i);i&&(this._config={...this._config,entities:i},$t(this,"config-changed",{config:this._config}))}_removeEntity(t){const e=[...this._config?.entities||[]];e.splice(t,1),this._config={...this._config,entities:e},$t(this,"config-changed",{config:this._config})}_addEntity(){const t=[...this._config?.entities||[],{entity:""}];this._config={...this._config,entities:t},$t(this,"config-changed",{config:this._config})}render(){if(!this.hass)return q`<div class="loading">Loading…</div>`;const t=this._config??{},e=t.entities??[];return q`
      <div class="editor">
        <!-- Title -->
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            class="ha-input"
            placeholder="Air Quality Monitor"
            .value=${t.title??""}
            data-config-value="title"
            @input=${this._valueChanged}
          />
        </div>

        <!-- Layout -->
        <div class="section">
          <div class="section-title">Layout</div>

          <div class="field">
            <label>Columns</label>
            <input
              type="number"
              class="ha-input"
              min="1"
              max="6"
              .value=${String(t.columns??2)}
              data-config-value="columns"
              @input=${this._valueChanged}
            />
          </div>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${t.compact??bt}
              data-config-value="compact"
              @change=${this._valueChanged}
            />
            <span>Compact mode</span>
          </label>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${t.show_sparklines??_t}
              data-config-value="show_sparklines"
              @change=${this._valueChanged}
            />
            <span>Show trend sparklines</span>
          </label>

          ${t.show_sparklines??_t?q`
                <div class="field">
                  <label>Sparkline window (hours)</label>
                  <input
                    type="number"
                    class="ha-input"
                    min="1"
                    max="168"
                    .value=${String(t.sparkline_hours??24)}
                    data-config-value="sparkline_hours"
                    @input=${this._valueChanged}
                  />
                </div>
              `:B}

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${t.smooth_sparklines??xt}
              data-config-value="smooth_sparklines"
              @change=${this._valueChanged}
            />
            <span>Smooth sparklines</span>
          </label>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${t.step_sparklines??wt}
              data-config-value="step_sparklines"
              @change=${this._valueChanged}
            />
            <span>Step interpolation</span>
          </label>
        </div>

        <!-- Entities -->
        <div class="section">
          <div class="section-title">Entities</div>

          ${e.map((t,i)=>q`
              <div class="entity-row">
                <div class="field">
                  <label>Entity</label>
                  <ha-entity-picker
                    .hass=${this.hass}
                    .value=${t.entity}
                    allow-custom-entity
                    @value-changed=${t=>this._entityChanged(i,t)}
                  ></ha-entity-picker>
                </div>

                <div class="field">
                  <label>Display name</label>
                  <input
                    type="text"
                    class="ha-input"
                    placeholder="Auto"
                    .value=${t.name??""}
                    @input=${t=>this._entityFieldChanged(i,"name",t)}
                  />
                </div>

                <div class="minmax-row">
                  <div class="field">
                    <label>Min value</label>
                    <input
                      type="number"
                      class="ha-input"
                      placeholder="Auto"
                      .value=${void 0!==t.min?String(t.min):""}
                      @input=${t=>this._entityFieldChanged(i,"min",t)}
                    />
                  </div>
                  <div class="field">
                    <label>Max value</label>
                    <input
                      type="number"
                      class="ha-input"
                      placeholder="Auto"
                      .value=${void 0!==t.max?String(t.max):""}
                      @input=${t=>this._entityFieldChanged(i,"max",t)}
                    />
                  </div>
                </div>

                <label class="toggle">
                  <input
                    type="checkbox"
                    .checked=${!1!==t.show_sparkline}
                    @change=${t=>this._entityFieldChanged(i,"show_sparkline",t)}
                  />
                  <span>Show sparkline</span>
                </label>

                <label class="toggle">
                  <input
                    type="checkbox"
                    .checked=${!1!==t.show_unit}
                    @change=${t=>this._entityFieldChanged(i,"show_unit",t)}
                  />
                  <span>Show unit</span>
                </label>

                <button
                  class="remove-btn"
                  ?disabled=${e.length<=1}
                  @click=${()=>this._removeEntity(i)}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                  Remove
                </button>
              </div>
            `)}

          <button class="add-btn" @click=${this._addEntity}>
            <ha-icon icon="mdi:plus"></ha-icon>
            Add entity
          </button>
        </div>
      </div>
    `}static get styles(){return a`
      :host {
        display: block;
      }

      .editor {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 8px 0;
      }

      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        color: var(--secondary-text-color);
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin: 0 0 2px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .field label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .ha-input {
        width: 100%;
        padding: 8px 12px;
        font-size: 14px;
        font-family: var(--paper-font-body_-_font-family, inherit);
        color: var(--primary-text-color);
        background: var(--secondary-background-color, #f5f5f5);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s;
      }

      .ha-input:focus {
        border-color: var(--primary-color);
      }

      .ha-input::placeholder {
        color: var(--disabled-text-color, #9e9e9e);
      }

      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .toggle input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
        cursor: pointer;
      }

      .entity-row {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        background: var(--secondary-background-color, #f5f5f5);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .minmax-row {
        display: flex;
        gap: 8px;
      }

      .minmax-row > .field {
        flex: 1;
      }

      .remove-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        font-size: 13px;
        font-family: inherit;
        color: var(--error-color, #db4437);
        background: transparent;
        border: 1px solid var(--error-color, #db4437);
        border-radius: 4px;
        cursor: pointer;
        align-self: flex-start;
        transition: background 0.2s;
      }

      .remove-btn:hover:not(:disabled) {
        background: rgba(219, 68, 55, 0.08);
      }

      .remove-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .remove-btn ha-icon {
        --mdc-icon-size: 16px;
      }

      .add-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        font-size: 13px;
        font-family: inherit;
        color: var(--primary-color);
        background: transparent;
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .add-btn:hover {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      }

      .add-btn ha-icon {
        --mdc-icon-size: 16px;
      }

      ha-entity-picker {
        width: 100%;
      }
    `}};t([pt({attribute:!1})],Lt.prototype,"hass",void 0),t([ut()],Lt.prototype,"_config",void 0),Lt=t([ht("air-quality-monitor-card-editor")],Lt);let Rt=class extends rt{constructor(){super(...arguments),this.value=null,this.min=0,this.max=100,this.severityColor="#9e9e9e",this.severityLabel="",this.name="",this.unit="",this.showUnit=!0,this.icon="",this.unavailable=!1,this.compact=!1,this.trend={direction:"stable",label:"stable",arrow:"→"}}get ratio(){if(null===this.value||void 0===this.value)return 0;if(this.max===this.min)return 0;const t=(this.value-this.min)/(this.max-this.min);return Math.max(0,Math.min(1,t))}get midValue(){return(this.min+this.max)/2}render(){const t=this.unavailable?"—":Ut(this.value),e=this.unavailable?"#bdbdbd":this.severityColor,i=this.unavailable?"var(--disabled-text-color, #9e9e9e)":this.severityColor,s=this.unavailable?"var(--disabled-text-color, #9e9e9e)":"var(--secondary-text-color)",n=(100*this.ratio).toFixed(1);return q`
      <div class="metric-panel">
        <!-- Label -->
        <div class="metric-label" style="color: ${s}">${this.name}</div>

        <!-- Value + Unit -->
        <div class="metric-value-row">
          <span class="metric-value" style="color: ${i}">${t}</span>
          ${this.showUnit&&this.unit&&!this.unavailable?q`<span class="metric-unit" style="color: ${s}">${this.unit}</span>`:""}
        </div>

        <!-- Status row: severity dot + label | trend -->
        <div class="metric-status-row">
          <div class="metric-status-left">
            <span class="status-dot" style="background: ${e}"></span>
            <span class="status-label" style="color: ${i}">${this.unavailable?"Unavailable":this.severityLabel}</span>
          </div>
          ${this.unavailable?"":q`<div class="metric-trend" style="color: ${s}">${this.trend.arrow} ${this.trend.label}</div>`}
        </div>

        <!-- Progress bar -->
        <div class="progress-track">
          <div
            class="progress-fill"
            style="width: ${this.unavailable?"0%":n+"%"}; background: ${e}"
          ></div>
        </div>

        <!-- Scale labels -->
        <div class="scale-labels" style="color: ${s}">
          <span>${this.min}</span>
          <span>${this.unavailable?"—":Ut(this.midValue)}</span>
          <span>${this.max}</span>
        </div>
      </div>
    `}static{this.styles=a`
    :host {
      display: block;
      width: 100%;
    }

    .metric-panel {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .metric-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      line-height: 1.2;
    }

    .metric-value-row {
      display: flex;
      align-items: baseline;
      gap: 4px;
      line-height: 1;
    }

    .metric-value {
      font-size: 36px;
      font-weight: 700;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      line-height: 1;
    }

    .metric-unit {
      font-size: 14px;
      font-weight: 400;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      line-height: 1;
    }

    .metric-status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      line-height: 1;
    }

    .metric-status-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-label {
      font-weight: 500;
      line-height: 1;
    }

    .metric-trend {
      font-size: 12px;
      font-weight: 400;
      line-height: 1;
    }

    .progress-track {
      width: 100%;
      height: 6px;
      background: var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s ease, background 0.3s ease;
    }

    .scale-labels {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 400;
      line-height: 1;
      opacity: 0.6;
    }

    /* Compact mode */
    :host([compact]) .metric-value {
      font-size: 28px;
    }

    :host([compact]) .metric-unit {
      font-size: 12px;
    }

    :host([compact]) .metric-label {
      font-size: 10px;
    }

    :host([compact]) .metric-status-row {
      font-size: 11px;
    }

    :host([compact]) .progress-track {
      height: 5px;
    }

    :host([compact]) .scale-labels {
      font-size: 9px;
    }
  `}};t([pt({type:Number})],Rt.prototype,"value",void 0),t([pt({type:Number})],Rt.prototype,"min",void 0),t([pt({type:Number})],Rt.prototype,"max",void 0),t([pt({type:String})],Rt.prototype,"severityColor",void 0),t([pt({type:String})],Rt.prototype,"severityLabel",void 0),t([pt({type:String})],Rt.prototype,"name",void 0),t([pt({type:String})],Rt.prototype,"unit",void 0),t([pt({type:Boolean})],Rt.prototype,"showUnit",void 0),t([pt({type:String})],Rt.prototype,"icon",void 0),t([pt({type:Boolean,reflect:!0})],Rt.prototype,"unavailable",void 0),t([pt({type:Boolean,reflect:!0})],Rt.prototype,"compact",void 0),t([pt({type:Object})],Rt.prototype,"trend",void 0),Rt=t([ht("aqm-gauge")],Rt);let Dt=0,jt=class extends rt{constructor(){super(...arguments),this.data=[],this.color="#4caf50",this.severity=void 0,this.min=0,this.max=100,this.width=120,this.height=40,this.smooth=!1,this.step=!0,this.timeStart=void 0,this.timeEnd=void 0,this.areaGradientId="spark-area-"+ ++Dt,this.lineGradientId=`spark-line-${Dt}`}get effectiveTimeStart(){return void 0!==this.timeStart?this.timeStart:this.data.length>0?this.data[0].timestamp:0}get effectiveTimeEnd(){return void 0!==this.timeEnd?this.timeEnd:this.data.length>0?this.data[this.data.length-1].timestamp:0}get effectiveData(){return this.data&&0!==this.data.length?this.step&&void 0!==this.timeStart&&this.data[0].timestamp>this.timeStart?[{timestamp:this.timeStart,value:this.data[0].value},...this.data]:this.data:[]}get linePath(){const t=this.effectiveData,e=this.effectiveTimeStart,i=this.effectiveTimeEnd;return this.step?Ht(t,this.width,this.height,2,e,i,this.min,this.max):this.smooth?zt(t,this.width,this.height,2,.3,e,i,this.min,this.max):Ot(t,this.width,this.height,2,e,i,this.min,this.max)}get areaPath(){const t=this.effectiveData,e=this.effectiveTimeStart,i=this.effectiveTimeEnd;return this.step?function(t,e,i,s=2,n,o,a,r){if(t.length<2)return"";const l=Ht(t,e,i,s,n,o,a,r),h=e-2*s,c=n??t[0].timestamp,d=o??t[t.length-1].timestamp;return`${l} L ${Tt(d,c,d,h,s).toFixed(1)} ${i-s} L ${s} ${i-s} Z`}(t,this.width,this.height,2,e,i,this.min,this.max):this.smooth?function(t,e,i,s=2,n=.3,o,a,r,l){if(t.length<2)return"";const h=zt(t,e,i,s,n,o,a,r,l),c=e-2*s,d=o??t[0].timestamp,p=a??t[t.length-1].timestamp;return`${h} L ${Tt(p,d,p,c,s).toFixed(1)} ${i-s} L ${s} ${i-s} Z`}(t,this.width,this.height,2,.3,e,i,this.min,this.max):function(t,e,i,s=2,n,o,a,r){if(t.length<2)return"";const l=Ot(t,e,i,s,n,o,a,r),h=e-2*s,c=n??t[0].timestamp,d=o??t[t.length-1].timestamp;return`${l} L ${Tt(d,c,d,h,s).toFixed(1)} ${i-s} L ${s} ${i-s} Z`}(t,this.width,this.height,2,e,i,this.min,this.max)}get hasData(){return!!(this.data&&this.data.length>=2)}get useGradient(){return!!this.severity&&this.hasData}get lineGradientStopsHTML(){if(!this.hasData||!this.severity)return"";const t=this.effectiveData,e=this.effectiveTimeStart,i=this.effectiveTimeEnd-e||1,s=Math.max(1,Math.floor(t.length/30)),n=[];for(let o=0;o<t.length;o+=s){const s=i>0?(t[o].timestamp-e)/i*100:o/(t.length-1)*100,a=Mt(t[o].value,this.severity).color;n.push(`<stop offset="${Math.max(0,Math.min(100,s)).toFixed(1)}%" stop-color="${a}"/>`)}const o=Mt(t[t.length-1].value,this.severity).color;return n.push(`<stop offset="100%" stop-color="${o}"/>`),n.join("")}get areaGradientStopsHTML(){if(this.severity){const t=[],e=this.max-this.min||1,i=Et.find(t=>void 0!==this.severity[t]);i&&t.push(`<stop offset="0%" stop-color="${kt[i]}" stop-opacity="0.35"/>`);for(const i of Et){const s=this.severity[i];if(void 0===s)continue;const n=(this.max-s)/e*100;t.push(`<stop offset="${Math.max(0,Math.min(100,n)).toFixed(1)}%" stop-color="${kt[i]}" stop-opacity="0.35"/>`)}return t.push(`<stop offset="100%" stop-color="${kt.good}" stop-opacity="0.15"/>`),t.join("")}return`<stop offset="0%" stop-color="${this.color}" stop-opacity="0.4"/><stop offset="100%" stop-color="${this.color}" stop-opacity="0.05"/>`}render(){const t=this.useGradient?`url(#${this.lineGradientId})`:this.color;return q`
      <svg
        viewBox="0 0 ${this.width} ${this.height}"
        preserveAspectRatio="none"
        class="sparkline-svg"
        part="svg"
        role="img"
        aria-label="Sparkline chart"
      >
        <defs>
          <!-- Area fill gradient (vertical, severity-based or single-color) -->
          <!-- Stops are injected via innerHTML in updated() -->
          <linearGradient id="${this.areaGradientId}" x1="0" y1="0" x2="0" y2="1">
          </linearGradient>

          <!-- Line stroke gradient (horizontal, per-point severity colors) -->
          <!-- Stops are injected via innerHTML in updated() to avoid SVG namespace issues -->
          <linearGradient id="${this.lineGradientId}" x1="0" y1="0" x2="1" y2="0">
          </linearGradient>
        </defs>

        <!-- Area fill under the line (always present, empty path if no data) -->
        <path
          d="${this.hasData?this.areaPath:""}"
          fill="${this.hasData?`url(#${this.areaGradientId})`:"none"}"
          class="sparkline-area"
        />

        <!-- Solid color line (always present, serves as fallback and base) -->
        <path
          d="${this.hasData?this.linePath:""}"
          fill="none"
          stroke="${this.hasData?this.color:"none"}"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="sparkline-line"
        />

        <!-- Gradient line on top (per-point severity coloring) -->
        <!-- Rendered with stroke="none" when no gradient, stroke=url when gradient available -->
        <path
          d="${this.hasData?this.linePath:""}"
          fill="none"
          stroke="${this.useGradient?t:"none"}"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `}updated(){const t=this.shadowRoot?.getElementById(this.areaGradientId);if(t&&(t.innerHTML=this.areaGradientStopsHTML),this.useGradient){const t=this.shadowRoot?.getElementById(this.lineGradientId);t&&(t.innerHTML=this.lineGradientStopsHTML)}}static{this.styles=a`
    :host {
      display: block;
      width: 100%;
    }

    .sparkline-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .sparkline-area {
      transition: fill 0.3s ease;
    }

    .sparkline-line {
      transition: stroke 0.3s ease;
    }
  `}};t([pt({type:Array})],jt.prototype,"data",void 0),t([pt({type:String})],jt.prototype,"color",void 0),t([pt({type:Object})],jt.prototype,"severity",void 0),t([pt({type:Number})],jt.prototype,"min",void 0),t([pt({type:Number})],jt.prototype,"max",void 0),t([pt({type:Number})],jt.prototype,"width",void 0),t([pt({type:Number})],jt.prototype,"height",void 0),t([pt({type:Boolean})],jt.prototype,"smooth",void 0),t([pt({type:Boolean})],jt.prototype,"step",void 0),t([pt({type:Number})],jt.prototype,"timeStart",void 0),t([pt({type:Number})],jt.prototype,"timeEnd",void 0),jt=t([ht("aqm-sparkline")],jt);let Ft=class extends rt{constructor(){super(...arguments),this._historyCache=new Map,this._loading=!1}static getConfigElement(){return document.createElement("air-quality-monitor-card-editor")}static getStubConfig(){return{type:"custom:air-quality-monitor-card",title:"Air Quality Monitor",entities:[{entity:"sensor.pm25"},{entity:"sensor.co2"}],columns:2,show_sparklines:_t,sparkline_hours:24,compact:bt,smooth_sparklines:xt,step_sparklines:wt}}getCardSize(){const t=this._config?.entities?.length??0;if(0===t)return 2;const e=this._config?.columns??2,i=Math.ceil(t/e),s=this._config?.title?1:0,n=this._config?.compact?2:3;return Math.ceil(s+i*n)}setConfig(t){if(!t.entities||!Array.isArray(t.entities)||0===t.entities.length)throw new Error("At least one entity must be configured");this._config={...t,columns:t.columns??2,show_sparklines:t.show_sparklines??_t,sparkline_hours:t.sparkline_hours??24,compact:t.compact??bt,smooth_sparklines:t.smooth_sparklines??xt,step_sparklines:t.step_sparklines??wt}}willUpdate(t){t.has("hass")&&this.hass&&this._config&&this._fetchHistoryIfNeeded()}async _fetchHistoryIfNeeded(){if(!this.hass||!this._config)return;if(!this._config.show_sparklines)return;const t=this._config.entities||[],e=this._config.sparkline_hours??24,i=t.filter(t=>!this._historyCache.has(t.entity));if(0===i.length)return;this._loading=!0,this.requestUpdate();const s=i.map(async t=>{try{const i=await async function(t,e,i){const s=new Date,n=new Date(s.getTime()-60*i*60*1e3);try{const i=await t.callApi("GET",`history/period/${n.toISOString()}?filter_entity_id=${e}&minimal_response&no_attributes`);return i&&i[0]&&0!==i[0].length?i[0].map(t=>{const e=parseFloat(t.state);return isNaN(e)?null:{timestamp:new Date(t.last_changed||t.last_updated).getTime(),value:e}}).filter(t=>null!==t):[]}catch{return[]}}(this.hass,t.entity,e);this._historyCache.set(t.entity,i)}catch{this._historyCache.set(t.entity,[])}});await Promise.all(s),this._loading=!1,this.requestUpdate()}_getMetricData(){if(!this.hass||!this._config)return[];return(this._config.entities||[]).map(t=>Nt(t,this.hass,this._historyCache.get(t.entity)||[]))}_shouldShowSparkline(t,e){const i=t.config.show_sparkline;return void 0!==i?i:!1!==e.show_sparklines}_handleMoreInfo(t){$t(this,"hass-more-info",{entityId:t})}render(){if(!this._config)return B;const t=this._config;if(0===(t.entities||[]).length)return q`
        <ha-card>
          <div class="empty-state">
            <ha-icon icon="mdi:air-filter"></ha-icon>
            <p>No entities configured</p>
          </div>
        </ha-card>
      `;const e=this._getMetricData(),i=Math.min(Math.max(t.columns??2,1),6);return q`
      <ha-card>
        ${t.title?q`<div class="card-header">${t.title}</div>`:B}

        <div
          class="grid ${gt({compact:!!t.compact})}"
          style="grid-template-columns: repeat(${i}, 1fr)"
        >
          ${e.map(e=>{const i=function(t){if(!t||t.length<2)return{direction:"stable",label:"stable",arrow:"→"};const e=t.length;let i=0,s=0,n=0,o=0;for(let a=0;a<e;a++){const e=a,r=t[a].value;i+=e,s+=r,n+=e*r,o+=e*e}const a=(e*n-i*s)/(e*o-i*i),r=t.map(t=>t.value),l=Math.max(...r)-Math.min(...r),h=a*(e-1),c=Math.max(.05*l,1);return h>c?{direction:"rising",label:"rising",arrow:"↑"}:h<-c?{direction:"falling",label:"falling",arrow:"↓"}:{direction:"stable",label:"stable",arrow:"→"}}(e.history);return q`
                <div
                  class="entity-cell ${gt({unavailable:e.unavailable})}"
                  @click=${()=>this._handleMoreInfo(e.config.entity)}
                >
                  <aqm-gauge
                    .value=${e.stateNumeric}
                    .min=${e.config.min??0}
                    .max=${e.config.max??100}
                    .severityColor=${e.severity.color}
                    .severityLabel=${e.severity.label}
                    .name=${e.name}
                    .unit=${e.unit}
                    .showUnit=${!1!==e.config.show_unit}
                    .icon=${e.icon}
                    .unavailable=${e.unavailable}
                    .compact=${!!t.compact}
                    .trend=${i}
                  ></aqm-gauge>

${this._shouldShowSparkline(e,t)?q`
                        <aqm-sparkline
                           .data=${e.history}
                           .color=${e.severity.color}
                           .severity=${e.config.severity}
                           .min=${e.config.min??0}
                           .max=${e.config.max??100}
                           .smooth=${!0===t.smooth_sparklines}
                           .step=${!1!==t.step_sparklines}
                           .timeStart=${Date.now()-36e5*(t.sparkline_hours??24)}
                           .timeEnd=${Date.now()}
                         ></aqm-sparkline>
                      `:B}
                </div>
              `})}
        </div>
      </ha-card>
    `}static get styles(){return a`
      :host {
        display: block;
      }

      ha-card {
        padding: 20px;
        box-sizing: border-box;
      }

      .card-header {
        font-family: var(--paper-font-headline_-_font-family, inherit);
        font-size: 22px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin: 0 0 16px 0;
        padding: 0;
        line-height: 1.2;
      }

      .grid {
        display: grid;
        gap: 12px;
      }

      .entity-cell {
        background: var(
          --ha-card-background,
          var(--card-background-color, var(--secondary-background-color, #f5f5f5))
        );
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: background 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
        min-width: 0;
        cursor: pointer;
      }

      .entity-cell:hover {
        box-shadow: var(
          --ha-card-box-shadow,
          0 2px 8px rgba(0, 0, 0, 0.08)
        );
      }

      .compact .entity-cell {
        padding: 10px;
        border-radius: 8px;
        gap: 4px;
      }

      .entity-cell.unavailable {
        opacity: 0.55;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 16px;
        color: var(--secondary-text-color);
        gap: 12px;
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--disabled-text-color);
      }

      .empty-state p {
        margin: 0;
        font-size: 14px;
        text-align: center;
      }

      
    `}};t([pt({attribute:!1})],Ft.prototype,"hass",void 0),t([ut()],Ft.prototype,"_config",void 0),Ft=t([ht("air-quality-monitor-card")],Ft),window.customCards=window.customCards||[],window.customCards.push({type:"air-quality-monitor-card",name:"Air Quality Monitor Card",description:"Monitor air quality with gauges and trend graphs",preview:!0}),console.info("%c AIR-QUALITY-MONITOR-CARD %c v2.5.0 ","color: white; background: #4caf50; font-weight: bold;","color: #4caf50; background: white; font-weight: bold;");export{Ft as AirQualityMonitorCard};
