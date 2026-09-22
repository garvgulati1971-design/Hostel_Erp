export const INITIAL_STUDENT = {
    id: "SRM20260402",
    name: "Garv",
    email: "garv.student@srmist.edu.in",
    phone: "+91 98765 43210",
    course: "B.Tech Computer Science & Engineering",
    year: "3rd Year (Semester 6)",
    rollNo: "RA2311003010452",
    hostelBlock: "C-Block (Boys Executive)",
    roomNo: "402",
    bedNo: "B",
    roomType: "2-Sharing AC with Ensuite Bath",
    roommate: {
        name: "Rohan Sharma",
        rollNo: "RA2311003010488",
        phone: "+91 98123 76543",
        dept: "B.Tech CSE"
    },
    warden: {
        name: "Dr. K. Sharma",
        phone: "+91 94440 12345",
        office: "Block-C Ground Floor Warden Desk"
    },
    guardian: {
        name: "Rajesh Kumar",
        relation: "Father",
        phone: "+91 98220 99887"
    },
    attendanceRate: 94.2,
    pendingFees: 30000,
    totalFees: 367000
};

export const INITIAL_ANNOUNCEMENTS = [
    {
        id: 1,
        title: "Scheduled High-Voltage Transformer Maintenance",
        date: "Sept 4, 2026",
        time: "10:00 AM - 02:00 PM",
        category: "Utility Alert",
        priority: "High",
        content: "Backup generators will operate for Block C & D elevators and study halls. Heavy AC usage is restricted during peak hours."
    },
    {
        id: 2,
        title: "Annual SRM Tech Fest 'AARUUSH' Outpass Guidelines",
        date: "Sept 2, 2026",
        time: "05:00 PM",
        category: "Event Notice",
        priority: "Medium",
        content: "Extended curfew to 10:30 PM granted for registered festival participants with valid digital ID badges."
    },
    {
        id: 3,
        title: "Mess Committee Weekly Menu Voting Open",
        date: "Aug 31, 2026",
        time: "08:00 PM",
        category: "Mess Notice",
        priority: "Low",
        content: "Submit your dish preferences for Sunday Special Dinner via the SRM Hostel ERP Mess Portal."
    }
];

export const INITIAL_OUTPASSES = [
    {
        id: "OTP-2026-881",
        type: "Day Outpass",
        destination: "Forum Vijaya Mall, Vadapalani",
        reason: "Academic project supply purchase & team gathering",
        outDate: "2026-09-03T14:00",
        expectedInDate: "2026-09-03T20:30",
        status: "Approved",
        qrCode: "SRM-PASS-GARV-881-VALID",
        approvedBy: "Dr. K. Sharma (Warden)",
        aiRiskScore: 12,
        aiRiskLevel: "Low Risk",
        createdAt: "2026-09-03T09:15"
    },
    {
        id: "OTP-2026-792",
        type: "Weekend Night Outpass",
        destination: "Home (Bangalore)",
        reason: "Family event & weekend home visit",
        outDate: "2026-08-22T17:00",
        expectedInDate: "2026-08-25T08:00",
        status: "Completed",
        qrCode: "SRM-PASS-GARV-792-EXPIRED",
        approvedBy: "Dr. K. Sharma (Warden)",
        aiRiskScore: 8,
        aiRiskLevel: "Low Risk",
        createdAt: "2026-08-21T11:00"
    }
];

export const INITIAL_PENDING_WARDEN_OUTPASSES = [
    {
        id: "OTP-2026-904",
        studentName: "Aarav Patel",
        rollNo: "RA2311003010410",
        roomNo: "C-305",
        type: "Weekend Night Leave",
        destination: "ECR Beach Resort Party",
        reason: "Friend's birthday night out",
        outDate: "2026-09-05T19:00",
        expectedInDate: "2026-09-06T06:00",
        aiRiskScore: 78,
        aiRiskLevel: "High Risk",
        aiRiskReason: "Late night return destination flagged; low hostel attendance record (74%).",
        status: "Pending Warden Review"
    },
    {
        id: "OTP-2026-905",
        studentName: "Priya Sundaram",
        rollNo: "RA2311003010499",
        roomNo: "C-212",
        type: "Day Outpass",
        destination: "SRM Medical Centre",
        reason: "Dental checkup consultation",
        outDate: "2026-09-04T10:00",
        expectedInDate: "2026-09-04T15:00",
        aiRiskScore: 5,
        aiRiskLevel: "Low Risk",
        aiRiskReason: "Medical purpose verified; verified daytime travel duration.",
        status: "Pending Warden Review"
    }
];

