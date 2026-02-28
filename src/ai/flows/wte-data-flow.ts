'use server';
/**
 * @fileOverview This file implements a Genkit flow for Waste-to-Energy (WtE) Optimization.
 * It simulates AI analysis of feedstock for anaerobic digestion facilities in Madurai.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WteDataOutputSchema = z.object({
  efficiencyIndex: z.number().min(0).max(100).describe('Overall operational efficiency of the WtE plant.'),
  totalThroughput: z.number().describe('Total waste processed today in metric tons.'),
  feedstock: z.object({
    moistureContent: z.number().describe('Average moisture content percentage.'),
    organicRatio: z.number().describe('Percentage of organic/biodegradable waste.'),
    composition: z.array(z.object({
      type: z.string(),
      percentage: z.number(),
    })),
  }),
  methaneProduction: z.object({
    currentYield: z.number().describe('Current methane yield in cubic meters per hour.'),
    predictedYield24h: z.number().describe('Predicted methane yield for the next 24 hours.'),
    status: z.enum(['Optimal', 'Sub-optimal', 'Inhibited']),
  }),
  energyOutput: z.object({
    kwhGenerated: z.number().describe('Total electricity generated today in kWh.'),
    streetlightsPowered: z.number().describe('Number of smart streetlights currently powered.'),
    gridStability: z.number().min(0).max(100).describe('Smart-grid stability index.'),
  }),
  optimizationTips: z.array(z.string()).describe('AI-generated tips to improve methane yield.'),
});

export type WteDataOutput = z.infer<typeof WteDataOutputSchema>;

const wteDataPrompt = ai.definePrompt({
  name: 'wteDataPrompt',
  output: { schema: WteDataOutputSchema },
  prompt: `You are the Energy Intelligence AI for Madurai's Waste-to-Energy (WtE) program.
Generate a realistic "real-time" analytical snapshot of the anaerobic digestion facilities today.

Contextual Intelligence:
1. Madurai processes roughly 600-800 tons of waste daily, with 70% being organic.
2. Anaerobic digestion performance is highly sensitive to moisture and feedstock balance.
3. The electricity generated is used for the city's smart-grid streetlights.
4. If moisture is too high (>80%), methane production might be "Sub-optimal".
5. Provide technical optimization tips (e.g., "Increase dry carbon-rich feedstock to balance high nitrogen from organic waste").

Ensure the data is technically consistent and follows the WteDataOutputSchema perfectly.`,
});

const wteDataFlow = ai.defineFlow(
  {
    name: 'wteDataFlow',
    outputSchema: WteDataOutputSchema,
  },
  async () => {
    try {
      const { output } = await wteDataPrompt();
      if (!output) throw new Error('Failed to generate WtE optimization data.');
      return output;
    } catch (error: any) {
      // Fallback for quota issues
      return {
        efficiencyIndex: 88,
        totalThroughput: 420,
        feedstock: {
          moistureContent: 65,
          organicRatio: 72,
          composition: [
            { type: "Food Waste", percentage: 55 },
            { type: "Green Waste", percentage: 25 },
            { type: "Agri Residue", percentage: 20 }
          ]
        },
        methaneProduction: {
          currentYield: 1250,
          predictedYield24h: 32000,
          status: "Optimal"
        },
        energyOutput: {
          kwhGenerated: 8400,
          streetlightsPowered: 4200,
          gridStability: 99
        },
        optimizationTips: [
          "Maintain moisture content between 60-70% for peak bacterial activity.",
          "Pre-sorting required for Zone 4 feedstock to remove non-biodegradable plastics."
        ]
      } as WteDataOutput;
    }
  }
);

export async function fetchWteRealtimeData(): Promise<WteDataOutput> {
  return wteDataFlow();
}
