
# MindBloom App Replication Prompt

This document provides a comprehensive prompt to replicate the MindBloom web application.

## **App Name**: MindBloom

### **Core Concept**
A digital sanctuary for mental wellness designed for students in higher education. It provides accessible, compassionate, and effective tools to navigate the mental health journey in a stigma-free environment.

---

### **Core Features**

1.  **User Authentication & Authorization**
    *   Secure user signup and login with email/password and Google Sign-In.
    *   A dedicated "Forgot Password" flow that sends a reset link to the user's email.
    *   User documents created in Firestore upon first login to store profile information.
    *   Admin role system based on a specific list of emails stored in a Firestore document (`config/adminCodes`).

2.  **Home Page (`/`)**
    *   A welcoming hero section with a title, descriptive text, and call-to-action buttons ("Explore Resources", "Chat with Bloom").
    *   Include a subtle, decorative background animation (like floating flower petals).
    *   A "Key Features" section highlighting the main functionalities (Resource Library, AI Companion, Calming Games, Survey) with icons and links.
    *   Previews of the Resource Library categories, Team members, and a CTA to the Chat page.
    *   A newsletter signup form.

3.  **User Dashboard (`/dashboard`)**
    *   Displayed after login, shows a personalized welcome message.
    *   A "Quick Links" section to navigate to Resources, Games, and the AI Chat.
    *   A "Quote of the Day" card that displays a new inspirational quote on each visit and allows the user to refresh it.
    *   A tabbed interface to switch between the main dashboard view and "Account Settings".

4.  **Account Settings (Tab in Dashboard)**
    *   Allows users to update their display name.
    *   Provides a secure flow to change their password, which requires re-authentication and sends a password reset link via email.
    *   Includes a "Forgot Password?" link within the re-authentication step.

5.  **Resource Library (`/resources`)**
    *   A filterable, categorized library of mental health resources.
    *   Categories: Anxiety, Depression, Sleep, Stress, Motivational, etc.
    *   Content Types: Embedded YouTube videos and audio.
    *   A search bar to filter resources within the selected category.
    *   An inspirational quote display on the page.

6.  **AI Chatbot "Bloom" (`/chat`)**
    *   A private, authenticated chat interface for users to interact with an AI assistant.
    *   The AI persona is empathetic, supportive, and non-judgmental, acting as a compassionate companion.
    *   The AI should provide personalized recommendations and coping strategies based on user input.
    *   The page includes a sidebar with a disclaimer that the AI is not a substitute for professional help and lists emergency contact hotlines for India.
    *   Chat history is saved in the browser's local storage.

7.  **Calming Games (`/games`)**
    *   A collection of simple, interactive games designed for relaxation.
    *   **Breathing Visualizer:** An animated circle that guides users through inhale/exhale cycles.
    *   **Color Match Game:** A game where users match a target color from a set of options.
    *   **Memory Game:** A classic card-matching game with icons.

8.  **About Us Page (`/about`)**
    *   Describes the mission and values of MindBloom.
    *   Presents the team members with their photos, roles, and short bios in interactive cards. Clicking a card reveals more details and links to email/LinkedIn.

9.  **Contact Page (`/contact`)**
    *   A "Send us a Message" form that opens the user's default email client with a pre-filled `mailto:` link.
    *   An FAQ section with an accordion component to answer common questions.

10. **Survey Page (`/survey`)**
    *   Displays a list of available community surveys.
    *   Includes a default, hardcoded survey link.
    *   Dynamically loads and displays additional surveys from the Firestore database.

11. **Admin Dashboard (`/admin`)**
    *   An access-controlled page for administrators.
    *   Users are verified against an email list in Firestore (`config/adminCodes`). Non-admins are shown an "Access Denied" message.
    *   A tabbed interface for managing different parts of the app:
        *   **Surveys:** Add, edit, delete, and toggle visibility of survey links.
        *   **Videos:** Add, edit, delete, and toggle visibility of resource videos.
        *   **Users:** View a list of all registered users and ban/unban them.
        *   **Config:** Manage app-wide settings like the title and announcements.

---

### **Style Guidelines**

*   **Color Palette (ShadCN Theme in `globals.css`):**
    *   **Primary:** A soothing Lavender (`hsl(276 65% 55%)`).
    *   **Secondary:** A gentle Teal (`hsl(174 62% 48%)`).
    *   **Background:** Near-white (`hsl(0 0% 98%)`).
    *   **Accent:** An aqua blue (`hsl(187 72% 47%)`).
    *   Use HSL CSS variables for all theme colors.
*   **Font:** `Inter` for both body and headlines for a modern, clean look.
*   **UI Components:** Use **ShadCN/UI** components as the base for all UI elements (Cards, Buttons, Forms, etc.).
*   **Layout:** Employ a clean, spacious layout with ample whitespace.
*   **Icons:** Use the `lucide-react` library for minimalist and friendly icons.
*   **Animations:** Incorporate subtle and gentle animations, such as smooth transitions and fade-in effects on page load (`framer-motion`).

---

### **Technical Stack & Implementation Details**

*   **Framework:** **Next.js** with the **App Router**.
*   **Language:** **TypeScript**.
*   **Styling:** **Tailwind CSS**.
*   **UI Library:** **ShadCN/UI**.
*   **Backend & Authentication:** **Firebase** (Firestore Database, Firebase Authentication).
*   **Generative AI:** **Genkit** with the Google AI provider for the AI Chatbot.
    *   The flow (`generatePersonalizedRecommendations`) should be designed with a specific persona (empathetic, non-judgmental friend) and logic to handle different types of user input (emotional expressions vs. direct requests).
*   **State Management:** Use React Hooks (`useState`, `useEffect`, `useContext`). Create custom hooks for authentication (`useAuth`, `useAdminAuth`) and Firestore data fetching (`useFirestoreCollection`, `useFirestoreDocument`).
*   **Forms:** Use `react-hook-form` with `zod` for validation.
*   **Security:**
    *   Implement Firestore security rules to allow reads for authenticated users on public collections (like `config`) and restrict writes to authenticated actions.
    *   Admin functionality is protected by checking the user's email against a specific allowlist in Firestore.
    *   All sensitive auth operations (password change, email update) must require re-authentication.

