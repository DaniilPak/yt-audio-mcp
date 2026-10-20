---
name: respect
description: >-
  Download YouTube / YouTube Music audio as MP3 with the yt-audio MCP server. Use
  whenever the user's message starts with "respect" followed by a YouTube link, a
  video ID, or a song name (e.g. "respect youtube.com/watch?v=...", "respect
  music.youtube.com/...", "respect daft punk one more time"), or they type /respect.
argument-hint: <youtube link | video id | song name> [more...]
allowed-tools: mcp__yt-audio__download_mp3, mcp__yt-audio__search_youtube, mcp__yt-audio__list_downloads
---

# respect

"respect X" means: get X as an MP3 with the `yt-audio` MCP server. Act right away, without asking for confirmation.

Input: $ARGUMENTS (if empty, use whatever follows the word "respect" in the user's message).

1. Split the input into items. Each URL (youtube.com, music.youtube.com, youtu.be, with or without `https://`) or 11-character video ID is its own item. Any remaining free text is one search query.
2. For each URL or ID, call `mcp__yt-audio__download_mp3` with `url`. Add `https://` if it is missing.
3. For a search query, call `mcp__yt-audio__search_youtube` with `limit: 5`, then download the best match: prefer the official upload or the artist's channel, and avoid covers, live versions, "sped up" edits and 1-hour loops unless the query asks for one. Say which result you picked.
4. Run independent downloads in parallel.
5. Reply briefly with one line per track: the title, the duration as m:ss, and the file path as a markdown link. If `cached: true`, say "already had it". If a download fails, quote the error in one line and keep going with the rest.

Extra words:
- "320" or "128" → pass `bitrate: "320K"` or `"128K"`.
- "again", "redownload" or "force" → pass `force: true`.
- "respect list" or "what did I respect" → call `mcp__yt-audio__list_downloads` instead.

If the `mcp__yt-audio__*` tools aren't available, tell the user the yt-audio MCP server isn't loaded. Point them to the setup steps in the yt-audio-mcp README, then suggest starting a new session.
