/**
 * formatDate.js
 * ─────────────
 * Date & time formatting helpers used across the dashboard.
 */

const WEEKDAY_SHORT_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  timeZone: 'UTC',
});

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const parseDateParts = (value) => {
  if (!value && value !== 0) return null;

  if (typeof value === 'number') {
    const date = new Date(value * 1000);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      useLocalDate: true,
    };
  }

  const [datePart = '', timePart = '00:00'] = String(value).split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour = 0, minute = 0] = timePart.split(':').map(Number);

  if ([year, month, day, hour, minute].some(Number.isNaN)) {
    return null;
  }

  return {
    year,
    month,
    day,
    hour,
    minute,
    useLocalDate: false,
  };
};

const toUtcDate = ({ year, month, day }) => new Date(Date.UTC(year, month - 1, day));

const formatClock = (hour, minute, includeMinutes) => {
  const normalizedHour = Number.isFinite(hour) ? hour : 0;
  const normalizedMinute = Number.isFinite(minute) ? minute : 0;
  const meridiem = normalizedHour >= 12 ? 'PM' : 'AM';
  const hour12 = normalizedHour % 12 || 12;

  if (!includeMinutes) {
    return `${hour12} ${meridiem}`;
  }

  return `${hour12}:${String(normalizedMinute).padStart(2, '0')} ${meridiem}`;
};

/**
 * Format a Unix timestamp into a human-readable time string (e.g. "3:00 PM").
 * Accepts a Unix timestamp in seconds or an Open-Meteo local time string.
 * @returns {string}
 */
export const formatTime = (value) => {
  const parts = parseDateParts(value);
  if (!parts) return '–';

  if (parts.useLocalDate) {
    const date = new Date(value * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return formatClock(parts.hour, parts.minute, true);
};

/**
 * Return the short weekday name for a Unix timestamp or Open-Meteo local date string.
 */
export const formatDay = (value) => {
  const parts = parseDateParts(value);
  if (!parts) return '–';

  if (parts.useLocalDate) {
    const date = new Date(value * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  return WEEKDAY_SHORT_FORMATTER.format(toUtcDate(parts));
};

/**
 * Return a long-form date string for a Unix timestamp or Open-Meteo local date string.
 */
export const formatFullDate = (value) => {
  const parts = parseDateParts(value);
  if (!parts) return '–';

  if (parts.useLocalDate) {
    const date = new Date(value * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return FULL_DATE_FORMATTER.format(toUtcDate(parts));
};

/**
 * Format hour only for a Unix timestamp or Open-Meteo local time string (e.g. "3 PM").
 */
export const formatHour = (value) => {
  const parts = parseDateParts(value);
  if (!parts) return '–';

  if (parts.useLocalDate) {
    const date = new Date(value * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
  }

  return formatClock(parts.hour, parts.minute, false);
};
