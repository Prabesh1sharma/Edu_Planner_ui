'use client'
import Link from 'next/link';
import { Home, List, Plus, Settings } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import ListPlan from './ListPlan'; 

export default function Navbar() {
    const [showListPlan, setShowListPlan] = useState(false);

    return (
        <>
        <nav className="fixed bottom-0 left-0 w-full h-16 md:top-0 md:h-full md:w-16 bg-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-lg z-50 flex md:flex-col justify-around md:justify-start px-2 md:px-0 md:py-3 transition-all duration-300">
            {/* Logo Image */}
            <div className="hidden md:block mb-9 text-center -mx-2">
                <Image
                    src="/EDULogo.png"
                    alt="EDU Planner Logo"
                    width={80}
                    height={80}
                    className="mx-auto"
                />
            </div>
            {/* Navigation Items */}
            <ul className="flex flex-row md:flex-col items-center justify-around w-full md:space-y-3 space-y-0 h-full md:h-auto">
                <li className="group relative">
                    <Link 
                        href="/home" 
                        className="flex items-center justify-center text-gray-600 hover:text-indigo-600 p-2 md:p-3 rounded-lg transition-colors duration-200"
                    >
                        <Home size={28} />
                    </Link>
                    <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Home
                    </div>
                </li>
                
                <li className="group relative">
                    <button
                        type="button"
                        onClick={() => setShowListPlan((prev) => !prev)}
                        className="flex items-center justify-center text-gray-600 hover:text-indigo-600 p-2 md:p-3 rounded-lg transition-colors duration-200 focus:outline-none"
                    >
                        <List size={28} />
                    </button>
                    <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        List Plans
                    </div>
                </li>
                
                <li className="group relative">
                    <Link 
                        href="/create-plan" 
                        className="flex items-center justify-center text-gray-600 hover:text-indigo-600 p-2 md:p-3 rounded-lg transition-colors duration-200"
                    >
                        <Plus size={28} className="bg-indigo-600 text-white rounded-full p-1" />
                    </Link>
                    <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Create Plan
                    </div>
                </li>

                <li className="group relative">
                    <Link 
                        href="/settings" 
                        className="flex items-center justify-center text-gray-600 hover:text-indigo-600 p-2 md:p-3 rounded-lg transition-colors duration-200"
                    >
                        <Settings size={28} />
                    </Link>
                    <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Settings
                    </div>
                </li>
            </ul>
        </nav>
        {/* ListPlan Drawer */}
        <ListPlan open={showListPlan} onClose={() => setShowListPlan(false)} />
        </>
    );
}
