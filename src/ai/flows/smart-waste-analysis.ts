'use server';
/**
 * @fileOverview Advanced Smart Waste Analysis AI Flow.
 * 
 * This flow identifies waste items with high precision, classifies them, 
 * provides material analysis, and calculates potential environmental impact.
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
  description: z.string().describe("A professional technical description of the item."),
  materialAnalysis: z.string().describe("Detailed breakdown of the materials found in the object (e.g., HDPE Plastic, Aluminum)."),
  disposalMethod: z.string().describe("Step-by-step instructions on how to dispose of this specific item in Madurai."),
  environmentalImpact: z.string().describe("The estimated positive impact of recycling this item (e.g., water saved, CO2 reduced)."),
  confidence: z.number().min(0).max(1).describe("Confidence score of the identification (0-1)."),
});

export type SmartWasteOutput = z.infer<typeof SmartWasteOutputSchema>;

const smartWastePrompt = ai.definePrompt({
  name: 'smartWastePrompt',
  input: { schema: SmartWasteInputSchema },
  output: { schema: SmartWasteOutputSchema },
  prompt: `You are a high-precision Industrial Waste Classification AI, trained on a dataset of over 1 million urban waste samples.

Analyze the provided image with maximum accuracy. Perform the following:
1. Image Recognition: Identify the primary object and determine if it belongs to a municipal waste stream.
2. Classification: Categorize as Dry, Wet, E-waste, Hazardous, or Recyclable.
3. Material Forensics: Detail the material composition (e.g., 'Clear PET Plastic', 'Corrugated Cardboard').
4. Localization: Provide disposal instructions specific to Madurai's 'Clean City' guidelines.
5. Impact Analysis: Calculate the environmental benefit of diverting this specific item from a landfill.

Image: {{media url=imageDataUri}}

Return a highly accurate, structured technical analysis. Set the confidence score based on visual clarity and model matching.`,
});

export const smartWasteAnalysisFlow = ai.defineFlow(
  {
    name: 'smartWasteAnalysisFlow',
    inputSchema: SmartWasteInputSchema,
    outputSchema: SmartWasteOutputSchema,
  },
  async (input) => {
    const { output } = await smartWastePrompt(input);
    if (!output) throw new Error("Industrial AI core failed to stabilize. Analysis incomplete.");
    return output;
  }
);

export async function analyzeWaste(imageDataUri: string): Promise<SmartWasteOutput> {
  return smartWasteAnalysisFlow({ imageDataUri });
}
