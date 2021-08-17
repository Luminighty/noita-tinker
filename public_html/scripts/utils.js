function randomValue(object, nullchance = 0) {
	if (nullchance > Math.random())
		return null;
	const keys = Object.keys(object);
	return object[keys[parseInt(Math.random() * keys.length)]];

}