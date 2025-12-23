
import { GoogleGenAI } from "@google/genai";

/**
 * Ask Shadow AI (Gemini 3 Pro) for guidance on vault security and account abstraction.
 */
export const askGemini = async (prompt: string, context?: any) => {
  try {
    // Initializing with the system-provided API key from environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      You are Shadow Vault AI, an elite security analyst for a next-gen seedless smart wallet. 
      The user is managing their multi-chain identity using Account Abstraction (ERC-4337).
      
      Current User Context: ${JSON.stringify(context || {})}
      
      Your operational guidelines:
      1. Educate the user on why seedless (Passkey-based) wallets are more secure than traditional private keys.
      2. Explain the "3-of-5" social recovery protocol using Social Guardians and ZK-Email proofs.
      3. Guide them through adding recovery factors like hardware keys or trusted contacts.
      4. Clarify technical concepts like "Gasless Transactions" and "On-chain Governance" of their vault.
      5. Maintain a professional, highly secure, and reassuring tone.
      6. Never ask for secrets, emails, or personal data.
      
      If asked about "Wallet Discovery," explain that Shadow queries multiple networks to find accounts tied to their identity anchor.
    `;

    // Using Gemini 3 Pro for high-reasoning security tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4, // Lower temperature for more consistent, reliable security advice
        topP: 0.8,
        topK: 40,
      },
    });

    // Access text output directly per latest SDK standards
    return response.text;
  } catch (error) {
    console.error("[Shadow AI Service Error]:", error);
    return "The AI node is currently resyncing. Your vault remains fully secured by the on-chain protocol.";
  }
};
