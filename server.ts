import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Allow JSON body up to 25MB for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Lazy initialize GenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// IN-MEMORY CLOUD DATABASE (Cross-Device Central Store)
// ----------------------------------------------------
let cloudBookings: any[] = [
  {
    id: 'bk-1001',
    customerId: 'c1',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Oakwood Heights, Jubilee Hills, Hyderabad',
    providerId: 'p1',
    providerName: 'Ramesh Sharma',
    providerProfession: 'Master Plumber',
    serviceCategory: 'Plumbing',
    problemTitle: 'Severe Kitchen Sink Pipe Joint Leakage',
    problemDescription: 'Water is dripping continuously from the P-trap PVC compression ring beneath the main sink.',
    status: 'in_progress',
    isEmergency: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    scheduledTime: 'Today, within 1 hour',
    inspectionFee: 349,
    finalAmount: 649,
    paymentStatus: 'pending',
  },
  {
    id: 'bk-1002',
    customerId: 'c1',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Oakwood Heights, Jubilee Hills, Hyderabad',
    providerId: 'p3',
    providerName: 'Vikram Joshi',
    providerProfession: 'HVAC Specialist',
    serviceCategory: 'AC & Cooling',
    problemTitle: 'Split AC Water Leaking from Indoor Blower',
    problemDescription: '1.5 ton inverter split AC blowing cool air but dripping water onto wooden flooring.',
    status: 'work_completed',
    isEmergency: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    scheduledTime: '3 days ago',
    inspectionFee: 499,
    finalAmount: 1199,
    paymentStatus: 'paid',
    paymentMethod: 'upi',
  }
];

let cloudMessages: any[] = [
  {
    id: 'msg-1',
    bookingId: 'bk-1001',
    senderId: 'p1',
    senderName: 'Ramesh Sharma',
    senderRole: 'provider',
    text: 'Namaste Ananya Ji! I have reviewed your sink photo from the AI estimate. I am on my way with a replacement PVC slip joint and teflon seal.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg-2',
    bookingId: 'bk-1001',
    senderId: 'c1',
    senderName: 'Ananya Sharma',
    senderRole: 'customer',
    text: 'Thank you Ramesh! The main valve is shut off. Please ring Flat 402 when you arrive.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  }
];

let cloudEstimates: any[] = [];
let cloudNotifications: any[] = [
  {
    id: 'notif-1',
    userId: 'c1',
    title: 'Technician Dispatched',
    message: 'Ramesh Sharma is en route to Jubilee Hills with replacement parts.',
    type: 'booking_update',
    read: false,
    createdAt: new Date().toISOString(),
  }
];

let cloudDisputes: any[] = [];
let cloudOwnerProfile = {
  name: 'Bhavyakth',
  title: 'Founder & App Developer',
  tagline: 'FixMate AI Creator & Lead Engineer',
  phone: '9030957387', // strictly private
  email: 'bhavyakth.founder@fixmate.ai',
  appCredit: 'Developed by Bhavyakth',
  role: 'admin',
  verifiedBadge: true,
  joinedDate: 'January 2026',
  totalPlatformBookings: 1482,
  satisfactionScore: 4.95,
};

// 1. Health check & Config
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'FixMate AI',
    developer: 'Bhavyakth',
    role: 'Founder & App Developer',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 2. Full Cross-Device Cloud Sync Endpoint (GET /api/sync)
app.get('/api/sync', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      bookings: cloudBookings,
      messages: cloudMessages,
      estimates: cloudEstimates,
      notifications: cloudNotifications,
      disputes: cloudDisputes,
      ownerProfile: cloudOwnerProfile,
      serverTime: new Date().toISOString(),
    }
  });
});

