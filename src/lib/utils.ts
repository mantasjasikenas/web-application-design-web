import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { siteConfig } from '$lib/config/site';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getPageTitle(pathname: string): string {
	return [siteConfig.name, ...pathname.split('/').slice(1)]
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' – ');
}
