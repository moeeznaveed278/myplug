import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Lazily initialize PrismaClient to avoid constructing it during module
// evaluation (which can run during Next.js build on Vercel). We return a
// Proxy that will create the real PrismaClient only when a property is
// accessed (i.e. when the first DB operation is performed).
function createLazyPrisma(): PrismaClient {
  let realClient: PrismaClient | null = null;

  const createClient = () => {
    if (!realClient) {
      realClient = new PrismaClient();
      if (process.env.NODE_ENV !== "production") globalThis.prisma = realClient;
    }
    return realClient;
  };

  // Create a proxy that forwards operations to the real client lazily
  const proxy = new Proxy(
    {},
    {
      get(_, prop) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client: any = createClient();
        return client[prop as keyof PrismaClient];
      },
      // allow calling functions like db.$connect()
      apply(_, __, args) {
        const client: any = createClient();
        return (client as any).apply(_, args);
      },
    }
  );

  return proxy as unknown as PrismaClient;
}

export const db: PrismaClient = globalThis.prisma || createLazyPrisma();
