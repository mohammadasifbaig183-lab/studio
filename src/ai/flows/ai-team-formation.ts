'use server';

/**
 * @fileOverview An AI-powered team formation flow.
 *
 * - aiTeamFormation - A function that handles the team formation process.
 * - AiTeamFormationInput - The input type for the aiTeamFormation function.
 * - AiTeamFormationOutput - The return type for the aiTeamFormation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTeamFormationInputSchema = z.object({
  userProfiles: z.array(
    z.object({
      userId: z.string().describe('The unique identifier of the user.'),
      skills: z.array(z.string()).describe('The skills of the user.'),
      interests: z.array(z.string()).describe('The interests of the user.'),
    })
  ).describe('An array of user profiles, each containing skills and interests.'),
  teamSize: z.number().int().positive().describe('The desired team size.'),
});
export type AiTeamFormationInput = z.infer<typeof AiTeamFormationInputSchema>;

const AiTeamFormationOutputSchema = z.array(
  z.array(z.string()).describe('An array of teams, where each team is an array of user IDs.')
);
export type AiTeamFormationOutput = z.infer<typeof AiTeamFormationOutputSchema>;

export async function aiTeamFormation(input: AiTeamFormationInput): Promise<AiTeamFormationOutput> {
  return aiTeamFormationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTeamFormationPrompt',
  input: {schema: AiTeamFormationInputSchema},
  output: {schema: AiTeamFormationOutputSchema},
  prompt: `You are an expert team formation AI.

Given a list of user profiles, each with a list of skills and interests, form teams of the specified size.

Each team should have members with complementary skills and shared interests where possible.

User Profiles:
{{#each userProfiles}}
- User ID: {{this.userId}}
  Skills: {{#each this.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Interests: {{#each this.interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}

Team Size: {{{teamSize}}}

Output the teams as a JSON array of arrays, where each inner array is a team of user IDs.

Ensure that all users are assigned to a team.
`,
});

const aiTeamFormationFlow = ai.defineFlow(
  {
    name: 'aiTeamFormationFlow',
    inputSchema: AiTeamFormationInputSchema,
    outputSchema: AiTeamFormationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
