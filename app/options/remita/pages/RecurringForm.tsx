// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import axios from 'axios';

// const schema = z.object({
// 	amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
// 	name: z.string().min(2),
// 	email: z.string().email(),
// 	phone: z.string().min(7).max(15),
// 	bankCode: z.string().length(3),
// 	account: z.string().min(5),
// 	startDate: z.string(),
// 	endDate: z.string(),
// });

// type FormData = z.infer<typeof schema>;

// export default function RecurringForm() {
// 	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
// 		resolver: zodResolver(schema),
// 	});
	
// 	const onSubmit = async data => {
// 		try {
// 			const res = await axios.post('/api/payments/recurring', {
// 				serviceTypeId: '4430731',
// 				orderId: `REC-${Date.now()}`,
// 				...data,
// 			});
// 			alert('Mandate setup response: ' + JSON.stringify(res.data));
// 		} catch (err: any) {
// 			alert(err.response?.data?.error || 'Mandate setup failed');
// 		}
// 	};
	
// 	return (
// 		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// 			{/* Similar fields as OneTimeForm, plus bankCode, account, dates */}
// 			{/* ... */}
// 			<button type="submit" disabled={isSubmitting} className="w-full py-2 bg-green-600 text-white rounded-lg">
// 				{isSubmitting ? 'Setting up…' : 'Setup Mandate'}
// 			</button>
// 		</form>
// 	);
// }
