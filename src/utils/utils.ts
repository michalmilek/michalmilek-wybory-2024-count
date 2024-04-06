export const clearVotesFromLocalStorage = () => {
	const keys = Object.keys(localStorage);

	keys.forEach(key => {
		if (key.startsWith("votes-")) {
			localStorage.removeItem(key);
		}
	});
};
