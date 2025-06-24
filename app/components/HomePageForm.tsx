'use client'

import React from 'react'
import Image from "next/image";
import pay from "../img_1.png";
import { FaShieldAlt, FaHandshake} from 'react-icons/fa';
import Link from 'next/link';

type Props = {}

export default function HomePageForm({}: Props) {
	return (
		<section className="z-5 self-center w-full h-100 mx-5 px-5 py-10 -mx-auto rounded-xl border-1 border-gray-200 items-center justify-center text-center backdrop-blur-3xl">
			<form action="" className={`relative flex flex-col justify-center gap-10 items-center w-full h-full`}>
				<h2 className={`absolute top-5 font-bold uppercase text-sm`}>your payments are end to end secured</h2>
				<div className={`flex gap-5 items-center justify-center`}>
					<FaHandshake className={`w-10 h-10 lg:w-20 aspect-square rounded-xl text-blue-900 bg-`} />
					<FaShieldAlt className={`w-10 h-10 lg:w-20 aspect-square rounded-xl text-blue-900 bg-`} />
				</div>
				<label htmlFor="index" className={`text-sm font-medium tracking-widest text-white capitalize`}>input your index number</label>
				<input type="text" name="index" placeholder={`XXXXXXXXXXXXXX`} autoFocus id="index" className={`w-full h-8 outline-3 text-center outline-gray-300/30 px-5 rounded-full text-gray-600`}/>
				<Link href={`/payment-form`} className={`absolute bottom-0 w-[50%]`}><button type={`submit`} className={`w-full bg-blue-600 p-1 rounded-full text-lg font-bold text-gray-200 drop-shadow-sm drop-shadow-blue-50`}>Submit</button></Link>
				
			</form>
		</section>
	)
}