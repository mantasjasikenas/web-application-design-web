import axios from '$lib/axios';
import type { ApiResponse, Section } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const response = await axios.get<ApiResponse<Section[]>>(`/projects/${params.id}/sections`);

	const sections = response.data.data || [];
	console.log(sections);

	return {
		params: {
			...params
		},
		sections
	};
};
