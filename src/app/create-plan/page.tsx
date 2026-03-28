'use client'
import Navbar from '../../components/navbar';
import { useState } from 'react';
import EduPlanForm, { GeneratedPlan } from '../../components/EduPlanForm';
import GeneratedPlanPreview from '../../components/GeneratedPlanPreview';

export default function CreatePlanPage() {
    const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-10 pt-10 px-4 md:ml-16">
            <Navbar />
            <EduPlanForm onGenerate={setGeneratedPlan} />
            {generatedPlan && <GeneratedPlanPreview plan={generatedPlan} />}
        </div>
    );
}
