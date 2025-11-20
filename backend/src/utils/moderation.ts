/**
 * Simple content moderation utility
 * In production, this would integrate with AI services like OpenAI Moderation API
 */

// Palavras e padrões suspeitos
const SUSPICIOUS_PATTERNS = {
  // Assédio sexual
  harassment: [
    /\b(nudes?|pelad[ao]s?|fotos?\s+intimas?)\b/i,
    /\b(sexo|transar|foder)\b/i,
    /\b(gostosa|delicia|tesao)\b/i,
  ],

  // Manipulação financeira
  financial: [
    /\b(pix|transferencia|dinheiro)\s+(agora|urgente|rapido)/i,
    /\b(empresta|emprestimo|preciso\s+de\s+dinheiro)/i,
    /\b(conta\s+bloqueada|emergencia\s+financeira)/i,
  ],

  // Ameaças
  threats: [
    /\b(vou\s+te\s+(matar|machucar|destruir))/i,
    /\b(cuidado|vai\s+se\s+arrepender)/i,
  ],

  // Golpes
  scams: [
    /\b(investimento|oportunidade\s+unica|ganhar\s+dinheiro)/i,
    /\b(bitcoin|cripto|forex)/i,
  ],

  // Informações pessoais
  personalInfo: [
    /\b\d{3}[\.\-]?\d{3}[\.\-]?\d{3}[\.\-]?\d{2}\b/, // CPF
    /\b\d{11}\b/, // Telefone
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
  ],
};

export interface ModerationResult {
  flagged: boolean;
  categories: string[];
  severity: 'low' | 'medium' | 'high';
  reason?: string;
}

/**
 * Moderate text content
 */
export function moderateContent(text: string): ModerationResult {
  const flaggedCategories: string[] = [];

  // Check each category
  for (const [category, patterns] of Object.entries(SUSPICIOUS_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        flaggedCategories.push(category);
        break;
      }
    }
  }

  // Determine severity
  let severity: 'low' | 'medium' | 'high' = 'low';
  
  if (flaggedCategories.includes('threats')) {
    severity = 'high';
  } else if (
    flaggedCategories.includes('harassment') ||
    flaggedCategories.includes('scams')
  ) {
    severity = 'medium';
  }

  return {
    flagged: flaggedCategories.length > 0,
    categories: flaggedCategories,
    severity,
    reason: flaggedCategories.length > 0
      ? `Detected: ${flaggedCategories.join(', ')}`
      : undefined,
  };
}

/**
 * Analyze conversation pattern
 * Detects suspicious patterns like:
 * - Too many messages in short time
 * - Repeated requests for money
 * - Sudden topic changes to financial matters
 */
export function analyzeConversationPattern(messages: Array<{ text: string; createdAt: Date }>) {
  if (messages.length < 5) {
    return { suspicious: false };
  }

  // Check message frequency
  const now = new Date();
  const recentMessages = messages.filter((msg) => {
    const diff = now.getTime() - new Date(msg.createdAt).getTime();
    return diff < 5 * 60 * 1000; // Last 5 minutes
  });

  if (recentMessages.length > 10) {
    return {
      suspicious: true,
      reason: 'Too many messages in short time (possible spam)',
    };
  }

  // Check for repeated financial requests
  const financialMessages = messages.filter((msg) =>
    SUSPICIOUS_PATTERNS.financial.some((pattern) => pattern.test(msg.text))
  );

  if (financialMessages.length > 3) {
    return {
      suspicious: true,
      reason: 'Multiple financial requests detected',
    };
  }

  return { suspicious: false };
}

/**
 * Generate safety score for a user based on their behavior
 */
export function calculateSafetyScore(data: {
  reportCount: number;
  verifiedStatus: boolean;
  accountAge: number; // in days
  messagesFlagged: number;
}): number {
  let score = 100;

  // Deduct points for reports
  score -= data.reportCount * 10;

  // Deduct points for flagged messages
  score -= data.messagesFlagged * 5;

  // Add points for verification
  if (data.verifiedStatus) {
    score += 20;
  }

  // Add points for account age
  if (data.accountAge > 30) {
    score += 10;
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