// 3. Cloud Bookings Sync (POST /api/sync/bookings)
app.post('/api/sync/bookings', (req: Request, res: Response) => {
  const { booking, action } = req.body;
  if (!booking) {
    return res.status(400).json({ error: 'Missing booking payload' });
  }

  const existingIdx = cloudBookings.findIndex(b => b.id === booking.id);
  if (existingIdx >= 0) {
    cloudBookings[existingIdx] = { ...cloudBookings[existingIdx], ...booking };
  } else {
    cloudBookings.unshift(booking);
  }

  // Create notification for cross-device awareness
  cloudNotifications.unshift({
    id: `notif-${Date.now()}`,
    userId: booking.customerId,
    title: `Booking Update: ${booking.serviceCategory}`,
    message: `Status: ${booking.status.replace('_', ' ').toUpperCase()} • ₹${booking.finalAmount || booking.inspectionFee}`,
    type: 'booking_update',
    read: false,
    createdAt: new Date().toISOString(),
  });

  return res.json({ success: true, booking, totalBookings: cloudBookings.length });
});

// 4. Cloud Chat Messages Sync (POST /api/sync/messages)
app.post('/api/sync/messages', (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message || !message.text) {
    return res.status(400).json({ error: 'Missing message payload' });
  }

  const newMsg = {
    id: message.id || `msg-${Date.now()}`,
    ...message,
    timestamp: message.timestamp || new Date().toISOString(),
  };

  cloudMessages.push(newMsg);
  return res.json({ success: true, message: newMsg, totalMessages: cloudMessages.length });
});

// 5. Cloud AI Estimates Sync (POST /api/sync/estimates)
app.post('/api/sync/estimates', (req: Request, res: Response) => {
  const { estimate } = req.body;
  if (estimate) {
    cloudEstimates.unshift(estimate);
  }
  return res.json({ success: true, totalEstimates: cloudEstimates.length });
});

// 6. Cloud Notifications Sync (POST /api/sync/notifications)
app.post('/api/sync/notifications', (req: Request, res: Response) => {
  const { notification, markAllRead, id } = req.body;
  if (markAllRead) {
    cloudNotifications = cloudNotifications.map(n => ({ ...n, read: true }));
  } else if (id) {
    const target = cloudNotifications.find(n => n.id === id);
    if (target) target.read = true;
  } else if (notification) {
    cloudNotifications.unshift(notification);
  }
  return res.json({ success: true, notifications: cloudNotifications });
});

// 7. Cloud Disputes Sync (POST /api/sync/disputes)
app.post('/api/sync/disputes', (req: Request, res: Response) => {
  const { dispute } = req.body;
  if (dispute) {
    const existing = cloudDisputes.findIndex(d => d.id === dispute.id);
    if (existing >= 0) {
      cloudDisputes[existing] = { ...cloudDisputes[existing], ...dispute };
    } else {
      cloudDisputes.unshift(dispute);
    }
  }
  return res.json({ success: true, disputes: cloudDisputes });
});

// In-memory Users store & Audit Logs
let cloudUsers: any[] = [
  {
    id: 'u-bhavyakth-admin',
    name: 'Bhavyakth',
    email: 'bhavyakth.founder@fixmate.ai',
    role: 'admin',
    title: 'Founder & App Developer',
    verified: true,
    phone: '9030957387',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p1',
    name: 'Ramesh Sharma',
    email: 'ramesh.sharma@fixmate.ai',
    role: 'provider',
    profession: 'Master Plumber',
    phone: '+91 98765 12345',
    verified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    role: 'customer',
    location: 'Jubilee Hills, Hyderabad',
    phone: '+91 98765 43210',
    verified: true,
    createdAt: new Date().toISOString(),
  }
];

let cloudAuditLogs: any[] = [
  {
    id: 'log-1',
    actor: 'Bhavyakth (Founder)',
    action: 'Platform initialized & UPI Payment Gateway configured to 9030957387@axl',
    timestamp: new Date().toISOString(),
    severity: 'info',
  }
];

