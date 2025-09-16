# MindBloom - Your Mental Wellness Sanctuary

MindBloom is a web application designed to be a personal sanctuary for mental wellness. It provides users with accessible, compassionate, and effective tools to navigate their mental health journey.

This project was built iteratively in Firebase Studio.

## Key Features

- **Home Page**: A welcoming landing page that introduces the app's mission, key features, and provides previews of the resources and team.
- **User Authentication**: Secure user sign-up and login using Firebase Authentication, including email/password and Google Sign-In.
- **Personalized Dashboard**: A user-specific dashboard that provides quick access to core features and displays an inspirational quote of the day.
- **Resource Library**: A curated collection of articles, videos, and audio resources categorized into topics like Anxiety, Depression, Sleep, and Stress. Includes a search feature to easily find relevant content.
- **AI-Powered Chat Assistant "Bloom"**: An empathetic and supportive AI assistant (built with Genkit) that provides personalized recommendations and coping strategies based on user input.
- **Gratitude Journal**: A private space for users to record things they are grateful for. Each entry helps a personal digital tree grow from a sprout to a flourishing tree. Features an interactive AI chat with the tree spirit.
- **Calming Games**: A suite of interactive mini-games designed to promote relaxation and mindfulness, including a Breathing Visualizer, a Color Matching game, and a Memory game.
- **Survey Page**: Allows users to participate in community surveys to help improve the platform.
- **About Us Page**: Introduces the mission, values, and the dedicated team behind MindBloom.
- **Contact Page**: A simple and accessible contact form, along with an FAQ section to address common user questions.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Backend & Authentication**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (for the AI Chat Assistant)
- **Deployment**: Firebase App Hosting

## Getting Started

The application is configured to run with Firebase.

### Running the Development Server

To run the app locally, use the following command:

```bash
npm run dev
```

This will start the Next.js development server, typically on `http://localhost:9002`.

### Building for Production

To create a production-ready build of the application, run:

```bash
npm run build
```

This will generate an optimized version of the app in the `.next` directory.
