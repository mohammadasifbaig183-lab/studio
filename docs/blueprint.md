# **App Name**: SynergySphere Events

## Core Features:

- Secure Authentication & Roles: Firebase Auth integration with Google/GitHub/Email login. User roles include Organizer, Participant, and Sponsor. Firestore stores user profiles with skills, interests, and past events.
- Drag-and-Drop Event Management: Organizer dashboard to create and edit events with a drag-and-drop form builder for sessions, tracks, and prizes. Participants can browse and join events. Sponsors can publish offers and perks.
- AI-Powered Team Formation: Utilize ChatGPT to match users into teams based on skills and interests using a matching tool.
- Personalized Event Recommendations: Leverage ChatGPT to provide personalized event and session recommendations to users using a recommendation tool.
- Real-Time Collaboration: Real-time chat for participants using Firestore listeners. Integration with GitHub for hackathons. A virtual whiteboard feature (Excalidraw integration optional).
- Analytics Dashboard with AI Insights: Track registrations, engagement, and attendance. Predictive insights via ChatGPT to summarize participant engagement and suggest improvements using a summary tool.
- Mobile-First PWA: Offline-ready Progressive Web App with push notifications for event reminders.

## Style Guidelines:

- Background color: Light gray (#F0F2F5), providing a clean and modern base. It matches well with the use case and the requested glass/neumorphism.
- Primary color: Soft blue (#64B5F6), for a calming and trustworthy feel. Matches the theme and use case.
- Accent color: Subtle orange (#FFB74D), to draw attention to important actions without overpowering the design.
- Body text: 'Inter' (sans-serif) for body text, offering a modern, machined, neutral look suitable for a professional platform.
- Headline font: 'Space Grotesk' (sans-serif) for headlines, creating a contemporary and fashionable touch. Note: currently only Google Fonts are supported.
- Use modern, minimalist icons that align with the futuristic glassmorphism & neumorphism design. Ensure icons are consistent and intuitive.
- Implement a clean, mobile-first interface with a dashboard layout featuring a sidebar and topbar. Utilize responsive grid layouts for event pages and dashboards.
- Use subtle animations, particularly animated cards for gamification elements (leaderboards, badges), and interactive hover effects on event cards.