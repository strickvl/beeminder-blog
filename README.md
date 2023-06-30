# blog

## Post Ideas

Ideas for new blog posts live here as gissues.
Danny curates the collection via
[freshgishing][3]
aka
[backlog freshening][4].

## Post Markdown

The frontmatter for each post is a [YAML][1] block at the top of the file:

```yaml
---
title: The Title of the Post
date: 2021-01-01
author: Danny
tags: [tag1, tag2]
image:
  src: /images/2021-01-01-title-of-post/image.png
  alt: alt text
status: publish
---
The actual content of the post goes here.
```

In addition, all Beeminder extended features documented [here][2] are supported.

## Development

```bash
nvm use
pnpm install
pnpm run dev
pnpm run test
```

## Production

Commits merged to `master` are automatically deployed via <render.com>.

[1]: https://quickref.me/yaml
[2]: http://expost.padm.us/
[3]: https://www.beeminder.com/d/freshblog "Danny's Beeminder goal for curating the collection of blog post drafts and notes"
[4]: https://blog.beeminder.com/freshen/ "Nerd version; see also the sequel post"
