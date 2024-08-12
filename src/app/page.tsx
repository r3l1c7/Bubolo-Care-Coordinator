// Relative Path: src\app\page.tsx

'use client'

import { useState, useEffect } from 'react'
import PatientForm from '@/components/components/PatientForm'
import PlanReview from '@/components/components/PlanReview'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Spinner from '@/components/components/spinner'  // Import the new Spinner component
import CarePlanPDF from '@/components/components/CarePlanPDF';
import { pdf } from '@react-pdf/renderer';


interface PatientData {
  name: string
  dob: string
  service: string
  goals: string[]
  objectives: string[]
}

interface GeneratedPlan {
  plan: string[]
  healthySolutions: string[]
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null)
  const [approvedPlan, setApprovedPlan] = useState<GeneratedPlan | null>(null)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)  // New state for tracking plan generation

  const checkPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent default form submission
    try {
      console.log('Sending password check request...');
      console.log('Password being sent:', password);
      const response = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);
      try {
        const data = JSON.parse(textResponse);
        console.log('Parsed response data:', data);
        if (data.success) {
          console.log('Authentication successful');
          setIsAuthenticated(true);
          localStorage.setItem('appPassword', password);
        } else {
          console.log('Authentication failed');
          alert(data.message || 'Authentication failed');
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        alert('Error parsing server response');
      }
    } catch (error) {
      console.error('Error checking password:', error)
      alert('An error occurred while checking the password: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  useEffect(() => {
    const storedPassword = localStorage.getItem('appPassword')
    if (storedPassword) {
      setPassword(storedPassword)
      // We're not automatically checking the password anymore
    }
  }, [])

  const handleFormSubmit = async (data: PatientData) => {
    setPatientData(data)
    setIsGeneratingPlan(true)  // Start generating plan
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-App-Password': password
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        const plan = await response.json()
        setGeneratedPlan(plan)
      } else {
        console.error('Failed to generate plan')
        alert('Failed to generate plan. Please try again.')
      }
    } catch (error) {
      console.error('Error generating plan:', error)
      alert('An error occurred while generating the plan. Please try again.')
    } finally {
      setIsGeneratingPlan(false)  // Stop generating plan
    }
  }

  const handlePlanApproval = (approvedPlan: GeneratedPlan) => {
    setApprovedPlan(approvedPlan)
  }

  const handleGeneratePDF = async () => {
    if (patientData && approvedPlan) {
      try {
        const blob = await pdf(
          <CarePlanPDF
            patientData={{
              name: patientData.name,
              dob: patientData.dob,
              service: patientData.service,
              goals: patientData.goals,
              objectives: patientData.objectives
            }}
            plan={approvedPlan.plan}
            healthySolutions={approvedPlan.healthySolutions}
          />
        ).toBlob();
  
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `care_plan_${patientData.name}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('An error occurred while generating the PDF. Please try again.');
      }
    }
  };
  

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Care Plan Generator</h1>
        <form onSubmit={checkPassword} className="flex flex-col items-center space-y-4">
          <Input 
            type="password" 
            placeholder="Enter password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </form>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Care Plan Generator</h1>
      {!patientData && <PatientForm onSubmit={handleFormSubmit} />}
      {isGeneratingPlan && <Spinner />}
      {generatedPlan && !approvedPlan && !isGeneratingPlan && (
        <PlanReview
          plan={generatedPlan.plan}
          healthySolutions={generatedPlan.healthySolutions}
          onApprove={handlePlanApproval}
        />
      )}
      {approvedPlan && (
        <Button onClick={handleGeneratePDF}>Generate and Download PDF</Button>
      )}
    </main>
  )
}