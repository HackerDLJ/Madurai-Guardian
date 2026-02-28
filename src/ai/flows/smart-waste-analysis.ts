'use server';
/**
 * @fileOverview Smart Waste Analysis AI Flow.
 * 
 * This flow identifies waste items, classifies them into categories, 
 * provides a description, and gives disposal instructions based on an image input.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartWasteInputSchema = z.object({
  imageDataUri: z.string().describe("A photo of the waste item as a base64 data URI."),
});

const SmartWasteOutputSchema = z.object({
  isWaste: z.boolean().describe("Whether the item in the image is classified as waste."),
  wasteType: z.enum(['Dry', 'Wet', 'E-waste', 'Hazardous', 'Recyclable', 'Unknown']).describe("The classification of the waste."),
  itemName: z.string().describe("Common name of the item identified."),
  description: z.string().describe("A brief but informative description of the identified product or item."),
  disposalMethod: z.string().describe("Step-by-step instructions on how to dispose of this specific item in Madurai."),
  confidence: z.number().describe("Confidence score of the identification (0-1)."),
});

export type SmartWasteOutput = z.infer<typeof SmartWasteOutputSchema>;

const smartWastePrompt = ai.definePrompt({
  name: 'smartWastePrompt',
  input: { schema: SmartWasteInputSchema },
  output: { schema: SmartWasteOutputSchema },
  prompt: `You are a highly advanced Industrial Waste Classification AI.

Analyze the provided image and determine:
1. If the object is waste.
2. The specific type of waste (Dry, Wet, E-waste, etc.).
3. The common name of the item.
4. A detailed description of the scanned product, including its material and typical usage.
5. The correct disposal method following Madurai's municipal guidelines.

Image: {{media url=imageDataUri}}

Provide a detailed and accurate classification with a helpful description of the product.`,
});

export const smartWasteAnalysisFlow = ai.defineFlow(
  {
    name: 'smartWasteAnalysisFlow',
    inputSchema: SmartWasteInputSchema,
    outputSchema: SmartWasteOutputSchema,
  },
  async (input) => {
    const { output } = await smartWastePrompt(input);
    if (!output) throw new Error("AI failed to classify the item.");
    return output;
  }
);

export async function analyzeWaste(imageDataUri: string): Promise<SmartWasteOutput> {
  return smartWasteAnalysisFlow({ imageDataUri });
}
