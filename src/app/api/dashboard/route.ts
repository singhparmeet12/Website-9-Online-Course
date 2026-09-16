import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOrCreateDemoUser, DEMO_USER_ID } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getOrCreateDemoUser();

    // Fetch enrolled courses with modules and lessons
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: true,
            modules: {
              orderBy: { order: "asc" },
              include: {
                lessons: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    // Fetch all user completions
    const completions = await prisma.lessonCompletion.findMany({
      where: { userId: user.id },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    const completedLessonIds = new Set(completions.map((c) => c.lessonId));

    // Format enrolled courses with mini-roadmap progress summary
    let nextIncompleteLesson: {
      lessonId: string;
      lessonTitle: string;
      courseSlug: string;
      courseTitle: string;
      moduleTitle: string;
      durationMinutes: number;
      type: string;
    } | null = null;

    const formattedEnrollments = enrollments.map((enr) => {
      const course = enr.course;
      const allLessons = course.modules.flatMap((m) =>
        m.lessons.map((l) => ({
          ...l,
          moduleTitle: m.title,
          isCompleted: completedLessonIds.has(l.id),
        }))
      );

      const completedInCourse = allLessons.filter((l) => l.isCompleted);
      const firstIncomplete = allLessons.find((l) => !l.isCompleted);

      // If we haven't picked a next lesson yet, take this course's first incomplete lesson
      if (!nextIncompleteLesson && firstIncomplete) {
        nextIncompleteLesson = {
          lessonId: firstIncomplete.id,
          lessonTitle: firstIncomplete.title,
          courseSlug: course.slug,
          courseTitle: course.title,
          moduleTitle: firstIncomplete.moduleTitle,
          durationMinutes: firstIncomplete.durationMinutes,
          type: firstIncomplete.type,
        };
      }

      // Map module milestones for mini-roadmap visualization
      const moduleMilestones = course.modules.map((m) => {
        const modLessons = m.lessons;
        const modCompleted = modLessons.filter((l) =>
          completedLessonIds.has(l.id)
        ).length;
        return {
          id: m.id,
          title: m.title,
          order: m.order,
          isCompleted: modLessons.length > 0 && modCompleted === modLessons.length,
          isCurrent: modCompleted > 0 && modCompleted < modLessons.length,
          completedCount: modCompleted,
          totalCount: modLessons.length,
        };
      });

      return {
        id: enr.id,
        courseId: course.id,
        courseSlug: course.slug,
        courseTitle: course.title,
        courseCategory: course.category,
        courseLevel: course.level,
        courseImage: course.image,
        instructor: {
          name: course.instructor.name,
          avatar: course.instructor.avatar,
        },
        progressPercent: enr.progressPercent,
        completedLessonsCount: completedInCourse.length,
        totalLessonsCount: allLessons.length,
        moduleMilestones,
        enrolledAt: enr.enrolledAt,
      };
    });

    // Calculate overall stats
    const totalLessonsCompleted = completions.length;
    const totalMinutesCompleted = completions.reduce(
      (acc, curr) => acc + curr.lesson.durationMinutes,
      0
    );
    const hoursLearned = (totalMinutesCompleted / 60).toFixed(1);

    return NextResponse.json({
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        streakDays: user.streakDays,
        xpPoints: user.xpPoints,
      },
      stats: {
        enrolledCoursesCount: enrollments.length,
        completedLessonsCount: totalLessonsCompleted,
        hoursLearned: parseFloat(hoursLearned),
        streakDays: user.streakDays,
        xpPoints: user.xpPoints,
      },
      nextIncompleteLesson,
      enrolledCourses: formattedEnrollments,
      recentCompletions: completions.slice(0, 5).map((c) => ({
        id: c.id,
        lessonTitle: c.lesson.title,
        courseTitle: c.lesson.module.course.title,
        courseSlug: c.lesson.module.course.slug,
        completedAt: c.completedAt,
        type: c.lesson.type,
      })),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// POST endpoint to quick-reset demo data or mark sample milestones for testing
export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === "reset") {
      // Reset demo user completions to initial state
      await prisma.lessonCompletion.deleteMany({
        where: { userId: DEMO_USER_ID },
      });

      // Seed default 6 completions for Next.js course
      const nextjsCourse = await prisma.course.findFirst({
        where: { slug: "nextjs-fullstack-architecture" },
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: { lessons: { orderBy: { order: "asc" } } },
          },
        },
      });

      if (nextjsCourse) {
        const lessons = nextjsCourse.modules.flatMap((m) => m.lessons);
        const sample = lessons.slice(0, 6);
        for (const l of sample) {
          await prisma.lessonCompletion.create({
            data: { userId: DEMO_USER_ID, lessonId: l.id },
          });
        }
        const pct = Math.round((sample.length / lessons.length) * 100);
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId: DEMO_USER_ID, courseId: nextjsCourse.id } },
          create: { userId: DEMO_USER_ID, courseId: nextjsCourse.id, progressPercent: pct },
          update: { progressPercent: pct },
        });
      }

      await prisma.user.update({
        where: { id: DEMO_USER_ID },
        data: { streakDays: 5, xpPoints: 1420 },
      });

      return NextResponse.json({ success: true, message: "Demo progress reset to defaults" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Dashboard reset error:", error);
    return NextResponse.json({ error: "Failed to execute action" }, { status: 500 });
  }
}
