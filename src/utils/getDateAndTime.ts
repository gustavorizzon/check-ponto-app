export const getDateAndTime = (date: Date): { date: string; time: string } => {
  const fullYear = date.getFullYear().toString().padStart(4, '0');
  const fullMonth = String(date.getMonth() + 1).padStart(2, '0');
  const fullDay = String(date.getDate()).padStart(2, '0');
  const strDate = `${fullYear}-${fullMonth}-${fullDay}`;

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  return { date: strDate, time };
};