export const INITIAL_COMPLAINTS = [
    {
        id: "TKT-4401",
        title: "AC cooling reduced & minor water dripping",
        category: "HVAC / Air Conditioning",
        description: "Room 402 AC split unit filter needs cleaning and coolant check. Dripping into bucket.",
        roomNo: "402",
        priority: "Medium",
        status: "In Progress",
        assignedTech: "Suresh (AC Maintenance Dept)",
        estimatedHours: 4,
        createdAt: "2026-09-02T16:30",
        aiAnalysis: "Filter clog detected from regular seasonal operation. Priority rated Medium (Non-Emergency)."
    },
    {
        id: "TKT-4389",
        title: "Study Table LED Tube Flickering",
        category: "Electrical",
        description: "Bed B study lamp light is flickering continuously.",
        roomNo: "402",
        priority: "Low",
        status: "Resolved",
        assignedTech: "Ramesh (Electrician)",
        estimatedHours: 1,
        createdAt: "2026-08-29T10:15",
        aiAnalysis: "Bulb fixture replaced successfully."
    }
];

export const TODAY_MESS_MENU = {
    day: "Thursday",
    date: "Sept 3, 2026",
    breakfast: {
        time: "07:30 AM - 09:30 AM",
        items: ["Ghee Podi Idli", "Medu Vada", "Coconut Chutney & Sambar", "Bread Butter Jam", "Tea / Coffee / Milk"],
        calories: "450 kcal",
        highlight: "Fresh South Indian Breakfast"
    },
    lunch: {
        time: "12:15 PM - 02:15 PM",
        items: ["Paneer Butter Masala / Chicken Chettinad", "Dal Tadka", "Jeera Rice & Steamed Rice", "Poori", "Curd & Mango Pickle", "Gulab Jamun"],
        calories: "780 kcal",
        highlight: "Special North & South Combo"
    },
    snacks: {
        time: "04:30 PM - 05:45 PM",
        items: ["Onion Pakoda", "Green Chutney", "Hot Masala Chai / Milk"],
        calories: "280 kcal",
        highlight: "Crispy Evening Snacks"
    },
    dinner: {
        time: "07:30 PM - 09:30 PM",
        items: ["Aloo Gobi Dry", "Soft Phulka Roti", "Lemon Rice", "Rasam & Sambar", "Fruit Salad"],
        calories: "620 kcal",
        highlight: "Light Balanced Meal"
    }
};

export const FEE_ITEMS = [
    { id: "FEE-1", name: "Hostel Room Rent (2-Sharing AC)", amount: 155000, status: "Paid", dueDate: "Aug 15, 2026" },
    { id: "FEE-2", name: "Mess & Catering Charges (Annual)", amount: 120000, status: "Paid", dueDate: "Aug 15, 2026" },
    { id: "FEE-3", name: "Amenities & High-Speed Wi-Fi", amount: 25000, status: "Paid", dueDate: "Aug 15, 2026" },
    { id: "FEE-4", name: "Security & Caution Deposit (Refundable)", amount: 15000, status: "Paid", dueDate: "Aug 15, 2026" },
    { id: "FEE-5", name: "Laundry & Housekeeping Services", amount: 22000, status: "Paid", dueDate: "Aug 15, 2026" },
    { id: "FEE-6", name: "Semester 6 Gym & Sports Complex", amount: 30000, status: "Pending", dueDate: "Sept 15, 2026" }
];