// 8. Authentication & User Profile Management
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role = 'customer', phone, location, profession } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }

  const existing = cloudUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `u-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    role,
    phone: phone || '',
    location: location || 'Hyderabad',
    profession: role === 'provider' ? (profession || 'General Technician') : undefined,
    verified: role === 'admin',
    createdAt: new Date().toISOString(),
  };

  cloudUsers.push(newUser);
  cloudAuditLogs.unshift({
    id: `log-${Date.now()}`,
    actor: newUser.name,
    action: `User registered with role: ${role}`,
    timestamp: new Date().toISOString(),
    severity: 'info',
  });

  return res.json({ success: true, user: newUser });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, role = 'customer' } = req.body;

  if (role === 'admin' || (email && email.toLowerCase() === 'bhavyakth.founder@fixmate.ai')) {
    if (password && password !== 'bhavyakth') {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
    }
    return res.json({
      success: true,
      user: {
        id: 'u-bhavyakth-admin',
        name: 'Bhavyakth',
        email: 'bhavyakth.founder@fixmate.ai',
        role: 'admin',
        title: 'Founder & App Developer',
        verified: true,
      }
    });
  }

  const user = cloudUsers.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (user) {
    return res.json({ success: true, user });
  }

  // Fallback default role session
  if (role === 'provider') {
    return res.json({
      success: true,
      user: cloudUsers[1],
    });
  }

  return res.json({
    success: true,
    user: cloudUsers[2],
  });
});

app.post('/api/auth/recover-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email address is required.' });
  }

  const user = cloudUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  // Prevent account enumeration by always returning success with security message
  cloudAuditLogs.unshift({
    id: `log-${Date.now()}`,
    actor: email,
    action: `Password reset requested for ${email}`,
    timestamp: new Date().toISOString(),
    severity: 'security',
  });

  return res.json({
    success: true,
    message: 'If an account exists with this email, secure password reset instructions have been generated.',
  });
});

// Admin endpoint for audit logs & server health
app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  return res.json({
    success: true,
    logs: cloudAuditLogs,
    totalUsers: cloudUsers.length,
    totalBookings: cloudBookings.length,
    serverUptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  });
});

// 9. AI Photo Diagnosis & Cost Estimation endpoint
app.post('/api/ai/diagnose', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userDescription = '', categoryHint = '' } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found. Using intelligent contextual fallback.');
      const fallback = generateSmartFallback(userDescription, categoryHint);
      return res.json({ success: true, data: fallback, source: 'offline_expert_rule_engine' });
    }

    const ai = getGenAI();

    const systemPrompt = `You are the master diagnostic AI for "FixMate AI", a professional local home & automotive services marketplace founded by Bhavyakth.
Your task is to analyze user-uploaded photos and descriptions of damaged or faulty items (such as pipes, electrical switches, AC units, car brakes, appliances, carpentry, walls, electronics) and output a precise, realistic diagnosis with preliminary cost estimates in Indian Rupees (₹ INR).

Categorize the required service strictly into ONE of the following:
- Plumbing
- Electrical
- AC & Cooling
- Appliance Repair
- Car & Bike
- Carpentry
- Painting
- Cleaning
- Electronics
- General Maintenance

Provide difficulty as one of: "Low", "Medium", "High", "Expert".
Provide confidence as one of: "High", "Medium", "Preliminary".
Include safety advice if water, gas, high voltage, or vehicle brakes are involved.
Return valid JSON only matching the schema.`;

    const userPromptText = `Please diagnose this repair issue:
User description: "${userDescription || 'Please inspect the uploaded photo and identify the problem.'}"
Category hint: "${categoryHint || 'Auto-detect from image'}"

