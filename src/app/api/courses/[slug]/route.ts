import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEMO_USER_ID } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const course = await prisma.course.findUnique({
      where: { slug },
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
        enrollments: {
          where: { userId: DEMO_USER_ID },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Fetch user completions for this course
    const completions = await prisma.lessonCompletion.findMany({
      where: {
        userId: DEMO_USER_ID,
        lesson: {
          module: { courseId: course.id },
        },
      },
      select: { lessonId: true },
    });

    const completedLessonIds = new Set(completions.map((c) => c.lessonId));

    const modulesWithCompletion = course.modules.map((m) => ({
      id: m.id,
      courseId: m.courseId,
      title: m.title,
      order: m.order,
      description: m.description,
      icon: m.icon,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        moduleId: l.moduleId,
        title: l.title,
        order: l.order,
        durationMinutes: l.durationMinutes,
        type: l.type,
        summary: l.summary,
        content: l.content,
        videoUrl: l.videoUrl,
        isCompleted: completedLessonIds.has(l.id),
      })),
    }));

    const enrollment = course.enrollments[0];

    return NextResponse.json({
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        tagline: course.tagline,
        description: course.description,
        category: course.category,
        level: course.level,
        durationHours: course.durationHours,
        price: course.price,
        rating: course.rating,
        reviewsCount: course.reviewsCount,
        image: course.image,
        featured: course.featured,
        instructor: course.instructor,
        modules: modulesWithCompletion,
        isEnrolled: !!enrollment,
        progressPercent: enrollment ? enrollment.progressPercent : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course details" }, { status: 500 });
  }
}
