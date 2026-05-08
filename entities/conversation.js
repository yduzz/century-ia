{
  "name": "Conversation",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the conversation"
    },
    "tool_type": {
      "type": "string",
      "enum": [
        "chat",
        "property_presentation",
        "social_media",
        "image_generator",
        "agent_assistant"
      ],
      "description": "Which AI tool this conversation belongs to"
    },
    "messages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {
            "type": "string",
            "enum": [
              "user",
              "assistant"
            ]
          },
          "content": {
            "type": "string"
          },
          "file_urls": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "timestamp": {
            "type": "string"
          }
        }
      },
      "description": "Array of messages in the conversation"
    },
    "is_archived": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "title",
    "tool_type"
  ]
}