export const WARDEN_STATS = {
    totalCapacity: 500,
    occupiedBeds: 442,
    presentInHostel: 415,
    onApprovedOutpass: 24,
    unaccountedCurfew: 3,
    openComplaints: 14,
    criticalComplaints: 2,
    pendingOutpasses: 2
};

// 1. HOSTEL BLOCKS & DUTY STAFF DIRECTORY
export const INITIAL_BLOCKS = [
    {
        id: "BLOCK_I",
        name: "I-Block (International & Senior Wing)",
        code: "Block-I",
        type: "Boys Hostel (Senior & International)",
        totalFloors: 10,
        capacity: 550,
        occupied: 498,
        wardenName: "Dr. Ronald V. Anderson",
        wardenPhone: "+91 94440 22331",
        wardenEmail: "warden.blocki@srmist.edu.in",
        wardenOffice: "Block-I Ground Floor Reception Suite 102",
        serviceTechName: "Arumugam P.",
        serviceTechRole: "Senior Block Electrician & Utility Lead",
        serviceTechPhone: "+91 98401 11221",
        features: ["Attached Balconies", "Fiber Wi-Fi 6", "Laundromat", "Dedicated International Student Lounge"]
    },
    {
        id: "BLOCK_G",
        name: "G-Block (Engineering Boys Deluxe)",
        code: "Block-G",
        type: "Boys Hostel (Undergraduate Deluxe)",
        totalFloors: 9,
        capacity: 600,
        occupied: 542,
        wardenName: "Prof. S. Venkatraman",
        wardenPhone: "+91 94440 33442",
        wardenEmail: "warden.blockg@srmist.edu.in",
        wardenOffice: "Block-G East Wing Admin Office",
        serviceTechName: "Murugan K.",
        serviceTechRole: "Chief Carpenter & Infrastructure Lead",
        serviceTechPhone: "+91 98402 22332",
        features: ["2-Sharing AC", "Elevators", "Badminton Court", "Night Canteen Annex"]
    },
    {
        id: "BLOCK_H",
        name: "H-Block (Postgraduate & Research Block)",
        code: "Block-H",
        type: "Boys Hostel (Postgraduate & Scholars)",
        totalFloors: 8,
        capacity: 420,
        occupied: 380,
        wardenName: "Dr. P. Meenakshi Sundaram",
        wardenPhone: "+91 94440 44553",
        wardenEmail: "warden.blockh@srmist.edu.in",
        wardenOffice: "Block-H Academic Wing Floor 1",
        serviceTechName: "Balamurugan S.",
        serviceTechRole: "HVAC & Thermal Plant Technician",
        serviceTechPhone: "+91 98403 33443",
        features: ["Single & Double Study Rooms", "Silent Study Lounge", "LAN ports per desk", "Gym Annex"]
    },
    {
        id: "BLOCK_C",
        name: "C-Block (Boys Executive)",
        code: "Block-C",
        type: "Boys Hostel (Executive Ensuite)",
        totalFloors: 8,
        capacity: 500,
        occupied: 442,
        wardenName: "Dr. K. Sharma",
        wardenPhone: "+91 94440 12345",
        wardenEmail: "warden.blockc@srmist.edu.in",
        wardenOffice: "Block-C Ground Floor Chief Warden Desk",
        serviceTechName: "Suresh V.",
        serviceTechRole: "AC & Climate Systems Specialist",
        serviceTechPhone: "+91 98400 11223",
        features: ["2-Sharing Ensuite Bath", "Central AC", "Study Pods", "Table Tennis & Pool"]
    },
    {
        id: "BLOCK_A",
        name: "A-Block (Boys Standard)",
        code: "Block-A",
        type: "Boys Hostel (Standard Quad)",
        totalFloors: 7,
        capacity: 480,
        occupied: 410,
        wardenName: "Dr. T. Rajan",
        wardenPhone: "+91 94440 55664",
        wardenEmail: "warden.blocka@srmist.edu.in",
        wardenOffice: "Block-A Central Wing Desk",
        serviceTechName: "Mani G.",
        serviceTechRole: "Lead Plumber & Water Network",
        serviceTechPhone: "+91 98400 55667",
        features: ["3-Sharing Non-AC", "Water Coolers", "Common TV Hall", "Bicycle Parking"]
    },
    {
        id: "BLOCK_B",
        name: "B-Block (Boys Deluxe)",
        code: "Block-B",
        type: "Boys Hostel (Deluxe Double)",
        totalFloors: 7,
        capacity: 460,
        occupied: 395,
        wardenName: "Dr. M. Joseph",
        wardenPhone: "+91 94440 66775",
        wardenEmail: "warden.blockb@srmist.edu.in",
        wardenOffice: "Block-B Resident Warden Office",
        serviceTechName: "Ramesh T.",
        serviceTechRole: "General Electrical Maintenance",
        serviceTechPhone: "+91 98400 33445",
        features: ["2-Sharing Standard", "Solar Water Heating", "Courtyard Garden", "Reading Room"]
    }
];

