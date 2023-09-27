const getCurrentTime = () => {
	const date = new Date();
	let year = String(date.getFullYear());
	const month = String(date.getMonth() + 1);
	let hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12;

	const strTime = `${month}/${year} @${hours}:${minutes} ${ampm}`;
	return strTime;
};
export default getCurrentTime;