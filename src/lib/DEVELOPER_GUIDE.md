# MindBloom - Developer's Guide

This document provides a technical overview of the MindBloom web application for developers. It covers the core architectural concepts, key services, and implementation details to help you get started with the codebase.

## 1. Core Technologies

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with `globals.css` for theme variables.
- **UI Components**: ShadCN/UI, located in `src/components/ui`. Custom components are in `src/components`.
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **Generative AI**: Genkit (via `@genkit-ai/googleai`)

---

## 2. Authentication Flow

Authentication is managed centrally through the `useAuth` hook (`src/hooks/use-auth.tsx`).

- **`AuthProvider`**: This context provider wraps the entire application in `src/app/layout.tsx`. It uses Firebase's `onAuthStateChanged` listener to monitor the user's authentication state.
- **`useAuth()` Hook**: Any component that needs user information can call this hook to get the current `user` object and `loading` state.
- **New User Onboarding**: The `AuthProvider` contains a critical helper function, `ensureUserDocument`. When a user signs in for the first time, this function:
    1. Creates a new document for them in the `users` collection in Firestore.
    2. Populates it with their `uid`, `email`, `displayName`, etc.
    3. Creates an initial document for their **Gratitude Journal** at `users/{userId}/journal/state`.
- **Auth Services**: All direct interactions with Firebase Auth (e.g., `signInWithEmail`, `signUpWithEmail`, `sendPasswordResetLink`) are encapsulated in `src/services/auth-service.ts`. Components should **always** use these service functions rather than calling Firebase Auth directly.

---

## 3. Firestore Database (`db`)

The Firestore instance is initialized in `src/lib/firebase.ts`. All database interactions should be handled through our custom hooks or dedicated service files.

### Key Collections:

- **`users/{userId}`**: Stores public profile information for each user.
  - **`users/{userId}/journalEntries/{entryId}`**: Stores individual gratitude journal entries.
  - **`users/{userId}/journal/state`**: Stores metadata for the journal, like the tree's name.
  - **`users/{userId}/chats/{chatId}`**: Stores metadata for a chat session with the Tree AI.
    - **`users/{userId}/chats/{chatId}/messages/{messageId}`**: Stores the actual messages for a chat session.
- **`videos`**: Stores metadata for videos in the Resource Library (curated by admins).
- **`surveys`**: Stores links to community surveys (managed by admins).

### Interacting with Firestore:

- **`useFirestoreCollection(path)`**: A hook (`src/hooks/use-firestore.tsx`) to get a real-time stream of documents from a collection. It returns `data`, `loading`, and `error` states.
- **`useFirestoreDocument(path)`**: A hook to get a real-time stream of a single document.
- **Data Modification**: Functions for adding, updating, or deleting data are located in service files like `src/services/journal-service.ts`. This keeps data logic separate from UI components.

---

## 4. Generative AI with Genkit

All AI functionality is powered by **Genkit**. The configuration is located in `src/ai/genkit.ts`.

### Key Concepts:

- **Flows**: An AI operation is defined as a "flow" in `src/ai/flows/`. A flow is a server-side function that can be called from client components.
- **Prompts**: Inside a flow, we define a `prompt`. This is where the core instructions for the AI model are written. We use Handlebars syntax (`{{{userInput}}}`) to inject data into the prompt.
- **Input/Output Schemas**: We use `zod` to define strict schemas for the input and output of each flow. This ensures type safety and helps the AI produce structured data.

### Example Flow: `generatePersonalizedRecommendations`

- **File**: `src/ai/flows/generate-personalized-recommendations.ts`
- **Purpose**: Powers the "Bloom" AI chat assistant.
- **Persona Prompting**: The prompt carefully defines the AI's persona as an empathetic and supportive friend. It includes critical safety instructions to detect crisis language and provide emergency contact information for India.
- **Logic**: The prompt guides the AI to respond differently based on whether the user is expressing emotions or making a direct request.

---

## 5. Gratitude Journal (`/journal`)

This feature is a good example of how the different parts of the app work together.

- **`src/app/journal/page.tsx`**: The entry point. It uses the `useAuth` hook to protect the route and fetches the user's `uid`.
- **`src/app/journal/journal-client.tsx`**: The main client component that orchestrates the feature.
- **`src/components/journal/TreeSection.tsx`**: The primary component that lays out the journal page.
    - It uses the `useFirestoreCollection` hook to fetch all `journalEntries` for the current user.
    - It uses the `useFirestoreDocument` hook to get the `treeName` from the journal's `state`.
- **`src/lib/journal-utils.ts`**: Contains the `getTreeStage` function, which determines which tree image to display based on the number of journal entries.
- **`src/services/journal-service.ts`**: Contains all the functions for interacting with Firestore, such as `addJournalEntry`, `deleteJournalEntry`, and `updateTreeName`. These are "server actions" (`'use server'`).

This structure separates concerns effectively: the page handles routing and auth, the client component manages state and data fetching, UI components handle presentation, and service files handle the backend logic.
