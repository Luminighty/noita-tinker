const wandSpritePicker = {
	wand: null,
	opened: false,
	modal: document.querySelector("#wand-sprite-modal"),
	wandSpriteHolder: document.querySelector("#wand-sprite-modal .wands"),
	filterInput: document.querySelector("#wand-sprite-modal .wand-filter"),

	open: (wand) => {
		wandSpritePicker.wand = wand;
		wandSpritePicker.modal.style.display = "block";
	},
	close: () => wandSpritePicker.modal.style.display = "none",
};

wandSpritePicker.modal.querySelector(".close").addEventListener("click", wandSpritePicker.close);

window.onclick = function(event) {
	if (event.target == wandSpritePicker.modal) {
		wandSpritePicker.modal.style.display = "none";
	}
};

wandSpritePicker.filterInput.addEventListener("change", (event) => {
	const group = wandSpritePicker.filterInput.value;
	for(const child of wandSpritePicker.wandSpriteHolder.children) {
		child.style.display = (group == "Any" || child.getAttribute("data-group") == group) ? "initial" : "none";
	}
});


async function loadGroups() {
	for (const groupKey in wandSprites) {
		const group = wandSprites[groupKey];
		const option = wandSpritePicker.filterInput.appendChild(document.createElement("option"));
		option.value = groupKey;
		option.innerText = groupKey;
		for (const id of group) {
			const img = wandSpritePicker.wandSpriteHolder.appendChild(document.createElement("img"));
			img.loading = "lazy";
			img.src = `imgs/wands/wand_${id.toString().padStart(4, '0')}.png`;
			img.classList.add("wand-sprite");
			img.setAttribute("data-group", groupKey);
			img.addEventListener("load", () => {
				img.height = img.naturalHeight * 5;
			});
			img.addEventListener("click", () => {
				if (wandSpritePicker.wand)
					wandSpritePicker.wand.icon = id;
				wandSpritePicker.close();
			});
		}
	}
}

window.addEventListener("load", loadGroups);