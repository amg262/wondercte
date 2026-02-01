import { getGlobalLeaderboard, getGroupLeaderboard } from "@/lib/actions/leaderboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Function to send data
      const sendUpdate = async () => {
        try {
          const leaderboard = groupId
            ? await getGroupLeaderboard(groupId)
            : await getGlobalLeaderboard(100);

          const data = `data: ${JSON.stringify(leaderboard)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          console.error("Error sending SSE update:", error);
        }
      };

      // Send initial data
      await sendUpdate();

      // Send updates every 10 seconds
      const interval = setInterval(sendUpdate, 10000);

      // Cleanup on connection close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