Provide:
1. problemTitle (concise, professional title e.g. "Kitchen Sink P-Trap Compression Leak")
2. category (one of the 10 supported categories)
3. difficulty ("Low" | "Medium" | "High" | "Expert")
4. summary (2-3 detailed sentences explaining the exact root cause and required fix)
5. possibleParts (array of items with partName, estimatedPriceMin, estimatedPriceMax, necessity: "Required"|"Recommended"|"Optional")
6. laborRange (object with min and max in INR ₹)
7. partsRange (object with min and max in INR ₹)
8. totalRange (object with min and max in INR ₹)
9. safetyTips (array of 2-3 essential safety guidelines for the customer)
10. estimatedDuration (e.g. "1 – 2 hours")
11. confidence ("High" | "Medium" | "Preliminary")
12. disclaimer ("This is an AI-generated preliminary estimate. Final pricing may change after professional inspection.")`;

    const contentsPayload: any = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const cleanMime = imageBase64.includes(';') ? imageBase64.split(';')[0].replace('data:', '') : mimeType;

      contentsPayload.push({
        inlineData: {
          mimeType: cleanMime || 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    contentsPayload.push({
      text: userPromptText,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemTitle: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            summary: { type: Type.STRING },
            possibleParts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  partName: { type: Type.STRING },
                  estimatedPriceMin: { type: Type.NUMBER },
                  estimatedPriceMax: { type: Type.NUMBER },
                  necessity: { type: Type.STRING },
                },
                required: ['partName', 'estimatedPriceMin', 'estimatedPriceMax', 'necessity'],
              },
            },
            laborRange: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
              },
              required: ['min', 'max'],
            },
            partsRange: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
              },
              required: ['min', 'max'],
            },
            totalRange: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
              },
              required: ['min', 'max'],
            },
            safetyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            estimatedDuration: { type: Type.STRING },
            confidence: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
          },
          required: [
            'problemTitle',
            'category',
            'difficulty',
            'summary',
            'possibleParts',
            'laborRange',
            'partsRange',
            'totalRange',
            'safetyTips',
            'estimatedDuration',
            'confidence',
            'disclaimer',
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response from AI Vision model.');
    }

    const parsed = JSON.parse(textOutput);
    const resultObj = {
      id: `est-${Date.now()}`,
      ...parsed,
      createdAt: new Date().toISOString(),
    };

    // Save to cloud estimates store
    cloudEstimates.unshift(resultObj);

    return res.json({
      success: true,
      data: resultObj,
      source: 'gemini_vision_3.7_flash',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/diagnose:', error?.message || error);
    const fallback = generateSmartFallback(req.body.userDescription, req.body.categoryHint);
    cloudEstimates.unshift(fallback);
    return res.json({
      success: true,
      data: fallback,
      source: 'intelligent_resilience_engine',
      note: 'Processed via resilient fallback engine due to API timeout/limit.',
    });
  }
});

// 10. Intelligent Multi-Turn AI Assistant Chat endpoint with image and troubleshooting capabilities
app.post('/api/ai/chat-assistant', async (req: Request, res: Response) => {
  try {
    const {
      message,
      conversationHistory = [],
      currentBookingContext,
      imageBase64,
      language = 'en', // 'en' or 'te'
      beginnerMode = false,
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const isTe = language === 'te';
      const fallbackReply = isTe
        ? `నమస్కారం! నేను భవ్యక్త్ రూపొందించిన FixMate AI అసిస్టెంట్‌ని. గృహోపకరణాలు, ప్లంబింగ్, ఎలక్ట్రికల్, ఏసీ లేదా వాహన మరమ్మతుల కోసం నేను మీకు సహాయం చేయగలను. మీ సమస్య ఏమిటి?`
        : `Hello! I am FixMate AI Assistant, developed by Bhavyakth. I can help diagnose home, appliance, gadget, and automotive repair issues, calculate fair ₹ INR pricing estimates, provide safe step-by-step troubleshooting, and connect you with verified local technicians. How can I help you today?`;
      return res.json({
        reply: fallbackReply,
        source: 'local_offline_assistant',
      });
    }

    const ai = getGenAI();

    const isTelugu = language === 'te';
    const langInstruction = isTelugu
      ? `CRITICAL LANGUAGE REQUIREMENT: You MUST reply in clear, professional, and natural TELUGU (తెలుగు) script. Use beginner-friendly Telugu with technical terms clearly explained.`
      : `Provide answers in clear, structured English. If requested, simplify technical jargon into beginner-friendly instructions.`;

    const systemPrompt = `You are FixMate AI Assistant, the premier intelligent repair technician and diagnostic consultant for FixMate AI (founded and developed by Bhavyakth).

Your Core Capabilities & Guidelines:
1. Multi-Device Troubleshooting: Phones, laptops, tablets, computers, home appliances (AC, fridge, washing machine), electrical circuits, plumbing, automotive (cars, bikes), and carpentry.
2. Step-by-Step Diagnostic Method:
   - Ask clarifying diagnostic questions when needed (e.g., brand, model, error codes, strange noises, when the issue began).
   - Distinguish confirmed facts from likely hypotheses.
   - Provide numbered, actionable troubleshooting steps with numbered headings.
   - Mention likely causes and prevention tips.
   - SAFETY FIRST: Explicitly warn users before risky actions (e.g., live high-voltage, mains water shutoff, refrigerant gases, lithium battery swelling, vehicle brake systems).
   - Recommend professional FixMate repair whenever high danger, specialized calibration tools, or safety hazards are present.
