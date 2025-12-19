import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    // To set an admin role:
    // Go to Clerk Dashboard -> Users -> Select User -> Metadata -> Public Metadata -> Add {'role': 'admin'}.
    const { userId, redirectToSignIn, sessionClaims } = await auth();

    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // Role-based access control (Admin vs Customer)
    // NOTE: Depending on your Clerk JWT/session config, role may live under `sessionClaims.metadata.role`
    // or `sessionClaims.publicMetadata.role`. We check both for robustness.
    const role =
      (sessionClaims as any)?.metadata?.role ??
      (sessionClaims as any)?.publicMetadata?.role;

    // If role is not included in sessionClaims, fall back to fetching the Clerk user.
    const effectiveRole =
      role ??
      ((await (await clerkClient()).users.getUser(userId))?.publicMetadata as any)?.role;

    if (effectiveRole !== "admin") {
      return Response.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};


