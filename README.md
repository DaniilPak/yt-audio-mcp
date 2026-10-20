<div align="center">

# 🎧 yt-audio-mcp

### Turn any YouTube or YouTube Music link into an MP3, right from your AI agent.

**Ask "download Daft Punk – One More Time as an MP3" and get a tagged file with cover art in your Music folder.**

[![CI](https://github.com/DaniilPak/yt-audio-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/DaniilPak/yt-audio-mcp/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](LICENSE)
[![MCP server](https://img.shields.io/badge/MCP-server-5c4ee5?style=flat-square)](https://modelcontextprotocol.io)
[![Node.js 20+](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)](package.json)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-2ea44f?style=flat-square)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/DaniilPak/yt-audio-mcp?style=flat-square)](https://github.com/DaniilPak/yt-audio-mcp/stargazers)

[Quick start](#quick-start) · [Tools](#tools) · [Clients](#connect-your-client) · [The "respect" shortcut](#the-respect-shortcut) · [FAQ](#faq) · [Contributing](#contributing)

</div>

---

yt-audio-mcp is a small [Model Context Protocol](https://modelcontextprotocol.io) server
that gives Claude Code, Claude Desktop, Cursor or any other MCP client three tools:
search YouTube, download a track as MP3, and list what you already have.

Under the hood it runs [yt-dlp](https://github.com/yt-dlp/yt-dlp) and ffmpeg, which
keep working as YouTube changes. Everything runs on your machine; no API keys, no
accounts, no cloud.

```text
You:    respect daft punk one more time
Claude: Daft Punk - One More Time (Official Video), 5:21
        → ~/Music/yt-audio-mcp/Daft Punk - One More Time (Official Video) [FGBhQbmPwH8].mp3
```

## Quick start

### 1. Install yt-dlp and ffmpeg

```bash
brew install yt-dlp ffmpeg        # macOS
# Linux: install ffmpeg from your package manager and yt-dlp from https://github.com/yt-dlp/yt-dlp#installation
```

Keep yt-dlp current (`brew upgrade yt-dlp`), since YouTube changes often.

### 2. Build the server

```bash
git clone https://github.com/DaniilPak/yt-audio-mcp.git
cd yt-audio-mcp
npm install && npm run build
```

### 3. Add it to Claude Code

```bash
claude mcp add yt-audio --scope user -e YT_AUDIO_DIR=~/Music/yt-audio-mcp -- node "$PWD/dist/index.js"
```

Start a new Claude Code session and ask it to download a song.

## Tools

| Tool | Input | Returns |
|---|---|---|
| `download_mp3` | `url` (youtube.com, music.youtube.com, youtu.be, or an 11-character video ID), `bitrate` (`"0"` best VBR by default, or `320K` / `256K` / `192K` / `128K`), `force` | `{ id, title, duration, uploader, filepath, cached }` |
| `search_youtube` | `query`, `limit` (1–25, default 5) | `[{ id, title, duration, channel, url }]` |
| `list_downloads` | none | MP3s in the output folder, newest first |

- **Tagged files:** saved as `<title> [<videoId>].mp3` with ID3 tags and the cover art embedded.
- **No duplicates:** a video you already downloaded is returned from disk. Pass `force: true` to download it again.
- **Single tracks only:** playlist parameters (`&list=…`) are dropped.
- **Safe input:** only YouTube hosts are accepted, and yt-dlp is called without a shell.

## Connect your client

### Claude Desktop

Add this to `~/Library/Application Support/Claude/claude_desktop_config.json`
(macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows), with the path
to your clone:

```json
{
  "mcpServers": {
    "yt-audio": {
      "command": "node",
      "args": ["/path/to/yt-audio-mcp/dist/index.js"],
      "env": { "YT_AUDIO_DIR": "~/Music/yt-audio-mcp" }
    }
  }
}
```

### Cursor and other MCP clients

Any client that supports stdio MCP servers works. Use `node /path/to/yt-audio-mcp/dist/index.js`
as the command and set the environment variables below if you need them.

### Environment

| Variable | Default | Purpose |
|---|---|---|
| `YT_AUDIO_DIR` | `~/Music/yt-audio-mcp` | Where MP3s are saved |
| `YTDLP_PATH` | `yt-dlp` (from `PATH`) | Path to the yt-dlp binary |

Desktop apps often don't inherit your shell's `PATH`. If you see "yt-dlp not found",
set `YTDLP_PATH=/opt/homebrew/bin/yt-dlp`. If ffmpeg isn't found either, add
`"PATH": "/opt/homebrew/bin:/usr/bin:/bin"` to the `env` block.

## The "respect" shortcut

The repo includes a Claude Code skill in [`skills/respect`](skills/respect/SKILL.md).
Copy it to your skills folder:

```bash
mkdir -p ~/.claude/skills && cp -r skills/respect ~/.claude/skills/
```

Then type `respect <link | video id | song name>` (or `/respect …`) in Claude Code and
it downloads the MP3 right away. A few extras:

- `respect <song> 320` downloads at 320 kbps.
- `respect <link> again` downloads it again, even if you already have it.
- `respect list` shows what you've downloaded.

## FAQ

**Why yt-dlp and not a JavaScript library?**
JavaScript YouTube libraries break whenever YouTube changes its player, and often
produce empty files. yt-dlp is actively maintained and fixes these within days.

**Does it work on Windows and Linux?**
The server is plain Node.js and runs anywhere yt-dlp and ffmpeg do. The examples
use macOS paths; adjust them for your system.

**Can it download whole playlists?**
Not yet: it downloads one track per call and drops playlist parameters. Playlist
support would make a good [contribution](CONTRIBUTING.md).

**Where do my files go?**
`~/Music/yt-audio-mcp` by default, or wherever `YT_AUDIO_DIR` points.

## Development

```bash
npm install
npm test          # builds, then runs the unit tests in src/*.test.ts
npm run dev       # rebuild on change
```

| Path | Purpose |
|---|---|
| `src/index.ts` | MCP server and tool definitions |
| `src/ytdlp.ts` | URL validation and the yt-dlp wrapper |
| `src/ytdlp.test.ts` | Unit tests |
| `skills/respect` | The "respect" Claude Code skill |

## Contributing

Bug reports and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md),
or pick an issue labeled [`good first issue`](https://github.com/DaniilPak/yt-audio-mcp/labels/good%20first%20issue).

If yt-audio-mcp is useful to you, a ⭐ helps other people find it.

## Disclaimer

This tool is for downloading content you have the right to download, such as your
own uploads, Creative Commons or public-domain audio, or content whose owner allows
it. Respect copyright and YouTube's Terms of Service. The authors are not
responsible for how the tool is used.

## License

[MIT](LICENSE) © Daniil Pak
