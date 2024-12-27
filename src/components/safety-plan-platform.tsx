// src/components/safety-plan-platform.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, AlertCircle, Heart, Home, Phone, Check, Download, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateSafetyPlanPDF } from '@/lib/generate-pdf';

interface StepInput {
  id: string;
  value: string;
}

interface ContactInput {
  id: string;
  name: string;
  contact: string;
}

interface ProfessionalInput {
  id: string;
  name: string;
  phone: string;
}

interface SafetyPlanData {
  warningSteps: StepInput[];
  copingStrategies: StepInput[];
  socialSettings: StepInput[];
  supportContacts: ContactInput[];
  professionals: ProfessionalInput[];
  safetyMeasures: StepInput[];
}

export function SafetyPlanPlatform() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [planData, setPlanData] = useState<SafetyPlanData>({
    warningSteps: [
      { id: '1', value: '' },
      { id: '2', value: '' },
      { id: '3', value: '' }
    ],
    copingStrategies: [
      { id: '1', value: '' },
      { id: '2', value: '' },
      { id: '3', value: '' }
    ],
    socialSettings: [
      { id: '1', value: '' },
      { id: '2', value: '' }
    ],
    supportContacts: [
      { id: '1', name: '', contact: '' },
      { id: '2', name: '', contact: '' }
    ],
    professionals: [
      { id: '1', name: '', phone: '' }
    ],
    safetyMeasures: [
      { id: '1', value: '' },
      { id: '2', value: '' }
    ]
  });

  const steps = [
    {
      title: "Warning Signs",
      description: "What thoughts, mood, or behavior might indicate a crisis is developing?",
      icon: AlertCircle,
      field: 'warningSteps'
    },
    {
      title: "Coping Strategies",
      description: "What can you do by yourself to take your mind off your problems?",
      icon: Heart,
      field: 'copingStrategies'
    },
    {
      title: "People & Places",
      description: "List people and places that can provide distraction",
      icon: Home,
      field: 'socialSettings'
    },
    {
      title: "Support Network",
      description: "Who can you reach out to for help during a crisis?",
      icon: Phone,
      field: 'supportContacts'
    },
    {
      title: "Professional Help",
      description: "List medical professionals and crisis hotlines",
      icon: Shield,
      field: 'professionals'
    },
    {
      title: "Safety Measures",
      description: "Steps to make your environment safer",
      icon: Check,
      field: 'safetyMeasures'
    }
  ];

  const handleInputChange = (section: keyof SafetyPlanData, index: number, value: string, field?: string) => {
    setPlanData(prev => {
      const newData = { ...prev };
      if (field) {
        if (section === 'supportContacts') {
          (newData[section] as ContactInput[])[index][field as keyof ContactInput] = value;
        } else if (section === 'professionals') {
          (newData[section] as ProfessionalInput[])[index][field as keyof ProfessionalInput] = value;
        }
      } else {
        (newData[section] as StepInput[])[index].value = value;
      }
      return newData;
    });
  };

  const handleFinish = () => {
    // Save to localStorage for persistence
    const formattedPlan = {
      timestamp: new Date().toISOString(),
      data: planData
    };
    localStorage.setItem('safetyPlan', JSON.stringify(formattedPlan));

    // Generate and save PDF
    const doc = generateSafetyPlanPDF(planData);
    const fileName = `safety-plan-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    // Show success message
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const currentStepData = steps[currentStep - 1];
  const StepIcon = currentStepData.icon;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Shield className="h-8 w-8 text-blue-700" />
          <h1 className="text-2xl font-bold">BAUER LABS Crisis Response Planner</h1>
        </div>
        <a
          href="https://chatgpt.com/g/g-676e199d612c8191b4b26379c4d708a2-bauer-labs-safety-planner"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Try AI Planner
        </a>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div 
          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {showSuccess && (
        <Alert className="mb-4 bg-green-100 border-green-500">
          <AlertDescription className="text-green-800">
            Safety Plan saved and downloaded successfully!
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <StepIcon className="h-8 w-8 text-blue-600" />
          <div>
            <CardTitle>Step {currentStep}: {currentStepData.title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{currentStepData.description}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentStepData.field === 'supportContacts' ? (
              (planData.supportContacts).map((item, index) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="flex-1 p-2 border rounded-lg text-black placeholder-gray-400"
                    value={item.name}
                    onChange={(e) => handleInputChange('supportContacts', index, e.target.value, 'name')}
                  />
                  <input
                    type="text"
                    placeholder="Contact"
                    className="flex-1 p-2 border rounded-lg text-black placeholder-gray-400"
                    value={item.contact}
                    onChange={(e) => handleInputChange('supportContacts', index, e.target.value, 'contact')}
                  />
                </div>
              ))
            ) : currentStepData.field === 'professionals' ? (
              (planData.professionals).map((item, index) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="flex-1 p-2 border rounded-lg text-black placeholder-gray-400"
                    value={item.name}
                    onChange={(e) => handleInputChange('professionals', index, e.target.value, 'name')}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    className="flex-1 p-2 border rounded-lg text-black placeholder-gray-400"
                    value={item.phone}
                    onChange={(e) => handleInputChange('professionals', index, e.target.value, 'phone')}
                  />
                </div>
              ))
            ) : (
              (planData[currentStepData.field as keyof SafetyPlanData] as StepInput[]).map((item) => (
                <input
                  key={item.id}
                  type="text"
                  placeholder={`${currentStepData.title} #${item.id}`}
                  className="w-full p-2 border rounded-lg text-black placeholder-gray-400"
                  value={item.value}
                  onChange={(e) => handleInputChange(currentStepData.field as keyof SafetyPlanData, parseInt(item.id) - 1, e.target.value)}
                />
              ))
            )}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (currentStep === steps.length) {
                  handleFinish();
                } else {
                  setCurrentStep(prev => Math.min(steps.length, prev + 1));
                }
              }}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {currentStep === steps.length ? (
                <>
                  <Download className="h-4 w-4" />
                  Save Plan
                </>
              ) : (
                'Next'
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}