// 2. OFFICIAL CIRCULARS & NOTICES
export const INITIAL_NOTICES = [
    {
        id: "NOT-2026-001",
        refNo: "SRM/CW/CIR/2026/089",
        title: "Mandatory Biometric ID & RFID Door Access Synchronization",
        category: "Chief Warden Circular",
        priority: "Urgent Alert",
        issuedBy: "Dr. K. Sharma (Chief Warden)",
        targetBlocks: "All Blocks (I, G, H, C, A, B)",
        content: "All resident students of Blocks I, G, H, C, A, and B must re-sync their campus RFID Smart Cards at the Block C Ground Floor kiosk by September 25, 2026. Unsynced cards will fail turnstile gate access after 21:00 hrs.",
        date: "Sept 18, 2026",
        attachmentName: "Notice_RFID_Sync_Guidelines_2026.pdf",
        signatoryTitle: "Chief Warden & Dean of Hostels"
    },
    {
        id: "NOT-2026-002",
        refNo: "SRM/ENG/MAINT/2026/041",
        title: "Block I & G High-Efficiency Heat Pump Maintenance Schedule",
        category: "Maintenance Notice",
        priority: "High Priority",
        issuedBy: "Executive Engineer (Hostel Infrastructure)",
        targetBlocks: "Block I & G",
        content: "Annual de-scaling and preventive overhaul of centralized heat pumps in Block I and Block G will occur on Saturday from 10:00 AM to 02:00 PM. Hot water supply will be paused during these maintenance hours.",
        date: "Sept 19, 2026",
        attachmentName: "Heat_Pump_Maintenance_Block_I_G.pdf",
        signatoryTitle: "Director of Infrastructure & Maintenance"
    },
    {
        id: "NOT-2026-003",
        refNo: "SRM/MESS/COM/2026/012",
        title: "Hostel Grand Mess Fest 'Swad Sangam' & Regional Food Street",
        category: "Mess Notice",
        priority: "General Circular",
        issuedBy: "Dr. R. Swaminathan (Mess Warden)",
        targetBlocks: "All Blocks",
        content: "The Annual Hostel Food Fest 'Swad Sangam' is scheduled for Friday evening at the Central Quadrangle. Special dessert counters, Chettinad, Punjabi, and Continental live counters will be available. Mess coupons waived for hostel residents.",
        date: "Sept 20, 2026",
        attachmentName: "Food_Fest_Swad_Sangam_Menu.pdf",
        signatoryTitle: "Convener, Central Mess Committee"
    },
    {
        id: "NOT-2026-004",
        refNo: "SRM/DSA/FEST/2026/104",
        title: "AARUUSH 2026 National Tech Fest Hosteller Extended Curfew",
        category: "General Circular",
        priority: "General Circular",
        issuedBy: "Directorate of Student Affairs",
        targetBlocks: "All Blocks",
        content: "Registered student coordinators and participants of Aaruush 2026 with valid festival identity credentials are granted extended curfew permissions up to 23:00 hrs through September 24-27. Gate passes must still be submitted via Hostel ERP.",
        date: "Sept 21, 2026",
        attachmentName: "Aaruush_Hostel_Curfew_Guidelines.pdf",
        signatoryTitle: "Dean, Student Welfare & Activities"
    }
];

