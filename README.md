# yt-audio-mcp

MCP server that downloads YouTube / YouTube Music audio as MP3.

This uses the same flow as `frespect.com/sakura-api` (YouTube link → best audio stream → ffmpeg → file on disk), but with `yt-dlp` in place of `@distube/ytdl-core`. yt-dlp is maintained and keeps up with YouTube's changes. ytdl-core breaks often, which is why `sakura-api/tracks` has 0-byte files.

## Tools

| Tool | Input | Returns |
|---|---|---|
| `download_mp3` | `url` (youtube.com, music.youtube.com, youtu.be, or an 11-char video ID), `bitrate` (`"0"` best VBR by default, or `320K`/`256K`/`192K`/`128K`), `force` | `{ id, title, duration, uploader, filepath, cached }` |
| `search_youtube` | `query`, `limit` (1–25, default 5) | `[{ id, title, duration, channel, url }]` |
| `list_downloads` | – | MP3s in the output folder, newest first |

- Files are saved as `<title> [<videoId>].mp3`, with ID3 tags and the cover art embedded.
- If a video was already downloaded, the existing file is returned instead of downloading it again. Pass `force: true` to re-download.
- Playlist parameters (`&list=…`) are dropped, so only the single track is downloaded.
- Only YouTube hosts are accepted.

## Requirements

```bash
brew install yt-dlp ffmpeg
```

Keep yt-dlp current (`brew upgrade yt-dlp`), because YouTube changes often.

## Build

```bash
npm install && npm run build
```

## Use with Claude Code

```bash
claude mcp add yt-audio --scope user -e YT_AUDIO_DIR=~/Music/yt-audio-mcp -- node /Users/daniilpak/Desktop/yt-audio-mcp/dist/index.js
```

## Use with Claude Desktop

Add this to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "yt-audio": {
      "command": "node",
      "args": ["/Users/daniilpak/Desktop/yt-audio-mcp/dist/index.js"],
      "env": { "YT_AUDIO_DIR": "~/Music/yt-audio-mcp" }
    }
  }
}
```

## Environment

| Variable | Default |
|---|---|
| `YT_AUDIO_DIR` | `~/Music/yt-audio-mcp` |
| `YTDLP_PATH` | `yt-dlp` (from `PATH`) |

Desktop apps may not inherit your shell's `PATH`. If you see "yt-dlp not found", set `YTDLP_PATH=/opt/homebrew/bin/yt-dlp`. If ffmpeg isn't found either, also add `/opt/homebrew/bin` to `PATH` in the `env` block.

Only download content you have the rights to.
