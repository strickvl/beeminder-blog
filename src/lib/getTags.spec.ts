import { describe, it, expect, beforeEach, vi } from "vitest";
import getTags from "./getTags";
import loadLegacyData from "./test/loadLegacyData";
import readSources from "./readSources";

describe("getTags", () => {
  beforeEach(() => {
    vi.mocked(readSources).mockReturnValue(["https://padm.us/psychpricing"]);
    loadLegacyData([
      {
        expost_source_url: "https://padm.us/psychpricing",
        Slug: "psychpricing",
        Tags: "the_tag",
        Date: "2021-09-01",
        Status: "publish",
        dsq_thread_id: "abc",
      },
    ]);
  });

  it("returns tags", async () => {
    const result = await getTags();

    expect(result.length).toEqual(1);
  });

  it("includes posts in tags", async () => {
    const result = await getTags();

    expect(result[0]?.posts).toHaveLength(1);
  });

  it("includes post count on tags", async () => {
    const result = await getTags();

    expect(result[0]?.count).toEqual(1);
  });

  it("includes tag name in tag", async () => {
    const result = await getTags();

    expect(result[0]?.name).toEqual("the_tag");
  });

  it("does not include blank tags", async () => {
    loadLegacyData([
      {
        expost_source_url: "https://padm.us/psychpricing",
        Slug: "psychpricing",
        Tags: "",
        Date: "2021-09-01",
        dsq_thread_id: "abc",
      },
    ]);

    const result = await getTags();

    expect(Object.keys(result)).toHaveLength(0);
  });
});
