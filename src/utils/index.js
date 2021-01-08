module.exports = {
	capitalise: str => str.charAt(0).toUpperCase() + str.slice(1),
	wait: (time) => new Promise(res => setTimeout(res, time)),
};