import { GoogleGenAI } from "@google/genai";

// Standard Hostel Knowledge Base for offline NLP matching
const HOSTEL_KNOWLEDGE_BASE = [
    {
        keywords: ["curfew", "timing", "time", "gate", "close", "night", "entry"],
        topic: "Hostel Curfew & Gate Timings",
        answer: "SRM Hostel curfew for Block C (Boys Executive) is strictly **09:00 PM** on weekdays and **09:30 PM** on weekends. Late entry after curfew without an approved Night Outpass requires warden sign-off and attracts a biometric late log flag."
    },
    {
        keywords: ["outpass", "leave", "permission", "apply", "gatepass", "night out"],
        topic: "Outpass & Leave Rules",
        answer: "Day Outpasses (return before 08:30 PM) are auto-assessed by our AI engine and approved within 15 minutes. Weekend Night Outpasses require submission at least 12 hours prior with parent SMS confirmation. You can track your real-time QR Gate Pass in the Outpass tab."
    },
    {
        keywords: ["mess", "food", "dinner", "lunch", "breakfast", "menu", "timing", "eating"],
        topic: "Hostel Mess & Dining Schedule",
        answer: "Mess Timings:\n• Breakfast: 07:30 AM - 09:30 AM\n• Lunch: 12:15 PM - 02:15 PM\n• Evening Snacks: 04:30 PM - 05:45 PM\n• Dinner: 07:30 PM - 09:30 PM\nFood ratings and weekly menu suggestions can be submitted directly in the Mess Management Portal."
    },
    {
        keywords: ["fee", "fees", "pay", "payment", "due", "receipt", "tuition", "cost"],
        topic: "Fees & Payment Guidelines",
        answer: "Hostel & Mess fees are payable per semester via Net Banking, UPI, or Credit/Debit cards through the Fees tab. Digital receipts with official SRM transaction references are generated instantly upon payment confirmation."
    },
    {
        keywords: ["wifi", "internet", "speed", "network", "lan", "connect"],
        topic: "Wi-Fi & Campus Connectivity",
        answer: "High-speed 1 Gbps fiber Wi-Fi is available across all rooms (SSID: `SRM_HOSTEL_5G`). Each student gets 2 registered MAC addresses. For connectivity troubleshooting, raise a Maintenance Complaint under 'Wi-Fi / Network'."
    },
    {
        keywords: ["warden", "contact", "office", "doctor", "emergency", "help", "ambulance"],
        topic: "Emergency & Warden Desk",
        answer: "Emergency Contacts:\n• Chief Warden Office (Block C): +91 94440 12345 (Ground Floor)\n• SRM Campus Hospital Helpline: 044-27455555 / 1066\n• Hostel Security Gate: Extension 4001"
    },
    {
        keywords: ["laundry", "wash", "clothes", "ironing"],
        topic: "Laundry Facilities",
        answer: "Laundry pickup is available on Tuesdays & Fridays from 08:00 AM - 10:00 AM at the Block C basement. Clothes are washed, ironed, and delivered within 48 hours."
    }
];

/**
 * Perform Hostel Domain AI Answer query
 */
export function queryHostelAIModel(userQuery) {
    const queryLower = userQuery.toLowerCase();
    
    // Find best match in knowledge base
    let bestMatch = null;
    let maxMatchCount = 0;

    for (const item of HOSTEL_KNOWLEDGE_BASE) {
        let matchCount = 0;
        for (const kw of item.keywords) {
            if (queryLower.includes(kw)) {
                matchCount++;
            }
        }
        if (matchCount > maxMatchCount) {
            maxMatchCount = matchCount;
            bestMatch = item;
        }
    }

    if (bestMatch && maxMatchCount > 0) {
        return {
            topic: bestMatch.topic,
            answer: bestMatch.answer,
            source: "SRM Hostel AI Engine v3.4 (Domain Model)",
            confidence: Math.min(0.95, 0.70 + maxMatchCount * 0.1)
        };
    }

    // Default intelligent AI fallback response
    return {
        topic: "General Hostel Assistance",
        answer: `I analyzed your inquiry regarding "${userQuery}".\n\nFor general hostel queries, you can check your student dashboard for active announcements, apply for outpasses under the Outpass tab, or submit maintenance requests under Complaints. If you require warden intervention, Dr. K. Sharma is available at the Block C Warden Office during office hours (05:00 PM - 07:00 PM).`,
        source: "SRM Hostel AI Engine v3.4 (Domain Model)",
        confidence: 0.78
    };
}

/**
 * AI Maintenance Complaint Classifier
 */
