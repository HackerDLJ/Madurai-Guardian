'use server';
/**
 * @fileOverview This file implements a Genkit flow to simulate real-time sensor data for city bins.
 * It provides metrics for fill levels, gas concentrations, and interactive billboard content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HygieneDataOutputSchema = z.object({
  fillLevel: z.number().min(0).max(100),
  gasLevels: z.object({
    ammonia: z.number().describe('Ammonia level in ppm'),
    hydrogenSulfide: z.number().describe('Hydrogen Sulfide level in ppm'),
  }),
  gasStatus: z.enum(['Normal', 'Warning', 'Critical']),
  trendData: z.array(z.object({
    time: z.string(),
    nh3: z.number(),
    h2s: z.number(),
  })),
  currentTip: z.string().describe('An educational tip for the 50-inch billboard display.'),
  nodeId: z.string().describe('The sensor node identifier.'),
});

export type HygieneDataOutput = z.infer<typeof HygieneDataOutputSchema>;

const hygieneDataPrompt = ai.definePrompt({
  name: 'hygieneDataPrompt',
  output: { schema: HygieneDataOutputSchema },
  prompt: `You are the sensor mesh intelligence for Madurai Guardian.
Generate a realistic "real-time" telemetry snapshot for a smart bin sensor node in Madurai.

Context:
1. Node ID is usually something like "Ward 42 Node-B1".
2. Fill level should be between 20% and 95%.
3. Ammonia (NH3) safe range is 0-25ppm. Hydrogen Sulfide (H2S) safe range is 0-10ppm.
4. Generate a 6-hour trend showing slight fluctuations.
5. Provide a meaningful educational tip or "Thank You" message for a citizen who just used the bin.

Ensure the data is structured correctly according to the HygieneDataOutputSchema.`,
});

export const hygieneDataFlow = ai.defineFlow(
  {
    name: 'hygieneDataFlow',
    outputSchema: HygieneDataOutputSchema,
  },
  async () => {
    try {
      const { output } = await hygieneDataPrompt();
      if (!output) throw new Error('Failed to generate Hygiene real-time telemetry.');
      return output;
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.message?.includes('quota')) {
        return {
          fillLevel: 65,
          gasLevels: { ammonia: 12.5, hydrogenSulfide: 3.2 },
          gasStatus: 'Normal',
          trendData: [
            { time: "12 PM", nh3: 10, h2s: 2 },
            { time: "1 PM", nh3: 12, h2s: 3 },
            { time: "2 PM", nh3: 15, h2s: 4 },
            { time: "3 PM", nh3: 14, h2s: 3 },
            { time: "4 PM", nh3: 12, h2s: 3 },
            { time: "5 PM", nh3: 11, h2s: 2 }
          ],
          currentTip: "Remember to segregate your plastic waste to keep Madurai green!",
          nodeId: "Ward 42 Node-B1"
        } as HygieneDataOutput;
      }
      throw error;
    }
  }
);

export async function fetchHygieneRealtimeData(): Promise<HygieneDataOutput> {
  return hygieneDataFlow();
}