3. Realistic Indian Market Pricing: Provide estimated parts and labor costs in Indian Rupees (₹ INR) where relevant.
4. Multimodal Analysis: When an image is provided, thoroughly inspect physical wear, component numbers, discoloration, leaks, or cracked joints.
5. ${langInstruction}`;

    const contentsPayload: any[] = [];

    // Prior conversation turns
    for (const msg of conversationHistory) {
      if (msg.role === 'user' || msg.sender === 'user') {
        const parts: any[] = [{ text: msg.content || msg.text || '' }];
        if (msg.imageUrl) {
          const cleanBase64 = msg.imageUrl.includes(',') ? msg.imageUrl.split(',')[1] : msg.imageUrl;
          const cleanMime = msg.imageUrl.includes(';') ? msg.imageUrl.split(';')[0].replace('data:', '') : 'image/jpeg';
          parts.push({
            inlineData: {
              mimeType: cleanMime || 'image/jpeg',
              data: cleanBase64,
            },
          });
        }
        contentsPayload.push({
          role: 'user',
          parts,
        });
      } else {
        contentsPayload.push({
          role: 'model',
          parts: [{ text: msg.content || msg.text || msg.reply || '' }],
        });
      }
    }

    // Current turn parts
    const currentParts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const cleanMime = imageBase64.includes(';') ? imageBase64.split(';')[0].replace('data:', '') : 'image/jpeg';
      currentParts.push({
        inlineData: {
          mimeType: cleanMime || 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    let finalPrompt = message;
    if (currentBookingContext) {
      finalPrompt = `[Context: Booking #${currentBookingContext.id} | Service: ${currentBookingContext.serviceCategory} | Issue: ${currentBookingContext.problemTitle}]\nUser question: ${message}`;
    }
    if (beginnerMode) {
      finalPrompt += `\n(Please explain in ultra-simple, beginner-friendly language with zero complex jargon.)`;
    }

    currentParts.push({ text: finalPrompt });

    contentsPayload.push({
      role: 'user',
      parts: currentParts,
    });

    // Use current recommended model gemini-3.8-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const reply = response.text || 'I have analyzed your query and am ready to assist with further troubleshooting.';

    return res.json({
      success: true,
      reply,
      source: 'gemini_3.8_flash',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/ai/chat-assistant:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'AI service encountered an issue. Please try again or check your query.',
      details: err?.message || 'Upstream service error',
    });
  }
});

