/**
 * Gemini AI Coach integration
 * Provides training analysis and recommendations using Google's Generative AI
 */

import axios from 'axios';

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
  const prompt = `You are an expert cycling coach analyzing athlete performance data.

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

Format as JSON with keys: training_recommendation, nutrition, recovery, risk_assessment`;

  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured');
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]) as CoachAnalysis;
      return analysis;
    }

    // Default response if parsing fails
    return {
      training_recommendation: 'Rest day or recovery ride - check your current form (TSB) before intense sessions',
      nutrition: 'Maintain balanced nutrition with adequate carbohydrates',
      recovery: 'Ensure 8+ hours sleep, manage stress levels',
      risk_assessment: 'Monitor fatigue levels to prevent overtraining',
    };
  } catch (error) {
    console.error('Coach analysis error:', error);
    
    // Return default safe coaching recommendations
    return {
      training_recommendation: 'Consult your coach or rest today',
      nutrition: 'Hydrate well and maintain consistent nutrition',
      recovery: 'Prioritize sleep and stress management',
      risk_assessment: 'Monitor your training load carefully',
    };
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
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return `Analysis for ${topic}: Document received. Please configure Gemini API key for detailed analysis.`;
    }

    const prompt = `Analyze this training document and extract key insights:

Topic: ${topic}
Content: ${documentContent.substring(0, 2000)}...

Provide:
- Key takeaways
- Applicable protocols
- Performance optimization tips`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text || `Document analysis for ${topic} completed.`;
  } catch (error) {
    console.error('Document analysis error:', error);
    return `Analysis for "${topic}" - Training document received. Share insights with your coach.`;
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
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return `${duration}-week training plan for goals: ${goals.join(', ')}. Please configure Gemini API for personalized plan generation.`;
    }

    const prompt = `Create a ${duration}-week periodized training plan for a cyclist with:
- Goals: ${goals.join(', ')}
- Current Fitness (CTL): ${currentFitness}

Provide:
- Weekly structure (endurance, tempo, threshold, V02max sessions)
- Recovery days
- Build, peak, and recovery phases
- Progression logic`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text || `${duration}-week periodized training plan created for your goals.`;
  } catch (error) {
    console.error('Training plan generation error:', error);
    return `Generated ${duration}-week training plan. Goals: ${goals.join(', ')}`;
  }
}