export function classifyComplaintAI(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    let category = "General Maintenance";
    let priority = "Medium";
    let estimatedHours = 4;
    let assignedTech = "Maintenance Staff";
    let reasoning = "Standard maintenance ticket.";

    if (text.includes("leak") || text.includes("pipe") || text.includes("water") || text.includes("tap") || text.includes("flush") || text.includes("toilet") || text.includes("sink")) {
        category = "Plumbing";
        assignedTech = "Rajesh Kumar (Chief Plumber)";
        if (text.includes("burst") || text.includes("overflow") || text.includes("flooding") || text.includes("heavy leak")) {
            priority = "Emergency";
            estimatedHours = 1;
            reasoning = "AI detected potential flooding or heavy water overflow. Marked as EMERGENCY priority.";
        } else {
            priority = "Medium";
            estimatedHours = 3;
            reasoning = "Plumbing issue categorized with standard 3-hour SLA window.";
        }
    } else if (text.includes("ac") || text.includes("aircon") || text.includes("cooling") || text.includes("heat") || text.includes("fan")) {
        category = "HVAC / Air Conditioning";
        assignedTech = "Suresh V. (AC Service Dept)";
        priority = "Medium";
        estimatedHours = 5;
        reasoning = "Climate control unit servicing request assigned to AC technical team.";
    } else if (text.includes("spark") || text.includes("short") || text.includes("power") || text.includes("switch") || text.includes("wire") || text.includes("flicker") || text.includes("light")) {
        category = "Electrical";
        assignedTech = "M. Selvam (Senior Electrician)";
        if (text.includes("spark") || text.includes("smoke") || text.includes("shock") || text.includes("burning")) {
            priority = "Emergency";
            estimatedHours = 1;
            reasoning = "AI detected electrical safety hazard (sparks/smoke). Prioritized for IMMEDIATE dispatch.";
        } else {
            priority = "Medium";
            estimatedHours = 2;
            reasoning = "Electrical fixture servicing assigned to electrician queue.";
        }
    } else if (text.includes("wifi") || text.includes("internet") || text.includes("router") || text.includes("network") || text.includes("lan") || text.includes("speed")) {
        category = "Wi-Fi / Network";
        assignedTech = "SRM IT Network Desk";
        priority = "Low";
        estimatedHours = 6;
        reasoning = "Network connectivity ticket logged for IT infrastructure inspection.";
    } else if (text.includes("door") || text.includes("lock") || text.includes("key") || text.includes("table") || text.includes("chair") || text.includes("window") || text.includes("bed")) {
        category = "Carpentry & Furniture";
        assignedTech = "Karthik (Hostel Carpenter)";
        if (text.includes("door lock") || text.includes("cannot lock") || text.includes("stuck outside")) {
            priority = "High";
            estimatedHours = 2;
            reasoning = "Room security / lock issue marked High Priority.";
        } else {
            priority = "Low";
            estimatedHours = 12;
            reasoning = "Furniture repair queued for routine maintenance hours.";
        }
    }

    return {
        category,
        priority,
        estimatedHours,
        assignedTech,
        reasoning
    };
}

/**
 * AI Outpass Risk Assessment Engine
 */
export function assessOutpassRiskAI({ destination, reason, type, outDate, expectedInDate, attendanceRate = 94.2 }) {
    let riskScore = 10;
    const flags = [];

    const destLower = (destination || "").toLowerCase();
    const reasonLower = (reason || "").toLowerCase();

    // Destination risk factors
    if (destLower.includes("pub") || destLower.includes("bar") || destLower.includes("party") || destLower.includes("resort") || destLower.includes("club")) {
        riskScore += 45;
        flags.push("High-risk nightlife or party venue detected in destination.");
    }
    if (destLower.includes("beach") || destLower.includes("ecr") || destLower.includes("highway")) {
        riskScore += 25;
        flags.push("Coastal / Highway travel destination flagged for safety advisory.");
    }

    // Travel timing risk factors
    const outTime = new Date(outDate);
    const inTime = new Date(expectedInDate);
    
    if (!isNaN(outTime) && outTime.getHours() >= 20) {
        riskScore += 20;
        flags.push("Late evening departure time (after 08:00 PM).");
    }

    if (!isNaN(inTime) && (inTime.getHours() < 6 || inTime.getHours() >= 22)) {
        riskScore += 25;
        flags.push("Return time falls outside standard curfew windows (10:00 PM - 06:00 AM).");
    }

    // Type risk
    if (type === "Weekend Night Leave") {
        riskScore += 15;
    }

    // Attendance penalty
    if (attendanceRate < 80) {
        riskScore += 30;
        flags.push(`Low student attendance record (${attendanceRate}% < 80% cutoff).`);
    }

    // Final evaluation
    let riskLevel = "Low Risk";
    let recommendation = "Auto-Approval Recommended";

    if (riskScore >= 70) {
        riskLevel = "High Risk";
        recommendation = "Requires Warden Manual Interview & Parent Confirmation";
    } else if (riskScore >= 35) {
        riskLevel = "Moderate Risk";
        recommendation = "Standard Warden Approval Required";
    }

    return {
        riskScore: Math.min(99, riskScore),
        riskLevel,
        recommendation,
        flags: flags.length > 0 ? flags : ["Destination & schedule verified within standard safety parameters."]
    };
}

