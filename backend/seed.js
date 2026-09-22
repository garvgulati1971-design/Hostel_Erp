import db, { initDbSchema } from './db.js';

initDbSchema();

console.log('🌱 Seeding Hostel ERP Database with expanded institutional dataset...');

// Clear existing tables
db.exec(`
    DELETE FROM suggestion_comments;
    DELETE FROM suggestions;
    DELETE FROM item_requests;
    DELETE FROM notices;
    DELETE FROM hostel_blocks;
    DELETE FROM sms_logs;
    DELETE FROM warnings;
    DELETE FROM outpasses;
    DELETE FROM complaints;
    DELETE FROM fees;
    DELETE FROM attendance;
    DELETE FROM announcements;
    DELETE FROM students;
`);

// 1. Insert Hostel Blocks with assigned wardens & dedicated service technicians
const insertBlock = db.prepare(`
    INSERT INTO hostel_blocks (
        id, name, code, type, total_floors, capacity, occupied, 
        warden_name, warden_phone, warden_email, warden_office, 
        service_tech_name, service_tech_role, service_tech_phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertBlock.run(
    "BLOCK_I",
    "I-Block (International & Senior Wing)",
    "Block-I",
    "Boys Hostel (Senior & International)",
    10,
    550,
    498,
    "Dr. Ronald V. Anderson",
    "+91 94440 22331",
    "warden.blocki@srmist.edu.in",
    "Block-I Ground Floor Reception Suite 102",
    "Arumugam P.",
    "Senior Block Electrician & Utility Lead",
    "+91 98401 11221"
);

insertBlock.run(
    "BLOCK_G",
    "G-Block (Engineering Boys Deluxe)",
    "Block-G",
    "Boys Hostel (Undergraduate Deluxe)",
    9,
    600,
    542,
    "Prof. S. Venkatraman",
    "+91 94440 33442",
    "warden.blockg@srmist.edu.in",
    "Block-G East Wing Admin Office",
    "Murugan K.",
    "Chief Carpenter & Infrastructure Lead",
    "+91 98402 22332"
);

insertBlock.run(
    "BLOCK_H",
    "H-Block (Postgraduate & Research Block)",
    "Block-H",
    "Boys Hostel (Postgraduate & Scholars)",
    8,
    420,
    380,
    "Dr. P. Meenakshi Sundaram",
    "+91 94440 44553",
    "warden.blockh@srmist.edu.in",
    "Block-H Academic Wing Floor 1",
    "Balamurugan S.",
    "HVAC & Thermal Plant Technician",
    "+91 98403 33443"
);

insertBlock.run(
    "BLOCK_C",
    "C-Block (Boys Executive)",
    "Block-C",
    "Boys Hostel (Executive Ensuite)",
    8,
    500,
    442,
    "Dr. K. Sharma",
    "+91 94440 12345",
    "warden.blockc@srmist.edu.in",
    "Block-C Ground Floor Chief Warden Desk",
    "Suresh V.",
    "AC & Climate Systems Specialist",
    "+91 98400 11223"
);

insertBlock.run(
    "BLOCK_A",
    "A-Block (Boys Standard)",
    "Block-A",
    "Boys Hostel (Standard Quad)",
    7,
    480,
    410,
    "Dr. T. Rajan",
    "+91 94440 55664",
    "warden.blocka@srmist.edu.in",
    "Block-A Central Wing Desk",
    "Mani G.",
    "Lead Plumber & Water Network",
    "+91 98400 55667"
);

insertBlock.run(
    "BLOCK_B",
    "B-Block (Boys Deluxe)",
    "Block-B",
    "Boys Hostel (Deluxe Double)",
    7,
    460,
    395,
    "Dr. M. Joseph",
    "+91 94440 66775",
    "warden.blockb@srmist.edu.in",
    "Block-B Resident Warden Office",
    "Ramesh T.",
    "General Electrical Maintenance",
    "+91 98400 33445"
);

// 2. Insert Core Student (Garv)
const insertStudent = db.prepare(`
    INSERT INTO students (
        id, name, email, phone, roll_no, hostel_block, room_no, bed_no, course, year, guardian_name, guardian_phone, attendance_rate, pending_fees, total_fees
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertStudent.run(
    "SRM20260402",
    "Garv",
    "garv.student@srmist.edu.in",
    "+91 98765 43210",
    "RA2311003010452",
    "C-Block (Boys Executive)",
    "402",
    "B",
    "B.Tech Computer Science & Engineering",
    "3rd Year (Semester 6)",
    "Rajesh Kumar",
    "+91 98220 99887",
    94.2,
    30000,
    367000
);

// 3. Insert 60+ Simulated Students across Block I, Block G, Block H, Block C, Block A, Block B
const firstNames = ["Aarav", "Priya", "Rohan", "Ananya", "Dev", "Isha", "Karan", "Sneha", "Vikram", "Neha", "Aditya", "Meera", "Siddharth", "Pooja", "Arjun", "Kavya", "Rahul", "Tanvi", "Yash", "Riya"];
const lastNames = ["Sharma", "Patel", "Verma", "Sundaram", "Gupta", "Reddy", "Nair", "Joshi", "Singh", "Kumar", "Iyer", "Chawla", "Deshmukh", "Mehta", "Bhat"];
const courses = ["B.Tech CSE", "B.Tech ECE", "B.Tech Mech", "B.Tech AI & ML", "B.Tech IT", "M.Tech Data Science", "PhD Computer Science"];
const allBlocks = [
    "I-Block (International & Senior Wing)",
    "G-Block (Engineering Boys Deluxe)",
    "H-Block (Postgraduate & Research Block)",
    "C-Block (Boys Executive)",
    "A-Block (Boys Standard)",
    "B-Block (Boys Deluxe)"
];

for (let i = 1; i <= 60; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const name = `${fn} ${ln}`;
    const rollNo = `RA2311003010${(500 + i).toString().padStart(3, '0')}`;
    const block = allBlocks[i % allBlocks.length];
    const room = (100 + (i % 40)).toString();
    const course = courses[i % courses.length];
    const attendance = parseFloat((72 + (i * 1.3) % 26).toFixed(1));
    const pendingFees = (i % 4 === 0) ? 30000 : 0;

    insertStudent.run(
        `SRM2026${(500 + i)}`,
        name,
        `${fn.toLowerCase()}.${ln.toLowerCase()}@srmist.edu.in`,
        `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
        rollNo,
        block,
        room,
        i % 2 === 0 ? "A" : "B",
        course,
        i > 45 ? "4th Year (Semester 8)" : "3rd Year (Semester 6)",
        `Guardian of ${fn}`,
        `+91 94${Math.floor(10000000 + Math.random() * 90000000)}`,
        attendance,
        pendingFees,
        367000
    );
}

// 4. Insert Official Circulars & Notices
const insertNotice = db.prepare(`
    INSERT INTO notices (id, ref_no, title, category, priority, issued_by, target_blocks, content, date, attachment_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertNotice.run(
    "NOT-2026-001",
    "SRM/CW/CIR/2026/089",
    "Mandatory Biometric ID & RFID Door Access Synchronization",
    "Chief Warden Circular",
    "Urgent Alert",
    "Dr. K. Sharma (Chief Warden)",
    "All Blocks (I, G, H, C, A, B)",
    "All resident students of Blocks I, G, H, C, A, and B must re-sync their campus RFID Smart Cards at the Block C Ground Floor kiosk by September 25, 2026. Unsynced cards will fail turnstile gate access after 21:00 hrs.",
    "Sept 18, 2026",
    "Notice_RFID_Sync_Guidelines_2026.pdf"
);

insertNotice.run(
    "NOT-2026-002",
    "SRM/ENG/MAINT/2026/041",
    "Block I & G High-Efficiency Heat Pump Maintenance Schedule",
    "Maintenance Notice",
    "High Priority",
    "Executive Engineer (Hostel Infrastructure)",
    "Block I & G",
    "Annual de-scaling and preventive overhaul of centralized heat pumps in Block I and Block G will occur on Saturday from 10:00 AM to 02:00 PM. Hot water supply will be paused during these maintenance hours.",
    "Sept 19, 2026",
    "Heat_Pump_Maintenance_Block_I_G.pdf"
);

insertNotice.run(
    "NOT-2026-003",
    "SRM/MESS/COM/2026/012",
    "Hostel Grand Mess Fest & Regional Food Street",
    "Mess Notice",
    "General Circular",
    "Dr. R. Swaminathan (Mess Warden)",
    "All Blocks",
    "The Annual Hostel Food Fest 'Swad Sangam' is scheduled for Friday evening at the Central Quadrangle. Special dessert counters, Chettinad, Punjabi, and Continental live counters will be available. Mess coupons waived for hostel residents.",
    "Sept 20, 2026",
    "Food_Fest_Swad_Sangam_Menu.pdf"
);

insertNotice.run(
    "NOT-2026-004",
    "SRM/DSA/FEST/2026/104",
    "AARUUSH 2026 National Tech Fest Hosteller Extended Curfew",
    "General Circular",
    "General Circular",
    "Directorate of Student Affairs",
    "All Blocks",
    "Registered student coordinators and participants of Aaruush 2026 with valid festival identity credentials are granted extended curfew permissions up to 23:00 hrs through September 24-27. Gate passes must still be submitted via Hostel ERP.",
    "Sept 21, 2026",
    "Aaruush_Hostel_Curfew_Guidelines.pdf"
);

// 5. Insert Anonymous Suggestions (AI Moderated)
const insertSuggestion = db.prepare(`
    INSERT INTO suggestions (
        id, category, title, content, author_alias, hostel_block, 
        ai_status, ai_analysis, ai_sentiment, upvotes, downvotes, warden_response, warden_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertSuggestion.run(
    "SUG-101",
    "Infrastructure & Study Spaces",
    "Request 24/7 Air-Conditioned Reading Room in Block H & I",
    "During mid-term and end-term exam seasons, roommates sleep at different hours. A dedicated 24x7 study common room with reliable Wi-Fi and ergonomic chairs in Block H and Block I would massively reduce room friction and boost grades.",
    "Block H Scholar",
    "H-Block (Postgraduate & Research Block)",
    "Approved",
    "AI Content Filter: Clean, constructive academic enhancement proposal. No vulgar or derogatory phrases detected.",
    "Constructive Academic Proposal",
    48,
    3,
    "Chief Warden Note: Approved in principle. Floor 1 common hall in Block H is being converted with 40 new study pods starting next week.",
    "Accepted & In Progress"
);

insertSuggestion.run(
    "SUG-102",
    "Mess & Nutrition",
    "Add Fresh Fruit & High-Protein Sprouts Option for Breakfast",
    "The South Indian breakfast is delicious, but hostellers hitting the gym or needing light morning nutrition would really appreciate a fresh cut seasonal papaya/banana and sprouted moong dal salad counter daily.",
    "Fitness Enthusiast (Block G)",
    "G-Block (Engineering Boys Deluxe)",
    "Approved",
    "AI Content Filter: Constructive dietary feedback. Passed automated decorum and safety screening.",
    "Constructive Dietary Suggestion",
    64,
    5,
    "Mess Committee Response: Sprouts counter initiated on trial basis across Central Dining from Monday.",
    "Accepted & In Progress"
);

insertSuggestion.run(
    "SUG-103",
    "Campus Wi-Fi",
    "Increase Bandwidth Limit per Device during Evening 8 PM - 11 PM",
    "Currently the speed drops to 15 Mbps in Block I 4th floor during evening coding contest hours. Requesting dynamic load balancing so lab submissions and contest test-runs don't time out.",
    "Competitive Programmer",
    "I-Block (International & Senior Wing)",
    "Approved",
    "AI Content Filter: Technical feedback on network infrastructure. Decorum verified.",
    "Technical Infrastructure Suggestion",
    89,
    2,
    "IT Directorate has scheduled 10 Gbps fiber backbone upgrade for Block I switches on Sept 26.",
    "Under Active Review"
);

insertSuggestion.run(
    "SUG-104",
    "Hostel Amenities",
    "Install Shared Steam Iron Stations in Block C & G Laundry Rooms",
    "Many 1st and 2nd year students cannot afford personal steam irons or are afraid of fire safety violations. Having two heavy-duty wall-mounted timed iron stations in laundry rooms would help everyone with formal placements.",
    "Placement Rep",
    "C-Block (Boys Executive)",
    "Approved",
    "AI Content Filter: Constructive campus utility proposal. Passed all moderation rules.",
    "Utility Improvement Suggestion",
    112,
    4,
    null,
    "Open for Discussion"
);

// 6. Insert Public Opinions / Comments for Suggestions
const insertComment = db.prepare(`
    INSERT INTO suggestion_comments (id, suggestion_id, author_alias, comment_text, is_warden)
    VALUES (?, ?, ?, ?, ?)
`);

insertComment.run("COM-1", "SUG-101", "Resident @ Block I", "Totally support this! Block I 3rd floor also has an unused seminar room that can easily fit 25 study tables.", 0);
insertComment.run("COM-2", "SUG-101", "Dr. Ronald V. (Block I Warden)", "We are surveying the Block I ground floor lounge this Thursday. Students interested in study room layout planning can visit my office at 5 PM.", 1);
insertComment.run("COM-3", "SUG-102", "Resident @ Block G", "Yes please! Boiled eggs and peanut butter would also be amazing.", 0);
insertComment.run("COM-4", "SUG-104", "Garv (Room 402)", "Huge +1 for steam irons. Especially before morning company interviews when you need a crisp shirt in 5 minutes.", 0);

// 7. Insert Block-Based Peer Item Requests (Hostel ShareHub)
const insertItemReq = db.prepare(`
    INSERT INTO item_requests (
        id, student_id, student_name, student_room, hostel_block, 
        item_name, category, description, urgency, status, 
        helper_name, helper_room, helper_block, helper_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertItemReq.run(
    "REQ-201",
    "SRM20260402",
    "Garv",
    "402",
    "C-Block",
    "Heavy Steam Iron Box",
    "Apparel & Grooming",
    "Need to press formals for Amazon campus drive interview tomorrow at 8:30 AM. Will return within 30 minutes in pristine condition!",
    "Immediate (15-30 mins)",
    "Help Offered",
    "Rohan Sharma",
    "405",
    "C-Block",
    "Hey Garv, I have a Philips 1400W steam iron in room 405. Come take it whenever you want!"
);

insertItemReq.run(
    "REQ-202",
    "SRM2026505",
    "Dev Gupta",
    "208",
    "G-Block",
    "Cycle Air Pump (Schrader Valve)",
    "Sports & Fitness",
    "Front cycle tyre is completely flat, need to commute to Tech Park lab. Looking for quick 5-min pump borrow.",
    "Immediate (15-30 mins)",
    "Open",
    null,
    null,
    null,
    null
);

insertItemReq.run(
    "REQ-203",
    "SRM2026512",
    "Meera Iyer",
    "314",
    "I-Block",
    "Scientific Calculator (Casio fx-991CW or EX)",
    "Academic Supplies",
    "Forgot my scientific calculator at home in Mumbai. Have Engineering Mathematics 3 exam tomorrow morning!",
    "Within 2 Hours",
    "Open",
    null,
    null,
    null,
    null
);

insertItemReq.run(
    "REQ-204",
    "SRM2026518",
    "Arjun Chawla",
    "512",
    "H-Block",
    "Cat-6 LAN Ethernet Cable (3 meters or longer)",
    "Electronics & Networking",
    "Hostel Wi-Fi has high jitter tonight and I'm compiling large PyTorch model over campus GPU cluster. Need LAN cable.",
    "Today",
    "Fulfilled",
    "Siddharth Singh",
    "518",
    "H-Block",
    "Given to Arjun at 7:30 PM."
);

insertItemReq.run(
    "REQ-205",
    "SRM2026520",
    "Kavya Reddy",
    "104",
    "G-Block",
    "Large Travel Umbrella",
    "Daily Utility",
    "Heavy sudden monsoon rain outside and need to walk to University Pharmacy for medicine.",
    "Immediate (15-30 mins)",
    "Help Offered",
    "Tanvi Deshmukh",
    "109",
    "G-Block",
    "Take my umbrella from room 109 rack!"
);

// 8. Insert Fees
const insertFee = db.prepare(`
    INSERT INTO fees (id, student_id, fee_name, amount, status, due_date, paid_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertFee.run("FEE-1", "SRM20260402", "Hostel Room Rent (2-Sharing AC)", 155000, "Paid", "2026-08-15", "2026-08-10");
insertFee.run("FEE-2", "SRM20260402", "Mess & Catering Charges (Annual)", 120000, "Paid", "2026-08-15", "2026-08-12");
insertFee.run("FEE-3", "SRM20260402", "Amenities & High-Speed Wi-Fi", 25000, "Paid", "2026-08-15", "2026-08-14");
insertFee.run("FEE-4", "SRM20260402", "Security & Caution Deposit (Refundable)", 15000, "Paid", "2026-08-15", "2026-08-14");
insertFee.run("FEE-5", "SRM20260402", "Laundry & Housekeeping Services", 22000, "Paid", "2026-08-15", "2026-08-14");
insertFee.run("FEE-6", "SRM20260402", "Semester 6 Gym & Sports Complex", 30000, "Pending", "2026-09-15", null);

// 9. Insert Complaints
const insertComplaint = db.prepare(`
    INSERT INTO complaints (id, student_id, student_name, title, category, description, room_no, priority, status, assigned_tech, tech_phone, estimated_hours, resolution_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertComplaint.run(
    "TKT-4401",
    "SRM20260402",
    "Garv",
    "AC cooling reduced & minor water dripping",
    "HVAC / Air Conditioning",
    "Room 402 AC split unit filter needs cleaning and coolant check. Dripping into bucket.",
    "402",
    "Medium",
    "In Progress",
    "Suresh V. (AC Tech - Block C)",
    "+91 98400 11223",
    4,
    "Technician inspected filter; coolant refill scheduled."
);

insertComplaint.run(
    "TKT-4389",
    "SRM20260402",
    "Garv",
    "Study Table LED Tube Flickering",
    "Electrical",
    "Bed B study lamp light is flickering continuously.",
    "402",
    "Low",
    "Resolved",
    "Ramesh T. (Electrician)",
    "+91 98400 33445",
    1,
    "Replaced choke and starter light tube."
);

insertComplaint.run(
    "TKT-4405",
    "SRM2026501",
    "Aarav Patel",
    "Bathroom Tap Leaking Continuously",
    "Plumbing",
    "Main washroom faucet tap washer worn out, water flowing continuously.",
    "101",
    "High",
    "Pending",
    "Mani G. (Plumbing Lead)",
    "+91 98400 55667",
    2,
    null
);

insertComplaint.run(
    "TKT-4412",
    "SRM2026504",
    "Ananya Sundaram",
    "Wi-Fi Access Point Frequent Disconnection",
    "WiFi & Networking",
    "Block C 3rd floor router drops signal every 15 minutes during evening hours.",
    "305",
    "High",
    "In Progress",
    "Karthik (IT Admin)",
    "+91 98400 77889",
    3,
    "Firmware update in progress."
);

// 10. Insert Outpasses
const insertOutpass = db.prepare(`
    INSERT INTO outpasses (id, student_id, student_name, type, destination, reason, out_date, expected_in_date, status, qr_code, approved_by, ai_risk_score, ai_risk_level, ai_risk_reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertOutpass.run(
    "OTP-2026-881",
    "SRM20260402",
    "Garv",
    "Day Outpass",
    "Forum Vijaya Mall, Vadapalani",
    "Academic project supply purchase & team gathering",
    "2026-09-03T14:00",
    "2026-09-03T20:30",
    "Approved",
    "SRM-PASS-GARV-881-VALID",
    "Dr. K. Sharma (Warden)",
    12,
    "Low Risk",
    "Verified daytime travel duration."
);

insertOutpass.run(
    "OTP-2026-904",
    "SRM2026501",
    "Aarav Patel",
    "Weekend Night Leave",
    "ECR Beach Resort Party",
    "Friend's birthday night out",
    "2026-09-05T19:00",
    "2026-09-06T06:00",
    "Pending Warden Review",
    "SRM-PASS-AARAV-904-PENDING",
    null,
    78,
    "High Risk",
    "Late night return destination flagged; low hostel attendance record (74%)."
);

// 11. Insert Warnings
const insertWarning = db.prepare(`
    INSERT INTO warnings (id, student_id, student_name, roll_no, warning_type, severity, description, issued_by, action_taken)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertWarning.run(
    "WRN-2026-101",
    "SRM2026501",
    "Aarav Patel",
    "RA2311003010501",
    "Curfew Violation",
    "Official Reprimand",
    "Returned to hostel at 11:45 PM without approved night outpass on Sept 1, 2026.",
    "Dr. K. Sharma (Chief Warden)",
    "Parents notified via simulated SMS. Gate entry logged."
);

// 12. Insert SMS Logs
const insertSms = db.prepare(`
    INSERT INTO sms_logs (id, recipient_phone, recipient_name, role, trigger_event, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertSms.run(
    "SMS-9901",
    "+91 98400 11223",
    "Suresh (AC Tech)",
    "Service Tech",
    "New Ticket Assigned",
    "HOSTEL ERP TICKET ASSIGNED: Room 402 AC cooling reduced & dripping. Student: Garv (+91 98765 43210). Priority: Medium.",
    "Delivered (Simulated)"
);

// 13. Insert Announcements (Legacy compatibility)
const insertAnn = db.prepare(`
    INSERT INTO announcements (title, category, priority, content, date)
    VALUES (?, ?, ?, ?, ?)
`);

insertAnn.run(
    "Scheduled High-Voltage Transformer Maintenance",
    "Utility Alert",
    "High",
    "Backup generators will operate for Block C & D elevators and study halls. Heavy AC usage is restricted during peak hours.",
    "Sept 4, 2026"
);

insertAnn.run(
    "Annual SRM Tech Fest 'AARUUSH' Outpass Guidelines",
    "Event Notice",
    "Medium",
    "Extended curfew to 10:30 PM granted for registered festival participants with valid digital ID badges.",
    "Sept 2, 2026"
);

console.log('✅ Database successfully seeded with Blocks I, G, H, C, A, B, 60+ students, notices, suggestions, and item requests!');

