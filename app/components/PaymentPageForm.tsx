"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// ----- Model Interfaces -----
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  reference: string;
  status: string;
  channel?: string | null | undefined;
  paidAt?: string | Date | null | undefined;
  createdAt: string | Date | null | undefined;
  updatedAt: string | Date | null | undefined;
  remitaUserId?: string | null | undefined;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  subscriptionCode: string;
  status: string;
  nextPaymentDate?: Date | string | null | undefined;
  startedAt: string | Date | null | undefined;
  endedAt?: string | Date | null | undefined;
  createdAt: string | Date | null | undefined;
  updatedAt: string | Date | null | undefined;
}

export interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  class: string;
  term: string;
  // dateOfBirth can be a Date object or ISO string
  dateOfBirth: string | Date | null | undefined;
  regNumber?: string | null;
  createdAt: string | Date | null | undefined;
  updatedAt: string | Date | null | undefined;
  payments: Payment[] | undefined | null;
  subscriptions: Subscription[] | undefined | null;
}

// ----- PaymentForm Component -----
export default function PaymentForm({ user }: { user: User }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    class: user.class,
    term: user.term,
    dateOfBirth: user.dateOfBirth,
    consent: false,
  });
  const [error, setError] = useState<string>('');

  const feeAmounts: Record<string, number> = {
    school_fees: 25500,
    hostel_fees: 30000,
    lesson_fees: 10000,
    graduation_fees: 26500,
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : prev[name],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const totalAmount = Object.entries(feeAmounts).reduce((sum, [key, val]) => {
      return formData[key] ? sum + val : sum;
    }, 0);

    if (totalAmount === 0) {
      setError('Please select at least one payment option.');
      return;
    }

    const emailParam = encodeURIComponent(formData.email);
    router.push(`/options/paystack/checkout?email=${emailParam}&amount=${totalAmount}`);
  };

  return (
    <div className="z-10 relative self-center min-h-130 h-[80vh] w-full md:w-200 mx-5 px-5 py-5 mt-10 -mx-auto rounded-xl border border-gray-200 items-center justify-center overflow-y-scroll text-center backdrop-blur-3xl">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto py-6 bg-blue/50 rounded-2xl space-y-6">
        <h2 className="text-2xl font-semibold text-gray-300">Student Verification</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['firstName','middleName','lastName','class','term','email','phone','dateOfBirth'].map(field => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              readOnly
              disabled
              className="input cursor-not-allowed"
            />
          ))}
        </div>

        <div>
          <h3 className="font-bold text-white py-3 text-xl">Payment Options</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(feeAmounts).map(([id, amount]) => (
              <label key={id} htmlFor={id} className="flex cursor-pointer hover:bg-blue-900/30 gap-2 relative w-full items-center justify-start border rounded-full px-5 border-gray-300">
                <input
                  type="checkbox"
                  name={id}
                  id={id}
                  checked={!!formData[id]}
                  onChange={handleChange}
                  className="peer"
                />
                <span className="ml-2 text-blue-200 font-medium">
                  {id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="absolute right-8 text-gray-400 pl-10 border-l-2 font-bold">
                  ₦{amount.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        </div>

        <label htmlFor="consent" className="flex items-center justify-center w-full">
          <input
            type="checkbox"
            name="consent"
            id="consent"
            checked={formData.consent}
            onChange={handleChange}
            required
            className="mr-2"
          />
          <span className="text-sm text-gray-400">I confirm the above information is accurate.</span>
        </label>

        <button type="submit" className="py-1 px-8 bg-blue-700 text-blue-300 font-bold rounded-xl hover:bg-blue-800 transition">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}
