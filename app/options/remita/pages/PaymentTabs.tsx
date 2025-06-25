// import { useState } from 'react';
// import OneTimeForm from './OneTimeForm';
// import RecurringForm from './RecurringForm';
// import BillerForm from './BillerForm';

// const tabs = [
// 	{ key: 'one', label: 'One‑Time' },
// 	{ key: 'recurring', label: 'Recurring' },
// 	{ key: 'biller', label: 'Biller' },
// ];

// export default function PaymentTabs() {
// 	const [active, setActive] = useState(tabs[0].key);
// 	return (
// 		<div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
// 			<nav className="flex space-x-4 mb-6">
// 				{tabs.map(t => (
// 					<button
// 						key={t.key}
// 						onClick={() => setActive(t.key)}
// 						className={`py-2 px-4 rounded-lg transition ${
// 							active === t.key
// 								? 'bg-blue-600 text-white'
// 								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// 						}`}
// 					>
// 						{t.label}
// 					</button>
// 				))}
// 			</nav>
// 			{active === 'one' && <OneTimeForm />}
// 			{active === 'recurring' && <RecurringForm />}
// 			{active === 'biller' && <BillerForm />}
// 		</div>
// 	);
// }
