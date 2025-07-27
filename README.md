# Sahayak - AI-Powered Academic Companion

Welcome to Sahayak, an intelligent, AI-powered platform designed to enhance the learning experience for students and provide powerful tools for teachers. Built with Next.js, Firebase, and Google's Gemini API through Genkit, Sahayak serves as a central hub for academic management and personalized learning.

## Core Features

### For Teachers
- **Teacher Dashboard**: A centralized view to manage all teaching activities.
- **Class Management**: Organize classes, subjects, and upload reference materials for students.
- **AI Content Studio**: Generate custom educational content, quizzes, and lesson plans using AI prompts.
- **Content Review**: Review and approve AI-generated content before it becomes available to students.
- **Performance Tracking**: Monitor individual and class-wide student performance with easy-to-read charts and tables.
- **AI-Powered Insights**: Get AI-generated summaries of a student's strengths and areas for improvement based on grades and feedback.
- **Activity Feed**: Keep track of recent student submissions and activities.

### For Students
- **Student Dashboard**: A personalized overview of academic progress, including average grades, performance trends, and best subjects.
- **Assignments**: Receive and complete assignments with AI-generated quizzes tailored to teacher feedback.
- **Reference Materials**: Access all study materials uploaded by the teacher, organized by subject.
- **Concept Clarifier**: An AI-powered tool to get detailed explanations and quick quizzes on any concept.
- **AI Tutor (Ask a Query)**: Ask any academic question and get a detailed, easy-to-understand answer from an AI tutor.

---

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Firebase**:
    - Update the Firebase configuration in `src/lib/firebase-config.ts` with your project's credentials.
    - Set up Firestore and Firebase Storage in your Firebase project.

3.  **Set up Gemini API Key**:
    - Create a `.env` file in the root of the project.
    - Add your Gemini API key to the `.env` file:
      ```
      GEMINI_API_KEY=your_api_key_here
      ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the application.

5.  **Seed the Database (Optional)**:
    - To populate your Firestore database with initial mock data for students and grades, navigate to the **Teacher Dashboard** -> **Class** tab and click the "Seed Database" button.

---

## Folder Structure

The project follows a standard Next.js App Router structure. Here is a breakdown of the key directories:

```
/
├── src/
│   ├── app/                # Next.js App Router: Pages and Layouts
│   │   ├── dashboard/      # Layout and pages for the main dashboards
│   │   ├── globals.css     # Global styles and Tailwind directives
│   │   ├── layout.tsx      # Root layout for the entire application
│   │   └── page.tsx        # The main landing page
│   │
│   ├── ai/                 # All Genkit AI-related code
│   │   ├── flows/          # Genkit flows for different AI features
│   │   └── genkit.ts       # Genkit initialization and configuration
│   │
│   ├── components/         # Reusable React components
│   │   ├── concept-clarification/ # Components for the "Concept Clarifier" feature
│   │   ├── dashboard/      # Components used within the teacher and student dashboards
│   │   ├── layout/         # Layout components (e.g., AppLayout with sidebar)
│   │   └── ui/             # Core UI components from ShadCN
│   │
│   ├── hooks/              # Custom React hooks (e.g., use-toast, use-mobile)
│   │
│   └── lib/                # Core application logic, utilities, and data management
│       ├── firebase.ts     # Firebase initialization
│       ├── mock-data.ts    # Data fetching, seeding, and interaction logic with Firestore
│       ├── types.ts        # TypeScript type definitions for data models
│       └── utils.ts        # Utility functions (e.g., cn for classnames)
│
├── public/                 # Static assets
│
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

### Key File Descriptions

-   **`src/app/dashboard/page.tsx`**: This is the main entry point for both the teacher and student dashboards. It uses URL query parameters (`role`, `studentId`) to determine which dashboard to render.
-   **`src/components/layout/app-layout.tsx`**: This component defines the main structure of the application, including the responsive sidebar and header. It dynamically adjusts the navigation links based on whether the user is a teacher or a student.
-   **`src/lib/mock-data.ts`**: This file is central to the application's data layer. It handles all interactions with Firestore, such as fetching student data, adding grades, creating assignments, and seeding the database. It is designed to be the single source of truth for data operations.
-   **`src/ai/genkit.ts` & `src/ai/flows/*`**: These files define all the AI-powered features. `genkit.ts` configures the Genkit instance with the Gemini model. The files within the `flows/` directory each represent a specific AI capability, such as generating session content or answering a student's query.
-   **`src/components/dashboard/teacher-view.tsx` & `student-view.tsx`**: These components are the main parent components for the respective dashboard interfaces, containing the tabbed navigation and structure for each user role.
