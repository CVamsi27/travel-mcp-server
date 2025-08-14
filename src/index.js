import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { searchFlights } from "./tools/flights.js";
import { searchHotels } from "./tools/hotels.js";

dotenv.config();

const server = new McpServer({ name: "travel-mcp-server", version: "1.0.0" });

const tools = [
  {
    name: "searchFlights",
    title: "Search Flights",
    description: "Get flight offers between two locations",
    inputSchema: {
      origin: "string",
      destination: "string",
      departureDate: "string",
    },
    handler: searchFlights,
  },
  {
    name: "searchHotels",
    title: "Search Hotels",
    description: "Get hotel offers for a city",
    inputSchema: {
      cityCode: "string",
      checkInDate: "string",
      checkOutDate: "string",
    },
    handler: searchHotels,
  },
];

for (const tool of tools) {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    },
    async (input) => {
      try {
        const result = await tool.handler(input);
        return { content: [{ type: "json", text: JSON.stringify(result) }] };
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${err.message}` }] };
      }
    }
  );
}

const transport = new StdioServerTransport();
await server.connect(transport);

process.stdin.on("data", async (data) => {
  const input = data.toString().trim();
  console.log("Received input:", input);

  const matchJson = input.match(/^\/mcp\s+(\w+)\s+(\{.*\})$/);
  const matchKV = input.match(/^\/mcp\s+(\w+)\s+(.+)$/);

  let toolName, params;

  if (matchJson) {
    toolName = matchJson[1];
    try {
      params = JSON.parse(matchJson[2]);
    } catch {
      console.error("Invalid JSON input");
      return;
    }
  } else if (matchKV) {
    toolName = matchKV[1];
    params = {};
    matchKV[2].split(/\s+/).forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key && value) params[key] = value;
    });
  } else {
    console.error("Unrecognized command format.");
    return;
  }

  const tool = tools.find((t) => t.name === toolName);
  if (!tool) {
    console.error(`Tool '${toolName}' not found.`);
    return;
  }

  try {
    const result = await tool.handler(params);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
});
