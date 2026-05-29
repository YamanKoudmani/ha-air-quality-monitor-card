function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,f=g?g.emptyScript:"",y=m.reactiveElementPolyfillSupport,v=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??$)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,y?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,w=t=>t,k=A.trustedTypes,E=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,M=`<${P}>`,N=document,U=()=>N.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,R="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,j=/>/g,q=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,L=/"/g,I=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),V=new WeakMap,G=N.createTreeWalker(N,129);function Z(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=T;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===T?"!--"===l[1]?r=H:void 0!==l[1]?r=j:void 0!==l[2]?(I.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=q):void 0!==l[3]&&(r=q):r===q?">"===l[0]?(r=n??T,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?q:'"'===l[3]?L:D):r===L||r===D?r=q:r===H||r===j?r=T:(r=q,n=void 0);const d=r===q&&t[e+1].startsWith("/>")?" ":"";o+=r===T?i+M:c>=0?(s.push(a),i.slice(0,c)+S+i.slice(c)+C+d):i+C+(-2===c?e:d)}return[Z(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=K.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=c[o++],i=s.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),G.nextNode(),a.push({type:2,index:++n});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const i=N.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===F)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=Q(t,n._$AS(t,e.values),n,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??N).importNode(e,!0);G.currentNode=s;let n=G.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=G.nextNode(),o++)}return G.currentNode=N,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),O(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new K(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new X(this.O(U()),this.O(U()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=Q(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==F,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Q(this,s[i+r],e,r),a===F&&(a=this._$AH[r]),o||=!O(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends tt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??W)===F)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const ot=A.litHtmlPolyfillSupport;ot?.(K,X),(A.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;let at=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new X(e.insertBefore(U(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const lt=rt.litElementPolyfillSupport;lt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:$},dt=(t=ht,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}const mt=1;class gt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const ft=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends gt{constructor(t){if(super(t),t.type!==mt||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return F}}),yt=!0,vt=!1,_t={pm25:{min:0,max:150,severity:{good:12,moderate:35,unhealthy_sensitive:55,unhealthy:150}},pm10:{min:0,max:250,severity:{good:54,moderate:154,unhealthy_sensitive:254,unhealthy:250}},co2:{min:400,max:5e3,severity:{good:800,moderate:1500,unhealthy_sensitive:2e3,unhealthy:5e3}},voc:{min:0,max:1e3,severity:{good:250,moderate:500,unhealthy_sensitive:750,unhealthy:1e3}},temperature:{min:0,max:50,severity:{good:26,moderate:30,unhealthy_sensitive:35,unhealthy:50}},humidity:{min:0,max:100,severity:{good:60,moderate:70,unhealthy_sensitive:80,unhealthy:100}}},$t={good:"#4caf50",moderate:"#ffeb3b",unhealthy_sensitive:"#ff9800",unhealthy:"#f44336",very_unhealthy:"#9c27b0",hazardous:"#7e0023",unknown:"#9e9e9e"},bt={good:"Good",moderate:"Moderate",unhealthy_sensitive:"Sensitive",unhealthy:"Unhealthy",very_unhealthy:"Very Unhealthy",hazardous:"Hazardous",unknown:"Unknown"},xt=["hazardous","very_unhealthy","unhealthy","unhealthy_sensitive","moderate","good"],At={pm25:"mdi:air-filter",pm10:"mdi:air-filter",co2:"mdi:molecule-co2",voc:"mdi:flask-outline",temperature:"mdi:thermometer",humidity:"mdi:water-percent",aqi:"mdi:weather-hazy",no2:"mdi:molecule",o3:"mdi:molecule",so2:"mdi:molecule",co:"mdi:molecule-co",formaldehyde:"mdi:chemical-weapon"};function wt(t){const e=t.toLowerCase();return e.includes("pm25")||e.includes("pm2.5")||e.includes("pm2_5")?"pm25":e.includes("pm10")?"pm10":e.includes("co2")||e.includes("carbon_dioxide")?"co2":e.includes("voc")||e.includes("volatile")?"voc":e.includes("temp")?"temperature":e.includes("humid")?"humidity":e.includes("aqi")||e.includes("air_quality")?"aqi":e.includes("no2")||e.includes("nitrogen")?"no2":e.includes("o3")||e.includes("ozone")?"o3":e.includes("formaldehyde")?"formaldehyde":e.includes("co")&&!e.includes("co2")?"co":""}function kt(t,e,i){const s=e.states[t.entity],n=!s||"unavailable"===s.state||"unknown"===s.state,o=s?.state??"",r=""!==o&&"unavailable"!==o&&"unknown"!==o?parseFloat(o):null,a=t.unit??s?.attributes?.unit_of_measurement??"",l=t.name??s?.attributes?.friendly_name??t.entity,c=t.icon??s?.attributes?.icon??function(t){const e=wt(t);return At[e]||"mdi:gauge"}(t.entity),h=function(t){const e=wt(t);return _t[e]}(t.entity),d=function(t,e){if(null==t||isNaN(t))return{level:"unknown",label:bt.unknown,color:$t.unknown};if(e){for(const i of xt){const s=e[i];if(void 0!==s&&t<=s)return{level:i,label:bt[i],color:$t[i]}}const i=xt.find(t=>void 0!==e[t])||"unknown";return{level:i,label:bt[i],color:$t[i]}}return{level:"unknown",label:bt.unknown,color:$t.unknown}}(r,t.severity??h?.severity),p=t.min??h?.min??0,u=t.max??h?.max??(null!==r?Math.max(1.5*r,100):100);return{config:{...t,min:p,max:u},state:o,stateNumeric:r,unit:a,name:l,icon:c,severity:d,history:i,unavailable:n}}function Et(t,e,i,s,n){const o=St(t,e,i,n),r=St(t,e,i,s),a=n-s<=180?"0":"1";return`M ${o.x} ${o.y} A ${i} ${i} 0 ${a} 0 ${r.x} ${r.y}`}function St(t,e,i,s){const n=(s-90)*Math.PI/180;return{x:t+i*Math.cos(n),y:e+i*Math.sin(n)}}function Ct(t,e,i,s=2){if(t.length<2)return"";const n=t.map(t=>t.value),o=Math.min(...n),r=Math.max(...n)-o||1,a=i-2*s,l=(e-2*s)/(t.length-1);return t.map((t,e)=>{const i=s+e*l,n=s+a-(t.value-o)/r*a;return`${0===e?"M":"L"} ${i.toFixed(1)} ${n.toFixed(1)}`}).join(" ")}var Pt,Mt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Pt||(Pt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Mt||(Mt={}));var Nt=function(t,e,i,s){s=s||{},i=i??{};var n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n};let Ut=class extends at{setConfig(t){this._config=t}_valueChanged(t){const e=t.target,i=e.dataset.configValue;if(!i)return;let s=e.value;"number"===e.type&&(s=""===s?void 0:Number(s),void 0!==s&&isNaN(s))||("checkbox"===e.type&&(s=e.checked),this._config&&this._config[i]===s||(this._config={...this._config,[i]:s},Nt(this,"config-changed",{config:this._config})))}_entityChanged(t,e){this._updateEntity(t,{entity:e.detail.value})}_entityFieldChanged(t,e,i){let s=i.target.value;("min"!==e&&"max"!==e||(s=""===s?void 0:Number(s),void 0===s||!isNaN(s)))&&("name"===e&&(s=s||void 0),this._updateEntity(t,{[e]:s}))}_updateEntity(t,e){const i=this._config?.entities?.map((i,s)=>s===t?{...i,...e}:i);i&&(this._config={...this._config,entities:i},Nt(this,"config-changed",{config:this._config}))}_removeEntity(t){const e=[...this._config?.entities||[]];e.splice(t,1),this._config={...this._config,entities:e},Nt(this,"config-changed",{config:this._config})}_addEntity(){const t=[...this._config?.entities||[],{entity:""}];this._config={...this._config,entities:t},Nt(this,"config-changed",{config:this._config})}render(){if(!this.hass)return B`<div class="loading">Loading…</div>`;const t=this._config??{},e=t.entities??[];return B`
      <div class="editor">
        <!-- Title -->
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            class="ha-input"
            placeholder="Optional card title"
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
              .value=${String(t.columns??3)}
              data-config-value="columns"
              @input=${this._valueChanged}
            />
          </div>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${t.compact??vt}
              data-config-value="compact"
              @change=${this._valueChanged}
            />
            <span>Compact mode</span>
          </label>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${t.show_sparklines??yt}
              data-config-value="show_sparklines"
              @change=${this._valueChanged}
            />
            <span>Show trend sparklines</span>
          </label>

          ${t.show_sparklines??yt?B`
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
              `:W}
        </div>

        <!-- Entities -->
        <div class="section">
          <div class="section-title">Entities</div>

          ${e.map((t,i)=>B`
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
    `}static get styles(){return r`
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
    `}};t([pt({attribute:!1})],Ut.prototype,"hass",void 0),t([ut()],Ut.prototype,"_config",void 0),Ut=t([ct("air-quality-monitor-card-editor")],Ut);let Ot=class extends at{constructor(){super(...arguments),this.value=null,this.min=0,this.max=100,this.severityColor="#9e9e9e",this.name="",this.unit="",this.icon="",this.unavailable=!1,this.compact=!1,this.cx=60,this.cy=42,this.radius=30,this.startAngle=150,this.endAngle=390,this.strokeWidth=7}get ratio(){if(null===this.value||void 0===this.value)return 0;const t=(this.value-this.min)/(this.max-this.min);return Math.max(0,Math.min(1,t))}get filledAngle(){return this.startAngle+this.ratio*(this.endAngle-this.startAngle)}get backgroundArcPath(){return Et(this.cx,this.cy,this.radius,this.startAngle,this.endAngle)}get filledArcPath(){return null===this.value||void 0===this.value?"":Et(this.cx,this.cy,this.radius,this.startAngle,this.filledAngle)}render(){const t=this.unavailable?"—":function(t){if(null===t||isNaN(t))return"—";const e=Math.abs(t)<10?1:0;return t.toFixed(e)}(this.value),e=this.unavailable?"":this.unit,i=this.unavailable?"#bdbdbd":this.severityColor,s=this.unavailable?"var(--disabled-text-color, #9e9e9e)":"var(--primary-text-color)",n=this.unavailable?"var(--disabled-text-color, #9e9e9e)":"var(--secondary-text-color)";return B`
      <div class="gauge-container">
        ${!this.icon||this.compact||this.unavailable?W:B`<ha-icon .icon=${this.icon} class="gauge-icon"></ha-icon>`}

        <svg
          viewBox="0 0 120 75"
          class="gauge-svg"
          role="img"
          aria-label="${this.name}: ${t}${e?" "+e:""}"
        >
          <!-- Background arc -->
          <path
            d="${this.backgroundArcPath}"
            stroke="var(--divider-color, #e0e0e0)"
            stroke-width="${this.strokeWidth}"
            fill="none"
            stroke-linecap="round"
          />

          <!-- Foreground arc (severity colored) -->
          ${null===this.value||this.unavailable?W:B`
                <path
                  d="${this.filledArcPath}"
                  stroke="${i}"
                  stroke-width="${this.strokeWidth}"
                  fill="none"
                  stroke-linecap="round"
                  class="arc-fill"
                />
              `}

          <!-- Value text -->
          <text
            x="60"
            y="${this.compact?44:46}"
            text-anchor="middle"
            fill="${s}"
            class="value-text"
          >
            ${t}
          </text>

          <!-- Unit text -->
          ${e?B`
                <text
                  x="60"
                  y="${this.compact?54:56}"
                  text-anchor="middle"
                  fill="${n}"
                  class="unit-text"
                >
                  ${e}
                </text>
              `:W}

          <!-- Unavailable label -->
          ${this.unavailable?B`
                <text
                  x="60"
                  y="46"
                  text-anchor="middle"
                  fill="var(--disabled-text-color, #9e9e9e)"
                  class="unavailable-text"
                >
                  N/A
                </text>
              `:W}
        </svg>

        ${this.name?B`<div class="gauge-name" style="color: ${n}">${this.name}</div>`:W}
      </div>
    `}static{this.styles=r`
    :host {
      display: block;
      width: 100%;
    }

    .gauge-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .gauge-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
      margin-bottom: 2px;
    }

    .gauge-svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
    }

    .arc-fill {
      transition: stroke 0.3s ease;
    }

    .value-text {
      font-size: 18px;
      font-weight: 600;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
    }

    .unit-text {
      font-size: 10px;
      font-weight: 400;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
    }

    .unavailable-text {
      font-size: 11px;
      font-weight: 500;
      font-family: var(--paper-font-common-base_-_font-family, 'Roboto', 'Noto Sans', sans-serif);
      dominant-baseline: central;
    }

    .gauge-name {
      font-size: 11px;
      font-weight: 500;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
      line-height: 1.2;
    }

    /* Compact mode */
    :host([compact]) .gauge-icon {
      display: none;
    }

    :host([compact]) .value-text {
      font-size: 14px;
    }

    :host([compact]) .unit-text {
      font-size: 9px;
    }

    :host([compact]) .gauge-name {
      font-size: 9px;
    }
  `}};t([pt({type:Number})],Ot.prototype,"value",void 0),t([pt({type:Number})],Ot.prototype,"min",void 0),t([pt({type:Number})],Ot.prototype,"max",void 0),t([pt({type:String})],Ot.prototype,"severityColor",void 0),t([pt({type:String})],Ot.prototype,"name",void 0),t([pt({type:String})],Ot.prototype,"unit",void 0),t([pt({type:String})],Ot.prototype,"icon",void 0),t([pt({type:Boolean,reflect:!0})],Ot.prototype,"unavailable",void 0),t([pt({type:Boolean,reflect:!0})],Ot.prototype,"compact",void 0),Ot=t([ct("aqm-gauge")],Ot);let zt=0,Rt=class extends at{constructor(){super(...arguments),this.data=[],this.color="#4caf50",this.width=120,this.height=40,this.gradientId="sparkline-grad-"+ ++zt}get linePath(){return Ct(this.data,this.width,this.height)}get areaPath(){return function(t,e,i,s=2){if(t.length<2)return"";const n=Ct(t,e,i,s),o=(e-2*s)/(t.length-1);return`${n} L ${(s+(t.length-1)*o).toFixed(1)} ${i-s} L ${s} ${i-s} Z`}(this.data,this.width,this.height)}render(){return!this.data||this.data.length<2?B`<svg class="sparkline-svg" viewBox="0 0 ${this.width} ${this.height}" preserveAspectRatio="none" part="svg"></svg>`:B`
      <svg
        viewBox="0 0 ${this.width} ${this.height}"
        preserveAspectRatio="none"
        class="sparkline-svg"
        part="svg"
        role="img"
        aria-label="Sparkline chart"
      >
        <defs>
          <linearGradient id="${this.gradientId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${this.color}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="${this.color}" stop-opacity="0.02" />
          </linearGradient>
        </defs>

        <!-- Area fill under the line -->
        <path
          d="${this.areaPath}"
          fill="url(#${this.gradientId})"
          class="sparkline-area"
        />

        <!-- The line itself -->
        <path
          d="${this.linePath}"
          fill="none"
          stroke="${this.color}"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="sparkline-line"
        />
      </svg>
    `}static{this.styles=r`
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
  `}};t([pt({type:Array})],Rt.prototype,"data",void 0),t([pt({type:String})],Rt.prototype,"color",void 0),t([pt({type:Number})],Rt.prototype,"width",void 0),t([pt({type:Number})],Rt.prototype,"height",void 0),Rt=t([ct("aqm-sparkline")],Rt);let Tt=class extends at{constructor(){super(...arguments),this._historyCache=new Map,this._loading=!1}static getConfigElement(){return document.createElement("air-quality-monitor-card-editor")}static getStubConfig(){return{type:"custom:air-quality-monitor-card",entities:[{entity:"sensor.pm25"},{entity:"sensor.co2"}],columns:3,show_sparklines:yt,sparkline_hours:24,compact:vt}}getCardSize(){const t=this._config?.entities?.length??0;if(0===t)return 2;const e=this._config?.columns??3,i=Math.ceil(t/e),s=this._config?.title?1:0,n=this._config?.compact?1.5:2.5;return Math.ceil(s+i*n)}setConfig(t){if(!t.entities||!Array.isArray(t.entities)||0===t.entities.length)throw new Error("At least one entity must be configured");this._config={...t,columns:t.columns??3,show_sparklines:t.show_sparklines??yt,sparkline_hours:t.sparkline_hours??24,compact:t.compact??vt}}willUpdate(t){t.has("hass")&&this.hass&&this._config&&this._fetchHistoryIfNeeded()}async _fetchHistoryIfNeeded(){if(!this.hass||!this._config)return;if(!this._config.show_sparklines)return;const t=this._config.entities||[],e=this._config.sparkline_hours??24,i=t.filter(t=>!this._historyCache.has(t.entity));if(0===i.length)return;this._loading=!0,this.requestUpdate();const s=i.map(async t=>{try{const i=await async function(t,e,i){const s=new Date,n=new Date(s.getTime()-60*i*60*1e3);try{const i=await t.callApi("GET",`history/period/${n.toISOString()}?filter_entity_id=${e}&minimal_response&no_attributes`);return i&&i[0]&&0!==i[0].length?i[0].map(t=>{const e=parseFloat(t.state);return isNaN(e)?null:{timestamp:new Date(t.last_changed||t.last_updated).getTime(),value:e}}).filter(t=>null!==t):[]}catch{return[]}}(this.hass,t.entity,e);this._historyCache.set(t.entity,i)}catch{this._historyCache.set(t.entity,[])}});await Promise.all(s),this._loading=!1,this.requestUpdate()}_getMetricData(){if(!this.hass||!this._config)return[];return(this._config.entities||[]).map(t=>kt(t,this.hass,this._historyCache.get(t.entity)||[]))}render(){if(!this._config)return W;const t=this._config;if(0===(t.entities||[]).length)return B`
        <ha-card>
          <div class="empty-state">
            <ha-icon icon="mdi:air-filter"></ha-icon>
            <p>No entities configured</p>
          </div>
        </ha-card>
      `;const e=this._getMetricData(),i=Math.min(Math.max(t.columns??3,1),6);return B`
      <ha-card>
        ${t.title?B`<h1 class="card-header">${t.title}</h1>`:W}

        <div
          class="grid ${ft({compact:!!t.compact})}"
          style="grid-template-columns: repeat(${i}, 1fr)"
        >
          ${e.map(e=>B`
              <div
                class="entity-cell ${ft({unavailable:e.unavailable})}"
              >
                <aqm-gauge
                  .value=${e.stateNumeric}
                  .min=${e.config.min??0}
                  .max=${e.config.max??100}
                  .severityColor=${e.severity.color}
                  .name=${e.name}
                  .unit=${e.unit}
                  .icon=${e.icon}
                  .unavailable=${e.unavailable}
                  .compact=${!!t.compact}
                ></aqm-gauge>

                ${!1!==t.show_sparklines?this._loading&&0===e.history.length?B`
                        <div class="sparkline-skeleton">
                          <svg
                            width="100%"
                            height="40"
                            viewBox="0 0 120 40"
                            preserveAspectRatio="none"
                          >
                            <rect
                              x="0"
                              y="15"
                              width="120"
                              height="10"
                              rx="5"
                              fill="var(--secondary-background-color)"
                              opacity="0.4"
                            >
                              <animate
                                attributeName="opacity"
                                values="0.4;0.8;0.4"
                                dur="2s"
                                repeatCount="indefinite"
                              />
                            </rect>
                          </svg>
                        </div>
                      `:B`
                        <aqm-sparkline
                          .data=${e.history}
                          .color=${e.severity.color}
                        ></aqm-sparkline>
                      `:W}
              </div>
            `)}
        </div>
      </ha-card>
    `}static get styles(){return r`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
        box-sizing: border-box;
      }

      .card-header {
        font-family: var(--paper-font-headline_-_font-family, inherit);
        font-size: 24px;
        font-weight: 400;
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
        align-items: center;
        gap: 8px;
        transition: background 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
        min-width: 0;
      }

      .entity-cell:hover {
        box-shadow: var(
          --ha-card-box-shadow,
          0 2px 8px rgba(0, 0, 0, 0.08)
        );
      }

      .compact .entity-cell {
        padding: 8px;
        border-radius: 8px;
        gap: 4px;
      }

      .entity-cell.unavailable {
        opacity: 0.55;
      }

      .sparkline-skeleton {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
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

      /* Responsive overrides for narrow screens */
      @media (max-width: 480px) {
        .grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }

      @media (max-width: 340px) {
        .grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}};t([pt({attribute:!1})],Tt.prototype,"hass",void 0),t([ut()],Tt.prototype,"_config",void 0),Tt=t([ct("air-quality-monitor-card")],Tt),window.customCards=window.customCards||[],window.customCards.push({type:"air-quality-monitor-card",name:"Air Quality Monitor Card",description:"Monitor air quality with gauges and trend graphs",preview:!0}),console.info("%c AIR-QUALITY-MONITOR-CARD %c v1.0.0 ","color: white; background: #4caf50; font-weight: bold;","color: #4caf50; background: white; font-weight: bold;");export{Tt as AirQualityMonitorCard};
