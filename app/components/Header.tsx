import React from 'react'
import logo from '../img.png'
import Image from 'next/image'
import pay from '../img_1.png'
import {FaSchool} from "react-icons/fa";


type Props = {}


export default function Header({}: Props){
	return (
		<header className={`z-1000 bg-fixed absolute top-0 w-full justify-between flex items-center px-3 lg:px-10 py-2 text-gray-400`}>
			<div className="flex items-center gap-2 lg:gap-10">
				<Image src={logo} alt="Logo" className={`rounded-full w-12 lg:w-16 aspect-square`} />
				<h2 className={`text-sm lg:text-xl capitalize font-bold text-blue-400`}>saint joseph college</h2>
			</div>
			<div>
				<h2 className={`hidden md:block text-sm lg:text-lg text-gray-200 font-bold uppercase px-5 py-1 lg:py-2`}>payment gateway</h2>
			</div>
			<div className="flex items-center gap-2 lg:gap-5">
				<FaSchool className={`w-8 h-8 lg:w-20 text-blue-900 aspect-square rounded-xl`} />
				<h2 className={`capitalize font-medium hidden md:block text-sm lg:text-lg text-white`}>make payments </h2>
			</div>
		</header>
	)
}