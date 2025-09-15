'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized event and session recommendations to users.
 *
 * It leverages ChatGPT to analyze user interests and event details to generate relevant recommendations.
 *
 * - recommendEvents - A function that takes user information and event details as input and returns a list of recommended events.
 * - RecommendEventsInput - The input type for the recommendEvents function.
 * - RecommendEventsOutput - The return type for the recommendEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const RecommendEventsInputSchema = z.object({
  userProfile: z.object({
    skills: z.array(z.string()).describe('List of user skills'),
    interests: z.array(z.string()).describe('List of user interests'),
    pastEvents: z.array(z.string()).describe('List of past events the user attended'),
  }).describe('User profile information including skills, interests and past events.'),
  availableEvents: z.array(z.object({
    eventId: z.string().describe('Unique identifier for the event'),
    name: z.string().describe('Name of the event'),
    description: z.string().describe('Description of the event'),
    tags: z.array(z.string()).describe('Tags associated with the event'),
  })).describe('List of available events to recommend from.'),
});

export type RecommendEventsInput = z.infer<typeof RecommendEventsInputSchema>;

// Define the output schema
const RecommendEventsOutputSchema = z.array(z.object({
  eventId: z.string().describe('Unique identifier of the recommended event.'),
  reason: z.string().describe('The reason why this event is recommended for the user.'),
}));

export type RecommendEventsOutput = z.infer<typeof RecommendEventsOutputSchema>;

// Exported function to call the flow
export async function recommendEvents(input: RecommendEventsInput): Promise<RecommendEventsOutput> {
  return recommendEventsFlow(input);
}

// Define the prompt
const recommendEventsPrompt = ai.definePrompt({
  name: 'recommendEventsPrompt',
  input: {schema: RecommendEventsInputSchema},
  output: {schema: RecommendEventsOutputSchema},
  prompt: `You are an AI event recommendation expert. Given a user's profile and a list of available events, you will recommend the events that are most relevant to the user.\n\nUser Profile:\nSkills: {{userProfile.skills}}\nInterests: {{userProfile.interests}}\nPast Events: {{userProfile.pastEvents}}\n\nAvailable Events:\n{{#each availableEvents}}\nEvent ID: {{this.eventId}}\nName: {{this.name}}\nDescription: {{this.description}}\nTags: {{this.tags}}\n{{/each}}\n\nBased on the user's profile and the available events, recommend the events that the user would be most interested in. For each recommended event, provide a reason for the recommendation.\n\nFormat your response as a JSON array of objects, where each object has an eventId and a reason.`,
});

// Define the flow
const recommendEventsFlow = ai.defineFlow(
  {
    name: 'recommendEventsFlow',
    inputSchema: RecommendEventsInputSchema,
    outputSchema: RecommendEventsOutputSchema,
  },
  async input => {
    const {output} = await recommendEventsPrompt(input);
    return output!;
  }
);
