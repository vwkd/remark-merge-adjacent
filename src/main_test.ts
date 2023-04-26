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

Deno.test("two strong, multiple children", async () => {
  const input = "<strong>foo<em>bar</em></strong><strong>baz</strong>";
  const expected = "**foo_bar_baz**\n";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("three strong, single child", async () => {
  const input = "<strong>foo</strong><strong>bar</strong><strong>baz</strong>";
  const expected = "**foobarbaz**\n";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two links, empty properties, single child", async () => {
  const input = "<a>foo</a><a>bar</a>";
  const expected = "[foobar]()\n";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two links, same properties, single child", async () => {
  const input =
    '<a href="https://example.com/foo">foo</a><a href="https://example.com/foo">bar</strong>';
  const expected = "[foobar](https://example.com/foo)\n";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});

Deno.test("two links, different properties, single child", async () => {
  const input =
    '<a href="https://example.com/foo">foo</a><a href="https://example.com/bar">bar</strong>';
  const expected =
    "[foo](https://example.com/foo)[bar](https://example.com/bar)\n";

  const actual = (await pipeline
    .process(input)).toString();

  assertEquals(actual, expected);
});
