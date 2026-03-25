/**
 * Gemini AI Coach integration
 * Provides training analysis and recommendations using Google's Generative AI
 */

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export interface CoachAnalysis {
  training_recommendation: string;
  nutrition: string;
  recovery: string;
  risk_assessment: string;
}

/**
 * Get AI coaching recommendations based on athlete metrics
 */
export async function getCoachAnalysis(
  athleteProfile: {
    ftp: number;
    weight: number;
    recentActivities: any[];
    currentMetrics: {
      ctl: number;
      atl: number;
      tsb: number;
    };
    dailyData: {
      sleep: number;
      hrv: number;
      stress: number;
    };
  }
): Promise<CoachAnalysis> {
  const prompt = `
You are an expert cycling coach analyzing athlete performance data.

Athlete Profile:
- FTP: ${athleteProfile.ftp}W
- Weight: ${athleteProfile.weight}kg
- Recent Activities: ${athleteProfile.recentActivities.length} rides
- CTL (Fitness): ${athleteProfile.currentMetrics.ctl}
- ATL (Fatigue): ${athleteProfile.currentMetrics.atl}
- TSB (Form): ${athleteProfile.currentMetrics.tsb}
- Sleep: ${athleteProfile.dailyData.sleep}h
- HRV: ${athleteProfile.dailyData.hrv}ms
- Stress: ${athleteProfile.dailyData.stress}/10

Based on this data, provide:
1. Training recommendation for next session (type, intensity, duration)
2. Nutrition strategy (CHO/hour, protein, hydration)
3. Recovery priorities
4. Injury/overtraining risk assessment

Format as JSON.
`;

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-pro'),
      prompt,
    });

    // Parse JSON response
    const analysis = JSON.parse(text) as CoachAnalysis;
    return analysis;
  } catch (error) {
    console.error('Coach analysis error:', error);
    throw new Error('Failed to get coach analysis');
  }
}

/**
 * Analyze uploaded training documents (PDFs, articles)
 * Creates RAG knowledge base for the coach
 */
export async function analyzeTrainingDocument(
  documentContent: string,
  topic: string
): Promise<string> {
  const prompt = `
Analyze this training document and extract key insights:

Topic: ${topic}
Content: ${documentContent.substring(0, 2000)}...

Provide:
- Key takeaways
- Applicable protocols
- Performance optimization tips
`;

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-pro'),
      prompt,
    });

    return text;
  } catch (error) {
    console.error('Document analysis error:', error);
    throw new Error('Failed to analyze document');
  }
}

/**
 * Generate personalized training plan
 */
export async function generateTrainingPlan(
  goals: string[],
  duration: number, // weeks
  currentFitness: number // CTL
): Promise<string> {
  const prompt = `
Create a ${duration}-week periodized training plan for a cyclist with:
- Goals: ${goals.join(', ')}
- Current Fitness (CTL): ${currentFitness}

Include:
- Weekly structure (endurance, tempo, threshold, V02max sessions)
- Recovery days
- Build, peak, and recovery phases
- Progression logic
`;

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-pro'),
      prompt,
    });

    return text;
  } catch (error) {
    console.error('Training plan generation error:', error);
    throw new Error('Failed to generate training plan');
  }
}
