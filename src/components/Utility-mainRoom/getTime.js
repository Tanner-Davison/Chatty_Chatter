const getCurrentTime = () => {
  const date = new Date();
  let year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  let hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? String(hours).padStart(2, "0") : "12"; // Convert to string and pad

  const strTime = `${month}/${year - 2000} ${hours}:${minutes} ${ampm}`;
  return strTime;
};

const getCurrentTimeJSX = () => {
  const date = new Date();
  let year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  let hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? String(hours).padStart(2, "0") : "12"; // Convert to string and pad

  return (
    <>
      {month}/{year - 2000} <br /> {hours}:{minutes} {ampm}
    </>
  );
};

export { getCurrentTimeJSX, getCurrentTime };
export default getCurrentTime;
