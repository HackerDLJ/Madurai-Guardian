'use server';
/**
 * @fileOverview This file implements a Genkit flow for Dynamic Drainage Monitoring (Blue-Green Resilience).
 * It simulates AI analysis of UGD networks, correlating waste load with flood risks.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DrainageDataOutputSchema = z.object({
  networkHealthIndex: z.number().min(0).max(100).describe('Overall health of the UGD network based on flow and pressure sensors.'),
  stps: z.array(z.object({
    name: z.string().describe('Name of the Sewage Treatment Plant.'),
    inflow: z.number().describe('Current inflow in Million Liters per Day (MLD).'),
    wasteLoad: z.number().describe('Concentration percentage of solid waste detected in inflow.'),
    status: z.enum(['Optimal', 'High Load', 'Bypassing']).describe('Current operational status of the plant.'),
  })),
  activeBlockages: z.array(z.object({
    location: z.string().describe('Specific urban location or landmark.'),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Severity of the blockage based on pressure drop.'),
    identifiedCause: z.string().describe('AI analysis of the blockage cause (e.g., Plastic accumulation, silt).'),
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
  })),
  floodPredictions: z.array(z.object({
    zone: z.string().describe('Urban zone at risk of flooding.'),
    probability: z.number().min(0).max(100).describe('AI-calculated probability of flooding if rainfall continues.'),
    estimatedImpactTime: z.string().describe('Time until peak flood impact (e.g., "45 mins after rain").'),
    reasoning: z.string().describe('Graph-theoretic reasoning for the prediction.'),
  })),
  rainfallSimulation: z.object({
    intensity: z.number().describe('Simulated rainfall intensity in mm/hr.'),
    status: z.string().describe('Descriptive status of the rainfall event.'),
  }),
});

export type DrainageDataOutput = z.infer<typeof DrainageDataOutputSchema>;

const drainageDataPrompt = ai.definePrompt({
  name: 'drainageDataPrompt',
  output: { schema: DrainageDataOutputSchema },
  prompt: `You are the Blue-Green Resilience AI for Madurai's underground drainage (UGD) network.
Generate a realistic "real-time" analytical snapshot of the drainage system today.

Contextual Intelligence:
1. Madurai has major STPs at Sakkimangalam and Avaniapuram.
2. Use graph-theoretic logic: analyze how upstream waste dumping in zones like Bibikulam correlates with downstream blockages near the Vaigai river.
3. Predict flood risks specifically identifying "waste-induced blockages" which differ from hydraulic bottlenecks.
4. Provide technical causes (e.g., "PET bottle mass at junction point 42").
5. The Network Health Index should reflect the simulated rainfall intensity (higher rain + higher waste = lower health).

Ensure the data is technically consistent and follows the DrainageDataOutputSchema perfectly.`,
});

const drainageDataFlow = ai.defineFlow(
  {
    name: 'drainageDataFlow',
    outputSchema: DrainageDataOutputSchema,
  },
  async () => {
    const { output } = await drainageDataPrompt();
    if (!output) throw new Error('Failed to generate Drainage Monitoring data.');
    return output;
  }
);

export async function fetchDrainageRealtimeData(): Promise<DrainageDataOutput> {
  return drainageDataFlow();
}
