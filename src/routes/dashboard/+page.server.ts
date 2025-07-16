import type { PageServerLoad } from './$types';

// TODO: auto generate from supabase
type Link = {
	id: number;
	created_at: string;
	edited_at: string;
	url: string;
	status: 'save' | 'archive';
	is_favorited: boolean;
};

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:Link');

	let links: Link[] = [];
	try {
		const { data, error } = await supabase
			.from('Link')
			.select()
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(error as any);
		}

		links = data;
	} catch (error) {
		console.error(error);
	}

	return { links };
};
