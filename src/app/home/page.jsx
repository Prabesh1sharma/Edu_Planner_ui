import Navbar from '../../components/navbar';
import Metrics from '../../components/metrics';
import { User, LogOut } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className="ml-16 p-6">
                {/* Top Bar with Profile */}
                <div className="max-w-7xl mx-auto mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        
                        {/* Profile Section */}
                        <div className="relative group">
                            <div className="flex items-center space-x-3 bg-white rounded-lg shadow-md px-4 py-2 cursor-pointer hover:shadow-lg transition-shadow duration-200">
                                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                                <span className="text-gray-700 font-medium">Prabesh</span>
                            </div>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-2">
                                    <a 
                                        href="/profile" 
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200"
                                    >
                                        <User size={16} />
                                        <span>Profile</span>
                                    </a>
                                    <a 
                                        href="/logout" 
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Metrics */}
                <div className="max-w-7xl mx-auto">
                    <Metrics />
                </div>
            </main>
        </div>
    );
}
