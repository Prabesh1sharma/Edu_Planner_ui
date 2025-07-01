import Link from 'next/link';
import { Home, List, Plus } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="fixed left-0 top-0 h-full w-16 bg-gray-100 shadow-lg z-50">
            <div className="p-3">
                {/* Logo Image */}
                <div className="mb-9 text-center -mx-2">
                    <Image
                        src="/EDULogo.png"
                        alt="EDU Planner Logo"
                        width={80}
                        height={80}
                        className="mx-auto"
                    />
                </div>
                        
                {/* Navigation Items */}
                <ul className="space-y-3">
                    <li className="group relative">
                        <Link 
                            href="/home" 
                            className="flex items-center justify-center text-gray-600 hover:text-indigo-600 p-2 rounded-lg transition-colors duration-200"
                        >
                            <Home size={28} />
                        </Link>
                        {/* Tooltip on hover */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Home
                        </div>
                    </li>
                    
                    <li className="group relative">
                        <Link 
                            href="/plans" 
                            className="flex items-center justify-center text-gray-600 hover:text-indigo-600 p-2 rounded-lg transition-colors duration-200"
                        >
                            <List size={28} />
                        </Link>
                        {/* Tooltip on hover */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            List Plans
                        </div>
                    </li>
                    
                    <li className="group relative">
                        <Link 
                            href="/create-plan" 
                            className="flex items-center justify-center text-gray-600 hover:text-indigo-600 p-2 rounded-lg transition-colors duration-200"
                        >
                            <Plus size={28} />
                        </Link>
                        {/* Tooltip on hover */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Create Plan
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
