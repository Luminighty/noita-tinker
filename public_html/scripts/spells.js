const GrabbedSpell = {
	grabbed: null,
	originalHover: null,
	hover: null,
	hoverWand: null,
	get is_grabbing() { return this.grabbed != null; },
	get is_hovering() { return this.hover != null; },
}

document.body.addEventListener("mouseup", () => {
	if (GrabbedSpell.hover && GrabbedSpell.grabbed) {
		if (GrabbedSpell.hover.spell && GrabbedSpell.originalHover)
			GrabbedSpell.originalHover.spell = GrabbedSpell.hover.spell.id;
		GrabbedSpell.hover.spell = GrabbedSpell.grabbed;
	}
	if (GrabbedSpell.hoverWand)
		GrabbedSpell.hoverWand.calculate();
	GrabbedSpell.grabbed = null;
	GrabbedSpell.originalHover = null;
});



const SpellType = {
	ACTION_TYPE_PROJECTILE:        SpellTypeApply(0, "projectile"),
	ACTION_TYPE_STATIC_PROJECTILE: SpellTypeApply(1, "static_projectile"),
	ACTION_TYPE_MODIFIER:          SpellTypeApply(2, "modifier"),
	ACTION_TYPE_DRAW_MANY:         SpellTypeApply(3, "draw_many"),
	ACTION_TYPE_MATERIAl:          SpellTypeApply(4, "material"),
	ACTION_TYPE_OTHER:             SpellTypeApply(5, "other"),
	ACTION_TYPE_UTILITY:           SpellTypeApply(6, "utility"),
	ACTION_TYPE_PASSIVE:           SpellTypeApply(7, "passive"),

	fromValue(number) {
		for (const key in SpellType)
			if (SpellType[key].index == number)
				return SpellType[key];
		return null;
	},
}

function SpellTypeApply(index, file) {
	return {index, file}
}



class SpellElement extends HTMLElement {

	static styles = `
	.wrapper {
		margin: 3px;
		width: 60px;
		height: 60px;
		display: inline-grid;
		position: relative;
		grid-template-columns: repeat(12, 1fr);
	}
	img {
		image-rendering: pixelated;
	}
	.spell-slot {
		width: 60px;
		grid-column: 1;
		grid-row: 1;
		user-select: none;
		user-drag: none;
		-webkit-user-drag: none;
	}
	.spell-box {
		width: 75px;
		opacity: 80%;
		grid-row: 1;
		grid-column: 1;
		z-index: 1;
		margin: -7.6px;
		user-select: none;
		user-drag: none;
		-webkit-user-drag: none;
	}
	.spell {
		user-select: none;
		user-drag: none;
		-webkit-user-drag: none;
		width: 50px;
		grid-column: 1;
		grid-row: 1;
		padding-left: 5px;
		padding-top: 5px;
		z-index: 2;
	}
	`

	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this._spell = "";

		
		const wrapper = document.createElement('div');
		wrapper.classList.add("wrapper");

		this.spellSlot = wrapper.appendChild(document.createElement("img"));
		this.spellBox = wrapper.appendChild(document.createElement("img"));
		this.spellElement = wrapper.appendChild(document.createElement("img"));
		this.loading = "lazy";

		this.spellSlot.classList.add("spell-slot");
		this.spellSlot.src = "imgs/inventory/inventory_box.png";
		this.spellElement.classList.add("spell");
		this.spellBox.classList.add("spell-box");

		this.spell = randomValue(spells, 0.3);


		const style = document.createElement('style');
		style.textContent = SpellElement.styles;

		this.shadowRoot.append(style, wrapper);
	}

	get spell() {
		return spells[this._spell];
	}

	set spell(value) {
		if (value == null) {
			this._spell = null;
			this.spellElement.style.visibility = "hidden";
			this.spellBox.style.visibility = "hidden";
			return;
		}

		if (typeof(value) == "object")
			value = value.id;
		this._spell = value;
		const spell = spells[value];
		this.spellElement.src = spell.sprite;
		this.spellBox.src = `imgs/inventory/item_bg_${SpellType.fromValue(spell.type).file}.png`;
		
		this.spellElement.style.visibility = "visible";
		this.spellBox.style.visibility = "visible";
	}

}

customElements.define('spell-element', SpellElement);

