let wand = null;

class WandElement extends HTMLElement {

	static styles = `
		.wrapper {
			border: 3px solid #948064;
			padding: 15px;
			display: inline-block;
			border-radius: 2px;
			margin-bottom: 10px;
		}
		.wand {
			image-rendering: pixelated;
			margin-bottom: 10px;
		}
		.spells {
			margin-top: 20px;
		}
	`

	constructor() {
		super();
		wand = this;
		this.attachShadow({mode: 'open'});
		const wrapper = document.createElement('div');
		wrapper.classList.add("wrapper");

		this.iconElement = wrapper.appendChild(document.createElement("img"));
		this.iconElement.classList.add("wand");
		this.iconElement.addEventListener("dblclick", () => wandSpritePicker.open(this));
		this.icon = randomValue(randomValue(wandSprites));
		
		this.datas = wrapper.appendChild(document.createElement("div"));
		this.inputs = wrapper.appendChild(document.createElement("div"));
		this.spellContainer = wrapper.appendChild(document.createElement("div"));
		this.spellContainer.classList.add("spells");
		

		this._base = BaseStats();
		this.data = {
			shuffle:    Data("imgs/icons/shuffle.png",          "Shuffle", true, this.datas, "", (value) => (value) ? "Yes" : "No", (value) => value == "True"),
			cast:       Data("imgs/icons/casts.png",        "Spells/Cast", 1, this.datas),
			delay:      Data("imgs/icons/delay.png",         "Cast delay", 0, this.datas, "s", (value) => parseFloat(value).toFixed(2)),
			recharge:   Data("imgs/icons/recharge.png",    "Rechrg. Time", 0, this.datas, "s", (value) => parseFloat(value).toFixed(2)),
			maxmana:    Data("imgs/icons/mana.png",            "Mana max", 7, this.datas),
			manacharge: Data("imgs/icons/manacharge.png", "Mana chg. Spd", 2, this.datas),
			capacity:   Data("imgs/icons/capacity.png",        "Capacity", 3, this.datas),
			spread:     Data("imgs/icons/spread.png",            "Spread", 2, this.datas, "DEG", (value) => parseFloat(value).toFixed(1)),
		};

		this.inputFields = {
			shuffle:   InputContainer.boolean(this.inputs, this.data.shuffle.container, this.base.shuffle, ["Yes", "No"]),
			cast:       InputContainer.number(this.inputs, this.data.cast.container,       this.base.cast, null, 1, 1, 99),
			delay:      InputContainer.number(this.inputs, this.data.delay.container,      this.base.delay, "s", 0.01, -999, 999),
			recharge:   InputContainer.number(this.inputs, this.data.recharge.container,   this.base.recharge, "s", 0.01, -999, 999),
			maxmana:    InputContainer.number(this.inputs, this.data.maxmana.container,    this.base.maxmana, null, 1, 0, 99999),
			manacharge: InputContainer.number(this.inputs, this.data.manacharge.container, this.base.manacharge, null, 1, 0, 99999),
			capacity:   InputContainer.number(this.inputs, this.data.capacity.container,   this.base.capacity, null, 1, 1, 99),
			spread:     InputContainer.number(this.inputs, this.data.spread.container,     this.base.spread, "DEG", 0.01, 1, 99),
		};
		for (const key in this.inputFields) {
			const inputField = this.inputFields[key];
			inputField.onValueChanged((value) => {
				this.base[key] = value;
				this.calculate();
			});
		}

		this.spells = [];
		this.updateCapacity(this.base.capacity);
		this.isEditingStats = false;


		const style = document.createElement('style');
		style.textContent = WandElement.styles;
		
		this.calculate();
		// attach the created elements to the shadow DOM
		this.shadowRoot.append(style, wrapper);
	}

	set icon(value) {
		this._icon = value;
		this.iconElement.src = `imgs/wands/wand_${value.toString().padStart(4, '0')}.png`;
		if (this.iconElement.naturalHeight == 0) {
			this.iconElement.addEventListener("load", () => this.iconElement.height = this.iconElement.naturalHeight * 5);
		} else {
			this.iconElement.height = this.iconElement.naturalHeight * 5;
		}
	}

