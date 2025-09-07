// eslint-disable-next-line import/no-unused-modules
export const parseTimedelta = (timedelta: string): number => {
  const match = timedelta.match(/^(\d+):(\d+):(\d+)$/);
  if (match) {
    const [, hours, minutes, seconds] = match.map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  const daysMatch = timedelta.match(/^(\d+) days?, (\d+):(\d+):(\d+)$/);
  if (daysMatch) {
    const [, days, hours, minutes, seconds] = daysMatch.map(Number);
    return days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
};

// eslint-disable-next-line import/no-unused-modules
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}`;
    }
    return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}`;
  }

  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`;
  }

  return `${minutes} ${minutes === 1 ? 'минута' : minutes < 5 ? 'минуты' : 'минут'}`;
};
