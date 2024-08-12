// Relative Path: src\components\components\PlanReview.tsx

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit2, Save, X, Trash2 } from 'lucide-react'

interface PlanReviewProps {
  plan: string[]
  healthySolutions: string[]
  onApprove: (approved: { plan: string[], healthySolutions: string[] }) => void
}

export default function PlanReview({ plan, healthySolutions, onApprove }: PlanReviewProps) {
  const [approvedPlan, setApprovedPlan] = useState(plan.map(() => true))
  const [approvedSolutions, setApprovedSolutions] = useState(healthySolutions.map(() => true))
  const [editingPlan, setEditingPlan] = useState<number | null>(null)
  const [editingSolution, setEditingSolution] = useState<number | null>(null)
  const [newPlanItem, setNewPlanItem] = useState('')
  const [newSolutionItem, setNewSolutionItem] = useState('')
  const [editedPlan, setEditedPlan] = useState([...plan])
  const [editedSolutions, setEditedSolutions] = useState([...healthySolutions])

  const toggleApproval = (index: number, type: 'plan' | 'solutions') => {
    if (type === 'plan') {
      setApprovedPlan(prev => {
        const newApproved = [...prev]
        newApproved[index] = !newApproved[index]
        return newApproved
      })
    } else {
      setApprovedSolutions(prev => {
        const newApproved = [...prev]
        newApproved[index] = !newApproved[index]
        return newApproved
      })
    }
  }

  const handleEdit = (index: number, type: 'plan' | 'solutions') => {
    if (type === 'plan') {
      setEditingPlan(index)
    } else {
      setEditingSolution(index)
    }
  }

  const handleSave = (index: number, type: 'plan' | 'solutions') => {
    if (type === 'plan') {
      setEditingPlan(null)
    } else {
      setEditingSolution(null)
    }
  }

  const handleChange = (index: number, value: string, type: 'plan' | 'solutions') => {
    if (type === 'plan') {
      setEditedPlan(prev => {
        const newPlan = [...prev]
        newPlan[index] = value
        return newPlan
      })
    } else {
      setEditedSolutions(prev => {
        const newSolutions = [...prev]
        newSolutions[index] = value
        return newSolutions
      })
    }
  }

  const handleDelete = (index: number, type: 'plan' | 'solutions') => {
    if (type === 'plan') {
      setEditedPlan(prev => prev.filter((_, i) => i !== index))
      setApprovedPlan(prev => prev.filter((_, i) => i !== index))
    } else {
      setEditedSolutions(prev => prev.filter((_, i) => i !== index))
      setApprovedSolutions(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleAdd = (type: 'plan' | 'solutions') => {
    if (type === 'plan') {
      setEditedPlan(prev => [...prev, newPlanItem])
      setApprovedPlan(prev => [...prev, true])
      setNewPlanItem('')
    } else {
      setEditedSolutions(prev => [...prev, newSolutionItem])
      setApprovedSolutions(prev => [...prev, true])
      setNewSolutionItem('')
    }
  }

  const handleApprove = () => {
    const finalPlan = editedPlan.filter((_, index) => approvedPlan[index])
    const finalSolutions = editedSolutions.filter((_, index) => approvedSolutions[index])
    onApprove({ plan: finalPlan, healthySolutions: finalSolutions })
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Review Care Plan</CardTitle>
        <CardDescription>Approve, modify, or add to the generated care plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Personalized Plan</h3>
          {editedPlan.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={`plan-${index}`}
                checked={approvedPlan[index]}
                onCheckedChange={() => toggleApproval(index, 'plan')}
              />
              {editingPlan === index ? (
                <Textarea
                  value={item}
                  onChange={(e) => handleChange(index, e.target.value, 'plan')}
                  className="flex-grow"
                />
              ) : (
                <label htmlFor={`plan-${index}`} className="text-sm flex-grow">{item}</label>
              )}
              {editingPlan === index ? (
                <Button size="sm" onClick={() => handleSave(index, 'plan')}><Save className="h-4 w-4" /></Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => handleEdit(index, 'plan')}><Edit2 className="h-4 w-4" /></Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => handleDelete(index, 'plan')}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <div className="flex items-center space-x-2 mt-2">
            <Input
              placeholder="Add new plan item"
              value={newPlanItem}
              onChange={(e) => setNewPlanItem(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={() => handleAdd('plan')}><Plus className="h-4 w-4 mr-2" />Add</Button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Healthy Solutions</h3>
          {editedSolutions.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={`solution-${index}`}
                checked={approvedSolutions[index]}
                onCheckedChange={() => toggleApproval(index, 'solutions')}
              />
              {editingSolution === index ? (
                <Textarea
                  value={item}
                  onChange={(e) => handleChange(index, e.target.value, 'solutions')}
                  className="flex-grow"
                />
              ) : (
                <label htmlFor={`solution-${index}`} className="text-sm flex-grow">{item}</label>
              )}
              {editingSolution === index ? (
                <Button size="sm" onClick={() => handleSave(index, 'solutions')}><Save className="h-4 w-4" /></Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => handleEdit(index, 'solutions')}><Edit2 className="h-4 w-4" /></Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => handleDelete(index, 'solutions')}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <div className="flex items-center space-x-2 mt-2">
            <Input
              placeholder="Add new healthy solution"
              value={newSolutionItem}
              onChange={(e) => setNewSolutionItem(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={() => handleAdd('solutions')}><Plus className="h-4 w-4 mr-2" />Add</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleApprove} className="w-full">Approve and Generate PDF</Button>
      </CardFooter>
    </Card>
  )
}