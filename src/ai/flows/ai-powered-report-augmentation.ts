'use server';
/**
 * @fileOverview This file implements an AI-powered report augmentation flow.
 * It analyzes an image and description of a cleanliness issue to suggest
 * report categories and enrich the description.
 *
 * - augmentReport - The main function to call for report augmentation.
 * - ReportAugmentationInput - The input type for the augmentReport function.
 * - ReportAugmentationOutput - The return type for the augmentReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReportAugmentationInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a cleanliness issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z
    .string()
    .describe('A brief description of the cleanliness issue.')
    .optional(),
});
export type ReportAugmentationInput = z.infer<typeof ReportAugmentationInputSchema>;

const ReportAugmentationOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe(
      "An array of relevant categories for the report (e.g., 'Trash Overflow', 'Illegal Dumping', 'Street Sweeping Needed')."
    ),
  enrichedDescription: z
    .string()
    .describe(
      'An enriched and more detailed description of the cleanliness issue, incorporating observations from the image.'
    ),
});
export type ReportAugmentationOutput = z.infer<typeof ReportAugmentationOutputSchema>;

const reportAugmentationPrompt = ai.definePrompt({
  name: 'reportAugmentationPrompt',
  input: {schema: ReportAugmentationInputSchema},
  output: {schema: ReportAugmentationOutputSchema},
  prompt: `You are an AI assistant for the Madurai Guardian app, specialized in analyzing urban cleanliness issues.
Your task is to analyze the provided image and description of a cleanliness issue and perform two main actions:
1. Suggest relevant categories for the report based on the visual and textual information.
2. Enrich and expand the provided description, adding more details based on your observations from the image.

Here are some example categories you can use: 'Trash Overflow', 'Illegal Dumping', 'Street Sweeping Needed', 'Broken Infrastructure', 'Public Health Hazard', 'Animal Waste', 'Water Logging', 'Other'.

If no description is provided, analyze the image carefully to generate both categories and a detailed description.

Image: {{media url=imageDataUri}}
Description: {{{description}}}

Output ONLY a JSON object matching the ReportAugmentationOutputSchema. Do not include any other text or formatting.`,
});

const reportAugmentationFlow = ai.defineFlow(
  {
    name: 'reportAugmentationFlow',
    inputSchema: ReportAugmentationInputSchema,
    outputSchema: ReportAugmentationOutputSchema,
  },
  async input => {
    const {output} = await reportAugmentationPrompt(input);
    if (!output) {
      throw new Error('Failed to augment report: No output from AI model.');
    }
    return output;
  }
);

export async function augmentReport(
  input: ReportAugmentationInput
): Promise<ReportAugmentationOutput> {
  return reportAugmentationFlow(input);
}