/**
 * Google Gemini API Handler (for Live AI Mode)
 */
export async function queryGeminiLiveAPI(apiKey, prompt, contextHistory = []) {
    if (!apiKey) {
        throw new Error("No Google Gemini API key provided.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are the SRM Hostel ERP AI Assistant. You assist students and wardens with hostel administration, room guidelines, outpass requests, complaint resolutions, and campus life at SRM Institute of Science and Technology. Always provide clear, professional, executive responses without gaudy formatting. Keep tone helpful and structured.`;

        const contents = [
            ...contextHistory.map(msg => ({
                role: msg.sender === "user" ? "user" : "model",
                parts: [{ text: msg.text }]
            })),
            { role: "user", parts: [{ text: prompt }] }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: {
                systemInstruction,
                temperature: 0.4
            }
        });

        return response.text || "No response received from Gemini API.";
    } catch (err) {
        console.error("Gemini API Error:", err);
        throw new Error(err.message || "Failed to communicate with Gemini API.");
    }
}

/**
 * AI Content Moderation for Anonymous Suggestions & Opinions
 * Rejects vulgar, abusive, profane, defamatory, or spam content.
 */
const VULGAR_TERMS = [
    'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'cunt', 'dick', 'pussy', 'nigger', 
    'faggot', 'slut', 'whore', 'chutiya', 'madarchod', 'bhenchod', 'gaand', 'harami',
    'idiot', 'stupid', 'kill', 'attack', 'bomb', 'burn', 'hate', 'racist', 'ugly'
];

export function moderateSuggestionAI(title, content) {
    const combined = `${title} ${content}`.toLowerCase();
    
    // Check profanity / vulgarity
    const flagged = [];
    for (const word of VULGAR_TERMS) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(combined)) {
            flagged.push(word);
        }
    }

    if (flagged.length > 0) {
        return {
            isApproved: false,
            status: "Flagged_Vulgar",
            sentiment: "Inappropriate Content Detected",
            feedback: `AI Content Guard Shield: Your text contains words flagged as inappropriate or disrespectful ("${flagged.join(', ')}"). The Anonymous Suggestion Box is an official university dialogue forum. Please reframe constructively.`
        };
    }

    if (!content || content.trim().length < 15) {
        return {
            isApproved: false,
            status: "Flagged_Spam",
            sentiment: "Insufficient Details",
            feedback: "AI Content Guard: Your suggestion is too brief to be meaningful. Please provide sufficient reasoning so the hostel administration can review it."
        };
    }

    // Auto-detect constructive category/sentiment
    let sentiment = "Constructive Campus Suggestion";
    let autoCategory = "General Facilities";

    if (combined.includes('mess') || combined.includes('food') || combined.includes('dining') || combined.includes('breakfast') || combined.includes('lunch') || combined.includes('dinner')) {
        sentiment = "Constructive Dietary & Mess Feedback";
        autoCategory = "Mess & Dining";
    } else if (combined.includes('wifi') || combined.includes('internet') || combined.includes('speed') || combined.includes('lan') || combined.includes('network')) {
        sentiment = "Technical Infrastructure Proposal";
        autoCategory = "IT & Wi-Fi Network";
    } else if (combined.includes('curfew') || combined.includes('outpass') || combined.includes('timing') || combined.includes('gate') || combined.includes('security')) {
        sentiment = "Hostel Policy & Curfew Discourse";
        autoCategory = "Curfew & Resident Policy";
    } else if (combined.includes('ac') || combined.includes('water') || combined.includes('tap') || combined.includes('light') || combined.includes('lift') || combined.includes('study')) {
        sentiment = "Facility & Maintenance Enhancement";
        autoCategory = "Infrastructure & Common Rooms";
    } else if (combined.includes('gym') || combined.includes('badminton') || combined.includes('cricket') || combined.includes('sports')) {
        sentiment = "Sports & Recreation Proposal";
        autoCategory = "Sports & Fitness";
    }

    return {
        isApproved: true,
        status: "Approved",
        sentiment,
        autoCategory,
        feedback: "AI Content Verification Passed: Decorous, constructive student discourse verified."
    };
}

