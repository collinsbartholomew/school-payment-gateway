import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const schema = z.object({
	amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
	name: z.string().min(2),
	email: z.string().email(),
	phone: z.string().min(7).max(15),
});

type FormData = z.infer<typeof schema>;

export default function OneTimeForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm<FormData>({ resolver: zodResolver(schema) });
	
	const onSubmit = async (data: FormData) => {
		try {
			const res = await axios.post('/api/payments/one-time', {
				serviceTypeId: '4430731',
				orderId: `ONE-${Date.now()}`,
				amount: data.amount,
				payerName: data.name,
				payerEmail: data.email,
				payerPhone: data.phone,
			});
			// Redirect user to Remita payment page
			window.location.href = res.data.paymentUrl;
		} catch (err: any) {
			alert(err.response?.data?.error || 'Payment initiation failed');
		}
	};
	
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<label className="block text-sm font-medium">Amount (NGN)</label>
				<input
					{...register('amount')}
					className="mt-1 w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
				/>
				{errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
			</div>
			
			<div>
				<label className="block text-sm font-medium">Full Name</label>
				<input
					{...register('name')}
					className="mt-1 w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
				/>
				{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
			</div>
			
			<div>
				<label className="block text-sm font-medium">Email</label>
				<input
					{...register('email')}
					className="mt-1 w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
				/>
				{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
			</div>
			
			<div>
				<label className="block text-sm font-medium">Phone</label>
				<input
					{...register('phone')}
					className="mt-1 w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
				/>
				{errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
			</div>
			
			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
			>
				{isSubmitting ? 'Processing…' : 'Pay Now'}
			</button>
		</form>
	);
}