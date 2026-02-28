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
  infrastructure: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['Sluice Gate', 'Pumping Station', 'Culvert']),
    status: z.enum(['Open', 'Closed', 'Partially Obstructed', 'Operational']),
    lastService: z.string(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
  })).describe('Critical drainage infrastructure nodes.'),
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
2. Include district-level infrastructure like the Vandiyur Pumping Station and Vaigai Sluice Gates.
3. Use graph-theoretic logic: analyze how upstream waste dumping in zones like Bibikulam correlates with downstream blockages near the Vaigai river.
4. Predict flood risks specifically identifying "waste-induced blockages" which differ from hydraulic bottlenecks.
5. Provide technical causes (e.g., "PET bottle mass at junction point 42").
6. The Network Health Index should reflect the simulated rainfall intensity (higher rain + higher waste = lower health).

Ensure the data is technically consistent and follows the DrainageDataOutputSchema perfectly.`,
});

const drainageDataFlow = ai.defineFlow(
  {
    name: 'drainageDataFlow',
    outputSchema: DrainageDataOutputSchema,
  },
  async () => {
    try {
      const { output } = await drainageDataPrompt();
      if (!output) throw new Error('Failed to generate Drainage Monitoring data.');
      return output;
    } catch (error: any) {
      // Fallback for quota issues or API failures to ensure UI remains functional
      return {
        networkHealthIndex: 72,
        stps: [
          { name: "Sakkimangalam", inflow: 132, wasteLoad: 18, status: "Optimal" },
          { name: "Avaniapuram", inflow: 105, wasteLoad: 24, status: "Optimal" }
        ],
        infrastructure: [
          { id: "NODE-01", name: "Vandiyur Pumping Station", type: "Pumping Station", status: "Operational", lastService: "2024-03-10", coordinates: { lat: 9.9200, lng: 78.1600 } },
          { id: "GATE-04", name: "Vaigai Sluice Gate 4", type: "Sluice Gate", status: "Partially Obstructed", lastService: "2024-03-05", coordinates: { lat: 9.9300, lng: 78.1300 } },
          { id: "CUL-12", name: "Anna Nagar Culvert", type: "Culvert", status: "Open", lastService: "2024-02-28", coordinates: { lat: 9.9150, lng: 78.1450 } }
        ],
        activeBlockages: [
          { 
            location: "Goripalayam Junction", 
            severity: "High", 
            identifiedCause: "Plastic bottle accumulation at siphon point", 
            coordinates: { lat: 9.9312, lng: 78.1250 } 
          },
          { 
            location: "Sellur Channel B", 
            severity: "Critical", 
            identifiedCause: "Textile waste and silt buildup", 
            coordinates: { lat: 9.9400, lng: 78.1100 } 
          }
        ],
        floodPredictions: [
          { 
            zone: "Sellur", 
            probability: 65, 
            estimatedImpactTime: "45 mins", 
            reasoning: "Critical blockage detected in Sellur Channel B coupled with high rainfall intensity." 
          },
          { 
            zone: "Simmakkal", 
            probability: 30, 
            estimatedImpactTime: "120 mins", 
            reasoning: "Secondary runoff overflow from Vaigai banks predicted." 
          }
        ],
        rainfallSimulation: { intensity: 12, status: "Heavy Rain" }
      } as DrainageDataOutput;
    }
  }
);

export async function fetchDrainageRealtimeData(): Promise<DrainageDataOutput> {
  return drainageDataFlow();
}
