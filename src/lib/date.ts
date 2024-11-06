import { format, formatDistanceToNow } from 'date-fns';

const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss OOOO';

export function formatDate(date: string, formatStr?: string) {
	return format(date + 'Z', formatStr || DATE_FORMAT);
}

export function formatDateDistance(date: string) {
	return formatDistanceToNow(date + 'Z');
}
