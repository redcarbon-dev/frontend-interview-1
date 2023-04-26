import { createTRPCRouter } from "~/server/api/trpc";
import { incindetsRouter } from "~/server/api/routers/incidents";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  incidents: incindetsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
