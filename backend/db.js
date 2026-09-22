import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path in database folder
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'hostel.db');
const db = new Database(dbPath);

// Enable WAL mode & foreign keys for high performance & scalability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database schema with indexes for handling large datasets
export function initDbSchema() {
    db.exec(`
        -- Students Table
        CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            roll_no TEXT UNIQUE NOT NULL,
            hostel_block TEXT NOT NULL,
            room_no TEXT NOT NULL,
            bed_no TEXT NOT NULL,
            course TEXT NOT NULL,
            year TEXT NOT NULL,
            guardian_name TEXT,
            guardian_phone TEXT,
            attendance_rate REAL DEFAULT 95.0,
            pending_fees INTEGER DEFAULT 0,
            total_fees INTEGER DEFAULT 367000,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_students_roll ON students(roll_no);
        CREATE INDEX IF NOT EXISTS idx_students_block ON students(hostel_block);
        CREATE INDEX IF NOT EXISTS idx_students_room ON students(room_no);

        -- Attendance Table
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('Present', 'Absent', 'On Leave')),
            marked_by TEXT DEFAULT 'Warden Office',
            remarks TEXT,
            FOREIGN KEY (student_id) REFERENCES students(id)
        );

        CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);

        -- Fees Table
        CREATE TABLE IF NOT EXISTS fees (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            fee_name TEXT NOT NULL,
            amount INTEGER NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('Paid', 'Pending', 'Overdue')),
            due_date TEXT NOT NULL,
            paid_at TEXT,
            FOREIGN KEY (student_id) REFERENCES students(id)
        );

        CREATE INDEX IF NOT EXISTS idx_fees_student ON fees(student_id);
        CREATE INDEX IF NOT EXISTS idx_fees_status ON fees(status);

        -- Maintenance / Service Complaints Table
        CREATE TABLE IF NOT EXISTS complaints (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            student_name TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            room_no TEXT NOT NULL,
            priority TEXT NOT NULL CHECK(priority IN ('Emergency', 'High', 'Medium', 'Low')),
            status TEXT NOT NULL CHECK(status IN ('Pending', 'In Progress', 'Resolved')),
            assigned_tech TEXT,
            tech_phone TEXT,
            estimated_hours INTEGER DEFAULT 2,
            resolution_notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id)
        );

        CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
        CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
        CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
        CREATE INDEX IF NOT EXISTS idx_complaints_student ON complaints(student_id);

        -- Outpasses Table
        CREATE TABLE IF NOT EXISTS outpasses (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            student_name TEXT NOT NULL,
            type TEXT NOT NULL,
            destination TEXT NOT NULL,
            reason TEXT NOT NULL,
            out_date TEXT NOT NULL,
            expected_in_date TEXT NOT NULL,
            status TEXT NOT NULL,
            qr_code TEXT,
            approved_by TEXT,
            ai_risk_score INTEGER DEFAULT 10,
            ai_risk_level TEXT DEFAULT 'Low Risk',
            ai_risk_reason TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id)
        );

        CREATE INDEX IF NOT EXISTS idx_outpasses_student ON outpasses(student_id);
        CREATE INDEX IF NOT EXISTS idx_outpasses_status ON outpasses(status);

        -- Disciplinary Warnings Table (Issued by Wardens)
        CREATE TABLE IF NOT EXISTS warnings (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            student_name TEXT NOT NULL,
            roll_no TEXT NOT NULL,
            warning_type TEXT NOT NULL,
            severity TEXT NOT NULL CHECK(severity IN ('Minor Warning', 'Official Reprimand', 'Final Notice')),
            description TEXT NOT NULL,
            issued_by TEXT NOT NULL,
            issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            action_taken TEXT,
            FOREIGN KEY (student_id) REFERENCES students(id)
        );

        CREATE INDEX IF NOT EXISTS idx_warnings_student ON warnings(student_id);
        CREATE INDEX IF NOT EXISTS idx_warnings_severity ON warnings(severity);

        -- SMS Notification Gateway Log Table
        CREATE TABLE IF NOT EXISTS sms_logs (
            id TEXT PRIMARY KEY,
            recipient_phone TEXT NOT NULL,
            recipient_name TEXT NOT NULL,
            role TEXT NOT NULL,
            trigger_event TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Simulated Sent',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_sms_logs_time ON sms_logs(timestamp);

        -- Hostel Announcements Table (Legacy)
        CREATE TABLE IF NOT EXISTS announcements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            priority TEXT NOT NULL,
            content TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- 1. Hostel Blocks Table (with assigned wardens & dedicated service personnel)
        CREATE TABLE IF NOT EXISTS hostel_blocks (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT UNIQUE NOT NULL,
            type TEXT NOT NULL,
            total_floors INTEGER DEFAULT 8,
            capacity INTEGER NOT NULL,
            occupied INTEGER NOT NULL,
            warden_name TEXT NOT NULL,
            warden_phone TEXT NOT NULL,
            warden_email TEXT NOT NULL,
            warden_office TEXT NOT NULL,
            service_tech_name TEXT NOT NULL,
            service_tech_role TEXT NOT NULL,
            service_tech_phone TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- 2. Official Circulars & Notice Section Table
        CREATE TABLE IF NOT EXISTS notices (
            id TEXT PRIMARY KEY,
            ref_no TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            priority TEXT NOT NULL CHECK(priority IN ('Urgent Alert', 'High Priority', 'General Circular', 'Mess Notice', 'Maintenance Notice')),
            issued_by TEXT NOT NULL,
            target_blocks TEXT NOT NULL DEFAULT 'All Blocks',
            content TEXT NOT NULL,
            date TEXT NOT NULL,
            attachment_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_notices_priority ON notices(priority);
        CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);

        -- 3. Anonymous Suggestion Box Table (AI Moderated)
        CREATE TABLE IF NOT EXISTS suggestions (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author_alias TEXT DEFAULT 'Anonymous Resident',
            hostel_block TEXT NOT NULL,
            ai_status TEXT NOT NULL CHECK(ai_status IN ('Approved', 'Flagged_Vulgar', 'Flagged_Spam', 'Under_Review')) DEFAULT 'Approved',
            ai_analysis TEXT,
            ai_sentiment TEXT DEFAULT 'Constructive',
            upvotes INTEGER DEFAULT 0,
            downvotes INTEGER DEFAULT 0,
            warden_response TEXT,
            warden_status TEXT DEFAULT 'Open for Discussion',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(ai_status);
        CREATE INDEX IF NOT EXISTS idx_suggestions_category ON suggestions(category);
        CREATE INDEX IF NOT EXISTS idx_suggestions_block ON suggestions(hostel_block);

        -- 4. Suggestion Public Discussion / Comments Table
        CREATE TABLE IF NOT EXISTS suggestion_comments (
            id TEXT PRIMARY KEY,
            suggestion_id TEXT NOT NULL,
            author_alias TEXT NOT NULL,
            comment_text TEXT NOT NULL,
            is_warden BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (suggestion_id) REFERENCES suggestions(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_comments_suggestion ON suggestion_comments(suggestion_id);

        -- 5. Block-Based Peer Item Request Box Table (Hostel ShareHub)
        CREATE TABLE IF NOT EXISTS item_requests (
            id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            student_name TEXT NOT NULL,
            student_room TEXT NOT NULL,
            hostel_block TEXT NOT NULL,
            item_name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            urgency TEXT NOT NULL CHECK(urgency IN ('Immediate (15-30 mins)', 'Within 2 Hours', 'Today', 'Flexible')),
            status TEXT NOT NULL CHECK(status IN ('Open', 'Help Offered', 'Fulfilled', 'Closed')) DEFAULT 'Open',
            helper_name TEXT,
            helper_room TEXT,
            helper_block TEXT,
            helper_note TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id)
        );

        CREATE INDEX IF NOT EXISTS idx_item_requests_block ON item_requests(hostel_block);
        CREATE INDEX IF NOT EXISTS idx_item_requests_status ON item_requests(status);
    `);
    console.log('✅ SQLite Database Schema & Scalability Indexes Initialized Successfully.');
}

export default db;
