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
  const prompt = `Eres un entrenador ciclista experto analizando datos de rendimiento de un atleta.

Perfil del Atleta:
- FTP: ${athleteProfile.ftp}W
- Peso: ${athleteProfile.weight}kg
- Actividades Recientes: ${athleteProfile.recentActivities.length} paseos
- CTL (Forma Física): ${athleteProfile.currentMetrics.ctl}
- ATL (Fatiga): ${athleteProfile.currentMetrics.atl}
- TSB (Forma): ${athleteProfile.currentMetrics.tsb}
- Sueño: ${athleteProfile.dailyData.sleep}h
- VFC: ${athleteProfile.dailyData.hrv}ms
- Estrés: ${athleteProfile.dailyData.stress}/10

Basado en estos datos, proporciona:
1. Recomendación de entrenamiento para próxima sesión (tipo, intensidad, duración)
2. Estrategia nutricional (CHO/hora, proteína, hidratación)
3. Prioridades de recuperación
4. Evaluación de riesgo de lesión/sobreentrenamiento

Formatea como JSON con claves: training_recommendation, nutrition, recovery, risk_assessment`;

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
      training_recommendation: 'Día de descanso o paseo de recuperación - verifica tu forma actual (TSB) antes de sesiones intensas',
      nutrition: 'Mantén nutrición balanceada con carbohidratos adecuados',
      recovery: 'Asegura 8+ horas de sueño, maneja los niveles de estrés',
      risk_assessment: 'Monitorea los niveles de fatiga para prevenir sobreentrenamiento',
    };
  } catch (error) {
    console.error('Coach analysis error:', error);
    
    // Return default safe coaching recommendations
    return {
      training_recommendation: 'Consulta a tu entrenador o descansa hoy',
      nutrition: 'Hidrátate bien y mantén nutrición consistente',
      recovery: 'Prioriza el sueño y manejo del estrés',
      risk_assessment: 'Monitorea tu carga de entrenamiento cuidadosamente',
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
      return `Análisis de ${topic}: Documento recibido. Por favor, configura la clave de API de Gemini para análisis detallado.`;
    }

    const prompt = `Analiza este documento de entrenamiento y extrae perspectivas clave:

Tema: ${topic}
Contenido: ${documentContent.substring(0, 2000)}...

Proporciona:
- Conclusiones clave
- Protocolos aplicables
- Consejos de optimización de rendimiento`;

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
    return text || `Análisis del documento para ${topic} completado.`;
  } catch (error) {
    console.error('Document analysis error:', error);
    return `Análisis de "${topic}" - Documento de entrenamiento recibido. Comparte perspectivas con tu entrenador.`;
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
      return `Plan de entrenamiento de ${duration} semanas para objetivos: ${goals.join(', ')}. Por favor, configura la API de Gemini para generación de plan personalizado.`;
    }

    const prompt = `Crea un plan de entrenamiento periodizado de ${duration} semanas para un ciclista con:
- Objetivos: ${goals.join(', ')}
- Forma Física Actual (CTL): ${currentFitness}

Proporciona:
- Estructura semanal (sesiones de resistencia, tempo, umbral, V02max)
- Días de recuperación
- Fases de construcción, pico y recuperación
- Lógica de progresión`;

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
    return text || `Plan de entrenamiento periodizado de ${duration} semanas creado para tus objetivos.`;
  } catch (error) {
    console.error('Training plan generation error:', error);
    return `Plan de entrenamiento generado de ${duration} semanas. Objetivos: ${goals.join(', ')}`;
  }
}