// 3. ANONYMOUS SUGGESTIONS (AI-MODERATED)
export const INITIAL_SUGGESTIONS = [
    {
        id: "SUG-101",
        category: "Infrastructure & Study Spaces",
        title: "Request 24/7 Air-Conditioned Reading Room in Block H & I",
        content: "During mid-term and end-term exam seasons, roommates sleep at different hours. A dedicated 24x7 study common room with reliable Wi-Fi and ergonomic chairs in Block H and Block I would massively reduce room friction and boost grades.",
        authorAlias: "Block H Scholar",
        hostelBlock: "H-Block (Postgraduate & Research Block)",
        aiStatus: "Approved",
        aiAnalysis: "AI Content Filter: Clean, constructive academic enhancement proposal. No vulgar or derogatory phrases detected.",
        aiSentiment: "Constructive Academic Proposal",
        upvotes: 48,
        downvotes: 3,
        wardenResponse: "Chief Warden Note: Approved in principle. Floor 1 common hall in Block H is being converted with 40 new study pods starting next week.",
        wardenStatus: "Accepted & In Progress",
        createdAt: "2 days ago",
        comments: [
            { id: "COM-1", authorAlias: "Resident @ Block I", commentText: "Totally support this! Block I 3rd floor also has an unused seminar room that can easily fit 25 study tables.", isWarden: false, time: "Yesterday" },
            { id: "COM-2", authorAlias: "Dr. Ronald V. (Block I Warden)", commentText: "We are surveying the Block I ground floor lounge this Thursday. Students interested in study room layout planning can visit my office at 5 PM.", isWarden: true, time: "1 day ago" }
        ]
    },
    {
        id: "SUG-102",
        category: "Mess & Nutrition",
        title: "Add Fresh Fruit & High-Protein Sprouts Option for Breakfast",
        content: "The South Indian breakfast is delicious, but hostellers hitting the gym or needing light morning nutrition would really appreciate a fresh cut seasonal papaya/banana and sprouted moong dal salad counter daily.",
        authorAlias: "Fitness Enthusiast (Block G)",
        hostelBlock: "G-Block (Engineering Boys Deluxe)",
        aiStatus: "Approved",
        aiAnalysis: "AI Content Filter: Constructive dietary feedback. Passed automated decorum and safety screening.",
        aiSentiment: "Constructive Dietary Suggestion",
        upvotes: 64,
        downvotes: 5,
        wardenResponse: "Mess Committee Response: Sprouts counter initiated on trial basis across Central Dining from Monday.",
        wardenStatus: "Accepted & In Progress",
        createdAt: "3 days ago",
        comments: [
            { id: "COM-3", authorAlias: "Resident @ Block G", commentText: "Yes please! Boiled eggs and peanut butter would also be amazing.", isWarden: false, time: "2 days ago" }
        ]
    },
    {
        id: "SUG-103",
        category: "Campus Wi-Fi",
        title: "Increase Bandwidth Limit per Device during Evening 8 PM - 11 PM",
        content: "Currently the speed drops to 15 Mbps in Block I 4th floor during evening coding contest hours. Requesting dynamic load balancing so lab submissions and contest test-runs don't time out.",
        authorAlias: "Competitive Programmer",
        hostelBlock: "I-Block (International & Senior Wing)",
        aiStatus: "Approved",
        aiAnalysis: "AI Content Filter: Technical feedback on network infrastructure. Decorum verified.",
        aiSentiment: "Technical Infrastructure Suggestion",
        upvotes: 89,
        downvotes: 2,
        wardenResponse: "IT Directorate has scheduled 10 Gbps fiber backbone upgrade for Block I switches on Sept 26.",
        wardenStatus: "Under Active Review",
        createdAt: "4 days ago",
        comments: []
    },
    {
        id: "SUG-104",
        category: "Hostel Amenities",
        title: "Install Shared Steam Iron Stations in Block C & G Laundry Rooms",
        content: "Many 1st and 2nd year students cannot afford personal steam irons or are afraid of fire safety violations. Having two heavy-duty wall-mounted timed iron stations in laundry rooms would help everyone with formal placements.",
        authorAlias: "Placement Rep",
        hostelBlock: "C-Block (Boys Executive)",
        aiStatus: "Approved",
        aiAnalysis: "AI Content Filter: Constructive campus utility proposal. Passed all moderation rules.",
        aiSentiment: "Utility Improvement Suggestion",
        upvotes: 112,
        downvotes: 4,
        wardenResponse: null,
        wardenStatus: "Open for Discussion",
        createdAt: "5 days ago",
        comments: [
            { id: "COM-4", authorAlias: "Garv (Room 402)", commentText: "Huge +1 for steam irons. Especially before morning company interviews when you need a crisp shirt in 5 minutes.", isWarden: false, time: "3 days ago" }
        ]
    }
];

