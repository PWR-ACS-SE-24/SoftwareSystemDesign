import { assertEquals } from "@std/assert";
import { sha256 } from "./hash.ts";

Deno.test("sha256 should return the correct hash", async () => {
  for (
    const [input, expected] of [
      ["", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
      ["test", "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"],
      ["hello world", "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"],
    ]
  ) {
    const actual = await sha256(input);

    assertEquals(actual, expected);
  }
});
