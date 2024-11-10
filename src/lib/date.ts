import { format, formatRelative, formatDate as zodFormatDate } from 'date-fns';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss OOOO';

export function formatDate(date: string, formatStr?: string) {
	return format(date + 'Z', formatStr || DATE_FORMAT);
}

export function formatDateDistance(date: string) {
	return formatRelative(date, new Date());
}

export function generateCurrentDateTime() {
	return zodFormatDate(new Date(), `yyyy-MM-dd'T'HH:mm:ss`);
}
