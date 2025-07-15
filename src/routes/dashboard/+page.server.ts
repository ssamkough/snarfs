import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:Link');
	const { data, error } = await supabase.from('Link').select();
	// const user = await supabase.auth.getUser();
	// console.log('user', user);
	// const { data, error } = await supabase.rpc('select_link_for_user', {
	// 	user_id: user.data.user?.id
	// });
	console.log('data', data);
	console.log('error', error);
	return { links: data ?? [] };
};
