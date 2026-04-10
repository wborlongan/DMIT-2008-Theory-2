
import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "../test/msw/server";

vi.mock("next/image", () => ({
  default: ({ alt, src, unoptimized, ...props }) => {
    const resolvedSrc = typeof src === "string" ? src : src?.src || "";
    return createElement("img", { alt, src: resolvedSrc, ...props });
  },
}));

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
