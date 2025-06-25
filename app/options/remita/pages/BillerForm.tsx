// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import axios from 'axios';

// const schema = z.object({
// 	amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
// 	billerName: z.string().min(2),
// 	billerAccount: z.string().min(3),
// 	name: z.string().min(2),
// 	email: z.string().email(),
// 	phone: z.string().min(7).max(15),
// });

// type FormData = z.infer<typeof schema>;

// export default function BillerForm() {
// 	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
// 		resolver: zodResolver(schema),
// 	});
	
// 	const onSubmit = async data => {
// 		try {
// 			const res = await axios.post('/api/payments/biller', {
// 				serviceTypeId: '4430731',
// 				orderId: `BILL-${Date.now()}`,
// 				...data,
// 			});
// 			alert('Biller payment response: ' + JSON.stringify(res.data));
// 		} catch (err: any) {
// 			alert(err.response?.data?.error || 'Biller payment failed');
// 		}
// 	};
	
// 	return (
// 		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// 			{/* Form fields for billerName, billerAccount, amount, etc. */}
// 			{/* ... */}
// 			<button type="submit" disabled={isSubmitting} className="w-full py-2 bg-purple-600 text-white rounded-lg">
// 				{isSubmitting ? 'Processing…' : 'Pay Biller'}
// 			</button>
// 		</form>
// 	);
// }
