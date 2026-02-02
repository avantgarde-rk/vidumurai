
/**
 * AI Risk Engine for Student Leaves
 * Analyzes requests for meaningful patterns (Weekend extension, Frequency, Sandwich)
 */

const calculateRisk = (studentHistory, currentRequest) => {
    let score = 0;
    const factors = [];

    const reqDate = new Date(currentRequest.startDate);
    const day = reqDate.getDay(); // 0=Sun, 1=Mon... 5=Fri, 6=Sat

    // 1. Weekend Extension Detection (Friday or Monday leaves)
    if (day === 5 || day === 1) {
        score += 20;
        factors.push('Weekend Extension Pattern (Fri/Mon)');
    }

    // 2. Frequency Check (Leaves in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLeaves = studentHistory.filter(l => new Date(l.startDate) > thirtyDaysAgo);

    if (recentLeaves.length >= 3) {
        score += 40;
        factors.push(`High Frequency: ${recentLeaves.length} leaves in 30 days`);
    } else if (recentLeaves.length >= 2) {
        score += 15;
        factors.push('Moderate Frequency');
    }

    // 3. Serial Offender Check (Recurrent Reason)
    // E.g. "Sick" 3 times in a month
    const sickLeaves = recentLeaves.filter(l => l.reason.toLowerCase().includes('sick'));
    if (sickLeaves.length >= 2 && currentRequest.reason.toLowerCase().includes('sick')) {
        score += 25;
        factors.push('Recurrent "Sick" Reason');
    }

    // Determine Level
    let level = 'Low';
    if (score >= 70) level = 'Critical';
    else if (score >= 45) level = 'High';
    else if (score >= 20) level = 'Medium';

    return { score, level, factors };
};

module.exports = { calculateRisk };
