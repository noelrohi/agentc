import { withUnkey } from "@unkey/nextjs";
import { unstable_expireTag as expireTag } from "next/cache";

export const POST = withUnkey(
  async (req) => {
    if (!req.unkey?.valid) {
      return new Response("Unauthorized", { status: 403 });
    }
    try {
      expireTag("items");
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
  {
    apiId: "api_2CuNTn1twmkNK4RntE9W8KTQLmjz",
  },
);
