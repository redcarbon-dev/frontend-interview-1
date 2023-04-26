import { type Incident } from "@prisma/client";
import { z } from "zod";
import {
  IncidentCheckSchema,
  IncidentStatusSchema,
  TagsSchema,
} from "~/schemas/checks";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const OrderTypeSchema = z.union([z.literal("desc"), z.literal("asc")]);

export const incindetsRouter = createTRPCRouter({
  listIncindets: publicProcedure
    .input(
      z.object({
        skip: z.number().int().min(0),
        take: z.number().int().min(0),
        filter: z
          .object({
            status: IncidentStatusSchema.array().optional(),
            assegnees: z.string().array().optional(),
          })
          .optional(),
        order: z.union([
          z.object({
            createdAt: OrderTypeSchema,
          }),
          z.object({
            severity: OrderTypeSchema,
          }),
        ]),
      })
    )
    .query(async ({ input, ctx }) => {
      const incidents = await ctx.prisma.incident.findMany({
        skip: input.skip,
        take: input.take,
        orderBy: {
          ...input.order,
        },
        where: {
          assignee: input.filter?.assegnees && {
            in: input.filter.assegnees,
          },
          status: input.filter?.status && {
            in: input.filter.status,
          },
        },
      });
      const total = await ctx.prisma.incident.count({
        where: {
          assignee: input.filter?.assegnees && {
            in: input.filter.assegnees,
          },
          status: input.filter?.status && {
            in: input.filter.status,
          },
        },
      });
      return {
        incidents: incidents.map(parsePrismaIncident),
        total,
      };
    }),
  getIncindentsAssegnees: publicProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const inc = await ctx.prisma.incident.groupBy({
        by: ["assignee"],
        where: {
          assignee: {
            not: null,
          },
        },
      });
      return inc.map((user) => user.assignee);
    }),
  assignIncident: publicProcedure
    .input(
      z.object({
        incindetId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.incident.update({
        where: {
          id: input.incindetId,
          status: "open",
          assignee: null,
        },
        data: {
          assignee: ctx.user,
          status: "under_investigation",
        },
      });
    }),
  closeIncident: publicProcedure
    .input(
      z.object({
        incindetId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.incident.update({
        where: {
          id: input.incindetId,
          status: "under_investigation",
          assignee: ctx.user,
        },
        data: {
          assignee: ctx.user,
          status: "closed",
        },
      });
    }),
});

function parsePrismaIncident(inc: Incident) {
  return {
    ...inc,
    tags: TagsSchema.parse(JSON.parse(inc.tags)),
    checksData: IncidentCheckSchema.parse(JSON.parse(inc.checksData)),
    status: IncidentStatusSchema.parse(inc.status),
  };
}
