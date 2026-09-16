import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = checkRateLimit(`newsletter:${ip}`, 10, 60000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many subscription requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = newsletterSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validated.data;

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        message: "You are already subscribed to the weekly milestone guide!",
      });
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({
      message: "Successfully subscribed to Pathwise Weekly!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process newsletter subscription" },
      { status: 500 }
    );
  }
}
