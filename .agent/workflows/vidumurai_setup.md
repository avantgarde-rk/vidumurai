---
description: Setup and Migration workflow for Vidumurai
---

# Phase 1: Backend Setup & Migration (Postgres -> Mongo)

1. [x] Uninstall Prisma/PG dependencies in server
2. [x] Install Mongoose in server
3. [x] Delete `server/prisma` directory
4. [x] Create MongoDB Connection (`src/config/db.js`)
5. [x] Create Mongoose Models (`User`, `Leave`, `Attendance`)
6. [x] Update `src/index.js` to connect to MongoDB

# Phase 2: Frontend Branding & Foundation

1. [x] Update `client/src/app/globals.css` with new color palette (Glassmorphism, Vibrant)
2. [x] Install necessary UI libraries (Radix primitives if needed)
3. [x] Update Landing Page (`page.tsx`) to reflect "Vidumurai" branding

# Phase 3: Authentication Implementation

1. [x] Implement `authController.js` with Mongoose
2. [x] Update `authRoutes.js`
3. [x] Create Frontend Login/Register pages with new design

# Phase 4: Student Dashboard & Leaves

1. [x] Backend: Implement `leaveController.js` & `attendanceController.js`
2. [x] Backend: Enable Leave/Attendance Routes
3. [x] Frontend: Create Sidebar & Dashboard Layout
4. [x] Frontend: Student Dashboard (Attendance Stats, Pending Leaves)
5. [x] Frontend: Leave Application Form with AI Mock
6. [x] Frontend: Leave History Page

# Phase 5: Staff, Analytics & Final Polish

1. [x] Backend: Update `getPendingLeaves` to filter by Role/Dept
2. [x] Frontend: Create Mentor Sidebar & Dashboard Layout
3. [x] Frontend: Mentor Dashboard (Pending Counter, My Students)
4. [x] Frontend: Mentor Leave Approvals Page
5. [x] Frontend: HOD Dashboard with Analytics (Recharts)
6. [x] Backend: Integration of Email Notification on Leave Approval
7. [x] Final Polish: Check for missing UI states
