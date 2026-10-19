#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { OUTPUT_DIR, downloadMp3, listDownloads, search } from './ytdlp.js';

const server = new McpServer({ name: 'yt-audio', version: '1.0.0' });

const json = (value: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
});
const fail = (err: unknown) => ({
  isError: true,
  content: [{ type: 'text' as const, text: err instanceof Error ? err.message : String(err) }],
});

server.registerTool(
  'download_mp3',
  {
    title: 'Download MP3 from YouTube',
    description:
      'Download the audio of a YouTube or YouTube Music video as an MP3 file. ' +
      `Files are saved to ${OUTPUT_DIR}. Already-downloaded videos are returned from disk unless force=true.`,
    inputSchema: {
      url: z
        .string()
        .describe('youtube.com / music.youtube.com / youtu.be link, or a bare 11-character video ID'),
      bitrate: z
        .enum(['0', '320K', '256K', '192K', '128K'])
        .default('0')
        .describe('"0" = best VBR (default), or a fixed CBR bitrate'),
      force: z.boolean().default(false).describe('Re-download even if the file already exists'),
    },
    annotations: { readOnlyHint: false, openWorldHint: true },
  },
  async ({ url, bitrate, force }) => {
    try {
      return json(await downloadMp3(url, bitrate, force));
    } catch (err) {
      return fail(err);
    }
  }
);

server.registerTool(
  'search_youtube',
  {
    title: 'Search YouTube',
    description: 'Search YouTube and return video IDs/URLs that can be passed to download_mp3.',
    inputSchema: {
      query: z.string().min(1).describe('Search text, e.g. "artist - song title"'),
      limit: z.number().int().min(1).max(25).default(5),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ query, limit }) => {
    try {
      return json(await search(query, limit));
    } catch (err) {
      return fail(err);
    }
  }
);

server.registerTool(
  'list_downloads',
  {
    title: 'List downloaded MP3s',
    description: `List MP3 files already downloaded to ${OUTPUT_DIR}, newest first.`,
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },
  async () => {
    try {
      return json(await listDownloads());
    } catch (err) {
      return fail(err);
    }
  }
);

await server.connect(new StdioServerTransport());
console.error(`yt-audio MCP server running (output: ${OUTPUT_DIR})`);
