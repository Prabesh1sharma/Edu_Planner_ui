'use client'
import SubPlanDetail from '../../../../../components/SubPlanDetail';
import NotesSection from '../../../../../components/NotesSection';
import RecommendationsSection from '../../../../../components/RecommendationsSection';
import Navbar from '../../../../../components/navbar';

export default function SubPlanDetailPage() {
    const subplan = {
        title: "HTML & CSS",
        description: "Master the basics of HTML structure and CSS styling, including layouts, colors, and typography."
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <Navbar/>
            <div className="max-w-5xl mx-auto space-y-8">
                <SubPlanDetail subplan={subplan} />
                <NotesSection />
                <RecommendationsSection />
            </div>
        </div>
    );
}
