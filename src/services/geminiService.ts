// Google AI Studio (Gemini API) Integration Service for SNPSU Portal

export interface GeminiResponse {
  text: string;
  isMockFallback: boolean;
}

export class GeminiService {
  private static apiKey: string = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  public static setApiKey(key: string) {
    this.apiKey = key.trim();
  }

  public static getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Send a prompt to Google AI Studio Gemini API endpoint
   */
  public static async queryGemini(prompt: string, systemInstruction?: string): Promise<GeminiResponse> {
    const key = this.apiKey;
    
    // If user has provided a Google AI Studio API Key, invoke Gemini 2.0 Flash
    if (key && key.length > 10) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
        
        const payload: any = {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
          };
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return { text: generatedText, isMockFallback: false };
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, using intelligent SNPSU ERP fallback:', err);
      }
    }

    // Intelligent University ERP Fallback when API key is pending
    return {
      text: this.generateLocalSNPSUResponse(prompt),
      isMockFallback: true,
    };
  }

  /**
   * Generates localized SNPSU academic guidance when offline or without key
   */
  private static generateLocalSNPSUResponse(prompt: string): string {
    const p = prompt.toLowerCase();
    
    if (p.includes('shortage') || p.includes('75') || p.includes('exam') || p.includes('eligibility')) {
      return (
        "🏛️ **SNPSU Academic Regulations & Condonation Guidelines (UGC/AICTE/NMC):**\n\n" +
        "1. **>= 75% Attendance:** Fully eligible for Semester End Examinations (SEE).\n" +
        "2. **65% to 74% Attendance:** Eligible only upon Vice-Chancellor/Dean Condonation approval with valid Medical Certificate or sanctioned On-Duty (OD) pass.\n" +
        "3. **Below 65% Attendance:** Strictly Detained under University CBCS Ordinance clause 14.3. The student must re-register for the course in subsequent odd/even semesters.\n\n" +
        "💡 *Recommendation for Faculty/Student:* Attend the upcoming 2-hour lab and remedial sessions to recover percentages safely before final attendance cutoff."
      );
    }

    if (p.includes('od') || p.includes('leave') || p.includes('isro') || p.includes('sports')) {
      return (
        "📋 **SNPSU On-Duty (OD) Application Assessment:**\n\n" +
        "• Event: Co-curricular / Research Workshop / Sports\n" +
        "• Criteria: Official invitation or sanction letter with Faculty Mentor recommendation.\n" +
        "• Attendance Credit: Max 10% credit can be added to overall subject attendance upon HOD endorsement.\n" +
        "• Recommendation: **Approved for Condonation Waiver**, subject to submitting the completion certificate within 3 working days."
      );
    }

    return (
      "🎓 **SNPSU Smart Campus Assistant (Google AI Studio Ready):**\n\n" +
      "I have processed your academic query regarding Sapthagiri NPS University ERP operations. " +
      "To enable full multi-modal insights and document analysis, configure your Google AI Studio API key in the App Settings (`EXPO_PUBLIC_GEMINI_API_KEY`)."
    );
  }
}
