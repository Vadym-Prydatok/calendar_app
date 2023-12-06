
const BASE_URL = 'https://date.nager.at/api/v3/PublicHolidays';

export const getHolidays = async (year: number) => {
  const response = await fetch(`${BASE_URL}/${year}/ua`);
  const data = await response.json();
  return data;
}