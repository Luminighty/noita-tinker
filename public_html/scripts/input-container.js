class InputContainer extends DataContainer {

	static styles = `
		.input {
			background-color: transparent;
			display: inline-block;
			vertical-align: top;
			font-family: 'noita';
			text-shadow: 0px 3px #000000;
			margin-left: -4px;
			width: 118px;
			border: 1px dashed #948064;
		}
	`

	constructor() {
		super();
		const style = document.createElement('style');
		style.textContent = InputContainer.styles;

		this.parser = (value) => value;
		this.shadowRoot.appendChild(style);
		this.listeners = [];
	}

	get value() {
		if (this.inputField.type == "checkbox") {
			return this.inputField.checked;
		}
		return this.inputField.value;
	}

	set value(val) {
		this._value = val;
		this.valueElement.textContent = `${val} ${this.postfix}`;
		this.valueElement.value = val;
		if (typeof(val) == "boolean")
			this.valueElement.checked = val;
	}

	set inputField(element) {
		element.classList.add("input");
		element.classList.add("value");
		this.valueElement.parentElement.appendChild(element);
		this.valueElement.remove();
		this.valueElement = element;
		element.addEventListener("change", (event) => this.listeners.forEach((f) => f(this.parser(this.value))));
	}

	set suffix(value) {
		if (!this.suffixElement) {
			this.suffixElement = this.inputField.parentElement.appendChild(document.createElement("span"));
			this.suffixElement.classList.add("suffix");
		}
		//this.suffixElement.innerText = value;
	}

	get suffix() {
		return (this.suffixElement) ? this.suffixElement.innerText : "";
	}

	get inputField() {
		return this.valueElement;
	}

	onValueChanged(func) {
		this.listeners.push(func);
	}

	static fromDataContainer(parent, dataContainer, value, suffix) {
		const inputContainer = document.createElement("input-container");
		inputContainer.icon = dataContainer.icon;
		inputContainer.label = dataContainer.label;
		inputContainer.inputField = document.createElement("input");
		inputContainer.value = value;
		if (suffix)
			inputContainer.suffix = suffix;
		parent.appendChild(inputContainer);
		return inputContainer;
	}

	static number(parent, dataContainer, value, suffix, step, min, max) {
		const container = InputContainer.fromDataContainer(parent, dataContainer, value, suffix);
		container.inputField.type = "number";
		container.inputField.step = step;
		container.parser = (Number.isInteger(step)) ? parseInt : parseFloat;
		if (min != null)
			container.inputField.min = min;
		if (max != null)
			container.inputField.max = max;
		return container;
	}

	static boolean(parent, dataContainer, value, labels) {
		const container = InputContainer.fromDataContainer(parent, dataContainer, value);
		container.inputField.type = "checkbox";

		return container;
	}
}

customElements.define('input-container', InputContainer);