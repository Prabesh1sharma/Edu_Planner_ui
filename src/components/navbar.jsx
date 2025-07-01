import Link from 'next/link';
import { Home, List, Plus } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed left-0 top-0 h-full w-16 bg-gray-100 shadow-lg hover:w-64 transition-all duration-300 group">
            <div className="p-4">
                {/* Project Title - only visible on hover */}
                <h1 className="text-xl font-bold text-gray-800 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    EDUPlanner
                </h1>
                
                {/* Navigation Items */}
                <ul className="space-y-4">
                    <li>
                        <Link 
                            href="/home" 
                            className="flex items-center space-x-3 text-gray-600 hover:text-indigo-600 p-3 rounded-lg transition-colors duration-200"
                        >
                            <Home size={20} className="min-w-[20px]" />
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                Home
                            </span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link 
                            href="/plans" 
                            className="flex items-center space-x-3 text-gray-600 hover:text-indigo-600 p-3 rounded-lg transition-colors duration-200"
                        >
                            <List size={20} className="min-w-[20px]" />
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                List Plans
                            </span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link 
                            href="/create-plan" 
                            className="flex items-center space-x-3 text-gray-600 hover:text-indigo-600 p-3 rounded-lg transition-colors duration-200"
                        >
                            <Plus size={20} className="min-w-[20px]" />
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                Create Plan
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
