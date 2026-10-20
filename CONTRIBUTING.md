# Contributing to yt-audio-mcp

Bug fixes, new tools, client setup guides and tests are all welcome. For bigger
changes (a new tool, a new dependency), open an issue first so we can agree on the
scope.

## Getting set up

You need Node.js 20+, yt-dlp and ffmpeg.

```bash
git clone https://github.com/DaniilPak/yt-audio-mcp.git
cd yt-audio-mcp
npm install
npm test
```

To try your changes in Claude Code, point an MCP entry at your clone's
`dist/index.js` (see the README) and start a new session.

## Guidelines

- Keep each PR focused on one change, and explain the problem it solves.
- Add tests in `src/*.test.ts` for logic that doesn't need the network.
- Call yt-dlp through `run()` in `src/ytdlp.ts`, with arguments as an array. Never
  build a shell command from user input.
- Only YouTube hosts are accepted on purpose; keep the allowlist strict.
- Run `npm test` before opening the PR.

## Reporting issues

Include your OS, Node.js version, `yt-dlp --version`, the MCP client you use, the
input you passed and the error you got. Many download failures are fixed by
`brew upgrade yt-dlp`, so try that first.

Security problems go through [SECURITY.md](SECURITY.md), not public issues.

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE).
