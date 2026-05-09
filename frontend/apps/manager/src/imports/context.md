Use the following global design system and visual direction for the entire project.


# UI/UX Context: Driving School Manager Dashboard

## 1. Project Overview
This project is an automated scheduling and load-balancing system for a driving school[cite: 1]. While students and instructors use mobile applications for on-the-go interactions, the Manager (Admin) requires a powerful Web Dashboard built with React[cite: 1]. 

The Manager's role is to oversee the entire operation: monitoring the global schedule, managing user accounts (instructors and students), handling exceptions, and viewing business analytics[cite: 1].

**Core Design Principles for the Web Dashboard:**
*   **High Information Density:** The manager uses a desktop monitor. The UI should utilize screen real estate effectively to display large tables and complex calendars without feeling cluttered.
*   **Quick Actions & Modals:** Managers need to make quick changes (e.g., reassigning a student) without losing their context or navigating away from the main page.
*   **Clear Hierarchy & Navigation:** A persistent sidebar navigation is highly recommended for switching between core modules (Dashboard, Schedule, Users, Settings).
*   **Data Visualization:** Use simple, scannable charts for analytics[cite: 1].

---

## 2. Global Design System (Web Focus)
*   **Typography:** Clean, modern sans-serif (e.g., Inter, Roboto). Standard web sizing (14px/16px body, clear headings).
*   **Color Palette:**
    *   *Primary:* Trustworthy Blue or Deep Teal (matches the mobile app).
    *   *Surface/Background:* Light Gray (`#F3F4F6` or similar) for the app background, crisp White for data cards and tables.
    *   *Semantic Status Colors:*
        *   Green: Active/Completed lessons.
        *   Red: Cancelled/No-Show lessons[cite: 1].
        *   Orange/Yellow: Waitlist alerts or pending actions[cite: 1].
*   **UI Components:** Data Grids (Tables) with sorting/filtering, Multi-resource Calendars, Tabs, Breadcrumbs, and Slide-over panels (Drawers) for detailed views.

---

## 3. Manager UI/UX Requirements (Key Modules)

### 3.1. Dashboard (Overview & Analytics)
**Context:** The first screen the manager sees upon logging in. Provides a pulse on the business[cite: 1].
*   **KPI Cards (Top Row):** 
    *   Total active students.
    *   Lessons completed this week.
    *   Cancellation rate.
*   **Recent Activity Feed / Alerts:** A sidebar or widget showing automated system actions (e.g., "Slot at 14:00 filled via Waitlist", "Student X cancelled < 24h").

### 3.2. Global Schedule (Resource Calendar)
**Context:** The most complex UI component. A master calendar showing all instructors at once[cite: 1].
*   **View Modes:** Day, Week, and Timeline (Resource) view. The Timeline view should have Instructors as rows on the Y-axis and Time on the X-axis.
*   **Interactions:** 
    *   Hovering over a slot shows a tooltip with the student's name and phone number.
    *   Clicking a slot opens a Drawer with full details and the ability to manually override/cancel.
*   **Filters:** Ability to filter the calendar by specific instructor or slot status.

### 3.3. User Management (CRM Module)
**Context:** Where the manager links students to instructors and reviews progress[cite: 1].
*   **Students Table:** Columns for Name, Phone, Assigned Instructor, Total Hours Driven, and Status.
*   **Instructor Assignment Flow:** 
    *   Clicking "Assign Instructor" opens a modal.
    *   The manager selects an instructor from a dropdown, taking into account the instructor's current student load.
*   **Student Detail View (Student Card):** 
    *   A dedicated page or Drawer showing the student's history, upcoming booked slots, and instructor notes (Progress Notes)[cite: 1].

---

## 4. Specific Instructions for Figma Generation (Manager Dashboard)
When generating the Manager Web screens, please prioritize:
1.  **The Sidebar Layout:** Create a standard admin layout with a left-hand sidebar navigation and a top header (containing user profile and global search).
2.  **The Timeline/Resource Calendar:** This is critical. Design a calendar where the manager can easily compare Instructor A's schedule alongside Instructor B's schedule for the current week[cite: 1].
3.  **Data Table UI:** Design a clean, readable table for the "Students" page with a clear "Action" column (three dots menu for Edit/Assign).



PROJECT STYLE DNA:
Create an ultra-premium modern SaaS interface with a strong mobile-app aesthetic inspired by high-end Dribbble and Behance concepts.

The UI must feel:
- luxurious
- futuristic
- minimal
- soft
- highly polished
- emotionally pleasant
- startup-grade
- visually expensive

VISUAL STYLE:
- soft pastel palette
- lavender/purple primary branding
- smooth gradients
- floating cards
- large rounded corners (2xl–4xl)
- premium spacing system
- elegant shadows
- layered depth
- clean typography
- soft neumorphism
- subtle glassmorphism
- modern visual hierarchy
- breathable layouts
- visually balanced composition
- modern mobile-app feeling
- soft white/light backgrounds
- playful premium elements
- aesthetic UI blocks
- rich but minimal layouts

DESIGN QUALITY:
The result must look like:
- a $1,000,000 startup
- an award-winning SaaS
- Apple-level polish
- a premium 2026 product
- a professional Dribbble concept

UX REQUIREMENTS:
- smooth hover effects
- elegant transitions
- microinteractions
- responsive layouts
- visually satisfying spacing
- premium onboarding feel
- polished empty states
- beautiful loading states
- intuitive navigation
- clean component hierarchy

IMPORTANT:
Prioritize aesthetics and emotional design over functionality.
The UI must be portfolio-worthy.

AVOID:
- generic templates
- Bootstrap appearance
- dense enterprise layouts
- ugly tables
- outdated UI patterns
- sharp corners
- visually noisy screens
- default Tailwind look
- excessive text blocks

TECH STACK:
- React
- TailwindCSS
- reusable components
- clean architecture
- responsive implementation