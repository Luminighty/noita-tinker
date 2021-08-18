class DataContainer extends HTMLElement {

	static styles = `
	.data-container {
		margin: 3px auto;
	}
	* {
		height: 21px;
		font-size: 21px;
	}
	span {
		display: inline-block;
		vertical-align: top;
		margin-top: 2px;
		font-family: 'noita';
		text-shadow: 0px 3px #000000;
	}
	.icon.show {
		image-rendering: pixelated;
		padding-right: 15px;
	}
	.icon.hidden {
		display: none;
	}
	.label {  
		width: 175px;
		color: #cfcfce;
	}
	.value {
		width: 120px;
		color: #ffffff;
	}
	`

	constructor() {
		super();
		this.attachShadow({mode: 'open'});

		const wrapper = document.createElement("div");
		wrapper.classList.add("data-container");

		this.iconElement = wrapper.appendChild(document.createElement("img"));
		this.labelElement = wrapper.appendChild(document.createElement("span"));
		this.valueElement = wrapper.appendChild(document.createElement("span"));

		this.iconElement.classList.add("icon");
		this.labelElement.classList.add("label");
		this.valueElement.classList.add("value");

		this.label = this.getAttribute('data-label') || "";
		this.value = this.getAttribute('data-value') || "";
		this.postfix = this.getAttribute("data-postfix") || "";


		const style = document.createElement('style');
		style.textContent = DataContainer.styles;

		this.shadowRoot.append(style, wrapper);
	}

	get value() {
		return this._value;
	}

	set value(val) {
		this._value = val;
		this.valueElement.textContent = `${val} ${this.postfix}`;
	}

	get label() {
		return this._label;
	}

	set label(val) {
		this.labelElement.textContent = val;
		this._label = val;
	}

	set icon(src) {
		this.iconElement.src = src;
		if (src) {
			this.iconElement.classList.remove("hidden");
			this.iconElement.classList.add("show");
		} else {
			this.iconElement.classList.add("hidden");
			this.iconElement.classList.remove("show");
		}
	}

	get icon() {
		return this.iconElement.src;
	}
}
customElements.define('data-container', DataContainer);