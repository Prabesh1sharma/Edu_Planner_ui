import Navbar from '../../components/navbar';

export default function Home() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Add your main content here */}
                </div>
            </main>
        </div>
    );
}
