export const formatDate = (inputDate: string, timeZoneString?: string) => {
  const originalDate = new Date(inputDate);

  if (isNaN(originalDate.getTime())) {
    console.error('Invalid date:', inputDate);
    return '';
  }

  const timeZone: string = timeZoneString || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone,
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(originalDate);

  const day = originalDate.getDate().toString().padStart(2, '0');
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
  const year = originalDate.getFullYear();

  return `${day} / ${month} / ${year}  ${formattedTime}`;
};
export const hasTimePassed = (
  specifiedDateString: string = '18 / 01 / 2024  15:04',
  seconds: number = 20
): boolean => {
  const dateParts = specifiedDateString.split(/[\/\s:]+/);
  const specifiedDate = new Date(
    parseInt(dateParts[2]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[0]),
    parseInt(dateParts[3]),
    parseInt(dateParts[4])
  );

  const currentDate = new Date();

  const timeDifferenceInSeconds = (currentDate.getTime() - specifiedDate.getTime()) / 1000;

  return timeDifferenceInSeconds >= seconds;
};
