'use server';
/**
 * @fileOverview This file implements a Genkit flow to simulate real-time departmental data for the MCCC.
 * It provides realistic metrics for Health, Engineering, PWD, and Disaster Management.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const McccDataOutputSchema = z.object({
  health: z.object({
    attendancePercent: z.number(),
    totalStaff: z.number(),
    completedWards: z.number(),
    totalWards: z.number(),
  }),
  engineering: z.object({
    fleetActive: z.number(),
    fleetIdle: z.number(),
    fuelConsumedLiters: z.number(),
    gpsUptimePercent: z.number(),
    fleetZones: z.array(z.object({ name: z.string(), active: z.number(), idle: z.number() })),
  }),
  pwd: z.object({
    vaigaiLevelFeet: z.number(),
    warningLevelFeet: z.number(),
    tankStorageAvgPercent: z.number(),
  }),
  disaster: z.object({
    avgRainfallMm: z.number(),
    stations: z.array(z.object({ station: z.string(), mm: z.number() })),
  }),
  citizens: z.object({
    totalReportsDaily: z.number(),
    resolutionRatePercent: z.number(),
    trendPercent: z.number(),
    recentLogs: z.array(z.object({
      id: z.string(),
      zone: z.string(),
      issue: z.string(),
      status: z.string(),
      color: z.string(),
    })),
  }),
});

export type McccDataOutput = z.infer<typeof McccDataOutputSchema>;

const mcccDataPrompt = ai.definePrompt({
  name: 'mcccDataPrompt',
  output: { schema: McccDataOutputSchema },
  prompt: `You are the data intelligence core for the Madurai City Corporate Command Centre (MCCC).
Generate a realistic "real-time" snapshot of departmental data for Madurai today.

Considerations:
1. Madurai has 100 wards.
2. The Vaigai river is a key landmark; typical levels are 30-50ft.
3. Rainfall should be realistic for a tropical city (0-20mm usually).
4. Fleet data should show high activity during the day.

Ensure the data is structured correctly according to the McccDataOutputSchema.`,
});

export const mcccDataFlow = ai.defineFlow(
  {
    name: 'mcccDataFlow',
    outputSchema: McccDataOutputSchema,
  },
  async () => {
    const { output } = await mcccDataPrompt();
    if (!output) throw new Error('Failed to generate MCCC real-time data.');
    return output;
  }
);

export async function fetchMcccRealtimeData(): Promise<McccDataOutput> {
  return mcccDataFlow();
}
