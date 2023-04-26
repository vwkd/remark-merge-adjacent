import {
  assertEquals,
  rehypeParse,
  rehypeRemark,
  remarkStringify,
  unified,
} from "../deps.ts";
import remarkMergeAdjacent from "./main.ts";

const pipeline = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeRemark)
  .use(remarkMergeAdjacent)
  .use(remarkStringify, {
    bullet: "-",
    emphasis: "_",
    fences: true,
    listItemIndent: "one",
    resourceLink: true,
    rule: "-",
  });

Deno.test("two strong, single child", async () => {
  const input = "<strong>foo</strong><strong>bar</strong>";
  const expected = "**foobar**\n";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});
