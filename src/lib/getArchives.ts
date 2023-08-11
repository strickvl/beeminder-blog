import type { Post } from "../schemas/post";
import getPosts from "./getPosts";
import memoize from "./memoize";

export type Month = {
  label: string;
  posts: Post[];
  post_count: number;
};

type Year = {
  label: number;
  months: Month[];
  post_count: number;
};

type Archives = Year[];

const MONTH_LABELS = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

function isMonthIndex(m: number): m is keyof typeof MONTH_LABELS {
  return m in MONTH_LABELS;
}

function makeMonth(m: number, posts: Post[]): Month {
  if (!isMonthIndex(m)) throw new Error("Invalid month index");

  const monthPosts = posts.filter((p) => p.date.getMonth() === m);

  return {
    label: MONTH_LABELS[m],
    posts: monthPosts,
    post_count: monthPosts.length,
  };
}

function makeYear(yyyy: number, posts: Post[]): Year {
  const yearPosts = posts.filter((p) => p.date.getFullYear() === yyyy);
  const allMonths = [...new Set(yearPosts.map((p) => p.date.getMonth()))];
  return {
    label: yyyy,
    post_count: yearPosts.length,
    months: allMonths.map((m) => makeMonth(m, yearPosts)),
  };
}

async function makeArchives(): Promise<Archives> {
  const posts = await getPosts();
  const allYears = [...new Set(posts.map((p) => p.date.getFullYear()))];

  allYears.sort((a, b) => b - a);

  return allYears.map((yyyy) => makeYear(yyyy, posts));
}

const getArchives = memoize(makeArchives, "archives");

export default getArchives;
