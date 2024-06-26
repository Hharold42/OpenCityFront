const parseISO = (dateString) => {
  // Create a new Date object from the dateString
  const date = new Date(dateString);

  // Extract the components of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  // const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format the date and time as desired
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDate;
};

export default parseISO;
