'use server';
/**
 * @fileOverview This file implements a Genkit flow to simulate real-time departmental data for the MCCC.
 * It provides realistic metrics for Health, Engineering, PWD, and Disaster Management with exact timestamps.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const McccDataOutputSchema = z.object({
  lastSyncTime: z.string().describe('The exact ISO timestamp of this data snapshot.'),
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
      timestamp: z.string(),
    })),
  }),
});

export type McccDataOutput = z.infer<typeof McccDataOutputSchema>;

const mcccDataPrompt = ai.definePrompt({
  name: 'mcccDataPrompt',
  output: { schema: McccDataOutputSchema },
  prompt: `You are the data intelligence core for the Madurai City Corporate Command Centre (MCCC).
Generate a realistic "real-time" snapshot of departmental data for Madurai today.

Important:
1. Include an exact ISO timestamp for "lastSyncTime" representing the current moment.
2. Madurai has 100 wards.
3. The Vaigai river is a key landmark; typical levels are 30-50ft.
4. Rainfall should be realistic for a tropical city (0-20mm usually).
5. Fleet data should show high activity during the day.
6. Provide exact timestamps for recentLogs (within the last 2 hours).

Ensure the data is structured correctly according to the McccDataOutputSchema.`,
});

export const mcccDataFlow = ai.defineFlow(
  {
    name: 'mcccDataFlow',
    outputSchema: McccDataOutputSchema,
  },
  async () => {
    try {
      const { output } = await mcccDataPrompt();
      if (!output) throw new Error('No output from AI');
      return {
        ...output,
        lastSyncTime: new Date().toISOString(), // Ensure current time is used
      };
    } catch (error: any) {
      // Robust fallback for any error (quota, etc)
      const now = new Date();
      return {
        lastSyncTime: now.toISOString(),
        health: { attendancePercent: 88, totalStaff: 1200, completedWards: 75, totalWards: 100 },
        engineering: { 
          fleetActive: 85, 
          fleetIdle: 15, 
          fuelConsumedLiters: 450, 
          gpsUptimePercent: 99,
          fleetZones: [{ name: "North", active: 20, idle: 5 }, { name: "South", active: 25, idle: 2 }]
        },
        pwd: { vaigaiLevelFeet: 35.5, warningLevelFeet: 50, tankStorageAvgPercent: 62 },
        disaster: { avgRainfallMm: 2.5, stations: [{ station: "Central", mm: 3 }, { station: "Airport", mm: 2 }] },
        citizens: {
          totalReportsDaily: 42,
          resolutionRatePercent: 92,
          trendPercent: 5,
          recentLogs: [
            { id: "1", zone: "Ward 42", issue: "Bin Overflow", status: "In Progress", color: "primary", timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString() },
            { id: "2", zone: "Ward 10", issue: "Sewerage Leak", status: "Submitted", color: "destructive", timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString() }
          ]
        }
      } as McccDataOutput;
    }
  }
);

export async function fetchMcccRealtimeData(): Promise<McccDataOutput> {
  return mcccDataFlow();
}
