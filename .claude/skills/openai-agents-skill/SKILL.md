---
name: openai-agents-skill
description: Build AI agents with OpenAI Agents SDK. Use for chatbot logic and MCP tool integration.
---

# OpenAI Agents SDK Implementation

## Instructions

1. **Agent Setup**
   - Initialize agent with model (gpt-4o-mini)
   - Provide clear system instructions
   - Register MCP tools

2. **Tool Definition**
   - Define tools that agent can call
   - Provide clear descriptions
   - Return structured responses

3. **Conversation Management**
   - Maintain message history in database
   - Pass full context to agent
   - Handle multi-turn conversations

4. **Error Handling**
   - Catch API errors gracefully
   - Provide fallback responses
   - Log agent behavior for debugging

## Best Practices
- Keep system instructions clear and concise
- Limit tool calls to prevent loops
- Store conversation history in database
- Handle rate limits properly

## Example Implementation

```python
from openai import OpenAI
import json

client = OpenAI()

# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Create a new task for the user",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "title": {"type": "string"},
                    "description": {"type": "string"}
                },
                "required": ["user_id", "title"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "Get all tasks for the user",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "status": {"type": "string", "enum": ["all", "pending", "completed"]}
                },
                "required": ["user_id"]
            }
        }
    }
]

# Run agent
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful todo assistant."},
        {"role": "user", "content": "Add a task to buy groceries"}
    ],
    tools=tools
)

# Handle tool calls
if response.choices[0].message.tool_calls:
    for tool_call in response.choices[0].message.tool_calls:
        function_name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)
        # Execute MCP tool
        result = await mcp_server.execute_tool(function_name, arguments)
```