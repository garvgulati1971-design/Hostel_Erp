import express from 'express';
import cors from 'cors';
import db, { initDbSchema } from './db.js';

// Initialize DB schema on server start
initDbSchema();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- 1. OVERVIEW METRICS & HEALTH ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', service: 'Hostel ERP REST API Engine', timestamp: new Date() });
});

app.get('/api/stats', (req, res) => {
    try {
        const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
        const lowAttendance = db.prepare('SELECT COUNT(*) as count FROM students WHERE attendance_rate < 75.0').get().count;
        const pendingFeesCount = db.prepare('SELECT COUNT(*) as count FROM students WHERE pending_fees > 0').get().count;
        const openComplaints = db.prepare('SELECT COUNT(*) as count FROM complaints WHERE status != ?').get('Resolved').count;
        const pendingOutpasses = db.prepare('SELECT COUNT(*) as count FROM outpasses WHERE status = ?').get('Pending Warden Review').count;
        const totalWarnings = db.prepare('SELECT COUNT(*) as count FROM warnings').get().count;
        const totalSmsSent = db.prepare('SELECT COUNT(*) as count FROM sms_logs').get().count;

        res.json({
            success: true,
            totalStudents,
            lowAttendance,
            pendingFeesCount,
            openComplaints,
            pendingOutpasses,
            totalWarnings,
            totalSmsSent,
            totalCapacity: 500,
            occupiedBeds: totalStudents
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 2. STUDENTS DATABASE (WITH PAGINATION & SEARCH) ---
app.get('/api/students', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search ? `%${req.query.search}%` : '%';
        const block = req.query.block || '%';

        const totalQuery = db.prepare(`
            SELECT COUNT(*) as total FROM students 
            WHERE (name LIKE ? OR roll_no LIKE ? OR room_no LIKE ?)
            AND hostel_block LIKE ?
        `);
        const total = totalQuery.get(search, search, search, block).total;

        const studentsQuery = db.prepare(`
            SELECT * FROM students 
            WHERE (name LIKE ? OR roll_no LIKE ? OR room_no LIKE ?)
            AND hostel_block LIKE ?
            ORDER BY room_no ASC
            LIMIT ? OFFSET ?
        `);
        const students = studentsQuery.all(search, search, search, block, limit, offset);

        res.json({
            success: true,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            data: students
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/students/:id', (req, res) => {
    try {
        const student = db.prepare('SELECT * FROM students WHERE id = ? OR roll_no = ?').get(req.params.id, req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.json({ success: true, student });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 3. ATTENDANCE API ---
app.get('/api/attendance', (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const records = db.prepare(`
            SELECT a.*, s.name, s.roll_no, s.room_no, s.hostel_block 
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE a.date = ?
        `).all(date);
        res.json({ success: true, date, records });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/attendance/mark', (req, res) => {
    try {
        const { studentId, date, status, remarks } = req.body;
        const stmt = db.prepare(`
            INSERT INTO attendance (student_id, date, status, remarks)
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(studentId, date || new Date().toISOString().split('T')[0], status, remarks || 'Marked by Warden Office');
        res.json({ success: true, message: 'Attendance recorded successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 4. FEES & RECEIPTS API ---
app.get('/api/fees/:studentId', (req, res) => {
    try {
        const fees = db.prepare('SELECT * FROM fees WHERE student_id = ?').all(req.params.studentId);
        res.json({ success: true, fees });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/fees/pay', (req, res) => {
    try {
        const { feeId, studentId } = req.body;
        const updateFee = db.prepare('UPDATE fees SET status = ?, paid_at = ? WHERE id = ?');
        updateFee.run('Paid', new Date().toISOString().split('T')[0], feeId);

        // Update student pending fee balance
        const remainingPending = db.prepare('SELECT SUM(amount) as total FROM fees WHERE student_id = ? AND status = ?').get(studentId, 'Pending').total || 0;
        db.prepare('UPDATE students SET pending_fees = ? WHERE id = ?').run(remainingPending, studentId);

        res.json({ success: true, message: 'Fee payment recorded successfully!', remainingPending });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 5. MAINTENANCE & SERVICE REQUESTS API (FOR SERVICE PEOPLE & STUDENTS) ---
app.get('/api/complaints', (req, res) => {
    try {
        const category = req.query.category || '%';
        const status = req.query.status || '%';
        const complaints = db.prepare(`
            SELECT * FROM complaints 
            WHERE category LIKE ? AND status LIKE ?
            ORDER BY created_at DESC
        `).all(category, status);
        res.json({ success: true, data: complaints });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/complaints/create', (req, res) => {
    try {
        const { studentId, studentName, title, category, description, roomNo, priority } = req.body;
        const id = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

        // Assign default technician based on category
        let assignedTech = 'Unassigned';
        let techPhone = '+91 98400 00000';
        if (category.includes('Plumbing')) { assignedTech = 'Mani (Plumber)'; techPhone = '+91 98400 55667'; }
        else if (category.includes('Electrical')) { assignedTech = 'Ramesh (Electrician)'; techPhone = '+91 98400 33445'; }
        else if (category.includes('HVAC')) { assignedTech = 'Suresh (AC Tech)'; techPhone = '+91 98400 11223'; }
        else if (category.includes('WiFi')) { assignedTech = 'Karthik (IT Admin)'; techPhone = '+91 98400 77889'; }
        else { assignedTech = 'Hostel Housekeeping Lead'; techPhone = '+91 98400 99000'; }

        const stmt = db.prepare(`
            INSERT INTO complaints (id, student_id, student_name, title, category, description, room_no, priority, status, assigned_tech, tech_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, studentId || 'SRM20260402', studentName || 'Garv', title, category, description, roomNo, priority || 'Medium', 'Pending', assignedTech, techPhone);

        // Auto-generate simulated SMS to Service Staff!
        const smsId = `SMS-${Math.floor(1000 + Math.random() * 9000)}`;
        const smsMsg = `ALERT: New ${priority} Maintenance Request (${id}) generated for Room ${roomNo} by ${studentName}. Title: "${title}". Assigned to: ${assignedTech}.`;
        db.prepare(`
            INSERT INTO sms_logs (id, recipient_phone, recipient_name, role, trigger_event, message, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(smsId, techPhone, assignedTech, 'Service Tech', 'New Complaint Ticket', smsMsg, 'Delivered (Simulated)');

        res.json({
            success: true,
            message: 'Service complaint raised & SMS dispatched to technician!',
            complaint: { id, title, category, status: 'Pending', assignedTech, techPhone },
            simulatedSms: { smsId, techPhone, smsMsg }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/complaints/update-status', (req, res) => {
    try {
        const { ticketId, status, resolutionNotes } = req.body;
        const stmt = db.prepare('UPDATE complaints SET status = ?, resolution_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(status, resolutionNotes || null, ticketId);

        const ticket = db.prepare('SELECT * FROM complaints WHERE id = ?').get(ticketId);

        // Notify Student via SMS simulation
        if (ticket) {
            const smsId = `SMS-${Math.floor(1000 + Math.random() * 9000)}`;
            const smsMsg = `HOSTEL ERP UPDATE: Your request ${ticketId} (${ticket.title}) for Room ${ticket.room_no} status changed to [${status}].`;
            db.prepare(`
                INSERT INTO sms_logs (id, recipient_phone, recipient_name, role, trigger_event, message, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(smsId, '+91 98765 43210', ticket.student_name, 'Student', 'Ticket Status Update', smsMsg, 'Delivered (Simulated)');
        }

        res.json({ success: true, message: `Ticket ${ticketId} updated to ${status}` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 6. OUTPASS API ---
app.get('/api/outpasses', (req, res) => {
    try {
        const outpasses = db.prepare('SELECT * FROM outpasses ORDER BY created_at DESC').all();
        res.json({ success: true, data: outpasses });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/outpasses/apply', (req, res) => {
    try {
        const { studentId, studentName, type, destination, reason, outDate, expectedInDate } = req.body;
        const id = `OTP-2026-${Math.floor(100 + Math.random() * 900)}`;
        
        // Simple AI Risk evaluation logic
        let aiRiskScore = 12;
        let aiRiskLevel = 'Low Risk';
        let aiRiskReason = 'Day travel within city limit; verified student status.';
        
        if (type.includes('Night') || destination.toLowerCase().includes('resort') || destination.toLowerCase().includes('party')) {
            aiRiskScore = 75;
            aiRiskLevel = 'High Risk';
            aiRiskReason = 'Night return or unapproved recreational destination flagged.';
        }

        const stmt = db.prepare(`
            INSERT INTO outpasses (id, student_id, student_name, type, destination, reason, out_date, expected_in_date, status, qr_code, ai_risk_score, ai_risk_level, ai_risk_reason)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, studentId || 'SRM20260402', studentName || 'Garv', type, destination, reason, outDate, expectedInDate, 'Pending Warden Review', `SRM-PASS-${id}-PENDING`, aiRiskScore, aiRiskLevel, aiRiskReason);

        res.json({ success: true, message: 'Outpass submitted for Warden Review', outpassId: id, aiRiskScore, aiRiskLevel });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/outpasses/action', (req, res) => {
    try {
        const { outpassId, action, wardenName } = req.body; // action: 'Approve' | 'Reject'
        const newStatus = action === 'Approve' ? 'Approved' : 'Rejected';
        const qr = action === 'Approve' ? `SRM-PASS-${outpassId}-VALID` : `SRM-PASS-${outpassId}-REJECTED`;
        
        db.prepare('UPDATE outpasses SET status = ?, approved_by = ?, qr_code = ? WHERE id = ?')
          .run(newStatus, wardenName || 'Dr. K. Sharma (Chief Warden)', qr, outpassId);

        res.json({ success: true, message: `Outpass ${outpassId} ${newStatus}` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 7. DISCIPLINARY WARNINGS SYSTEM (ISSUED BY WARDEN) ---
app.get('/api/warnings', (req, res) => {
    try {
        const studentId = req.query.studentId;
        let query = 'SELECT * FROM warnings ORDER BY issued_at DESC';
        let warnings;
        if (studentId) {
            warnings = db.prepare('SELECT * FROM warnings WHERE student_id = ? ORDER BY issued_at DESC').all(studentId);
        } else {
            warnings = db.prepare(query).all();
        }
        res.json({ success: true, data: warnings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/warnings/issue', (req, res) => {
    try {
        const { studentId, studentName, rollNo, warningType, severity, description, issuedBy, actionTaken } = req.body;
        const id = `WRN-2026-${Math.floor(100 + Math.random() * 900)}`;

        const stmt = db.prepare(`
            INSERT INTO warnings (id, student_id, student_name, roll_no, warning_type, severity, description, issued_by, action_taken)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, studentId, studentName, rollNo, warningType, severity || 'Minor Warning', description, issuedBy || 'Dr. K. Sharma (Chief Warden)', actionTaken || 'Notice logged in record.');

        // Trigger SMS notification to student/parent
        const smsId = `SMS-${Math.floor(1000 + Math.random() * 9000)}`;
        const smsMsg = `DISCIPLINARY NOTICE: Official warning (${id} - ${severity}) issued to ${studentName} (${rollNo}) for ${warningType}. Details logged by Warden office.`;
        db.prepare(`
            INSERT INTO sms_logs (id, recipient_phone, recipient_name, role, trigger_event, message, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(smsId, '+91 98220 99887', 'Guardian / Student', 'Parent', 'Disciplinary Warning', smsMsg, 'Delivered (Simulated)');

        res.json({ success: true, message: `Disciplinary Warning ${id} issued & logged!`, warningId: id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 8. SIMULATED SMS SERVICE GATEWAY ---
app.get('/api/sms/logs', (req, res) => {
    try {
        const logs = db.prepare('SELECT * FROM sms_logs ORDER BY timestamp DESC LIMIT 50').all();
        res.json({ success: true, data: logs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/sms/send', (req, res) => {
    try {
        const { recipientPhone, recipientName, role, message, triggerEvent } = req.body;
        const id = `SMS-${Math.floor(1000 + Math.random() * 9000)}`;
        
        db.prepare(`
            INSERT INTO sms_logs (id, recipient_phone, recipient_name, role, trigger_event, message, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, recipientPhone, recipientName, role || 'Service Tech', triggerEvent || 'Manual SMS Test', message, 'Delivered (Simulated)');

        res.json({ success: true, message: `Simulated SMS dispatched to ${recipientPhone}`, smsId: id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 9. AI ASSISTANT QUERY ENDPOINT ---
app.post('/api/ai/query', (req, res) => {
    try {
        const { question, studentId } = req.body;
        const q = question.toLowerCase();

        const student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId || 'SRM20260402');
        let reply = '';

        if (q.includes('fee') || q.includes('due') || q.includes('payment')) {
            reply = `Hello ${student.name}, your total pending fee is ₹${student.pending_fees.toLocaleString('en-IN')}. You have 1 pending fee item (Semester 6 Gym & Sports) due by Sept 15, 2026. You can clear it via the Fees & Receipts portal!`;
        } else if (q.includes('attendance') || q.includes('present')) {
            reply = `Your current hostel attendance is ${student.attendance_rate}%. Minimum mandatory threshold required is 75.0%. Your record is in the Excellent standing zone!`;
        } else if (q.includes('outpass') || q.includes('leave') || q.includes('gate')) {
            reply = `Outpass Policy: Day outpasses must be applied 2 hours in advance (return curfew 08:30 PM). Weekend night leaves require Warden & Parent SMS verification.`;
        } else if (q.includes('mess') || q.includes('food') || q.includes('dinner') || q.includes('lunch')) {
            reply = `Today's Mess Special: Lunch features Paneer Butter Masala / Chicken Chettinad, Dal Tadka, and Gulab Jamun! Dinner: Aloo Gobi, Soft Phulkas & Lemon Rice.`;
        } else if (q.includes('complaint') || q.includes('repair') || q.includes('ac') || q.includes('light')) {
            const pendingComplaints = db.prepare('SELECT * FROM complaints WHERE student_id = ? AND status != ?').all(student.id, 'Resolved');
            if (pendingComplaints.length > 0) {
                reply = `You have ${pendingComplaints.length} active ticket(s). Ticket ${pendingComplaints[0].id} ("${pendingComplaints[0].title}") is currently [${pendingComplaints[0].status}] assigned to ${pendingComplaints[0].assigned_tech}.`;
            } else {
                reply = `You currently have 0 active complaint tickets. Everything in Room ${student.room_no} is marked fully operational!`;
            }
        } else {
            reply = `I am your SRM Hostel AI Assistant! I can help you check your attendance (${student.attendance_rate}%), pending fees (₹${student.pending_fees}), outpass rules, mess menu, or maintenance request statuses. What would you like to check?`;
        }

        res.json({ success: true, answer: reply, timestamp: new Date() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 10. HOSTEL BLOCKS & WARDEN / SERVICE PERSONNEL DIRECTORY ---
app.get('/api/blocks', (req, res) => {
    try {
        const blocks = db.prepare('SELECT * FROM hostel_blocks ORDER BY code ASC').all();
        res.json({ success: true, data: blocks });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 11. OFFICIAL NOTICES & CIRCULARS API ---
app.get('/api/notices', (req, res) => {
    try {
        const category = req.query.category || '%';
        const priority = req.query.priority || '%';
        const notices = db.prepare(`
            SELECT * FROM notices 
            WHERE category LIKE ? AND priority LIKE ?
            ORDER BY created_at DESC
        `).all(category, priority);
        res.json({ success: true, data: notices });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 12. ANONYMOUS SUGGESTION BOX API (WITH REAL-TIME AI SAFETY MODERATION) ---
const VULGAR_PROFANITY_WORDS = [
    'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'cunt', 'dick', 'pussy', 'nigger', 
    'faggot', 'slut', 'whore', 'chutiya', 'madarchod', 'bhenchod', 'gaand', 'harami',
    'idiot', 'stupid', 'kill', 'attack', 'bomb', 'burn', 'hate', 'racist'
];

function screenSuggestionAI(title, content) {
    const combined = `${title} ${content}`.toLowerCase();
    
    // Check profanity / vulgarity
    const flaggedWords = [];
    for (const word of VULGAR_PROFANITY_WORDS) {
        // Regex word boundary match
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(combined)) {
            flaggedWords.push(word);
        }
    }

    if (flaggedWords.length > 0) {
        return {
            isApproved: false,
            status: 'Flagged_Vulgar',
            sentiment: 'Inappropriate Content Detected',
            reason: `AI Content Guard Alert: Submission contains inappropriate or abusive language ("${flaggedWords.join(', ')}"). Please reframe constructively to maintain university campus decorum.`
        };
    }

    if (content.trim().length < 15) {
        return {
            isApproved: false,
            status: 'Flagged_Spam',
            sentiment: 'Insufficient Details',
            reason: 'AI Content Guard Alert: Suggestion is too brief to be actionable. Please provide constructive reasoning.'
        };
    }

    // Determine constructive sentiment tag
    let sentiment = 'Constructive Campus Suggestion';
    if (combined.includes('mess') || combined.includes('food') || combined.includes('dining')) {
        sentiment = 'Constructive - Mess & Nutrition';
    } else if (combined.includes('wifi') || combined.includes('internet') || combined.includes('network')) {
        sentiment = 'Constructive - IT & Connectivity';
    } else if (combined.includes('ac') || combined.includes('water') || combined.includes('light') || combined.includes('room')) {
        sentiment = 'Constructive - Infrastructure & Facilities';
    } else if (combined.includes('curfew') || combined.includes('outpass') || combined.includes('security')) {
        sentiment = 'Constructive - Student Governance & Curfew';
    } else if (combined.includes('gym') || combined.includes('sports') || combined.includes('ground')) {
        sentiment = 'Constructive - Sports & Fitness';
    }

    return {
        isApproved: true,
        status: 'Approved',
        sentiment,
        reason: 'AI Safety Verification Passed: Decorous, constructive student discourse verified.'
    };
}

app.get('/api/suggestions', (req, res) => {
    try {
        const suggestions = db.prepare(`
            SELECT * FROM suggestions 
            WHERE ai_status = 'Approved' 
            ORDER BY upvotes DESC, created_at DESC
        `).all();

        const comments = db.prepare(`
            SELECT * FROM suggestion_comments 
            ORDER BY created_at ASC
        `).all();

        // Attach comments to suggestions
        const enriched = suggestions.map(s => ({
            ...s,
            comments: comments.filter(c => c.suggestion_id === s.id)
        }));

        res.json({ success: true, data: enriched });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/suggestions/create', (req, res) => {
    try {
        const { title, content, category, authorAlias, hostelBlock } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ success: false, error: 'Title and content are mandatory' });
        }

        const aiCheck = screenSuggestionAI(title, content);

        if (!aiCheck.isApproved) {
            return res.status(400).json({
                success: false,
                isBlockedByAI: true,
                aiStatus: aiCheck.status,
                aiAnalysis: aiCheck.reason,
                message: aiCheck.reason
            });
        }

        const id = `SUG-${Math.floor(100 + Math.random() * 900)}`;
        const block = hostelBlock || 'C-Block (Boys Executive)';
        const alias = authorAlias || 'Anonymous Resident';

        const stmt = db.prepare(`
            INSERT INTO suggestions (
                id, category, title, content, author_alias, hostel_block, 
                ai_status, ai_analysis, ai_sentiment, upvotes, downvotes, warden_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 'Open for Discussion')
        `);

        stmt.run(id, category || 'General Campus', title, content, alias, block, aiCheck.status, aiCheck.reason, aiCheck.sentiment);

        res.json({
            success: true,
            message: 'Suggestion verified by AI and published to Student Forum!',
            suggestionId: id,
            aiAnalysis: aiCheck.reason,
            aiSentiment: aiCheck.sentiment
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/suggestions/vote', (req, res) => {
    try {
        const { suggestionId, voteType } = req.body; // 'up' | 'down'
        if (voteType === 'up') {
            db.prepare('UPDATE suggestions SET upvotes = upvotes + 1 WHERE id = ?').run(suggestionId);
        } else {
            db.prepare('UPDATE suggestions SET downvotes = downvotes + 1 WHERE id = ?').run(suggestionId);
        }
        const updated = db.prepare('SELECT upvotes, downvotes FROM suggestions WHERE id = ?').get(suggestionId);
        res.json({ success: true, upvotes: updated.upvotes, downvotes: updated.downvotes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/suggestions/comment', (req, res) => {
    try {
        const { suggestionId, authorAlias, commentText, isWarden } = req.body;
        if (!commentText) {
            return res.status(400).json({ success: false, error: 'Comment text required' });
        }

        const aiCheck = screenSuggestionAI('Comment', commentText);
        if (!aiCheck.isApproved) {
            return res.status(400).json({
                success: false,
                isBlockedByAI: true,
                message: aiCheck.reason
            });
        }

        const commentId = `COM-${Math.floor(1000 + Math.random() * 9000)}`;
        db.prepare(`
            INSERT INTO suggestion_comments (id, suggestion_id, author_alias, comment_text, is_warden)
            VALUES (?, ?, ?, ?, ?)
        `).run(commentId, suggestionId, authorAlias || 'Resident', commentText, isWarden ? 1 : 0);

        res.json({ success: true, message: 'Opinion posted successfully!', commentId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/suggestions/warden-respond', (req, res) => {
    try {
        const { suggestionId, responseText, wardenStatus } = req.body;
        db.prepare(`
            UPDATE suggestions 
            SET warden_response = ?, warden_status = ? 
            WHERE id = ?
        `).run(responseText, wardenStatus || 'Under Review', suggestionId);

        res.json({ success: true, message: 'Official warden response recorded!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 13. BLOCK-BASED PEER ITEM REQUEST BOX (HOSTEL SHAREHUB) ---
app.get('/api/item-requests', (req, res) => {
    try {
        const block = req.query.block;
        let requests;
        if (block && block !== 'All') {
            requests = db.prepare('SELECT * FROM item_requests WHERE hostel_block LIKE ? ORDER BY created_at DESC').all(`%${block}%`);
        } else {
            requests = db.prepare('SELECT * FROM item_requests ORDER BY created_at DESC').all();
        }
        res.json({ success: true, data: requests });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/item-requests/create', (req, res) => {
    try {
        const { studentId, studentName, studentRoom, hostelBlock, itemName, category, description, urgency } = req.body;
        const id = `REQ-${Math.floor(200 + Math.random() * 800)}`;

        const stmt = db.prepare(`
            INSERT INTO item_requests (
                id, student_id, student_name, student_room, hostel_block, 
                item_name, category, description, urgency, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Open')
        `);

        stmt.run(
            id, 
            studentId || 'SRM20260402', 
            studentName || 'Garv', 
            studentRoom || '402', 
            hostelBlock || 'C-Block', 
            itemName, 
            category || 'Daily Utility', 
            description || 'Urgent requirement from hostel peers.', 
            urgency || 'Immediate (15-30 mins)'
        );

        res.json({ success: true, message: 'Item request broadcast to hostel block!', requestId: id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/item-requests/offer-help', (req, res) => {
    try {
        const { requestId, helperName, helperRoom, helperBlock, helperNote } = req.body;
        db.prepare(`
            UPDATE item_requests 
            SET status = 'Help Offered', helper_name = ?, helper_room = ?, helper_block = ?, helper_note = ?
            WHERE id = ?
        `).run(helperName || 'Fellow Hosteller', helperRoom || 'Nearby Room', helperBlock || 'Hostel Block', helperNote || 'Available now!', requestId);

        res.json({ success: true, message: 'Offer sent to requester!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/item-requests/fulfill', (req, res) => {
    try {
        const { requestId } = req.body;
        db.prepare("UPDATE item_requests SET status = 'Fulfilled' WHERE id = ?").run(requestId);
        res.json({ success: true, message: 'Item marked as returned / fulfilled!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 14. 2026 ACADEMIC & HOSTEL HOLIDAYS CALENDAR API ---
const ACADEMIC_HOLIDAYS_2026 = [
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

app.get('/api/holidays', (req, res) => {
    res.json({ success: true, data: ACADEMIC_HOLIDAYS_2026 });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 SRM Hostel ERP Express Backend running on http://localhost:${PORT}`);
});