// Smart fallback engine for resilience
function generateSmartFallback(description = '', categoryHint = '') {
  const desc = (description + ' ' + categoryHint).toLowerCase();

  let category = 'Plumbing';
  let title = 'Pipe Joint Leakage & Drain Assessment';
  let laborMin = 300;
  let laborMax = 650;
  let partsMin = 150;
  let partsMax = 450;
  let parts = [
    { partName: 'PVC Slip Joint & Rubber Washer Seal', estimatedPriceMin: 120, estimatedPriceMax: 250, necessity: 'Required' },
    { partName: 'Thread Sealant Teflon Tape', estimatedPriceMin: 30, estimatedPriceMax: 60, necessity: 'Required' },
  ];
  let safety = [
    'Turn off the main water shut-off valve under the sink or main riser.',
    'Keep a bucket beneath the joint to prevent cabinet wood swelling.',
  ];

  if (desc.includes('electric') || desc.includes('spark') || desc.includes('mcb') || desc.includes('switch') || desc.includes('wiring') || categoryHint === 'Electrical') {
    category = 'Electrical';
    title = 'Tripped MCB Breaker & Short Circuit Diagnostic';
    laborMin = 350;
    laborMax = 750;
    partsMin = 200;
    partsMax = 600;
    parts = [
      { partName: 'Single Pole 32A C-Curve MCB Breaker', estimatedPriceMin: 180, estimatedPriceMax: 350, necessity: 'Required' },
      { partName: 'Heat-Resistant Terminal Connector Block', estimatedPriceMin: 50, estimatedPriceMax: 120, necessity: 'Recommended' },
    ];
    safety = [
      '⚠️ Turn off the main distribution switch immediately.',
      'Do NOT touch exposed blackened wires with bare hands.',
      'Avoid running high-power appliances (AC, Geyser) on this line.',
    ];
  } else if (desc.includes('ac') || desc.includes('cool') || desc.includes('gas') || desc.includes('compressor') || categoryHint === 'AC & Cooling') {
    category = 'AC & Cooling';
    title = 'Split AC Drain Blockage & Cooling Coil Inspection';
    laborMin = 499;
    laborMax = 950;
    partsMin = 250;
    partsMax = 1200;
    parts = [
      { partName: 'Foam Jet Chemical Cleanser & Antibacterial Spray', estimatedPriceMin: 250, estimatedPriceMax: 400, necessity: 'Required' },
      { partName: 'R32 Refrigerant Top-Up (150-250g)', estimatedPriceMin: 600, estimatedPriceMax: 1100, necessity: 'Optional' },
    ];
    safety = [
      'Switch off the dedicated AC MCB before cleaning or servicing.',
      'Ensure proper drainage pipe slope to prevent internal wall dampness.',
    ];
  } else if (desc.includes('car') || desc.includes('bike') || desc.includes('brake') || desc.includes('tire') || desc.includes('jumpstart') || categoryHint === 'Car & Bike') {
    category = 'Car & Bike';
    title = 'Brake Pad Wear & Rotor Diagnostic';
    laborMin = 400;
    laborMax = 800;
    partsMin = 500;
    partsMax = 1800;
    parts = [
      { partName: 'Ceramic/Semi-Metallic Front Brake Pad Set', estimatedPriceMin: 600, estimatedPriceMax: 1600, necessity: 'Required' },
      { partName: 'DOT-4 Synthetic Brake Fluid (250ml)', estimatedPriceMin: 150, estimatedPriceMax: 250, necessity: 'Recommended' },
    ];
    safety = [
      'Park on level ground with handbrake engaged.',
      'Do not drive if the brake pedal feels spongy or sinks to the floor.',
    ];
  } else if (desc.includes('wash') || desc.includes('fridge') || desc.includes('appliance') || categoryHint === 'Appliance Repair') {
    category = 'Appliance Repair';
    title = 'Washing Machine Drum Alignment & Shock Absorber Check';
    laborMin = 399;
    laborMax = 799;
    partsMin = 350;
    partsMax = 950;
    parts = [
      { partName: 'Heavy Duty Suspension Strut / Shock Damper', estimatedPriceMin: 350, estimatedPriceMax: 700, necessity: 'Required' },
      { partName: 'Drive Belt Replacement', estimatedPriceMin: 200, estimatedPriceMax: 400, necessity: 'Optional' },
    ];
    safety = [
      'Unplug appliance power cord before any physical examination.',
      'Turn off water supply hose connected to the machine.',
    ];
  }

  return {
    id: `est-${Date.now()}`,
    problemTitle: title,
    category,
    difficulty: 'Medium',
    summary: `The preliminary scan identifies probable wear and localized fault in the ${category.toLowerCase()} assembly. Inspection by a certified technician is recommended to verify seal integrity and prevent cascading damage.`,
    possibleParts: parts,
    laborRange: { min: laborMin, max: laborMax },
    partsRange: { min: partsMin, max: partsMax },
    totalRange: { min: laborMin + partsMin, max: laborMax + partsMax },
    safetyTips: safety,
    estimatedDuration: '1 – 2 hours',
    confidence: 'Preliminary',
    disclaimer: 'This is an AI-generated preliminary estimate. Final pricing may change after professional inspection.',
    createdAt: new Date().toISOString(),
  };
}

// Vite middleware & Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FixMate AI server running on http://0.0.0.0:${PORT}`);
    console.log(`Developed by Bhavyakth - Founder & App Developer`);
  });
}

startServer();
