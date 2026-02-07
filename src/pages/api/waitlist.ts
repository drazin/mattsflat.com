import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { waitlist } from '../../lib/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "That doesn't look like an email. Matt's not mad, just disappointed.",
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, normalizedEmail));

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "You're already on the list! Matt appreciates the enthusiasm.",
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.insert(waitlist).values({ email: normalizedEmail });

    return new Response(
      JSON.stringify({
        success: true,
        message: "You're on the list. Matt personally noted your email. On a napkin. Just kidding — it's in a database. But he's still excited.",
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Something went wrong. Even Matt's drink is smoother than this.",
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
