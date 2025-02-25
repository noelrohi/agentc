import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  spec: {
    url: "./api/openapi.json",
  },
};

export const GET = ApiReference(config);
