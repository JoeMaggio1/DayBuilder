import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// React Testing Library doesn't unmount components between tests on its
// own; without this, each test's render() output piles up in the same
// DOM, causing later tests to see duplicate elements.
afterEach(() => {
  cleanup();
});