// 4. BLOCK-BASED PEER ITEM REQUESTS (HOSTEL SHAREHUB)
export const INITIAL_ITEM_REQUESTS = [
    {
        id: "REQ-201",
        studentName: "Garv",
        studentRoom: "402",
        hostelBlock: "C-Block",
        itemName: "Heavy Steam Iron Box",
        category: "Apparel & Grooming",
        description: "Need to press formals for Amazon campus drive interview tomorrow at 8:30 AM. Will return within 30 minutes in pristine condition!",
        urgency: "Immediate (15-30 mins)",
        status: "Help Offered",
        helperName: "Rohan Sharma",
        helperRoom: "405",
        helperBlock: "C-Block",
        helperNote: "Hey Garv, I have a Philips 1400W steam iron in room 405. Come take it whenever you want!",
        createdAt: "10 mins ago"
    },
    {
        id: "REQ-202",
        studentName: "Dev Gupta",
        studentRoom: "208",
        hostelBlock: "G-Block",
        itemName: "Cycle Air Pump (Schrader Valve)",
        category: "Sports & Fitness",
        description: "Front cycle tyre is completely flat, need to commute to Tech Park lab. Looking for quick 5-min pump borrow.",
        urgency: "Immediate (15-30 mins)",
        status: "Open",
        helperName: null,
        helperRoom: null,
        helperBlock: null,
        helperNote: null,
        createdAt: "25 mins ago"
    },
    {
        id: "REQ-203",
        studentName: "Meera Iyer",
        studentRoom: "314",
        hostelBlock: "I-Block",
        itemName: "Scientific Calculator (Casio fx-991CW or EX)",
        category: "Academic Supplies",
        description: "Forgot my scientific calculator at home in Mumbai. Have Engineering Mathematics 3 exam tomorrow morning!",
        urgency: "Within 2 Hours",
        status: "Open",
        helperName: null,
        helperRoom: null,
        helperBlock: null,
        helperNote: null,
        createdAt: "1 hour ago"
    },
    {
        id: "REQ-204",
        studentName: "Arjun Chawla",
        studentRoom: "512",
        hostelBlock: "H-Block",
        itemName: "Cat-6 LAN Ethernet Cable (3 meters or longer)",
        category: "Electronics & Networking",
        description: "Hostel Wi-Fi has high jitter tonight and I'm compiling large PyTorch model over campus GPU cluster. Need LAN cable.",
        urgency: "Today",
        status: "Fulfilled",
        helperName: "Siddharth Singh",
        helperRoom: "518",
        helperBlock: "H-Block",
        helperNote: "Given to Arjun at 7:30 PM.",
        createdAt: "3 hours ago"
    },
    {
        id: "REQ-205",
        studentName: "Kavya Reddy",
        studentRoom: "104",
        hostelBlock: "G-Block",
        itemName: "Large Travel Umbrella",
        category: "Daily Utility",
        description: "Heavy sudden monsoon rain outside and need to walk to University Pharmacy for medicine.",
        urgency: "Immediate (15-30 mins)",
        status: "Help Offered",
        helperName: "Tanvi Deshmukh",
        helperRoom: "109",
        helperBlock: "G-Block",
        helperNote: "Take my umbrella from room 109 rack!",
        createdAt: "45 mins ago"
    }
];

