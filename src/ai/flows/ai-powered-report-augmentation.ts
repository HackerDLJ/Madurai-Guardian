'use server';
/**
 * @fileOverview This file implements an advanced AI-powered report augmentation flow.
 * It simulates a YOLOv8-style analysis to identify 6 waste fractions and estimate volume.
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

const WasteFractionsSchema = z.object({
  plastic: z.number().describe('Estimated volume of plastic waste in cubic meters.'),
  paper: z.number().describe('Estimated volume of paper waste in cubic meters.'),
  organic: z.number().describe('Estimated volume of organic waste in cubic meters.'),
  metal: z.number().describe('Estimated volume of metal waste in cubic meters.'),
  ewaste: z.number().describe('Estimated volume of e-waste in cubic meters.'),
  hazardous: z.number().describe('Estimated volume of hazardous waste in cubic meters.'),
});

const ReportAugmentationOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe(
      "An array of relevant categories for the report (e.g., 'Trash Overflow', 'Illegal Dumping')."
    ),
  enrichedDescription: z
    .string()
    .describe(
      'An enriched and more detailed description of the cleanliness issue, incorporating observations from the image.'
    ),
  wasteFractions: WasteFractionsSchema,
  isVerified: z.boolean().describe('Whether the report is verified as a real cleanliness issue based on visual cues.'),
  totalEstimatedVolume: z.number().describe('Total estimated volume of waste in cubic meters.'),
});
export type ReportAugmentationOutput = z.infer<typeof ReportAugmentationOutputSchema>;

const reportAugmentationPrompt = ai.definePrompt({
  name: 'reportAugmentationPrompt',
  input: {schema: ReportAugmentationInputSchema},
  output: {schema: ReportAugmentationOutputSchema},
  prompt: `You are an expert Computer Vision assistant for the Madurai Guardian app. 
Your task is to analyze the provided image of an urban cleanliness issue and simulate a YOLOv8 classification.

1. Categorization: Suggest relevant categories.
2. Description: Enrich the user's input with specific visual details (e.g., types of debris, context).
3. Waste Fractions: Estimate the volume (in cubic meters) for the following 6 fractions: Plastic, Paper, Organic, Metal, E-waste, and Hazardous. If a fraction is not present, set its volume to 0.
4. Verification: Determine if this looks like a genuine report of waste accumulation.
5. Volume: Provide a total estimated volume.

Image: {{media url=imageDataUri}}
User Description: {{{description}}}

Output ONLY a JSON object matching the ReportAugmentationOutputSchema.`,
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
