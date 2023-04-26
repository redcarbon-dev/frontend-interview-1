import { PrismaClient } from "@prisma/client";
import { incidents } from "./incidents";

async function main() {
  const prisma = new PrismaClient();
  await prisma.incident.deleteMany({});
  for (const incident of incidents) {
    await prisma.incident.create({
      data: {
        ...incident,
      },
    });
  }
}

main()
  .then(() => {
    console.log("seeded");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
