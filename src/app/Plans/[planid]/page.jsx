'use client';
import TopicDetails from '../../../components/TopicDetails';
import Navbar from '../../../components/navbar';
import TopicMetrics from '../../../components/topicMetrics';
import PlanList from '../../../components/PlanList';
import { useState } from 'react';

const topic = {
    name: "Full Stack Developer Journey",
    description: "A comprehensive roadmap to become a full stack developer.",
    createdDate: "2024-06-10",
    estimatedEndDate: "2025-06-10",
    progress: 55
};

const plans = [
    {
        id: 1,
        title: "Frontend Basics",
        completed: true,
        estimatedEndDate: "2024-08-01",
        subPlansCount: 3,
        subPlans: ["HTML & CSS", "JavaScript Essentials", "Responsive Design"]
    },
    {
        id: 2,
        title: "Backend Fundamentals",
        completed: false,
        estimatedEndDate: "2024-10-01",
        subPlansCount: 2,
        subPlans: ["Node.js & Express", "Database Basics"]
    },
    {
        id: 3,
        title: "DevOps & Deployment",
        completed: false,
        estimatedEndDate: "2025-01-15",
        subPlansCount: 2,
        subPlans: ["CI/CD Pipelines", "Cloud Hosting"]
    }
];

export default function PlanPage() {
    const [planList, setPlanList] = useState(plans);

    const handleAddPlan = () => {
        alert("Add Plan clicked!");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navbar />
            <main className="flex-1 ml-16 py-10 px-6">
                <TopicDetails topic={topic} />
                <TopicMetrics />
                <PlanList plans={planList} onAddPlan={handleAddPlan} />
            </main>
        </div>
    );
}
