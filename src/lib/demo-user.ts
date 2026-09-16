import prisma from "./prisma";

export const DEMO_USER_ID = "demo-student-alex";
export const DEMO_USER_EMAIL = "alex.turner@pathwise.edu";

export async function getOrCreateDemoUser() {
  const existing = await prisma.user.findUnique({
    where: { id: DEMO_USER_ID },
  });

  if (existing) {
    return existing;
  }

  // Create demo user if missing
  return await prisma.user.create({
    data: {
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      name: "Alex Turner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      streakDays: 5,
      xpPoints: 1280,
    },
  });
}
