// Relative Path: src\components\components\PatientForm.tsx

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react'

interface PatientData {
  name: string
  dob: string
  service: string
  goals: string[]
  objectives: string[]
}

const steps = ['Patient Info', 'Goals', 'Objectives']

export default function PatientForm({ onSubmit }: { onSubmit: (data: PatientData) => void }) {
  const [step, setStep] = useState(0)
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    dob: '',
    service: '',
    goals: [''],
    objectives: ['']
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value })
  }

  const handleArrayChange = (index: number, value: string, field: 'goals' | 'objectives') => {
    const newArray = [...patientData[field]]
    newArray[index] = value
    setPatientData({ ...patientData, [field]: newArray })
  }

  const addField = (field: 'goals' | 'objectives') => {
    setPatientData({ ...patientData, [field]: [...patientData[field], ''] })
  }

  const removeField = (index: number, field: 'goals' | 'objectives') => {
    const newArray = patientData[field].filter((_, i) => i !== index)
    setPatientData({ ...patientData, [field]: newArray })
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(patientData)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Care Plan</CardTitle>
        <CardDescription>Step {step + 1} of 3: {steps[step]}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Patient Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={patientData.name}
                  onChange={handleChange}
                  placeholder="Enter patient's full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={patientData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="service">Current Service</Label>
                <Input
                  id="service"
                  name="service"
                  value={patientData.service}
                  onChange={handleChange}
                  placeholder="e.g., Weight Loss, HRT"
                  required
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              {patientData.goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Textarea
                    value={goal}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'goals')}
                    placeholder={`Goal ${index + 1}`}
                    className="flex-grow"
                  />
                  {patientData.goals.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeField(index, 'goals')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={() => addField('goals')} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Goal
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {patientData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Textarea
                    value={objective}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'objectives')}
                    placeholder={`Objective ${index + 1}`}
                    className="flex-grow"
                  />
                  {patientData.objectives.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeField(index, 'objectives')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={() => addField('objectives')} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Objective
              </Button>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 0 && (
          <Button type="button" onClick={prevStep} variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
        )}
        {step < 2 ? (
          <Button type="button" onClick={nextStep} className="ml-auto">
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button type="submit" onClick={handleSubmit} className="ml-auto">
            Generate Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}