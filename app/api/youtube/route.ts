import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // ================================================================
    // SEARCH QUERY
    // ================================================================

    const query = request.nextUrl.searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // ================================================================
    // API KEY
    // ================================================================

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "YOUTUBE_API_KEY is missing" },
        { status: 500 }
      );
    }

    // ================================================================
    // YOUTUBE API PARAMS
    // ================================================================

    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      videoCategoryId: "10",
      videoEmbeddable: "true",
      maxResults: "10",
      regionCode: "ID",
      key: apiKey,
    });

    // ================================================================
    // REQUEST YOUTUBE API
    // ================================================================

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    const data = await response.json();

    // ================================================================
    // YOUTUBE API ERROR
    // ================================================================

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error?.message || "YouTube API request failed",
        },
        { status: response.status }
      );
    }

    // ================================================================
    // RESPONSE
    // ================================================================

    return NextResponse.json(data);
  } catch (error) {
    console.error("YouTube API Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}