// 5. 2026 ACADEMIC & HOSTEL HOLIDAY CALENDAR
export const INITIAL_HOLIDAYS_2026 = [
    { id: 'HOL-01', name: 'New Year Day', date: '2026-01-01', day: 'Thursday', type: 'Gazetted Holiday', messStatus: 'Special Festive Lunch', outpassRequired: 'Regular Day Outpass' },
    { id: 'HOL-02', name: 'Pongal / Makar Sankranti', date: '2026-01-14', day: 'Wednesday', type: 'State & Cultural Festival', messStatus: 'Traditional Sweet Pongal Feast', outpassRequired: 'Festival Home Leave Allowed' },
    { id: 'HOL-03', name: 'Thiruvalluvar Day', date: '2026-01-15', day: 'Thursday', type: 'State Holiday', messStatus: 'Regular Operational Mess', outpassRequired: 'Regular Outpass' },
    { id: 'HOL-04', name: 'Republic Day', date: '2026-01-26', day: 'Monday', type: 'National Holiday', messStatus: 'Flag Hoisting Breakfast Special', outpassRequired: 'Gate Open (Curfew 21:30)' },
    { id: 'HOL-05', name: 'Maha Shivratri', date: '2026-02-15', day: 'Sunday', type: 'Religious Holiday', messStatus: 'Special Fasting / Sabudana Option', outpassRequired: 'Regular Outpass' },
    { id: 'HOL-06', name: 'Holi / Spring Festival', date: '2026-03-04', day: 'Wednesday', type: 'National Festival', messStatus: 'Gujiya & Thandai Special Counter', outpassRequired: 'Campus Celebration (No Outpass Needed)' },
    { id: 'HOL-07', name: 'Eid-ul-Fitr (Ramadan)', date: '2026-03-20', day: 'Friday', type: 'Gazetted Holiday', messStatus: 'Hyderabadi Biryani & Sheer Khurma', outpassRequired: 'Weekend Leave Permitted' },
    { id: 'HOL-08', name: 'Tamil New Year & Ambedkar Jayanti', date: '2026-04-14', day: 'Tuesday', type: 'Gazetted Holiday', messStatus: 'Payasam & Special Feast', outpassRequired: 'Regular Day Outpass' },
    { id: 'HOL-09', name: 'Good Friday', date: '2026-04-03', day: 'Friday', type: 'National Holiday', messStatus: 'Special Vegetarian & Fish Option', outpassRequired: 'Long Weekend Leave Allowed' },
    { id: 'HOL-10', name: 'Independence Day', date: '2026-08-15', day: 'Saturday', type: 'National Holiday', messStatus: 'Tiranga Halwa & Special Lunch', outpassRequired: 'Gate Open (Curfew 21:30)' },
    { id: 'HOL-11', name: 'Ganesh Chaturthi', date: '2026-09-14', day: 'Monday', type: 'Gazetted Festival', messStatus: 'Modak & Festive South Indian Lunch', outpassRequired: 'Regular Outpass' },
    { id: 'HOL-12', name: 'Gandhi Jayanti', date: '2026-10-02', day: 'Friday', type: 'National Holiday', messStatus: 'Simple Balanced Sattvic Meal', outpassRequired: 'Regular Day Outpass' },
    { id: 'HOL-13', name: 'Dussehra / Vijaya Dashami', date: '2026-10-20', day: 'Tuesday', type: 'Gazetted Holiday', messStatus: 'Special Festive Dinner', outpassRequired: 'Mid-Semester Break Permitted' },
    { id: 'HOL-14', name: 'Deepavali / Diwali', date: '2026-11-08', day: 'Sunday', type: 'Major National Festival', messStatus: 'Grand Diwali Sweet Boxes Distributed', outpassRequired: 'Home Vacation Leave' },
    { id: 'HOL-15', name: 'Christmas Day', date: '2026-12-25', day: 'Friday', type: 'National Holiday', messStatus: 'Plum Cake & Roast Dinner', outpassRequired: 'Winter Vacation Period' }
];

