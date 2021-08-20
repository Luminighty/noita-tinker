class SpellPicker extends HTMLElement {

	static styles = `
	.wrapper {
		width: 30%;
		top: 0px;
		position: fixed;
		height: 100vh;
	}
	.spell-holder {
		display: flex;    
		justify-content: center;
		height: 100%;
		flex-flow: wrap;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.input {		
		font-family: 'noita';
		margin-left: 5px;
	}
	
	@media screen and (max-width: 600px) {
		.wrapper  {
			position: initial;
			width: 100%;
		}
		
	}
	::-webkit-scrollbar {
		width: 8px;
	}
	::-webkit-scrollbar-thumb {
		background: #948064;
		border-radius: 3px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #806a4b; 
	  }
	::-webkit-scrollbar-track {
		background-color: #94806420;
	}
	`;

	constructor() {
		super();
		this.attachShadow({mode: 'open'});

		const wrapper = document.createElement("div");
		wrapper.classList.add("wrapper");

		const filterHolder = wrapper.appendChild(document.createElement("div"));
		this.filterElements = {
			name: SpellPicker.addFilterField({title: "Name", parent: filterHolder, type: "text", onChange: this.refreshFilters.bind(this)}),
		};
		const spellHolder = wrapper.appendChild(document.createElement("div"));
		spellHolder.classList.add("spell-holder");
		this.spellElements = Object.keys(spells).sort((a,b) => spells[a].type - spells[b].type).map(((key) => {
			const element = spellHolder.appendChild(document.createElement("spell-element"));
			element.spell = key;
			return element;
		}));

		const style = document.createElement('style');
		style.textContent = SpellPicker.styles;

		this.shadowRoot.append(style, wrapper);
	}

	refreshFilters() {
		for (const spellElement of this.spellElements) {
			spellElement.style.display = (this.isShown(spellElement.spell)) ? "" : "none";
		}
	}

	isShown(spell) {
		return spell.name && spell.name.toLowerCase().includes(this.filterElements.name.value.toLowerCase());
	}

	static addFilterField({title, parent, type, values, onChange}) {
		const label = parent.appendChild(document.createElement("label"));
		label.innerText = title;
		const filter = parent.appendChild(document.createElement(type != "select" ? "input" : "select"));
		filter.classList.add("input");
		filter.addEventListener("change", onChange);
		if (type == "select")
		for (const value of values) {
			let key = value;
			let val = value;
			if (typeof(value) == "object")
				key = value[0]; val = value[1];

			const option = filter.appendChild(document.createElement("option"));
			option.value = key;
			option.innerText = value;
		}
		return filter;
	}

}



customElements.define('spell-picker', SpellPicker);