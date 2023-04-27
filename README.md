# README

Remark plugin that merges adjacent identical inline nodes



## Features

- merges adjacent identical inline nodes
- inline nodes currently used: `emphasis`, `strong`, `link`



## Example

```js
import { unified, rehypeParse, rehypeRemark, remarkStringify } from "./deps.ts";
import remarkMergeAdjacent from "./src/main.ts";

const result = (await unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeRemark)
  .use(remarkMergeAdjacent)
  .use(remarkStringify)
  .process(`<strong>foo</strong><strong>bar</strong>`))
  .toString();
console.log(result);
```

Before

```html
<strong>foo</strong><strong>bar</strong>
```

After

```md
**foobar**
```