	get icon() {return this._icon;}

	get base() {
		return this._base;
	}

	set base(value) {
		for (const key in value) {
			this._base[key] = value[key];
			this.inputFields[key].value = value[key];
		}
		this.calculate();
	}

	calculate() {
		let stats = Object.assign({}, this.base);
		for (const spellElement of this.spells)
			stats = applySpell(stats, spellElement.spell);
		
		for (const key in this.base) {
			const statElement = this.data[key];
			statElement.setValue(stats[key]);				
		}

		if (this.data.capacity.getValue() != this.spells.length)
			this.updateCapacity(parseInt(this.data.capacity.getValue()));
	}

	updateCapacity(newCapacity) {
		while(this.spells.length > newCapacity)
			this.spellContainer.removeChild(this.spells.pop());
		while(this.spells.length < newCapacity) 
			this.spells.push(this.spellContainer.appendChild(document.createElement("spell-element")));
	}

	set isEditingStats(value) {
		this.datas.style.display = (value) ? "none" : "block";
		this.inputs.style.display = (value) ? "block" : "none";
	}
}

function BaseStats() {
	return {
		shuffle: Math.random() > 0.5, 
		cast: parseInt(Math.max(Math.random() * 8 - 3, 1)), 
		delay: (Math.random() * 2).toFixed(2),
		recharge: (Math.random() * 3).toFixed(2), 
		maxmana: parseInt(Math.random() * 500), 
		manacharge: parseInt(Math.random() * 500),
		capacity: parseInt(Math.random() * 25 + 1), 
		spread: (Math.max(Math.random() * 15 - 5, 0)).toFixed(2)
	};
}



function applySpell(stats, spell) {
	if (spell) {
		stats.spread = parseFloat(stats.spread) + parseFloat(spell["spread_degrees"]);
		stats.delay = parseFloat(stats.delay) + parseFloat(spell["fire_rate_wait"] / 60);
	}
	return stats;
}

function Data(icon, label, value, parent, postfix, setter = (value) => value, getter = (value) => value) {
	const container = document.createElement("data-container");
	container.postfix = postfix || "";
	container.value = setter(value);
	container.label = label;
	container.icon = icon;
	parent.appendChild(container);
	return { 
		container,
		setValue: (value) => container.value = setter(value),
		getValue: () => getter(container.value)
	};
}

customElements.define('wand-element', WandElement);

let settings = {
	set editingBaseStats(value) {
		this._.editingBaseStats = value;
		document.querySelectorAll("wand-element").forEach((element) => {
			element.isEditingStats = value;
		});
	},
	get editingBaseStats() { return this._.editingBaseStats; },

	_: {
		editingBaseStats: false,
	}
}

document.querySelector("#editStats").addEventListener("change", (event) => {
	settings.editingBaseStats = event.target.checked;
});

function save() {
	const data = {
		wands: []
	};
	const wands = document.querySelectorAll("wand-element");
	for (const wand of wands) {
		const wandData = {
			sprite: wand.icon,
			base: wand.base,
			spells: wand.spells.map((spell) => (spell.spell) ? spell.spell.id : null)
		};
		data.wands.push(wandData);
	}
	return JSON.stringify(data);
}


function load(str) {
	const data = JSON.parse(str);
	const wandContainer = document.querySelector("#wands.container");
	while(wandContainer.children.length > 0)
		wandContainer.removeChild(wandContainer.firstChild);
	for (const wand of data.wands) {
		const element = wandContainer.appendChild(document.createElement("wand-element"));
		element.icon = wand.sprite;
		element.base = wand.base;
		element.updateCapacity(wand.base.capacity);
		for (let index = 0; index < wand.spells.length; index++) {
			const spellId = wand.spells[index];
			element.spells[index].spell = spellId;
		}
		element.calculate();
	}
}