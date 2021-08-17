class WandElement extends HTMLElement {

	static styles = `
		.wrapper {
			border: 3px solid #948064;
			padding: 15px;
			display: inline-block;
		}
		.wand {
			min-height: 75px;
			image-rendering: pixelated;
			margin-bottom: 10px;
		}
		.spells {
			margin-top: 20px;
		}
	`

	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		const wrapper = document.createElement('div');
		wrapper.classList.add("wrapper");

		this.iconElement = wrapper.appendChild(document.createElement("img"));
		this.iconElement.classList.add("wand");
		this.icon = randomValue(randomValue(wandSprites));
		
		const datas = wrapper.appendChild(document.createElement("div"));
		this.spellContainer = wrapper.appendChild(document.createElement("div"));
		this.spellContainer.classList.add("spells");
		

		this._base = BaseStats();
		this.data = {
			shuffle:    Data("imgs/icons/shuffle.png", "Shuffle", true, datas, "", (value) => (value) ? "Yes" : "No", (value) => value == "True"),
			cast:       Data("imgs/icons/casts.png", "Spells/Cast", 1, datas),
			delay:      Data("imgs/icons/delay.png", "Cast delay", 2.20123, datas, "s", (value) => parseFloat(value).toFixed(2)),
			recharge:   Data("imgs/icons/recharge.png", "Rechrg. Time", 0.4322, datas, "s", (value) => parseFloat(value).toFixed(2)),
			maxmana:    Data("imgs/icons/mana.png", "Mana max", 73, datas),
			manacharge: Data("imgs/icons/manacharge.png", "Mana chg. Spd", 230, datas),
			capacity:   Data("imgs/icons/capacity.png", "Capacity", 3, datas),
			spread:     Data("imgs/icons/spread.png", "Spread", 2.121, datas, "DEG", (value) => parseFloat(value).toFixed(1)),
		};

		this.spells = [];


		const style = document.createElement('style');
		style.textContent = WandElement.styles;
		this.calculate();
		// attach the created elements to the shadow DOM
		this.shadowRoot.append(style, wrapper);
	}

	set icon(value) {
		this._icon = value;
		this.iconElement.src = `imgs/wands/wand_${value.toString().padStart(4, '0')}.png`;
	}

	get icon() {return this._icon;}

	get base() {
		return this._base;
	}

	set base(value) {
		for (const key in value) 
			this._base[key] = value[key];
		this.calculate();
	}

	calculate() {
		let stats = this.base;
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
}

function BaseStats() {
	return {
		shuffle: Math.random() > 0.5, 
		cast: parseInt(Math.max(Math.random() * 8 - 3, 1)), 
		delay: Math.random() * 2,
		recharge: Math.random() * 3, 
		maxmana: parseInt(Math.random() * 500), 
		manacharge: parseInt(Math.random() * 500),
		capacity: parseInt(Math.random() * 25 + 1), 
		spread: Math.max(Math.random() * 15 - 5, 0)
	};
}



function applySpell(stats, spell) {
	stats.spread += spell["spread_degrees"];
	stats.spread += spell["spread_degrees"];
	stats.delay += spell["fire_rate_wait"] / 60;
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

WandElement.html = `
`;

customElements.define('wand-element', WandElement);