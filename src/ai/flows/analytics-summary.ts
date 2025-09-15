'use server';
/**
 * @fileOverview Provides AI-powered insights for the analytics dashboard.
 *
 * - summarizeAnalytics - A function that summarizes participant engagement and suggests improvements.
 * - SummarizeAnalyticsInput - The input type for the summarizeAnalytics function.
 * - SummarizeAnalyticsOutput - The return type for the summarizeAnalytics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAnalyticsInputSchema = z.object({
  engagementData: z
    .string()
    .describe('The data representing participant engagement.'),
});
export type SummarizeAnalyticsInput = z.infer<typeof SummarizeAnalyticsInputSchema>;

const SummarizeAnalyticsOutputSchema = z.object({
  summary: z.string().describe('A summary of participant engagement.'),
  suggestions: z.string().describe('Suggestions for improving future events.'),
});
export type SummarizeAnalyticsOutput = z.infer<typeof SummarizeAnalyticsOutputSchema>;

export async function summarizeAnalytics(input: SummarizeAnalyticsInput): Promise<SummarizeAnalyticsOutput> {
  return summarizeAnalyticsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAnalyticsPrompt',
  input: {schema: SummarizeAnalyticsInputSchema},
  output: {schema: SummarizeAnalyticsOutputSchema},
  prompt: `You are an AI assistant helping event organizers understand participant engagement and improve future events.

  Analyze the following engagement data and provide a summary of participant engagement and suggestions for improvement.

  Engagement Data:
  {{engagementData}}

  Summary:
  Suggestions:
  `,
});

const summarizeAnalyticsFlow = ai.defineFlow(
  {
    name: 'summarizeAnalyticsFlow',
    inputSchema: SummarizeAnalyticsInputSchema,
    outputSchema: SummarizeAnalyticsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
