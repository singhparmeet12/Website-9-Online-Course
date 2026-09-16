import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { progressSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getOrCreateDemoUser, DEMO_USER_ID } from "@/lib/demo-user";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = checkRateLimit(`progress:${ip}`, 60, 60000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many updates. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = progressSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { lessonId, courseId, completed } = validated.data;
    const userId = validated.data.userId || DEMO_USER_ID;

    await getOrCreateDemoUser();

    // Verify lesson and module exist
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Toggle completion in database
    if (completed) {
      await prisma.lessonCompletion.upsert({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        create: {
          userId,
          lessonId,
        },
        update: {},
      });

      // Award 50 XP
      await prisma.user.update({
        where: { id: userId },
        data: { xpPoints: { increment: 50 } },
      });
    } else {
      await prisma.lessonCompletion.deleteMany({
        where: {
          userId,
          lessonId,
        },
      });

      // Deduct 50 XP
      await prisma.user.update({
        where: { id: userId },
        data: { xpPoints: { decrement: 50 } },
      });
    }

    // Calculate updated course progress percentage
    const allCourseLessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    });

    const totalCourseLessonsCount = allCourseLessons.length;
    const completedCourseLessonsCount = await prisma.lessonCompletion.count({
      where: {
        userId,
        lesson: { module: { courseId } },
      },
    });

    const newProgressPercent =
      totalCourseLessonsCount > 0
        ? Math.round((completedCourseLessonsCount / totalCourseLessonsCount) * 100)
        : 0;

    // Upsert or update enrollment progress
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      create: {
        userId,
        courseId,
        progressPercent: newProgressPercent,
        completedAt: newProgressPercent === 100 ? new Date() : null,
      },
      update: {
        progressPercent: newProgressPercent,
        completedAt: newProgressPercent === 100 ? new Date() : null,
      },
    });

    // Check if the current module milestone was just unlocked/completed
    const moduleLessonIds = lesson.module.lessons.map((l) => l.id);
    const completedInModule = await prisma.lessonCompletion.count({
      where: {
        userId,
        lessonId: { in: moduleLessonIds },
      },
    });

    const milestoneUnlocked =
      completed && completedInModule === lesson.module.lessons.length;

    return NextResponse.json({
      success: true,
      lessonId,
      completed,
      progressPercent: newProgressPercent,
      completedLessonsCount: completedCourseLessonsCount,
      totalLessonsCount: totalCourseLessonsCount,
      milestoneUnlocked,
      moduleTitle: lesson.module.title,
    });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { error: "Failed to update lesson progress" },
      { status: 500 }
    );
  }
}
