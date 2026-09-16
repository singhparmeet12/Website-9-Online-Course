import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enrollSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getOrCreateDemoUser, DEMO_USER_ID } from "@/lib/demo-user";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = checkRateLimit(`enroll:${ip}`, 30, 60000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many enrollment attempts. Please slow down." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = enrollSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { courseId } = validated.data;
    const userId = validated.data.userId || DEMO_USER_ID;

    // Ensure demo user exists
    await getOrCreateDemoUser();

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check existing enrollment
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existing) {
      return NextResponse.json({
        message: "Already enrolled",
        enrollment: existing,
      });
    }

    // Create new enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        progressPercent: 0,
      },
    });

    return NextResponse.json({
      message: "Successfully enrolled in course",
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Failed to enroll in course" }, { status: 500 });
  }
}
