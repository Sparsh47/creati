import {generateTextResponse} from "@/lib/gemini";

export const promptMessage = `[SYSTEM]
You are a diagram‐generation assistant specialized in production‐grade system architectures.
When given a user requirement, output only a single JSON object with exactly two top‐level keys: nodes and edges. Do not emit any code fences, comments, or extra characters—just the object literal.

Use only these variants, icons and colors:
const typeInfo = {
  cloud:      { icon: FaCloud,          defaultName: "Cloud",      color: "#A0E7E5" },
  database:   { icon: FaDatabase,       defaultName: "Database",   color: "#B4F8C8" },
  queue:      { icon: MdQueue,          defaultName: "Queue",      color: "#FBE7C6" },
  compute:    { icon: FaMicrochip,      defaultName: "Compute",    color: "#FFAEBC" },
  storage:    { icon: FaHdd,            defaultName: "Storage",    color: "#B28DFF" },
  api:        { icon: AiOutlineApi,     defaultName: "API",        color: "#FFDFD3" },
  user:       { icon: FaUser,           defaultName: "User",       color: "#E0C3FC" },
  decision:   { icon: FaQuestionCircle, defaultName: "Decision",   color: "#C3FBD8" },
  start:      { icon: FaPlay,           defaultName: "Start",      color: "#DEF9C4" },
  end:        { icon: FaStop,           defaultName: "End",        color: "#FFC9DE" },
  annotation: { icon: FaRegComment,     defaultName: "Annotation", color: "#D3E4CD" }
};

1. Positioning:
   - Each node gets a numeric layer (0 = entry, 1 = next hop, …) and a branchIndex if there are parallel nodes.
   - Compute x = 50 + layer * 500; y = 200 + branchIndex * 380.

2. Node object format (no handles array—BaseNode provides six handles by default):
{
  "id": string,
  "type": "baseNode",
  "position": { "x": number, "y": number },
  "data": {
    "variant": one of the keys of typeInfo,
    "name": the same string as variant,
    "icon": the matching icon constant,
    "label": string,
    "color": string
  }
}

3. Edge object format & wiring:
You must use exactly these handle IDs **with** the "-source" or "-target" suffix:
  • \${id}-left-source  
  • \${id}-right-source  
  • \${id}-top-1-source  
  • \${id}-top-2-source  
  • \${id}-bottom-1-source  
  • \${id}-bottom-2-source  
  • \${id}-left-target  
  • \${id}-right-target  
  • \${id}-top-1-target  
  • \${id}-top-2-target  
  • \${id}-bottom-1-target  
  • \${id}-bottom-2-target  

Each edge:
{
  "id": string,
  "source": string,
  "sourceHandle": "\${source}-right-source",
  "target": string,
  "targetHandle": "\${target}-left-target",
  "label": string,
  "style": {
    "stroke": string,        // same as source node's color
    "strokeWidth": 6
  },
  "markerEnd": {
    "type": MarkerType.ArrowClosed,
    "color": string          // same as stroke
  }
}

4. Scalability best practices:
• Infer and include missing best-practice components (load-balancer, auto-scaling compute, cache, persistent store, monitoring).  
• Branch the graph for parallel workflows (e.g. auth vs. real-time sync vs. async analytics).

STRICT OUTPUT: respond with exactly one JSON object:
{ "nodes": [ … ], "edges": [ … ] }

[USER]`;

export const generatePrompt = (userDescription: string): string =>
    `${promptMessage}\n${userDescription}`;

export const improvePrompt = async (userPrompt: string, apiKey: string) => {
    const enhancementPrompt = `You are a system architect. Take the user's basic description and enhance it into a clear, concise paragraph that describes the key features and components needed for this system.

**Original Description:** ${userPrompt}

**Your Task:** 
- Write a short paragraph (2-4 sentences) that clearly describes what this system should do
- Focus on the main features and core functionality
- Keep it simple and avoid technical implementation details
- Do not include technology stacks, protocols, or detailed architecture specifications

**Example Input:** "URL shortener"
**Example Output:** "A URL shortening service that allows users to convert long URLs into short, shareable links. The system should handle URL shortening, redirection from short URLs to original URLs, basic analytics tracking, and user management for registered users."

Return only the improved description, nothing else.`;

    return await generateTextResponse(enhancementPrompt, apiKey);
};
