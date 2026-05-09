Use the following global design system and visual direction for the entire project.


# UI/UX Context: Driving School Management System

## 1. Project Overview
This project is an automated scheduling and load-balancing system for a driving school[cite: 1]. It replaces manual scheduling (notebooks) with a digital platform[cite: 1]. The system handles three distinct user roles: Student, Instructor, and Manager[cite: 1]. 

The design must maintain a cohesive visual identity across all platforms (Flutter for Mobile, React for Web) while adapting the user experience to the specific needs of each role[cite: 1].

**Core Design Principles:**
*   **Clarity over clutter:** Interfaces should be functional and easy to scan.
*   **Mobile-first for field operations:** Instructors and Students will primarily use the mobile app on the go (in the car).
*   **Information density for management:** The Manager's web dashboard needs to display large amounts of data efficiently.
*   **Color-coded statuses:** Consistent use of colors for booking statuses (e.g., Green = Booked/Active, Gray = Available, Red = Cancelled/No-Show).

---

## 2. Global Design System (To be applied across all roles)
*   **Typography:** Clean, modern sans-serif (e.g., Inter, Roboto, or SF Pro). Large, legible fonts for mobile.
*   **Color Palette:**
    *   *Primary:* Trustworthy Blue or Deep Teal (driving school branding).
    *   *Secondary:* Soft accents for backgrounds.
    *   *Semantic:*
        *   Success/Booked: Green
        *   Warning/Waitlist: Orange/Yellow
        *   Error/Cancelled/No-Show: Red
        *   Disabled/Past: Light Gray
*   **UI Elements:** Large, easy-to-tap buttons (FABs for primary actions), clear input fields, consistent card styles for slots and user profiles.

---

## 3. Role-Specific UI/UX Requirements

### 3.1. Instructor (Mobile App - Flutter) - **PRIMARY FOCUS FOR THIS DESIGN SPRINT**
**Context:** The instructor uses the app while working, often sitting in the training vehicle. The UI must be highly readable with high contrast and large tap targets.

**Key Screens to Design:**
1.  **Home / Daily Schedule (The "Today" View):**
    *   A vertical timeline or list of today's slots (1.5 hours each)[cite: 1].
    *   Each booked slot shows: Student name, phone number, and a quick summary of their progress.
    *   Free slots are clearly visible.
2.  **Active Lesson / Action Flow:**
    *   When a lesson time arrives, quick action buttons: `[Start Lesson]` and `[No-Show]`.
    *   **Post-Lesson Screen:** A form to log progress. Needs a large text area for notes ("What we learned: parking, city, signs") and a `[Save]` button[cite: 1].
3.  **Schedule Management (Calendar):**
    *   A monthly/weekly view to block out unavailability (e.g., "Car Maintenance", "Day Off").
4.  **Student Roster (Optional/Secondary):**
    *   A list of all students assigned to this instructor, showing their total hours driven[cite: 1].

### 3.2. Student (Mobile App - Flutter) - *For context and consistency*
**Context:** The student wants to quickly see their next lesson, book new ones, and check their progress.

**Key Features (To mirror Instructor's design language):**
*   **Dashboard:** Highlights the "Next Lesson" card prominently. Shows a progress bar (e.g., "Hours driven: 10/40")[cite: 1].
*   **Booking Flow:** Calendar view to pick a date -> List of available slots for their *assigned* instructor[cite: 1].
*   **Waitlist Logic:** If no slots are available, a button to "Join Waitlist" for a specific date[cite: 1].
*   **Cancellation:** If cancelling < 24 hours, a prominent warning modal appears[cite: 1].

### 3.3. Manager (Web Dashboard - React) - *For context and consistency*
**Context:** The manager works on a desktop computer, needing a "bird's-eye view" of the entire school.

**Key Features:**
*   **Global Calendar:** A dense, multi-column view showing all instructors' schedules simultaneously.
*   **CRM Tables:** Data grids listing all students, their assigned instructors, and total hours.
*   **Action Modals:** Pop-ups to assign a student to an instructor or manually override cancellations.

---

## 4. Specific Instructions for Figma Generation (Instructor App)
When generating the Instructor screens, please prioritize:
1.  **The "Daily Timeline":** Make it easy to distinguish between a completed lesson, an upcoming lesson, and a gap in the schedule.
2.  **The "Post-Lesson Note" screen:** Ensure the transition from "Lesson Finished" to "Write Note" feels seamless.
3.  **Contrast:** Assume the instructor might be looking at the phone in bright sunlight.



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