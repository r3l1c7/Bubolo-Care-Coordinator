// Relative Path: src\app\api\generate-plan\route.ts

import { NextResponse } from 'next/server';
import OpenAI from "openai";

interface PatientData {
  name: string;
  dob: string;
  service: string;
  goals: string[];
  objectives: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const patientData: PatientData = await req.json();
    console.log('Received patient data:', JSON.stringify({ ...patientData, name: '[REDACTED]' }, null, 2));

    if (!patientData || !patientData.goals || !patientData.objectives) {
      return NextResponse.json({ error: 'Invalid request: dob, service, goals, and objectives are required' }, { status: 400 });
    }

    console.log('Generating new plan using OpenAI');
    const prompt = `Generate a care plan for a medical clinic that offers weight loss, hormone replacement therapy, hair transplants, general practice, mens ed treatment using ICI or gainswave and prp, and mental health counseling; based on the following patient data:

Date of Birth: ${patientData.dob}
Service: ${patientData.service}

Goals:
${patientData.goals.map((goal, index) => `${index + 1}. ${goal}`).join('\n')}

Objectives:
${patientData.objectives.map((objective, index) => `${index + 1}. ${objective}`).join('\n')}

Please provide:

1. A personalized plan with at least 3 specific actions.
2. A list of healthy solutions with at least 3 items.
3. Do not mention specialists, nutritionists, dieticians or fitness trainers.
4. If PCOS or Diabetes are mentioned, suggest a low carb diet for PCOS or Diabetes associated with weight loss.
5. For sleep studies, suggest a possible sleep study prescribed by our doctor.
6. Keep answers brief, professional and simple and in line with our services, don't suggest outside suggestions or use the patient's name.
7) If patient is on TRT or HRT mention that we will check labs at 6 weeks to monitor progress.
8) If patient has low vitamin D mention to take 5,000 IU/day and recheck levels at 3 months.
9) If high a1c mention that at 6 weeks if it's not managed we'll consult with the doctor about semaglutide dosage changes or metformin.

Format the response as follows:

Personalized Plan:
1. [Action 1]
2. [Action 2]
3. [Action 3]

Healthy Solutions:
* [Solution 1]
* [Solution 2]
* [Solution 3]
* Reach out to our team for any support or questions. We are here to help! - Kayla`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    const generatedText = chatCompletion.choices[0]?.message?.content;

    if (!generatedText) {
      throw new Error('No response generated from OpenAI');
    }

    console.log('Generated text:', generatedText);

    // Parse the generated text to extract the plan and healthy solutions
    const planMatch = generatedText.match(/Personalized Plan:([\s\S]*?)Healthy Solutions:/);
    const healthySolutionsMatch = generatedText.match(/Healthy Solutions:([\s\S]*)/);

    let plan: string[] = [];
    let healthySolutions: string[] = [];

    if (planMatch && planMatch[1]) {
      plan = planMatch[1].split('\n').filter(item => item.trim().length > 0).map(item => item.replace(/^\d+\.\s*/, '').trim());
    }

    if (healthySolutionsMatch && healthySolutionsMatch[1]) {
      healthySolutions = healthySolutionsMatch[1].split('\n').filter(item => item.trim().length > 0).map(item => item.replace(/^\*\s*/, '').trim());
    }

    if (plan.length === 0 || healthySolutions.length === 0) {
      throw new Error('Failed to parse the generated plan or healthy solutions');
    }

    console.log('Returning generated plan and healthySolutions');
    return NextResponse.json({ plan, healthySolutions });
  } catch (error) {
    console.error('Error in generate-plan route:', error);
    return NextResponse.json({ error: 'Failed to process request: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
