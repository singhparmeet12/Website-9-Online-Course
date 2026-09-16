import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEMO_USER_ID } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (category && category !== "All") {
      whereClause.category = category;
    }

    if (level && level !== "All") {
      whereClause.level = level;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tagline: { contains: search } },
      ];
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: {
          where: { userId: DEMO_USER_ID },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = courses.map((course) => {
      const enrollment = course.enrollments[0];
      const allLessons = course.modules.flatMap((m) => m.lessons);

      return {
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
        instructor: {
          id: course.instructor.id,
          name: course.instructor.name,
          title: course.instructor.title,
          avatar: course.instructor.avatar,
        },
        modulesCount: course.modules.length,
        lessonsCount: allLessons.length,
        isEnrolled: !!enrollment,
        progressPercent: enrollment ? enrollment.progressPercent : 0,
      };
    });

    return NextResponse.json({ courses: formatted });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