// 6. HOSTEL EVENT GALLERY
export const HOSTEL_EVENT_GALLERY = [
    {
        id: "EVT-01",
        title: "Milan Inter-Hostel Cultural Odyssey 2026",
        category: "Cultural Fest",
        date: "March 12-15, 2026",
        venue: "Hostel Amphitheatre & Central Quad",
        attendees: "2,400+ Residents",
        photoCount: 42,
        coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
        description: "Four days of intense inter-hostel dance battles, live rock bands, street plays, and cultural parades representing all Indian states.",
        highlights: ["Block C Western Acoustic Band Won 1st Prize", "Celebrity DJ Night with Curfew Extended to 23:30"],
        gallery: [
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"
        ]
    },
    {
        id: "EVT-02",
        title: "Hostel Premier League (HPL) Floodlight Cricket Tournament",
        category: "Sports Tournament",
        date: "Feb 20-28, 2026",
        venue: "Block G Cricket Ground & Sports Complex",
        attendees: "1,200+ Viewers",
        photoCount: 38,
        coverImage: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1200&q=80",
        description: "Annual 8-a-side leather ball cricket championship between Block I Titans, Block G Gladiators, Block C Challengers, and Block H Scholars.",
        highlights: ["Block I won thrilling final on last ball", "Man of the Series: Rohit Verma (Block G, 248 runs)"],
        gallery: [
            "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80"
        ]
    },
    {
        id: "EVT-03",
        title: "Hostel Grand Food Street 'Swad Sangam' & BBQ Night",
        category: "Mess & Dining",
        date: "January 24, 2026",
        venue: "Central Mess Lawns",
        attendees: "3,100+ Foodies",
        photoCount: 29,
        coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        description: "Regional student chefs and university catering created 30+ authentic regional food stalls featuring Hyderabadi Haleem, Rajasthani Dal Baati, and Kolkata Roll counters.",
        highlights: ["Over 4,500 live waffles served", "Special live acoustic music session by resident singers"],
        gallery: [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
        ]
    },
    {
        id: "EVT-04",
        title: "Aaruush Hostel Hackathon & AI Hardware Showcase",
        category: "Tech & Innovation",
        date: "September 22-23, 2026",
        venue: "Block H Common Innovation Lab",
        attendees: "450+ Developers",
        photoCount: 34,
        coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        description: "36-hour non-stop hackathon with unlimited coffee and pizzas, building smart IoT campus energy trackers and automated hostel logistics.",
        highlights: ["1st Prize: Smart Water Metering Project for Block G", "₹75,000 cash prizes distributed by Chief Warden"],
        gallery: [
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
        ]
    },
    {
        id: "EVT-05",
        title: "Diwali Deepotsav & 5,000 Diya Lighting Ceremony",
        category: "Festival & Celebrations",
        date: "November 11, 2025",
        venue: "All Hostel Courtyards (Blocks I, G, H, C, A, B)",
        attendees: "All Campus Residents",
        photoCount: 51,
        coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
        description: "Magical night of traditional oil lamps, rangoli competitions between blocks, green laser show, and festive sweet distribution.",
        highlights: ["Block I won Best Eco-Friendly Rangoli Design", "Special Festive Banquet Dinner in all 4 mess halls"],
        gallery: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80"
        ]
    },
    {
        id: "EVT-06",
        title: "Freshers Induction & Senior-Junior Mentorship Night",
        category: "Hostel Community",
        date: "August 18, 2026",
        venue: "Block C & G Recreation Auditoriums",
        attendees: "1,800+ Students",
        photoCount: 26,
        coverImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
        description: "Welcoming 1st year students to campus life with fun icebreakers, anti-ragging orientation, hostel rulebooks, and senior peer buddy pairings.",
        highlights: ["Campus Survival Kit Distributed", "Q&A with Chief Warden Dr. K. Sharma"],
        gallery: [
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
        ]
    }
];

