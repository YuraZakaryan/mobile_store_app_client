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
  // Преобразовываем строку с датой в объект Date
  const dateParts = specifiedDateString.split(/[\/\s:]+/); // Разделяем строку на части
  const specifiedDate = new Date(
    parseInt(dateParts[2]), // год
    parseInt(dateParts[1]) - 1, // месяц (начинается с 0)
    parseInt(dateParts[0]), // день
    parseInt(dateParts[3]), // час
    parseInt(dateParts[4]) // минута
  );

  // Получаем текущую дату и время
  const currentDate = new Date();

  // Вычисляем разницу в секундах между текущей датой и указанной датой
  const timeDifferenceInSeconds = (currentDate.getTime() - specifiedDate.getTime()) / 1000;

  // Проверяем, прошло ли указанное количество секунд
  return timeDifferenceInSeconds >= seconds;
};
