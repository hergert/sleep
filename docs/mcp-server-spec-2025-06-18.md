
# Overview - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/server

## Metadata
- Depth: 0
- Timestamp: 2025-10-15T18:26:42.129547

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Server Features
Overview
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

Server Features
# Overview
Copy page
Copy page
**Protocol Revision** : 2025-06-18
Servers provide the fundamental building blocks for adding context to language models via MCP. These primitives enable rich interactions between clients, servers, and language models:
 * **Prompts** : Pre-defined templates or instructions that guide language model interactions
 * **Resources** : Structured data or content that provides additional context to the model
 * **Tools** : Executable functions that allow models to perform actions or retrieve information

Each primitive can be summarized in the following control hierarchy: Primitive | Control | Description | Example 
---|---|---|--- 
Prompts | User-controlled | Interactive templates invoked by user choice | Slash commands, menu options 
Resources | Application-controlled | Contextual data attached and managed by the client | File contents, git history 
Tools | Model-controlled | Functions exposed to the LLM to take actions | API POST requests, file writing 
Explore these key primitives in more detail below:
## Prompts## Resources## Tools
Was this page helpful?
YesNo
ElicitationPrompts
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# mcp blog

## URL
https://blog.modelcontextprotocol.io

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.129625

## Content
mcp blog")
 * Documentation 
 * GitHub 

## Update on the Next MCP Protocol Release
Release Timeline The next version of the Model Context Protocol specification will be released on November 25th, 2025, with a release candidate (RC) available on November 11th, 2025. We’re building in a 14-day RC validation window so client implementors and SDK maintainers can thoroughly test the protocol changes. This approach gives us the focused time we need to deliver critical improvements while applying our new governance model to the process. Summer Progress Our last spec was released on June 18, 2025, and focused on structured tool outputs, OAuth-based authorization, elicitation for server-initiated user interactions, and improved security best practices. ...
September 26, 2025 · 5 min · David Soria Parra[](http://blog.modelcontextprotocol.io/posts/2025-09-26-mcp-next-version-update/)
## Introducing the MCP Registry
Today, we’re launching the Model Context Protocol (MCP) Registry—an open catalog and API for publicly available MCP servers to improve discoverability and implementation. By standardizing how servers are distributed and discovered, we’re expanding their reach while making it easier for clients to get connected. The MCP Registry is now available in preview. To get started: Add your server by following our guide on Adding Servers to the MCP Registry (for server maintainers) Access server data by following our guide on Accessing MCP Registry Data (for client maintainers) Single source of truth for MCP servers In March 2025, we shared that we wanted to build a central registry for the MCP ecosystem. Today we are announcing that we’ve launched https://registry.modelcontextprotocol.io as the official MCP Registry. As part of the MCP project, the MCP Registry, as well as a parent OpenAPI specification, are open source—allowing everyone to build a compatible sub-registry. ...
September 8, 2025 · 4 min · David Soria Parra (Lead Maintainer), Adam Jones (Registry Maintainer), Tadas Antanavicius (Registry Maintainer), Toby Padilla (Registry Maintainer), Theodora Chu (MCP PM at Anthropic)[](http://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/)
## Announcing the Official PHP SDK for MCP
The official PHP SDK for the Model Context Protocol is now generally available. Built in collaboration with the PHP Foundation and Symfony, the PHP SDK handles protocol details, so developers don’t have to worry about low-level mechanics and can focus on building their applications. The initial release enables PHP developers to build MCP servers, exposing tools, prompts, and resources to AI applications. Support for PHP applications to act as MCP clients will follow. The PHP SDK now joins 9 other officially supported language SDKs in the MCP ecosystem, making it easier for developers everywhere to adopt MCP in their preferred language. ...
September 5, 2025 · 1 min · David Soria Parra (Lead Maintainer), Christopher Hertel (Symfony), Roman Pronskiy (PHP Foundation)[](http://blog.modelcontextprotocol.io/posts/2025-09-05-php-sdk/)
## Evolving OAuth Client Registration in the Model Context Protocol
The Model Context Protocol (MCP) has adopted OAuth 2.1 as the foundation for its authorization framework. A key part of the authorization flow that MCP is particularly reliant on is client registration. This is especially important in a world where clients and servers don’t have a pre-existing relationship - we can’t assume that we will always know which MCP clients will connect to which MCP servers. This design highlights two challenges that need to be addressed: ...
August 22, 2025 · 10 min · Paul Carleton (Core Maintainer)[](http://blog.modelcontextprotocol.io/posts/client_registration/)
## MCP Prompts: Building Workflow Automation
MCP (Model Context Protocol) prompts enable workflow automation by combining AI capabilities with structured data access. This post demonstrates how to build automations using MCP’s prompts and resource templates through a practical example. This guide demonstrates how MCP prompts can automate repetitive workflows. Whether you’re interested in the MCP ecosystem or simply want to leverage AI for workflow automation, you’ll learn how to build practical automations through a concrete meal planning example. No prior MCP experience needed—we’ll cover the fundamentals before diving into implementation. ...
August 4, 2025 · 8 min · Inna Harper (Core Maintainer)[](http://blog.modelcontextprotocol.io/posts/2025-07-29-prompts-for-automation/)Next »© 2025 mcp blog · Powered by Hugo & PaperMod[](https://blog.modelcontextprotocol.io/#top "Go to Top \(Alt + G\)")


---

# What is the Model Context Protocol (MCP)? - Model Context Protocol

## URL
https://modelcontextprotocol.io

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.129701

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Get started
What is the Model Context Protocol (MCP)?
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * What can MCP enable?
 * Why does MCP matter?
 * Start Building
 * Learn more

Get started
# What is the Model Context Protocol (MCP)?
Copy page
Copy page
MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems. Using MCP, AI applications like Claude or ChatGPT can connect to data sources (e.g. local files, databases), tools (e.g. search engines, calculators) and workflows (e.g. specialized prompts)—enabling them to access key information and perform tasks. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems.

## 
​
What can MCP enable?
 * Agents can access your Google Calendar and Notion, acting as a more personalized AI assistant.
 * Claude Code can generate an entire web app using a Figma design.
 * Enterprise chatbots can connect to multiple databases across an organization, empowering users to analyze data using chat.
 * AI models can create 3D designs on Blender and print them out using a 3D printer.

## 
​
Why does MCP matter?
Depending on where you sit in the ecosystem, MCP can have a range of benefits.
 * **Developers** : MCP reduces development time and complexity when building, or integrating with, an AI application or agent.
 * **AI applications or agents** : MCP provides access to an ecosystem of data sources, tools and apps which will enhance capabilities and improve the end-user experience.
 * **End-users** : MCP results in more capable AI applications or agents which can access your data and take actions on your behalf when necessary.

## 
​
Start Building
## Build servers Create MCP servers to expose your data and tools ## Build clients Develop applications that connect to MCP servers 
## 
​
Learn more
## Understand concepts Learn the core concepts and architecture of MCP 
Was this page helpful?
YesNo
Architecture
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.



---

# Prompts - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/server/prompts

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.129971

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Server Features
Prompts
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * User Interaction Model
 * Capabilities
 * Protocol Messages
 * Listing Prompts
 * Getting a Prompt
 * List Changed Notification
 * Message Flow
 * Data Types
 * Prompt
 * PromptMessage
 * Text Content
 * Image Content
 * Audio Content
 * Embedded Resources
 * Error Handling
 * Implementation Considerations
 * Security

Server Features
# Prompts
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) provides a standardized way for servers to expose prompt templates to clients. Prompts allow servers to provide structured messages and instructions for interacting with language models. Clients can discover available prompts, retrieve their contents, and provide arguments to customize them.
## 
​
User Interaction Model
Prompts are designed to be **user-controlled** , meaning they are exposed from servers to clients with the intention of the user being able to explicitly select them for use. Typically, prompts would be triggered through user-initiated commands in the user interface, which allows users to naturally discover and invoke available prompts. For example, as slash commands: !Example of prompt exposed as slash command However, implementors are free to expose prompts through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.
## 
​
Capabilities
Servers that support prompts **MUST** declare the `prompts` capability during initialization:
Copy
```
{
  "capabilities": {
    "prompts": {
      "listChanged": true
    }
  }
}

```

`listChanged` indicates whether the server will emit notifications when the list of available prompts changes.
## 
​
Protocol Messages
### 
​
Listing Prompts
To retrieve available prompts, clients send a `prompts/list` request. This operation supports pagination. **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "prompts/list",
  "params": {
    "cursor": "optional-cursor-value"
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "prompts": [
      {
        "name": "code_review",
        "title": "Request Code Review",
        "description": "Asks the LLM to analyze code quality and suggest improvements",
        "arguments": [
          {
            "name": "code",
            "description": "The code to review",
            "required": true
          }
        ]
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}

```

### 
​
Getting a Prompt
To retrieve a specific prompt, clients send a `prompts/get` request. Arguments may be auto-completed through the completion API. **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": {
      "code": "def hello():\n    print('world')"
    }
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "description": "Code review prompt",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please review this Python code:\ndef hello():\n    print('world')"
        }
      }
    ]
  }
}

```

### 
​
List Changed Notification
When the list of available prompts changes, servers that declared the `listChanged` capability **SHOULD** send a notification:
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/prompts/list_changed"
}

```

## 
​
Message Flow
## 
​
Data Types
### 
​
Prompt
A prompt definition includes:
 * `name`: Unique identifier for the prompt
 * `title`: Optional human-readable name of the prompt for display purposes.
 * `description`: Optional human-readable description
 * `arguments`: Optional list of arguments for customization

### 
​
PromptMessage
Messages in a prompt can contain:
 * `role`: Either “user” or “assistant” to indicate the speaker
 * `content`: One of the following content types:

All content types in prompt messages support optional annotations for metadata about audience, priority, and modification times.
#### 
​
Text Content
Text content represents plain text messages:
Copy
```
{
  "type": "text",
  "text": "The text content of the message"
}

```

This is the most common content type used for natural language interactions.
#### 
​
Image Content
Image content allows including visual information in messages:
Copy
```
{
  "type": "image",
  "data": "base64-encoded-image-data",
  "mimeType": "image/png"
}

```

The image data **MUST** be base64-encoded and include a valid MIME type. This enables multi-modal interactions where visual context is important.
#### 
​
Audio Content
Audio content allows including audio information in messages:
Copy
```
{
  "type": "audio",
  "data": "base64-encoded-audio-data",
  "mimeType": "audio/wav"
}

```

The audio data MUST be base64-encoded and include a valid MIME type. This enables multi-modal interactions where audio context is important.
#### 
​
Embedded Resources
Embedded resources allow referencing server-side resources directly in messages:
Copy
```
{
  "type": "resource",
  "resource": {
    "uri": "resource://example",
    "name": "example",
    "title": "My Example Resource",
    "mimeType": "text/plain",
    "text": "Resource content"
  }
}

```

Resources can contain either text or binary (blob) data and **MUST** include:
 * A valid resource URI
 * The appropriate MIME type
 * Either text content or base64-encoded blob data

Embedded resources enable prompts to seamlessly incorporate server-managed content like documentation, code samples, or other reference materials directly into the conversation flow.
## 
​
Error Handling
Servers **SHOULD** return standard JSON-RPC errors for common failure cases:
 * Invalid prompt name: `-32602` (Invalid params)
 * Missing required arguments: `-32602` (Invalid params)
 * Internal errors: `-32603` (Internal error)

## 
​
Implementation Considerations
 1. Servers **SHOULD** validate prompt arguments before processing
 2. Clients **SHOULD** handle pagination for large prompt lists
 3. Both parties **SHOULD** respect capability negotiation

## 
​
Security
Implementations **MUST** carefully validate all prompt inputs and outputs to prevent injection attacks or unauthorized access to resources.
Was this page helpful?
YesNo
OverviewResources
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Tools - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/server/tools

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.130233

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Server Features
Tools
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * User Interaction Model
 * Capabilities
 * Protocol Messages
 * Listing Tools
 * Calling Tools
 * List Changed Notification
 * Message Flow
 * Data Types
 * Tool
 * Tool Result
 * Text Content
 * Image Content
 * Audio Content
 * Resource Links
 * Embedded Resources
 * Structured Content
 * Output Schema
 * Error Handling
 * Security Considerations

Server Features
# Tools
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) allows servers to expose tools that can be invoked by language models. Tools enable models to interact with external systems, such as querying databases, calling APIs, or performing computations. Each tool is uniquely identified by a name and includes metadata describing its schema.
## 
​
User Interaction Model
Tools in MCP are designed to be **model-controlled** , meaning that the language model can discover and invoke tools automatically based on its contextual understanding and the user’s prompts. However, implementations are free to expose tools through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.
For trust & safety and security, there **SHOULD** always be a human in the loop with the ability to deny tool invocations.Applications **SHOULD** :
 * Provide UI that makes clear which tools are being exposed to the AI model
 * Insert clear visual indicators when tools are invoked
 * Present confirmation prompts to the user for operations, to ensure a human is in the loop

## 
​
Capabilities
Servers that support tools **MUST** declare the `tools` capability:
Copy
```
{
  "capabilities": {
    "tools": {
      "listChanged": true
    }
  }
}

```

`listChanged` indicates whether the server will emit notifications when the list of available tools changes.
## 
​
Protocol Messages
### 
​
Listing Tools
To discover available tools, clients send a `tools/list` request. This operation supports pagination. **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {
    "cursor": "optional-cursor-value"
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "title": "Weather Information Provider",
        "description": "Get current weather information for a location",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name or zip code"
            }
          },
          "required": ["location"]
        }
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}

```

### 
​
Calling Tools
To invoke a tool, clients send a `tools/call` request: **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "New York"
    }
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in New York:\nTemperature: 72°F\nConditions: Partly cloudy"
      }
    ],
    "isError": false
  }
}

```

### 
​
List Changed Notification
When the list of available tools changes, servers that declared the `listChanged` capability **SHOULD** send a notification:
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}

```

## 
​
Message Flow
## 
​
Data Types
### 
​
Tool
A tool definition includes:
 * `name`: Unique identifier for the tool
 * `title`: Optional human-readable name of the tool for display purposes.
 * `description`: Human-readable description of functionality
 * `inputSchema`: JSON Schema defining expected parameters
 * `outputSchema`: Optional JSON Schema defining expected output structure
 * `annotations`: optional properties describing tool behavior

For trust & safety and security, clients **MUST** consider tool annotations to be untrusted unless they come from trusted servers.
### 
​
Tool Result
Tool results may contain **structured** or **unstructured** content. **Unstructured** content is returned in the `content` field of a result, and can contain multiple content items of different types:
All content types (text, image, audio, resource links, and embedded resources) support optional annotations that provide metadata about audience, priority, and modification times. This is the same annotation format used by resources and prompts.
#### 
​
Text Content
Copy
```
{
  "type": "text",
  "text": "Tool result text"
}

```

#### 
​
Image Content
Copy
```
{
  "type": "image",
  "data": "base64-encoded-data",
  "mimeType": "image/png"
  "annotations": {
    "audience": ["user"],
    "priority": 0.9
  }
}

```

This example demonstrates the use of an optional Annotation.
#### 
​
Audio Content
Copy
```
{
  "type": "audio",
  "data": "base64-encoded-audio-data",
  "mimeType": "audio/wav"
}

```

#### 
​
Resource Links
A tool **MAY** return links to Resources, to provide additional context or data. In this case, the tool will return a URI that can be subscribed to or fetched by the client:
Copy
```
{
  "type": "resource_link",
  "uri": "file:///project/src/main.rs",
  "name": "main.rs",
  "description": "Primary application entry point",
  "mimeType": "text/x-rust",
  "annotations": {
    "audience": ["assistant"],
    "priority": 0.9
  }
}

```

Resource links support the same Resource annotations as regular resources to help clients understand how to use them.
Resource links returned by tools are not guaranteed to appear in the results of a `resources/list` request.
#### 
​
Embedded Resources
Resources **MAY** be embedded to provide additional context or data using a suitable URI scheme. Servers that use embedded resources **SHOULD** implement the `resources` capability:
Copy
```
{
  "type": "resource",
  "resource": {
    "uri": "file:///project/src/main.rs",
    "title": "Project Rust Main File",
    "mimeType": "text/x-rust",
    "text": "fn main() {\n    println!(\"Hello world!\");\n}",
    "annotations": {
      "audience": ["user", "assistant"],
      "priority": 0.7,
      "lastModified": "2025-05-03T14:30:00Z"
    }
  }
}

```

Embedded resources support the same Resource annotations as regular resources to help clients understand how to use them.
#### 
​
Structured Content
**Structured** content is returned as a JSON object in the `structuredContent` field of a result. For backwards compatibility, a tool that returns structured content SHOULD also return the serialized JSON in a TextContent block.
#### 
​
Output Schema
Tools may also provide an output schema for validation of structured results. If an output schema is provided:
 * Servers **MUST** provide structured results that conform to this schema.
 * Clients **SHOULD** validate structured results against this schema.

Example tool with output schema:
Copy
```
{
  "name": "get_weather_data",
  "title": "Weather Data Retriever",
  "description": "Get current weather data for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or zip code"
      }
    },
    "required": ["location"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "temperature": {
        "type": "number",
        "description": "Temperature in celsius"
      },
      "conditions": {
        "type": "string",
        "description": "Weather conditions description"
      },
      "humidity": {
        "type": "number",
        "description": "Humidity percentage"
      }
    },
    "required": ["temperature", "conditions", "humidity"]
  }
}

```

Example valid response for this tool:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"temperature\": 22.5, \"conditions\": \"Partly cloudy\", \"humidity\": 65}"
      }
    ],
    "structuredContent": {
      "temperature": 22.5,
      "conditions": "Partly cloudy",
      "humidity": 65
    }
  }
}

```

Providing an output schema helps clients and LLMs understand and properly handle structured tool outputs by:
 * Enabling strict schema validation of responses
 * Providing type information for better integration with programming languages
 * Guiding clients and LLMs to properly parse and utilize the returned data
 * Supporting better documentation and developer experience

## 
​
Error Handling
Tools use two error reporting mechanisms:
 1. **Protocol Errors** : Standard JSON-RPC errors for issues like:
 * Unknown tools
 * Invalid arguments
 * Server errors
 2. **Tool Execution Errors** : Reported in tool results with `isError: true`:
 * API failures
 * Invalid input data
 * Business logic errors

Example protocol error:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32602,
    "message": "Unknown tool: invalid_tool_name"
  }
}

```

Example tool execution error:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Failed to fetch weather data: API rate limit exceeded"
      }
    ],
    "isError": true
  }
}

```

## 
​
Security Considerations
 1. Servers **MUST** :
 * Validate all tool inputs
 * Implement proper access controls
 * Rate limit tool invocations
 * Sanitize tool outputs
 2. Clients **SHOULD** :
 * Prompt for user confirmation on sensitive operations
 * Show tool inputs to the user before calling the server, to avoid malicious or accidental data exfiltration
 * Validate tool results before passing to LLM
 * Implement timeouts for tool calls
 * Log tool usage for audit purposes

Was this page helpful?
YesNo
ResourcesCompletion
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Resources - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/server/resources

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.130531

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Server Features
Resources
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * User Interaction Model
 * Capabilities
 * Protocol Messages
 * Listing Resources
 * Reading Resources
 * Resource Templates
 * List Changed Notification
 * Subscriptions
 * Message Flow
 * Data Types
 * Resource
 * Resource Contents
 * Text Content
 * Binary Content
 * Annotations
 * Common URI Schemes
 * https://
 * file://
 * git://
 * Custom URI Schemes
 * Error Handling
 * Security Considerations

Server Features
# Resources
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) provides a standardized way for servers to expose resources to clients. Resources allow servers to share data that provides context to language models, such as files, database schemas, or application-specific information. Each resource is uniquely identified by a URI.
## 
​
User Interaction Model
Resources in MCP are designed to be **application-driven** , with host applications determining how to incorporate context based on their needs. For example, applications could:
 * Expose resources through UI elements for explicit selection, in a tree or list view
 * Allow the user to search through and filter available resources
 * Implement automatic context inclusion, based on heuristics or the AI model’s selection

!Example of resource context picker However, implementations are free to expose resources through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.
## 
​
Capabilities
Servers that support resources **MUST** declare the `resources` capability:
Copy
```
{
  "capabilities": {
    "resources": {
      "subscribe": true,
      "listChanged": true
    }
  }
}

```

The capability supports two optional features:
 * `subscribe`: whether the client can subscribe to be notified of changes to individual resources.
 * `listChanged`: whether the server will emit notifications when the list of available resources changes.

Both `subscribe` and `listChanged` are optional—servers can support neither, either, or both:
Copy
```
{
  "capabilities": {
    "resources": {} // Neither feature supported
  }
}

```

Copy
```
{
  "capabilities": {
    "resources": {
      "subscribe": true // Only subscriptions supported
    }
  }
}

```

Copy
```
{
  "capabilities": {
    "resources": {
      "listChanged": true // Only list change notifications supported
    }
  }
}

```

## 
​
Protocol Messages
### 
​
Listing Resources
To discover available resources, clients send a `resources/list` request. This operation supports pagination. **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/list",
  "params": {
    "cursor": "optional-cursor-value"
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resources": [
      {
        "uri": "file:///project/src/main.rs",
        "name": "main.rs",
        "title": "Rust Software Application Main File",
        "description": "Primary application entry point",
        "mimeType": "text/x-rust"
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}

```

### 
​
Reading Resources
To retrieve resource contents, clients send a `resources/read` request: **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "file:///project/src/main.rs"
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "contents": [
      {
        "uri": "file:///project/src/main.rs",
        "name": "main.rs",
        "title": "Rust Software Application Main File",
        "mimeType": "text/x-rust",
        "text": "fn main() {\n    println!(\"Hello world!\");\n}"
      }
    ]
  }
}

```

### 
​
Resource Templates
Resource templates allow servers to expose parameterized resources using URI templates. Arguments may be auto-completed through the completion API. **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/templates/list"
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "resourceTemplates": [
      {
        "uriTemplate": "file:///{path}",
        "name": "Project Files",
        "title": "📁 Project Files",
        "description": "Access files in the project directory",
        "mimeType": "application/octet-stream"
      }
    ]
  }
}

```

### 
​
List Changed Notification
When the list of available resources changes, servers that declared the `listChanged` capability **SHOULD** send a notification:
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/list_changed"
}

```

### 
​
Subscriptions
The protocol supports optional subscriptions to resource changes. Clients can subscribe to specific resources and receive notifications when they change: **Subscribe Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/subscribe",
  "params": {
    "uri": "file:///project/src/main.rs"
  }
}

```

**Update Notification:**
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uri": "file:///project/src/main.rs",
    "title": "Rust Software Application Main File"
  }
}

```

## 
​
Message Flow
## 
​
Data Types
### 
​
Resource
A resource definition includes:
 * `uri`: Unique identifier for the resource
 * `name`: The name of the resource.
 * `title`: Optional human-readable name of the resource for display purposes.
 * `description`: Optional description
 * `mimeType`: Optional MIME type
 * `size`: Optional size in bytes

### 
​
Resource Contents
Resources can contain either text or binary data:
#### 
​
Text Content
Copy
```
{
  "uri": "file:///example.txt",
  "name": "example.txt",
  "title": "Example Text File",
  "mimeType": "text/plain",
  "text": "Resource content"
}

```

#### 
​
Binary Content
Copy
```
{
  "uri": "file:///example.png",
  "name": "example.png",
  "title": "Example Image",
  "mimeType": "image/png",
  "blob": "base64-encoded-data"
}

```

### 
​
Annotations
Resources, resource templates and content blocks support optional annotations that provide hints to clients about how to use or display the resource:
 * **`audience`**: An array indicating the intended audience(s) for this resource. Valid values are`"user"` and `"assistant"`. For example, `["user", "assistant"]` indicates content useful for both.
 * **`priority`**: A number from 0.0 to 1.0 indicating the importance of this resource. A value of 1 means “most important” (effectively required), while 0 means “least important” (entirely optional).
 * **`lastModified`**: An ISO 8601 formatted timestamp indicating when the resource was last modified (e.g.,`"2025-01-12T15:00:58Z"`).

Example resource with annotations:
Copy
```
{
  "uri": "file:///project/README.md",
  "name": "README.md",
  "title": "Project Documentation",
  "mimeType": "text/markdown",
  "annotations": {
    "audience": ["user"],
    "priority": 0.8,
    "lastModified": "2025-01-12T15:00:58Z"
  }
}

```

Clients can use these annotations to:
 * Filter resources based on their intended audience
 * Prioritize which resources to include in context
 * Display modification times or sort by recency

## 
​
Common URI Schemes
The protocol defines several standard URI schemes. This list not exhaustive—implementations are always free to use additional, custom URI schemes.
### 
​
https://
Used to represent a resource available on the web. Servers **SHOULD** use this scheme only when the client is able to fetch and load the resource directly from the web on its own—that is, it doesn’t need to read the resource via the MCP server. For other use cases, servers **SHOULD** prefer to use another URI scheme, or define a custom one, even if the server will itself be downloading resource contents over the internet.
### 
​
file://
Used to identify resources that behave like a filesystem. However, the resources do not need to map to an actual physical filesystem. MCP servers **MAY** identify file:// resources with an XDG MIME type, like `inode/directory`, to represent non-regular files (such as directories) that don’t otherwise have a standard MIME type.
### 
​
git://
Git version control integration.
### 
​
Custom URI Schemes
Custom URI schemes **MUST** be in accordance with RFC3986, taking the above guidance in to account.
## 
​
Error Handling
Servers **SHOULD** return standard JSON-RPC errors for common failure cases:
 * Resource not found: `-32002`
 * Internal errors: `-32603`

Example error:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 5,
  "error": {
    "code": -32002,
    "message": "Resource not found",
    "data": {
      "uri": "file:///nonexistent.txt"
    }
  }
}

```

## 
​
Security Considerations
 1. Servers **MUST** validate all resource URIs
 2. Access controls **SHOULD** be implemented for sensitive resources
 3. Binary data **MUST** be properly encoded
 4. Resource permissions **SHOULD** be checked before operations

Was this page helpful?
YesNo
PromptsTools
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.
!Example of resource context picker


---

# Overview - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/basic

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.130694

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Base Protocol
Overview
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Messages
 * Requests
 * Responses
 * Notifications
 * Auth
 * Schema
 * General fields
 * _meta

Base Protocol
# Overview
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol consists of several key components that work together:
 * **Base Protocol** : Core JSON-RPC message types
 * **Lifecycle Management** : Connection initialization, capability negotiation, and session control
 * **Authorization** : Authentication and authorization framework for HTTP-based transports
 * **Server Features** : Resources, prompts, and tools exposed by servers
 * **Client Features** : Sampling and root directory lists provided by clients
 * **Utilities** : Cross-cutting concerns like logging and argument completion

All implementations **MUST** support the base protocol and lifecycle management components. Other components **MAY** be implemented based on the specific needs of the application. These protocol layers establish clear separation of concerns while enabling rich interactions between clients and servers. The modular design allows implementations to support exactly the features they need.
## 
​
Messages
All messages between MCP clients and servers **MUST** follow the JSON-RPC 2.0 specification. The protocol defines these types of messages:
### 
​
Requests
Requests are sent from the client to the server or vice versa, to initiate an operation.
Copy
```
{
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    [key: string]: unknown;
  };
}

```

 * Requests **MUST** include a string or integer ID.
 * Unlike base JSON-RPC, the ID **MUST NOT** be `null`.
 * The request ID **MUST NOT** have been previously used by the requestor within the same session.

### 
​
Responses
Responses are sent in reply to requests, containing the result or error of the operation.
Copy
```
{
  jsonrpc: "2.0";
  id: string | number;
  result?: {
    [key: string]: unknown;
  }
  error?: {
    code: number;
    message: string;
    data?: unknown;
  }
}

```

 * Responses **MUST** include the same ID as the request they correspond to.
 * **Responses** are further sub-categorized as either **successful results** or **errors**. Either a `result` or an `error` **MUST** be set. A response **MUST NOT** set both.
 * Results **MAY** follow any JSON object structure, while errors **MUST** include an error code and message at minimum.
 * Error codes **MUST** be integers.

### 
​
Notifications
Notifications are sent from the client to the server or vice versa, as a one-way message. The receiver **MUST NOT** send a response.
Copy
```
{
  jsonrpc: "2.0";
  method: string;
  params?: {
    [key: string]: unknown;
  };
}

```

 * Notifications **MUST NOT** include an ID.

## 
​
Auth
MCP provides an Authorization framework for use with HTTP. Implementations using an HTTP-based transport **SHOULD** conform to this specification, whereas implementations using STDIO transport **SHOULD NOT** follow this specification, and instead retrieve credentials from the environment. Additionally, clients and servers **MAY** negotiate their own custom authentication and authorization strategies. For further discussions and contributions to the evolution of MCP’s auth mechanisms, join us in GitHub Discussions to help shape the future of the protocol!
## 
​
Schema
The full specification of the protocol is defined as a TypeScript schema. This is the source of truth for all protocol messages and structures. There is also a JSON Schema, which is automatically generated from the TypeScript source of truth, for use with various automated tooling.
### 
​
General fields
#### 
​
`_meta`
The `_meta` property/parameter is reserved by MCP to allow clients and servers to attach additional metadata to their interactions. Certain key names are reserved by MCP for protocol-level metadata, as specified below; implementations MUST NOT make assumptions about values at these keys. Additionally, definitions in the schema may reserve particular names for purpose-specific metadata, as declared in those definitions. **Key name format:** valid `_meta` key names have two segments: an optional **prefix** , and a **name**. **Prefix:**
 * If specified, MUST be a series of labels separated by dots (`.`), followed by a slash (`/`). 
 * Labels MUST start with a letter and end with a letter or digit; interior characters can be letters, digits, or hyphens (`-`).
 * Any prefix beginning with zero or more valid labels, followed by `modelcontextprotocol` or `mcp`, followed by any valid label, is **reserved** for MCP use. 
 * For example: `modelcontextprotocol.io/`, `mcp.dev/`, `api.modelcontextprotocol.org/`, and `tools.mcp.com/` are all reserved.

**Name:**
 * Unless empty, MUST begin and end with an alphanumeric character (`[a-z0-9A-Z]`).
 * MAY contain hyphens (`-`), underscores (`_`), dots (`.`), and alphanumerics in between.

Was this page helpful?
YesNo
ArchitectureLifecycle
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Key Changes - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/changelog

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.130781

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Key Changes
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Major changes
 * Other schema changes
 * Full changelog

# Key Changes
Copy page
Copy page
This document lists changes made to the Model Context Protocol (MCP) specification since the previous revision, 2025-03-26.
## 
​
Major changes
 1. Remove support for JSON-RPC **batching** (PR #416)
 2. Add support for structured tool output (PR #371)
 3. Classify MCP servers as OAuth Resource Servers, adding protected resource metadata to discover the corresponding Authorization server. (PR #338)
 4. Require MCP clients to implement Resource Indicators as described in RFC 8707 to prevent malicious servers from obtaining access tokens. (PR #734)
 5. Clarify security considerations and best practices in the authorization spec and in a new security best practices page.
 6. Add support for **elicitation** , enabling servers to request additional information from users during interactions. (PR #382)
 7. Add support for **resource links** in tool call results. (PR #603)
 8. Require negotiated protocol version to be specified via `MCP-Protocol-Version` header in subsequent requests when using HTTP (PR #548).
 9. Change **SHOULD** to **MUST** in Lifecycle Operation

## 
​
Other schema changes
 1. Add `_meta` field to additional interface types (PR #710), and specify proper usage.
 2. Add `context` field to `CompletionRequest`, providing for completion requests to include previously-resolved variables (PR #598).
 3. Add `title` field for human-friendly display names, so that `name` can be used as a programmatic identifier (PR #663)

## 
​
Full changelog
For a complete list of all changes that have been made since the last protocol revision, see GitHub.
Was this page helpful?
YesNo
SpecificationArchitecture
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Contributor Communication - Model Context Protocol

## URL
https://modelcontextprotocol.io/community/communication

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.130908

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Contributor Communication
DocumentationSpecificationCommunityAbout MCP
 * Contributor Communication

##### Governance
 * Governance and Stewardship
 * SEP Guidelines
 * Working and Interest Groups
 * Antitrust Policy

##### Roadmap
 * Roadmap

##### Examples
 * Example Clients
 * Example Servers

On this page
 * Communication Channels
 * Discord
 * Public Channels (Default)
 * Private channels (Exceptions)
 * GitHub Discussions
 * GitHub Issues
 * Security Issues
 * Decision Records

# Contributor Communication
Copy page
Communication strategy and framework for the Model Context Protocol community
Copy page
This document explains how to communicate and collaborate within the Model Context Protocol (MCP) project.
## 
​
Communication Channels
In short:
 * **Discord** : For real-time or ad-hoc discussions.
 * **GitHub Discussions** : For structured, longer-form discussions.
 * **GitHub Issues** : For actionable tasks, bug reports, and feature requests.
 * **For security-sensitive issues** : Follow the process in SECURITY.md.

All communication is governed by our Code of Conduct. We expect all participants to maintain respectful, professional, and inclusive interactions across all channels.
### 
​
Discord
For real-time contributor discussion and collaboration. The server is designed around **MCP contributors** and is not intended to be a place for general MCP support. The Discord server will have both public and private channels. Join the Discord server here.
#### 
​
Public Channels (Default)
 * **Purpose** : Open community engagement, collaborative development, and transparent project coordination.
 * Primary use cases: 
 * **Public SDK and tooling development** : All development, from ideation to release planning, happens in public channels (e.g., `#typescript-sdk-dev`, `#inspector-dev`).
 * **Working and Interest Group discussions**
 * **Community onboarding** and contribution guidance.
 * **Community feedback** and collaborative brainstorming.
 * Public **office hours** and **maintainer availability**.
 * Avoid: 
 * MCP user support: participants are expected to read official documentation and start new GitHub Discussions for questions or support.
 * Service or product marketing: interactions on this Discord are expected to be vendor-neutral and not used for brand-building or sales. Mentions of brands or products are discouraged outside of being used as examples or responses to conversations that start off focused on the specification.

#### 
​
Private channels (Exceptions)
 * **Purpose** : Confidential coordination and sensitive matters that cannot be discussed publicly. Access will be restricted to designated maintainers.
 * **Strict criteria for private use** : 
 * **Security incidents** (CVEs, protocol vulnerabilities).
 * **People matters** (maintainer-related discussions, code of conduct policies).
 * Select channels will be configured to be **read-only**. This can be good for example for maintainer decision making.
 * Coordination requiring **immediate** or otherwise **focused response** with a limited audience.
 * **Transparency** : 
 * **All technical and governance decisions** affecting the community **must be documented** in GitHub Discussions and/or Issues, and will be labeled with `notes`.
 * **Some matters related to individual contributors** may remain private when appropriate (e.g., personal circumstances, disciplinary actions, or other sensitive individual matters).
 * Private channels are to be used as **temporary “incident rooms,”** not for routine development.

Any significant discussion on Discord that leads to a potential decision or proposal must be moved to a GitHub Discussion or GitHub Issue to create a persistent, searchable record. Proposals will then be promoted to full-fledged PRs with associated work items (GitHub Issues) as needed.
### 
​
GitHub Discussions
For structured, long-form discussion and debate on project direction, features, improvements, and community topics. When to use:
 * Project roadmap planning and milestone discussions
 * Announcements and release communications
 * Community polls and consensus-building processes
 * Feature requests with context and rationale 
 * If a particular repository does not have GitHub Discussions enabled, feel free to open a GitHub Issue instead.

### 
​
GitHub Issues
For bug reports, feature tracking, and actionable development tasks. When to use:
 * Submit SEP proposals (following the SEP guidelines)
 * Bug reports with reproducible steps
 * Documentation improvements with specific scope
 * CI/CD problems and infrastructure issues
 * Release tasks and milestone tracking

### 
​
Security Issues
**Do not post security issues publicly.** Instead:
 1. Use the private security reporting process. For protocol-level security issues, follow the process in SECURITY.md in the modelcontextprotocol GitHub repository.
 2. Contact lead and/or core maintainers directly.
 3. Follow responsible disclosure guidelines.

## 
​
Decision Records
All MCP decisions are documented and captured in public channels.
 * **Technical decisions** : GitHub Issues and SEPs.
 * **Specification changes** : On the Model Context Protocol website.
 * **Process changes** : Community documentation.
 * **Governance decisions and updates** : GitHub Issues and SEPs.

When documenting decisions, we will retain as much context as possible:
 * Decision makers
 * Background context and motivation
 * Options that were considered
 * Rationale for the chosen approach
 * Implementation steps

Was this page helpful?
YesNo
Governance and Stewardship
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Specification - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.131024

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Specification
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Overview
 * Key Details
 * Base Protocol
 * Features
 * Additional Utilities
 * Security and Trust & Safety
 * Key Principles
 * Implementation Guidelines
 * Learn More

# Specification
Copy page
Copy page
Model Context Protocol (MCP) is an open protocol that enables seamless integration between LLM applications and external data sources and tools. Whether you’re building an AI-powered IDE, enhancing a chat interface, or creating custom AI workflows, MCP provides a standardized way to connect LLMs with the context they need. This specification defines the authoritative protocol requirements, based on the TypeScript schema in schema.ts. For implementation guides and examples, visit modelcontextprotocol.io. The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “NOT RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.
## 
​
Overview
MCP provides a standardized way for applications to:
 * Share contextual information with language models
 * Expose tools and capabilities to AI systems
 * Build composable integrations and workflows

The protocol uses JSON-RPC 2.0 messages to establish communication between:
 * **Hosts** : LLM applications that initiate connections
 * **Clients** : Connectors within the host application
 * **Servers** : Services that provide context and capabilities

MCP takes some inspiration from the Language Server Protocol, which standardizes how to add support for programming languages across a whole ecosystem of development tools. In a similar way, MCP standardizes how to integrate additional context and tools into the ecosystem of AI applications.
## 
​
Key Details
### 
​
Base Protocol
 * JSON-RPC message format
 * Stateful connections
 * Server and client capability negotiation

### 
​
Features
Servers offer any of the following features to clients:
 * **Resources** : Context and data, for the user or the AI model to use
 * **Prompts** : Templated messages and workflows for users
 * **Tools** : Functions for the AI model to execute

Clients may offer the following features to servers:
 * **Sampling** : Server-initiated agentic behaviors and recursive LLM interactions
 * **Roots** : Server-initiated inquiries into uri or filesystem boundaries to operate in
 * **Elicitation** : Server-initiated requests for additional information from users

### 
​
Additional Utilities
 * Configuration
 * Progress tracking
 * Cancellation
 * Error reporting
 * Logging

## 
​
Security and Trust & Safety
The Model Context Protocol enables powerful capabilities through arbitrary data access and code execution paths. With this power comes important security and trust considerations that all implementors must carefully address.
### 
​
Key Principles
 1. **User Consent and Control**
 * Users must explicitly consent to and understand all data access and operations
 * Users must retain control over what data is shared and what actions are taken
 * Implementors should provide clear UIs for reviewing and authorizing activities
 2. **Data Privacy**
 * Hosts must obtain explicit user consent before exposing user data to servers
 * Hosts must not transmit resource data elsewhere without user consent
 * User data should be protected with appropriate access controls
 3. **Tool Safety**
 * Tools represent arbitrary code execution and must be treated with appropriate caution. 
 * In particular, descriptions of tool behavior such as annotations should be considered untrusted, unless obtained from a trusted server.
 * Hosts must obtain explicit user consent before invoking any tool
 * Users should understand what each tool does before authorizing its use
 4. **LLM Sampling Controls**
 * Users must explicitly approve any LLM sampling requests
 * Users should control: 
 * Whether sampling occurs at all
 * The actual prompt that will be sent
 * What results the server can see
 * The protocol intentionally limits server visibility into prompts

### 
​
Implementation Guidelines
While MCP itself cannot enforce these security principles at the protocol level, implementors **SHOULD** :
 1. Build robust consent and authorization flows into their applications
 2. Provide clear documentation of security implications
 3. Implement appropriate access controls and data protections
 4. Follow security best practices in their integrations
 5. Consider privacy implications in their feature designs

## 
​
Learn More
Explore the detailed specification for each protocol component:
## Architecture## Base Protocol## Server Features## Client Features## Contributing
Was this page helpful?
YesNo
Key Changes
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Roots - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/client/roots

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.131162

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Client Features
Roots
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * User Interaction Model
 * Capabilities
 * Protocol Messages
 * Listing Roots
 * Root List Changes
 * Message Flow
 * Data Types
 * Root
 * Project Directory
 * Multiple Repositories
 * Error Handling
 * Security Considerations
 * Implementation Guidelines

Client Features
# Roots
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) provides a standardized way for clients to expose filesystem “roots” to servers. Roots define the boundaries of where servers can operate within the filesystem, allowing them to understand which directories and files they have access to. Servers can request the list of roots from supporting clients and receive notifications when that list changes.
## 
​
User Interaction Model
Roots in MCP are typically exposed through workspace or project configuration interfaces. For example, implementations could offer a workspace/project picker that allows users to select directories and files the server should have access to. This can be combined with automatic workspace detection from version control systems or project files. However, implementations are free to expose roots through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.
## 
​
Capabilities
Clients that support roots **MUST** declare the `roots` capability during initialization:
Copy
```
{
  "capabilities": {
    "roots": {
      "listChanged": true
    }
  }
}

```

`listChanged` indicates whether the client will emit notifications when the list of roots changes.
## 
​
Protocol Messages
### 
​
Listing Roots
To retrieve roots, servers send a `roots/list` request: **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "roots/list"
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "roots": [
      {
        "uri": "file:///home/user/projects/myproject",
        "name": "My Project"
      }
    ]
  }
}

```

### 
​
Root List Changes
When roots change, clients that support `listChanged` **MUST** send a notification:
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/roots/list_changed"
}

```

## 
​
Message Flow
## 
​
Data Types
### 
​
Root
A root definition includes:
 * `uri`: Unique identifier for the root. This **MUST** be a `file://` URI in the current specification.
 * `name`: Optional human-readable name for display purposes.

Example roots for different use cases:
#### 
​
Project Directory
Copy
```
{
  "uri": "file:///home/user/projects/myproject",
  "name": "My Project"
}

```

#### 
​
Multiple Repositories
Copy
```
[
  {
    "uri": "file:///home/user/repos/frontend",
    "name": "Frontend Repository"
  },
  {
    "uri": "file:///home/user/repos/backend",
    "name": "Backend Repository"
  }
]

```

## 
​
Error Handling
Clients **SHOULD** return standard JSON-RPC errors for common failure cases:
 * Client does not support roots: `-32601` (Method not found)
 * Internal errors: `-32603`

Example error:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Roots not supported",
    "data": {
      "reason": "Client does not have roots capability"
    }
  }
}

```

## 
​
Security Considerations
 1. Clients **MUST** :
 * Only expose roots with appropriate permissions
 * Validate all root URIs to prevent path traversal
 * Implement proper access controls
 * Monitor root accessibility
 2. Servers **SHOULD** :
 * Handle cases where roots become unavailable
 * Respect root boundaries during operations
 * Validate all paths against provided roots

## 
​
Implementation Guidelines
 1. Clients **SHOULD** :
 * Prompt users for consent before exposing roots to servers
 * Provide clear user interfaces for root management
 * Validate root accessibility before exposing
 * Monitor for root changes
 2. Servers **SHOULD** :
 * Check for roots capability before usage
 * Handle root list changes gracefully
 * Respect root boundaries in operations
 * Cache root information appropriately

Was this page helpful?
YesNo
ProgressSampling
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Authorization - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.131466

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Base Protocol
Authorization
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Introduction
 * Purpose and Scope
 * Protocol Requirements
 * Standards Compliance
 * Authorization Flow
 * Roles
 * Overview
 * Authorization Server Discovery
 * Authorization Server Location
 * Server Metadata Discovery
 * Sequence Diagram
 * Dynamic Client Registration
 * Authorization Flow Steps
 * Resource Parameter Implementation
 * Access Token Usage
 * Token Requirements
 * Token Handling
 * Error Handling
 * Security Considerations
 * Token Audience Binding and Validation
 * Token Theft
 * Communication Security
 * Authorization Code Protection
 * Open Redirection
 * Confused Deputy Problem
 * Access Token Privilege Restriction

Base Protocol
# Authorization
Copy page
Copy page
**Protocol Revision** : 2025-06-18
## 
​
Introduction
### 
​
Purpose and Scope
The Model Context Protocol provides authorization capabilities at the transport level, enabling MCP clients to make requests to restricted MCP servers on behalf of resource owners. This specification defines the authorization flow for HTTP-based transports.
### 
​
Protocol Requirements
Authorization is **OPTIONAL** for MCP implementations. When supported:
 * Implementations using an HTTP-based transport **SHOULD** conform to this specification.
 * Implementations using an STDIO transport **SHOULD NOT** follow this specification, and instead retrieve credentials from the environment.
 * Implementations using alternative transports **MUST** follow established security best practices for their protocol.

### 
​
Standards Compliance
This authorization mechanism is based on established specifications listed below, but implements a selected subset of their features to ensure security and interoperability while maintaining simplicity:
 * OAuth 2.1 IETF DRAFT (draft-ietf-oauth-v2-1-13)
 * OAuth 2.0 Authorization Server Metadata (RFC8414)
 * OAuth 2.0 Dynamic Client Registration Protocol (RFC7591)
 * OAuth 2.0 Protected Resource Metadata (RFC9728)

## 
​
Authorization Flow
### 
​
Roles
A protected _MCP server_ acts as an OAuth 2.1 resource server, capable of accepting and responding to protected resource requests using access tokens. An _MCP client_ acts as an OAuth 2.1 client, making protected resource requests on behalf of a resource owner. The _authorization server_ is responsible for interacting with the user (if necessary) and issuing access tokens for use at the MCP server. The implementation details of the authorization server are beyond the scope of this specification. It may be hosted with the resource server or a separate entity. The Authorization Server Discovery section specifies how an MCP server indicates the location of its corresponding authorization server to a client.
### 
​
Overview
 1. Authorization servers **MUST** implement OAuth 2.1 with appropriate security measures for both confidential and public clients.
 2. Authorization servers and MCP clients **SHOULD** support the OAuth 2.0 Dynamic Client Registration Protocol (RFC7591).
 3. MCP servers **MUST** implement OAuth 2.0 Protected Resource Metadata (RFC9728). MCP clients **MUST** use OAuth 2.0 Protected Resource Metadata for authorization server discovery.
 4. Authorization servers **MUST** provide OAuth 2.0 Authorization Server Metadata (RFC8414). MCP clients **MUST** use the OAuth 2.0 Authorization Server Metadata.

### 
​
Authorization Server Discovery
This section describes the mechanisms by which MCP servers advertise their associated authorization servers to MCP clients, as well as the discovery process through which MCP clients can determine authorization server endpoints and supported capabilities.
#### 
​
Authorization Server Location
MCP servers **MUST** implement the OAuth 2.0 Protected Resource Metadata (RFC9728) specification to indicate the locations of authorization servers. The Protected Resource Metadata document returned by the MCP server **MUST** include the `authorization_servers` field containing at least one authorization server. The specific use of `authorization_servers` is beyond the scope of this specification; implementers should consult OAuth 2.0 Protected Resource Metadata (RFC9728) for guidance on implementation details. Implementors should note that Protected Resource Metadata documents can define multiple authorization servers. The responsibility for selecting which authorization server to use lies with the MCP client, following the guidelines specified in RFC9728 Section 7.6 “Authorization Servers”. MCP servers **MUST** use the HTTP header `WWW-Authenticate` when returning a _401 Unauthorized_ to indicate the location of the resource server metadata URL as described in RFC9728 Section 5.1 “WWW-Authenticate Response”. MCP clients **MUST** be able to parse `WWW-Authenticate` headers and respond appropriately to `HTTP 401 Unauthorized` responses from the MCP server.
#### 
​
Server Metadata Discovery
MCP clients **MUST** follow the OAuth 2.0 Authorization Server Metadata RFC8414 specification to obtain the information required to interact with the authorization server.
#### 
​
Sequence Diagram
The following diagram outlines an example flow:
### 
​
Dynamic Client Registration
MCP clients and authorization servers **SHOULD** support the OAuth 2.0 Dynamic Client Registration Protocol RFC7591 to allow MCP clients to obtain OAuth client IDs without user interaction. This provides a standardized way for clients to automatically register with new authorization servers, which is crucial for MCP because:
 * Clients may not know all possible MCP servers and their authorization servers in advance.
 * Manual registration would create friction for users.
 * It enables seamless connection to new MCP servers and their authorization servers.
 * Authorization servers can implement their own registration policies.

Any authorization servers that _do not_ support Dynamic Client Registration need to provide alternative ways to obtain a client ID (and, if applicable, client credentials). For one of these authorization servers, MCP clients will have to either:
 1. Hardcode a client ID (and, if applicable, client credentials) specifically for the MCP client to use when interacting with that authorization server, or
 2. Present a UI to users that allows them to enter these details, after registering an OAuth client themselves (e.g., through a configuration interface hosted by the server).

### 
​
Authorization Flow Steps
The complete Authorization flow proceeds as follows:
#### 
​
Resource Parameter Implementation
MCP clients **MUST** implement Resource Indicators for OAuth 2.0 as defined in RFC 8707 to explicitly specify the target resource for which the token is being requested. The `resource` parameter:
 1. **MUST** be included in both authorization requests and token requests.
 2. **MUST** identify the MCP server that the client intends to use the token with.
 3. **MUST** use the canonical URI of the MCP server as defined in RFC 8707 Section 2.

##### Canonical Server URI
For the purposes of this specification, the canonical URI of an MCP server is defined as the resource identifier as specified in RFC 8707 Section 2 and aligns with the `resource` parameter in RFC 9728. MCP clients **SHOULD** provide the most specific URI that they can for the MCP server they intend to access, following the guidance in RFC 8707. While the canonical form uses lowercase scheme and host components, implementations **SHOULD** accept uppercase scheme and host components for robustness and interoperability. Examples of valid canonical URIs:
 * `https://mcp.example.com/mcp`
 * `https://mcp.example.com`
 * `https://mcp.example.com:8443`
 * `https://mcp.example.com/server/mcp` (when path component is necessary to identify individual MCP server)

Examples of invalid canonical URIs:
 * `mcp.example.com` (missing scheme)
 * `https://mcp.example.com#fragment` (contains fragment)

> **Note:** While both `https://mcp.example.com/` (with trailing slash) and `https://mcp.example.com` (without trailing slash) are technically valid absolute URIs according to RFC 3986, implementations **SHOULD** consistently use the form without the trailing slash for better interoperability unless the trailing slash is semantically significant for the specific resource.
For example, if accessing an MCP server at `https://mcp.example.com`, the authorization request would include:
Copy
```
&resource=https%3A%2F%2Fmcp.example.com

```

MCP clients **MUST** send this parameter regardless of whether authorization servers support it.
### 
​
Access Token Usage
#### 
​
Token Requirements
Access token handling when making requests to MCP servers **MUST** conform to the requirements defined in OAuth 2.1 Section 5 “Resource Requests”. Specifically:
 1. MCP client **MUST** use the Authorization request header field defined in OAuth 2.1 Section 5.1.1:

Copy
```
Authorization: Bearer <access-token>

```

Note that authorization **MUST** be included in every HTTP request from client to server, even if they are part of the same logical session.
 1. Access tokens **MUST NOT** be included in the URI query string

Example request:
Copy
```
GET /mcp HTTP/1.1
Host: mcp.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

```

#### 
​
Token Handling
MCP servers, acting in their role as an OAuth 2.1 resource server, **MUST** validate access tokens as described in OAuth 2.1 Section 5.2. MCP servers **MUST** validate that access tokens were issued specifically for them as the intended audience, according to RFC 8707 Section 2. If validation fails, servers **MUST** respond according to OAuth 2.1 Section 5.3 error handling requirements. Invalid or expired tokens **MUST** receive a HTTP 401 response. MCP clients **MUST NOT** send tokens to the MCP server other than ones issued by the MCP server’s authorization server. Authorization servers **MUST** only accept tokens that are valid for use with their own resources. MCP servers **MUST NOT** accept or transit any other tokens.
### 
​
Error Handling
Servers **MUST** return appropriate HTTP status codes for authorization errors: Status Code | Description | Usage 
---|---|--- 
401 | Unauthorized | Authorization required or token invalid 
403 | Forbidden | Invalid scopes or insufficient permissions 
400 | Bad Request | Malformed authorization request 
## 
​
Security Considerations
Implementations **MUST** follow OAuth 2.1 security best practices as laid out in OAuth 2.1 Section 7. “Security Considerations”.
### 
​
Token Audience Binding and Validation
RFC 8707 Resource Indicators provide critical security benefits by binding tokens to their intended audiences **when the Authorization Server supports the capability**. To enable current and future adoption:
 * MCP clients **MUST** include the `resource` parameter in authorization and token requests as specified in the Resource Parameter Implementation section
 * MCP servers **MUST** validate that tokens presented to them were specifically issued for their use

The Security Best Practices document outlines why token audience validation is crucial and why token passthrough is explicitly forbidden.
### 
​
Token Theft
Attackers who obtain tokens stored by the client, or tokens cached or logged on the server can access protected resources with requests that appear legitimate to resource servers. Clients and servers **MUST** implement secure token storage and follow OAuth best practices, as outlined in OAuth 2.1, Section 7.1. Authorization servers **SHOULD** issue short-lived access tokens to reduce the impact of leaked tokens. For public clients, authorization servers **MUST** rotate refresh tokens as described in OAuth 2.1 Section 4.3.1 “Token Endpoint Extension”.
### 
​
Communication Security
Implementations **MUST** follow OAuth 2.1 Section 1.5 “Communication Security”. Specifically:
 1. All authorization server endpoints **MUST** be served over HTTPS.
 2. All redirect URIs **MUST** be either `localhost` or use HTTPS.

### 
​
Authorization Code Protection
An attacker who has gained access to an authorization code contained in an authorization response can try to redeem the authorization code for an access token or otherwise make use of the authorization code. (Further described in OAuth 2.1 Section 7.5) To mitigate this, MCP clients **MUST** implement PKCE according to OAuth 2.1 Section 7.5.2. PKCE helps prevent authorization code interception and injection attacks by requiring clients to create a secret verifier-challenge pair, ensuring that only the original requestor can exchange an authorization code for tokens.
### 
​
Open Redirection
An attacker may craft malicious redirect URIs to direct users to phishing sites. MCP clients **MUST** have redirect URIs registered with the authorization server. Authorization servers **MUST** validate exact redirect URIs against pre-registered values to prevent redirection attacks. MCP clients **SHOULD** use and verify state parameters in the authorization code flow and discard any results that do not include or have a mismatch with the original state. Authorization servers **MUST** take precautions to prevent redirecting user agents to untrusted URI’s, following suggestions laid out in OAuth 2.1 Section 7.12.2 Authorization servers **SHOULD** only automatically redirect the user agent if it trusts the redirection URI. If the URI is not trusted, the authorization server MAY inform the user and rely on the user to make the correct decision.
### 
​
Confused Deputy Problem
Attackers can exploit MCP servers acting as intermediaries to third-party APIs, leading to confused deputy vulnerabilities. By using stolen authorization codes, they can obtain access tokens without user consent. MCP proxy servers using static client IDs **MUST** obtain user consent for each dynamically registered client before forwarding to third-party authorization servers (which may require additional consent).
### 
​
Access Token Privilege Restriction
An attacker can gain unauthorized access or otherwise compromise an MCP server if the server accepts tokens issued for other resources. This vulnerability has two critical dimensions:
 1. **Audience validation failures.** When an MCP server doesn’t verify that tokens were specifically intended for it (for example, via the audience claim, as mentioned in RFC9068), it may accept tokens originally issued for other services. This breaks a fundamental OAuth security boundary, allowing attackers to reuse legitimate tokens across different services than intended.
 2. **Token passthrough.** If the MCP server not only accepts tokens with incorrect audiences but also forwards these unmodified tokens to downstream services, it can potentially cause the “confused deputy” problem, where the downstream API may incorrectly trust the token as if it came from the MCP server or assume the token was validated by the upstream API. See the Token Passthrough section of the Security Best Practices guide for additional details.

MCP servers **MUST** validate access tokens before processing the request, ensuring the access token is issued specifically for the MCP server, and take all necessary steps to ensure no data is returned to unauthorized parties. A MCP server **MUST** follow the guidelines in OAuth 2.1 - Section 5.2 to validate inbound tokens. MCP servers **MUST** only accept tokens specifically intended for themselves and **MUST** reject tokens that do not include them in the audience claim or otherwise verify that they are the intended recipient of the token. See the Security Best Practices Token Passthrough section for details. If the MCP server makes requests to upstream APIs, it may act as an OAuth client to them. The access token used at the upstream API is a separate token, issued by the upstream authorization server. The MCP server **MUST NOT** pass through the token it received from the MCP client. MCP clients **MUST** implement and use the `resource` parameter as defined in RFC 8707 - Resource Indicators for OAuth 2.0 to explicitly specify the target resource for which the token is being requested. This requirement aligns with the recommendation in RFC 9728 Section 7.4. This ensures that access tokens are bound to their intended resources and cannot be misused across different services.
Was this page helpful?
YesNo
TransportsSecurity Best Practices
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Transports - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/basic/transports

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.131695

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Base Protocol
Transports
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * stdio
 * Streamable HTTP
 * Security Warning
 * Sending Messages to the Server
 * Listening for Messages from the Server
 * Multiple Connections
 * Resumability and Redelivery
 * Session Management
 * Sequence Diagram
 * Protocol Version Header
 * Backwards Compatibility
 * Custom Transports

Base Protocol
# Transports
Copy page
Copy page
**Protocol Revision** : 2025-06-18
MCP uses JSON-RPC to encode messages. JSON-RPC messages **MUST** be UTF-8 encoded. The protocol currently defines two standard transport mechanisms for client-server communication:
 1. stdio, communication over standard in and standard out
 2. Streamable HTTP

Clients **SHOULD** support stdio whenever possible. It is also possible for clients and servers to implement custom transports in a pluggable fashion.
## 
​
stdio
In the **stdio** transport:
 * The client launches the MCP server as a subprocess.
 * The server reads JSON-RPC messages from its standard input (`stdin`) and sends messages to its standard output (`stdout`).
 * Messages are individual JSON-RPC requests, notifications, or responses.
 * Messages are delimited by newlines, and **MUST NOT** contain embedded newlines.
 * The server **MAY** write UTF-8 strings to its standard error (`stderr`) for logging purposes. Clients **MAY** capture, forward, or ignore this logging.
 * The server **MUST NOT** write anything to its `stdout` that is not a valid MCP message.
 * The client **MUST NOT** write anything to the server’s `stdin` that is not a valid MCP message.

## 
​
Streamable HTTP
This replaces the HTTP+SSE transport from protocol version 2024-11-05. See the backwards compatibility guide below.
In the **Streamable HTTP** transport, the server operates as an independent process that can handle multiple client connections. This transport uses HTTP POST and GET requests. Server can optionally make use of Server-Sent Events (SSE) to stream multiple server messages. This permits basic MCP servers, as well as more feature-rich servers supporting streaming and server-to-client notifications and requests. The server **MUST** provide a single HTTP endpoint path (hereafter referred to as the **MCP endpoint**) that supports both POST and GET methods. For example, this could be a URL like `https://example.com/mcp`.
#### 
​
Security Warning
When implementing Streamable HTTP transport:
 1. Servers **MUST** validate the `Origin` header on all incoming connections to prevent DNS rebinding attacks
 2. When running locally, servers **SHOULD** bind only to localhost (127.0.0.1) rather than all network interfaces (0.0.0.0)
 3. Servers **SHOULD** implement proper authentication for all connections

Without these protections, attackers could use DNS rebinding to interact with local MCP servers from remote websites.
### 
​
Sending Messages to the Server
Every JSON-RPC message sent from the client **MUST** be a new HTTP POST request to the MCP endpoint.
 1. The client **MUST** use HTTP POST to send JSON-RPC messages to the MCP endpoint.
 2. The client **MUST** include an `Accept` header, listing both `application/json` and `text/event-stream` as supported content types.
 3. The body of the POST request **MUST** be a single JSON-RPC _request_ , _notification_ , or _response_.
 4. If the input is a JSON-RPC _response_ or _notification_ : 
 * If the server accepts the input, the server **MUST** return HTTP status code 202 Accepted with no body.
 * If the server cannot accept the input, it **MUST** return an HTTP error status code (e.g., 400 Bad Request). The HTTP response body **MAY** comprise a JSON-RPC _error response_ that has no `id`.
 5. If the input is a JSON-RPC _request_ , the server **MUST** either return `Content-Type: text/event-stream`, to initiate an SSE stream, or `Content-Type: application/json`, to return one JSON object. The client **MUST** support both these cases.
 6. If the server initiates an SSE stream: 
 * The SSE stream **SHOULD** eventually include JSON-RPC _response_ for the JSON-RPC _request_ sent in the POST body.
 * The server **MAY** send JSON-RPC _requests_ and _notifications_ before sending the JSON-RPC _response_. These messages **SHOULD** relate to the originating client _request_.
 * The server **SHOULD NOT** close the SSE stream before sending the JSON-RPC _response_ for the received JSON-RPC _request_ , unless the session expires.
 * After the JSON-RPC _response_ has been sent, the server **SHOULD** close the SSE stream.
 * Disconnection **MAY** occur at any time (e.g., due to network conditions). Therefore: 
 * Disconnection **SHOULD NOT** be interpreted as the client cancelling its request.
 * To cancel, the client **SHOULD** explicitly send an MCP `CancelledNotification`.
 * To avoid message loss due to disconnection, the server **MAY** make the stream resumable.

### 
​
Listening for Messages from the Server
 1. The client **MAY** issue an HTTP GET to the MCP endpoint. This can be used to open an SSE stream, allowing the server to communicate to the client, without the client first sending data via HTTP POST.
 2. The client **MUST** include an `Accept` header, listing `text/event-stream` as a supported content type.
 3. The server **MUST** either return `Content-Type: text/event-stream` in response to this HTTP GET, or else return HTTP 405 Method Not Allowed, indicating that the server does not offer an SSE stream at this endpoint.
 4. If the server initiates an SSE stream: 
 * The server **MAY** send JSON-RPC _requests_ and _notifications_ on the stream.
 * These messages **SHOULD** be unrelated to any concurrently-running JSON-RPC _request_ from the client.
 * The server **MUST NOT** send a JSON-RPC _response_ on the stream **unless** resuming a stream associated with a previous client request.
 * The server **MAY** close the SSE stream at any time.
 * The client **MAY** close the SSE stream at any time.

### 
​
Multiple Connections
 1. The client **MAY** remain connected to multiple SSE streams simultaneously.
 2. The server **MUST** send each of its JSON-RPC messages on only one of the connected streams; that is, it **MUST NOT** broadcast the same message across multiple streams. 
 * The risk of message loss **MAY** be mitigated by making the stream resumable.

### 
​
Resumability and Redelivery
To support resuming broken connections, and redelivering messages that might otherwise be lost:
 1. Servers **MAY** attach an `id` field to their SSE events, as described in the SSE standard. 
 * If present, the ID **MUST** be globally unique across all streams within that session—or all streams with that specific client, if session management is not in use.
 2. If the client wishes to resume after a broken connection, it **SHOULD** issue an HTTP GET to the MCP endpoint, and include the `Last-Event-ID` header to indicate the last event ID it received. 
 * The server **MAY** use this header to replay messages that would have been sent after the last event ID, _on the stream that was disconnected_ , and to resume the stream from that point.
 * The server **MUST NOT** replay messages that would have been delivered on a different stream.

In other words, these event IDs should be assigned by servers on a _per-stream_ basis, to act as a cursor within that particular stream.
### 
​
Session Management
An MCP “session” consists of logically related interactions between a client and a server, beginning with the initialization phase. To support servers which want to establish stateful sessions:
 1. A server using the Streamable HTTP transport **MAY** assign a session ID at initialization time, by including it in an `Mcp-Session-Id` header on the HTTP response containing the `InitializeResult`. 
 * The session ID **SHOULD** be globally unique and cryptographically secure (e.g., a securely generated UUID, a JWT, or a cryptographic hash).
 * The session ID **MUST** only contain visible ASCII characters (ranging from 0x21 to 0x7E).
 2. If an `Mcp-Session-Id` is returned by the server during initialization, clients using the Streamable HTTP transport **MUST** include it in the `Mcp-Session-Id` header on all of their subsequent HTTP requests. 
 * Servers that require a session ID **SHOULD** respond to requests without an `Mcp-Session-Id` header (other than initialization) with HTTP 400 Bad Request.
 3. The server **MAY** terminate the session at any time, after which it **MUST** respond to requests containing that session ID with HTTP 404 Not Found.
 4. When a client receives HTTP 404 in response to a request containing an `Mcp-Session-Id`, it **MUST** start a new session by sending a new `InitializeRequest` without a session ID attached.
 5. Clients that no longer need a particular session (e.g., because the user is leaving the client application) **SHOULD** send an HTTP DELETE to the MCP endpoint with the `Mcp-Session-Id` header, to explicitly terminate the session. 
 * The server **MAY** respond to this request with HTTP 405 Method Not Allowed, indicating that the server does not allow clients to terminate sessions.

### 
​
Sequence Diagram
Syntax error in textmermaid version 11.4.1
### 
​
Protocol Version Header
If using HTTP, the client **MUST** include the `MCP-Protocol-Version: <protocol-version>` HTTP header on all subsequent requests to the MCP server, allowing the MCP server to respond based on the MCP protocol version. For example: `MCP-Protocol-Version: 2025-06-18` The protocol version sent by the client **SHOULD** be the one negotiated during initialization. For backwards compatibility, if the server does _not_ receive an `MCP-Protocol-Version` header, and has no other way to identify the version - for example, by relying on the protocol version negotiated during initialization - the server **SHOULD** assume protocol version `2025-03-26`. If the server receives a request with an invalid or unsupported `MCP-Protocol-Version`, it **MUST** respond with `400 Bad Request`.
### 
​
Backwards Compatibility
Clients and servers can maintain backwards compatibility with the deprecated HTTP+SSE transport (from protocol version 2024-11-05) as follows: **Servers** wanting to support older clients should:
 * Continue to host both the SSE and POST endpoints of the old transport, alongside the new “MCP endpoint” defined for the Streamable HTTP transport. 
 * It is also possible to combine the old POST endpoint and the new MCP endpoint, but this may introduce unneeded complexity.

**Clients** wanting to support older servers should:
 1. Accept an MCP server URL from the user, which may point to either a server using the old transport or the new transport.
 2. Attempt to POST an `InitializeRequest` to the server URL, with an `Accept` header as defined above: 
 * If it succeeds, the client can assume this is a server supporting the new Streamable HTTP transport.
 * If it fails with an HTTP 4xx status code (e.g., 405 Method Not Allowed or 404 Not Found): 
 * Issue a GET request to the server URL, expecting that this will open an SSE stream and return an `endpoint` event as the first event.
 * When the `endpoint` event arrives, the client can assume this is a server running the old HTTP+SSE transport, and should use that transport for all subsequent communication.

## 
​
Custom Transports
Clients and servers **MAY** implement additional custom transport mechanisms to suit their specific needs. The protocol is transport-agnostic and can be implemented over any communication channel that supports bidirectional message exchange. Implementers who choose to support custom transports **MUST** ensure they preserve the JSON-RPC message format and lifecycle requirements defined by MCP. Custom transports **SHOULD** document their specific connection establishment and message exchange patterns to aid interoperability.
Was this page helpful?
YesNo
LifecycleAuthorization
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Elicitation - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.131890

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Client Features
Elicitation
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * User Interaction Model
 * Capabilities
 * Protocol Messages
 * Creating Elicitation Requests
 * Simple Text Request
 * Structured Data Request
 * Message Flow
 * Request Schema
 * Supported Schema Types
 * Response Actions
 * Security Considerations

Client Features
# Elicitation
Copy page
Copy page
**Protocol Revision** : 2025-06-18
Elicitation is newly introduced in this version of the MCP specification and its design may evolve in future protocol versions.
The Model Context Protocol (MCP) provides a standardized way for servers to request additional information from users through the client during interactions. This flow allows clients to maintain control over user interactions and data sharing while enabling servers to gather necessary information dynamically. Servers request structured data from users with JSON schemas to validate responses.
## 
​
User Interaction Model
Elicitation in MCP allows servers to implement interactive workflows by enabling user input requests to occur _nested_ inside other MCP server features. Implementations are free to expose elicitation through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.
For trust & safety and security:
 * Servers **MUST NOT** use elicitation to request sensitive information.

Applications **SHOULD** :
 * Provide UI that makes it clear which server is requesting information
 * Allow users to review and modify their responses before sending
 * Respect user privacy and provide clear decline and cancel options

## 
​
Capabilities
Clients that support elicitation **MUST** declare the `elicitation` capability during initialization:
Copy
```
{
  "capabilities": {
    "elicitation": {}
  }
}

```

## 
​
Protocol Messages
### 
​
Creating Elicitation Requests
To request information from a user, servers send an `elicitation/create` request:
#### 
​
Simple Text Request
**Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "elicitation/create",
  "params": {
    "message": "Please provide your GitHub username",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        }
      },
      "required": ["name"]
    }
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "action": "accept",
    "content": {
      "name": "octocat"
    }
  }
}

```

#### 
​
Structured Data Request
**Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "elicitation/create",
  "params": {
    "message": "Please provide your contact information",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Your full name"
        },
        "email": {
          "type": "string",
          "format": "email",
          "description": "Your email address"
        },
        "age": {
          "type": "number",
          "minimum": 18,
          "description": "Your age"
        }
      },
      "required": ["name", "email"]
    }
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "action": "accept",
    "content": {
      "name": "Monalisa Octocat",
      "email": "octocat@github.com",
      "age": 30
    }
  }
}

```

**Reject Response Example:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "action": "decline"
  }
}

```

**Cancel Response Example:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "action": "cancel"
  }
}

```

## 
​
Message Flow
## 
​
Request Schema
The `requestedSchema` field allows servers to define the structure of the expected response using a restricted subset of JSON Schema. To simplify implementation for clients, elicitation schemas are limited to flat objects with primitive properties only:
Copy
```
"requestedSchema": {
  "type": "object",
  "properties": {
    "propertyName": {
      "type": "string",
      "title": "Display Name",
      "description": "Description of the property"
    },
    "anotherProperty": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    }
  },
  "required": ["propertyName"]
}

```

### 
​
Supported Schema Types
The schema is restricted to these primitive types:
 1. **String Schema**
Copy
```
{
  "type": "string",
  "title": "Display Name",
  "description": "Description text",
  "minLength": 3,
  "maxLength": 50,
  "format": "email" // Supported: "email", "uri", "date", "date-time"
}

```

Supported formats: `email`, `uri`, `date`, `date-time`
 2. **Number Schema**
Copy
```
{
  "type": "number", // or "integer"
  "title": "Display Name",
  "description": "Description text",
  "minimum": 0,
  "maximum": 100
}

```

 3. **Boolean Schema**
Copy
```
{
  "type": "boolean",
  "title": "Display Name",
  "description": "Description text",
  "default": false
}

```

 4. **Enum Schema**
Copy
```
{
  "type": "string",
  "title": "Display Name",
  "description": "Description text",
  "enum": ["option1", "option2", "option3"],
  "enumNames": ["Option 1", "Option 2", "Option 3"]
}

```

Clients can use this schema to:
 1. Generate appropriate input forms
 2. Validate user input before sending
 3. Provide better guidance to users

Note that complex nested structures, arrays of objects, and other advanced JSON Schema features are intentionally not supported to simplify client implementation.
## 
​
Response Actions
Elicitation responses use a three-action model to clearly distinguish between different user actions:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "action": "accept", // or "decline" or "cancel"
    "content": {
      "propertyName": "value",
      "anotherProperty": 42
    }
  }
}

```

The three response actions are:
 1. **Accept** (`action: "accept"`): User explicitly approved and submitted with data
 * The `content` field contains the submitted data matching the requested schema
 * Example: User clicked “Submit”, “OK”, “Confirm”, etc.
 2. **Decline** (`action: "decline"`): User explicitly declined the request
 * The `content` field is typically omitted
 * Example: User clicked “Reject”, “Decline”, “No”, etc.
 3. **Cancel** (`action: "cancel"`): User dismissed without making an explicit choice
 * The `content` field is typically omitted
 * Example: User closed the dialog, clicked outside, pressed Escape, etc.

Servers should handle each state appropriately:
 * **Accept** : Process the submitted data
 * **Decline** : Handle explicit decline (e.g., offer alternatives)
 * **Cancel** : Handle dismissal (e.g., prompt again later)

## 
​
Security Considerations
 1. Servers **MUST NOT** request sensitive information through elicitation
 2. Clients **SHOULD** implement user approval controls
 3. Both parties **SHOULD** validate elicitation content against the provided schema
 4. Clients **SHOULD** provide clear indication of which server is requesting information
 5. Clients **SHOULD** allow users to decline elicitation requests at any time
 6. Clients **SHOULD** implement rate limiting
 7. Clients **SHOULD** present elicitation requests in a way that makes it clear what information is being requested and why

Was this page helpful?
YesNo
SamplingOverview
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Sampling - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/client/sampling

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.132030

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Client Features
Sampling
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * User Interaction Model
 * Capabilities
 * Protocol Messages
 * Creating Messages
 * Message Flow
 * Data Types
 * Messages
 * Text Content
 * Image Content
 * Audio Content
 * Model Preferences
 * Capability Priorities
 * Model Hints
 * Error Handling
 * Security Considerations

Client Features
# Sampling
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) provides a standardized way for servers to request LLM sampling (“completions” or “generations”) from language models via clients. This flow allows clients to maintain control over model access, selection, and permissions while enabling servers to leverage AI capabilities—with no server API keys necessary. Servers can request text, audio, or image-based interactions and optionally include context from MCP servers in their prompts.
## 
​
User Interaction Model
Sampling in MCP allows servers to implement agentic behaviors, by enabling LLM calls to occur _nested_ inside other MCP server features. Implementations are free to expose sampling through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.
For trust & safety and security, there **SHOULD** always be a human in the loop with the ability to deny sampling requests.Applications **SHOULD** :
 * Provide UI that makes it easy and intuitive to review sampling requests
 * Allow users to view and edit prompts before sending
 * Present generated responses for review before delivery

## 
​
Capabilities
Clients that support sampling **MUST** declare the `sampling` capability during initialization:
Copy
```
{
  "capabilities": {
    "sampling": {}
  }
}

```

## 
​
Protocol Messages
### 
​
Creating Messages
To request a language model generation, servers send a `sampling/createMessage` request: **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "What is the capital of France?"
        }
      }
    ],
    "modelPreferences": {
      "hints": [
        {
          "name": "claude-3-sonnet"
        }
      ],
      "intelligencePriority": 0.8,
      "speedPriority": 0.5
    },
    "systemPrompt": "You are a helpful assistant.",
    "maxTokens": 100
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "role": "assistant",
    "content": {
      "type": "text",
      "text": "The capital of France is Paris."
    },
    "model": "claude-3-sonnet-20240307",
    "stopReason": "endTurn"
  }
}

```

## 
​
Message Flow
## 
​
Data Types
### 
​
Messages
Sampling messages can contain:
#### 
​
Text Content
Copy
```
{
  "type": "text",
  "text": "The message content"
}

```

#### 
​
Image Content
Copy
```
{
  "type": "image",
  "data": "base64-encoded-image-data",
  "mimeType": "image/jpeg"
}

```

#### 
​
Audio Content
Copy
```
{
  "type": "audio",
  "data": "base64-encoded-audio-data",
  "mimeType": "audio/wav"
}

```

### 
​
Model Preferences
Model selection in MCP requires careful abstraction since servers and clients may use different AI providers with distinct model offerings. A server cannot simply request a specific model by name since the client may not have access to that exact model or may prefer to use a different provider’s equivalent model. To solve this, MCP implements a preference system that combines abstract capability priorities with optional model hints:
#### 
​
Capability Priorities
Servers express their needs through three normalized priority values (0-1):
 * `costPriority`: How important is minimizing costs? Higher values prefer cheaper models.
 * `speedPriority`: How important is low latency? Higher values prefer faster models.
 * `intelligencePriority`: How important are advanced capabilities? Higher values prefer more capable models.

#### 
​
Model Hints
While priorities help select models based on characteristics, `hints` allow servers to suggest specific models or model families:
 * Hints are treated as substrings that can match model names flexibly
 * Multiple hints are evaluated in order of preference
 * Clients **MAY** map hints to equivalent models from different providers
 * Hints are advisory—clients make final model selection

For example:
Copy
```
{
  "hints": [
    { "name": "claude-3-sonnet" }, // Prefer Sonnet-class models
    { "name": "claude" } // Fall back to any Claude model
  ],
  "costPriority": 0.3, // Cost is less important
  "speedPriority": 0.8, // Speed is very important
  "intelligencePriority": 0.5 // Moderate capability needs
}

```

The client processes these preferences to select an appropriate model from its available options. For instance, if the client doesn’t have access to Claude models but has Gemini, it might map the sonnet hint to `gemini-1.5-pro` based on similar capabilities.
## 
​
Error Handling
Clients **SHOULD** return errors for common failure cases: Example error:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -1,
    "message": "User rejected sampling request"
  }
}

```

## 
​
Security Considerations
 1. Clients **SHOULD** implement user approval controls
 2. Both parties **SHOULD** validate message content
 3. Clients **SHOULD** respect model preference hints
 4. Clients **SHOULD** implement rate limiting
 5. Both parties **MUST** handle sensitive data appropriately

Was this page helpful?
YesNo
RootsElicitation
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Architecture - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/architecture

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.132134

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Architecture
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Core Components
 * Host
 * Clients
 * Servers
 * Design Principles
 * Capability Negotiation

# Architecture
Copy page
Copy page
The Model Context Protocol (MCP) follows a client-host-server architecture where each host can run multiple client instances. This architecture enables users to integrate AI capabilities across applications while maintaining clear security boundaries and isolating concerns. Built on JSON-RPC, MCP provides a stateful session protocol focused on context exchange and sampling coordination between clients and servers.
## 
​
Core Components
### 
​
Host
The host process acts as the container and coordinator:
 * Creates and manages multiple client instances
 * Controls client connection permissions and lifecycle
 * Enforces security policies and consent requirements
 * Handles user authorization decisions
 * Coordinates AI/LLM integration and sampling
 * Manages context aggregation across clients

### 
​
Clients
Each client is created by the host and maintains an isolated server connection:
 * Establishes one stateful session per server
 * Handles protocol negotiation and capability exchange
 * Routes protocol messages bidirectionally
 * Manages subscriptions and notifications
 * Maintains security boundaries between servers

A host application creates and manages multiple clients, with each client having a 1:1 relationship with a particular server.
### 
​
Servers
Servers provide specialized context and capabilities:
 * Expose resources, tools and prompts via MCP primitives
 * Operate independently with focused responsibilities
 * Request sampling through client interfaces
 * Must respect security constraints
 * Can be local processes or remote services

## 
​
Design Principles
MCP is built on several key design principles that inform its architecture and implementation:
 1. **Servers should be extremely easy to build**
 * Host applications handle complex orchestration responsibilities
 * Servers focus on specific, well-defined capabilities
 * Simple interfaces minimize implementation overhead
 * Clear separation enables maintainable code
 2. **Servers should be highly composable**
 * Each server provides focused functionality in isolation
 * Multiple servers can be combined seamlessly
 * Shared protocol enables interoperability
 * Modular design supports extensibility
 3. **Servers should not be able to read the whole conversation, nor “see into” other servers**
 * Servers receive only necessary contextual information
 * Full conversation history stays with the host
 * Each server connection maintains isolation
 * Cross-server interactions are controlled by the host
 * Host process enforces security boundaries
 4. **Features can be added to servers and clients progressively**
 * Core protocol provides minimal required functionality
 * Additional capabilities can be negotiated as needed
 * Servers and clients evolve independently
 * Protocol designed for future extensibility
 * Backwards compatibility is maintained

## 
​
Capability Negotiation
The Model Context Protocol uses a capability-based negotiation system where clients and servers explicitly declare their supported features during initialization. Capabilities determine which protocol features and primitives are available during a session.
 * Servers declare capabilities like resource subscriptions, tool support, and prompt templates
 * Clients declare capabilities like sampling support and notification handling
 * Both parties must respect declared capabilities throughout the session
 * Additional capabilities can be negotiated through extensions to the protocol

Each capability unlocks specific protocol features for use during the session. For example:
 * Implemented server features must be advertised in the server’s capabilities
 * Emitting resource subscription notifications requires the server to declare subscription support
 * Tool invocation requires the server to declare tool capabilities
 * Sampling requires the client to declare support in its capabilities

This capability negotiation ensures clients and servers have a clear understanding of supported functionality while maintaining protocol extensibility.
Was this page helpful?
YesNo
Key ChangesOverview
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Schema Reference - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/schema

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.134996

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Schema Reference
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Common Types
 * Annotations
 * AudioContent
 * BlobResourceContents
 * BooleanSchema
 * ClientCapabilities
 * ContentBlock
 * Cursor
 * EmbeddedResource
 * EmptyResult
 * EnumSchema
 * ImageContent
 * Implementation
 * JSONRPCError
 * JSONRPCNotification
 * JSONRPCRequest
 * JSONRPCResponse
 * LoggingLevel
 * ModelHint
 * ModelPreferences
 * NumberSchema
 * PrimitiveSchemaDefinition
 * ProgressToken
 * Prompt
 * PromptArgument
 * PromptMessage
 * PromptReference
 * RequestId
 * Resource
 * ResourceContents
 * ResourceLink
 * ResourceTemplate
 * ResourceTemplateReference
 * Result
 * Role
 * Root
 * SamplingMessage
 * ServerCapabilities
 * StringSchema
 * TextContent
 * TextResourceContents
 * Tool
 * ToolAnnotations
 * completion/complete
 * CompleteRequest
 * CompleteResult
 * elicitation/create
 * ElicitRequest
 * ElicitResult
 * initialize
 * InitializeRequest
 * InitializeResult
 * logging/setLevel
 * SetLevelRequest
 * notifications/cancelled
 * CancelledNotification
 * notifications/initialized
 * InitializedNotification
 * notifications/message
 * LoggingMessageNotification
 * notifications/progress
 * ProgressNotification
 * notifications/prompts/list_changed
 * PromptListChangedNotification
 * notifications/resources/list_changed
 * ResourceListChangedNotification
 * notifications/resources/updated
 * ResourceUpdatedNotification
 * notifications/roots/list_changed
 * RootsListChangedNotification
 * notifications/tools/list_changed
 * ToolListChangedNotification
 * ping
 * PingRequest
 * prompts/get
 * GetPromptRequest
 * GetPromptResult
 * prompts/list
 * ListPromptsRequest
 * ListPromptsResult
 * resources/list
 * ListResourcesRequest
 * ListResourcesResult
 * resources/read
 * ReadResourceRequest
 * ReadResourceResult
 * resources/subscribe
 * SubscribeRequest
 * resources/templates/list
 * ListResourceTemplatesRequest
 * ListResourceTemplatesResult
 * resources/unsubscribe
 * UnsubscribeRequest
 * roots/list
 * ListRootsRequest
 * ListRootsResult
 * sampling/createMessage
 * CreateMessageRequest
 * CreateMessageResult
 * tools/call
 * CallToolRequest
 * CallToolResult
 * tools/list
 * ListToolsRequest
 * ListToolsResult

# Schema Reference
Copy page
Copy page
## 
​
Common Types
### 
​
`Annotations`
interface Annotations { 
audience?: Role[]; 
lastModified?: string; 
priority?: number; 
}
Optional annotations for the client. The client can use annotations to inform how objects are used or displayed
`Optional`audience[](https://modelcontextprotocol.io/specification/2025-06-18/schema#annotations-audience)
audience?: Role[]
Describes who the intended customer of this object or data is.
It can include multiple entries to indicate content useful for multiple audiences (e.g., `[“user”, “assistant”]`).
`Optional`lastModified[](https://modelcontextprotocol.io/specification/2025-06-18/schema#annotations-lastmodified)
lastModified?: string
The moment the resource was last modified, as an ISO 8601 formatted string.
Should be an ISO 8601 formatted string (e.g., “2025-01-12T15:00:58Z”).
Examples: last activity timestamp in an open file, timestamp when the resource was attached, etc.
`Optional`priority[](https://modelcontextprotocol.io/specification/2025-06-18/schema#annotations-priority)
priority?: number
Describes how important this data is for operating the server.
A value of 1 means “most important,” and indicates that the data is effectively required, while 0 means “least important,” and indicates that the data is entirely optional.
TJS-type[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tjs-type)
number
### 
​
`AudioContent`
interface AudioContent { 
_meta?: { [key: string]: unknown }; 
annotations?: Annotations; 
data: string; 
mimeType: string; 
type: “audio”; 
}
Audio provided to or from an LLM.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#audiocontent-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`annotations[](https://modelcontextprotocol.io/specification/2025-06-18/schema#audiocontent-annotations)
annotations?: Annotations
Optional annotations for the client.
data[](https://modelcontextprotocol.io/specification/2025-06-18/schema#audiocontent-data)
data: string
The base64-encoded audio data.
mimeType[](https://modelcontextprotocol.io/specification/2025-06-18/schema#audiocontent-mimetype)
mimeType: string
The MIME type of the audio. Different providers may support different audio types.
### 
​
`BlobResourceContents`
interface BlobResourceContents { 
_meta?: { [key: string]: unknown }; 
blob: string; 
mimeType?: string; 
uri: string; 
}
The contents of a specific resource or sub-resource.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#blobresourcecontents-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from ResourceContents._meta
blob[](https://modelcontextprotocol.io/specification/2025-06-18/schema#blobresourcecontents-blob)
blob: string
A base64-encoded string representing the binary data of the item.
`Optional`mimeType[](https://modelcontextprotocol.io/specification/2025-06-18/schema#blobresourcecontents-mimetype)
mimeType?: string
The MIME type of this resource, if known.
Inherited from ResourceContents.mimeType
uri[](https://modelcontextprotocol.io/specification/2025-06-18/schema#blobresourcecontents-uri)
uri: string
The URI of this resource.
Inherited from ResourceContents.uri
### 
​
`BooleanSchema`
interface BooleanSchema { 
default?: boolean; 
description?: string; 
title?: string; 
type: “boolean”; 
}
### 
​
`ClientCapabilities`
interface ClientCapabilities { 
elicitation?: object; 
experimental?: { [key: string]: object }; 
roots?: { listChanged?: boolean }; 
sampling?: object; 
}
Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.
`Optional`elicitation[](https://modelcontextprotocol.io/specification/2025-06-18/schema#clientcapabilities-elicitation)
elicitation?: object
Present if the client supports elicitation from the server.
`Optional`experimental[](https://modelcontextprotocol.io/specification/2025-06-18/schema#clientcapabilities-experimental)
experimental?: { [key: string]: object }
Experimental, non-standard capabilities that the client supports.
`Optional`roots[](https://modelcontextprotocol.io/specification/2025-06-18/schema#clientcapabilities-roots)
roots?: { listChanged?: boolean }
Present if the client supports listing roots.
Type declaration
 * `Optional`listChanged?: boolean
Whether the client supports notifications for changes to the roots list.

`Optional`sampling[](https://modelcontextprotocol.io/specification/2025-06-18/schema#clientcapabilities-sampling)
sampling?: object
Present if the client supports sampling from an LLM.
### 
​
`ContentBlock`
ContentBlock: 
| TextContent 
| ImageContent 
| AudioContent 
| ResourceLink 
| EmbeddedResource
### 
​
`Cursor`
Cursor: string
An opaque token used to represent a cursor for pagination.
### 
​
`EmbeddedResource`
interface EmbeddedResource { 
_meta?: { [key: string]: unknown }; 
annotations?: Annotations; 
resource: TextResourceContents | BlobResourceContents; 
type: “resource”; 
}
The contents of a resource, embedded into a prompt or tool call result.
It is up to the client how best to render embedded resources for the benefit of the LLM and/or the user.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#embeddedresource-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`annotations[](https://modelcontextprotocol.io/specification/2025-06-18/schema#embeddedresource-annotations)
annotations?: Annotations
Optional annotations for the client.
### 
​
`EmptyResult`
EmptyResult: Result
A response that indicates success but carries no data.
### 
​
`EnumSchema`
interface EnumSchema { 
description?: string; 
enum: string[]; 
enumNames?: string[]; 
title?: string; 
type: “string”; 
}
### 
​
`ImageContent`
interface ImageContent { 
_meta?: { [key: string]: unknown }; 
annotations?: Annotations; 
data: string; 
mimeType: string; 
type: “image”; 
}
An image provided to or from an LLM.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#imagecontent-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`annotations[](https://modelcontextprotocol.io/specification/2025-06-18/schema#imagecontent-annotations)
annotations?: Annotations
Optional annotations for the client.
data[](https://modelcontextprotocol.io/specification/2025-06-18/schema#imagecontent-data)
data: string
The base64-encoded image data.
mimeType[](https://modelcontextprotocol.io/specification/2025-06-18/schema#imagecontent-mimetype)
mimeType: string
The MIME type of the image. Different providers may support different image types.
### 
​
`Implementation`
interface Implementation { 
name: string; 
title?: string; 
version: string; 
}
Describes the name and version of an MCP implementation, with an optional title for UI representation.
name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#implementation-name)
name: string
Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).
Inherited from BaseMetadata.name
`Optional`title[](https://modelcontextprotocol.io/specification/2025-06-18/schema#implementation-title)
title?: string
Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.
If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).
Inherited from BaseMetadata.title
### 
​
`JSONRPCError`
interface JSONRPCError { 
error: { code: number; data?: unknown; message: string }; 
id: RequestId; 
jsonrpc: “2.0”; 
}
A response to a request that indicates an error occurred.
error[](https://modelcontextprotocol.io/specification/2025-06-18/schema#jsonrpcerror-error)
error: { code: number; data?: unknown; message: string }
Type declaration
 * code: number
The error type that occurred.
 * `Optional`data?: unknown
Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
 * message: string
A short description of the error. The message SHOULD be limited to a concise single sentence.

### 
​
`JSONRPCNotification`
interface JSONRPCNotification { 
jsonrpc: “2.0”; 
method: string; 
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }; 
}
A notification which does not expect a response.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#jsonrpcnotification-params)
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }
Type declaration
 * [key: string]: unknown
 * `Optional`_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.

Inherited from Notification.params
### 
​
`JSONRPCRequest`
interface JSONRPCRequest { 
id: RequestId; 
jsonrpc: “2.0”; 
method: string; 
params?: { 
_meta?: { progressToken?: ProgressToken; [key: string]: unknown }; 
[key: string]: unknown; 
}; 
}
A request that expects a response.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#jsonrpcrequest-params)
params?: { 
_meta?: { progressToken?: ProgressToken; [key: string]: unknown }; 
[key: string]: unknown; 
}
Type declaration
 * [key: string]: unknown
 * `Optional`_meta?: { progressToken?: ProgressToken; [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
 * `Optional`progressToken?: ProgressToken
If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from Request.params
### 
​
`JSONRPCResponse`
interface JSONRPCResponse { 
id: RequestId; 
jsonrpc: “2.0”; 
result: Result; 
}
A successful (non-error) response to a request.
### 
​
`LoggingLevel`
LoggingLevel: 
| “debug” 
| “info” 
| “notice” 
| “warning” 
| “error” 
| “critical” 
| “alert” 
| “emergency”
The severity of a log message.
These map to syslog message severities, as specified in RFC-5424: [](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1)<https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1>
### 
​
`ModelHint`
interface ModelHint { 
name?: string; 
}
Hints to use for model selection.
Keys not declared here are currently left unspecified by the spec and are up to the client to interpret.
`Optional`name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#modelhint-name)
name?: string
A hint for a model name.
The client SHOULD treat this as a substring of a model name; for example:
 * `claude-3-5-sonnet` should match `claude-3-5-sonnet-20241022`
 * `sonnet` should match `claude-3-5-sonnet-20241022`, `claude-3-sonnet-20240229`, etc.
 * `claude` should match any Claude model

The client MAY also map the string to a different provider’s model name or a different model family, as long as it fills a similar niche; for example:
 * `gemini-1.5-flash` could match `claude-3-haiku-20240307`

### 
​
`ModelPreferences`
interface ModelPreferences { 
costPriority?: number; 
hints?: ModelHint[]; 
intelligencePriority?: number; 
speedPriority?: number; 
}
The server’s preferences for model selection, requested of the client during sampling.
Because LLMs can vary along multiple dimensions, choosing the “best” model is rarely straightforward. Different models excel in different areas—some are faster but less capable, others are more capable but more expensive, and so on. This interface allows servers to express their priorities across multiple dimensions to help clients make an appropriate selection for their use case.
These preferences are always advisory. The client MAY ignore them. It is also up to the client to decide how to interpret these preferences and how to balance them against other considerations.
`Optional`costPriority[](https://modelcontextprotocol.io/specification/2025-06-18/schema#modelpreferences-costpriority)
costPriority?: number
How much to prioritize cost when selecting a model. A value of 0 means cost is not important, while a value of 1 means cost is the most important factor.
TJS-type[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tjs-type)
number
`Optional`hints[](https://modelcontextprotocol.io/specification/2025-06-18/schema#modelpreferences-hints)
hints?: ModelHint[]
Optional hints to use for model selection.
If multiple hints are specified, the client MUST evaluate them in order (such that the first match is taken).
The client SHOULD prioritize these hints over the numeric priorities, but MAY still use the priorities to select from ambiguous matches.
`Optional`intelligencePriority[](https://modelcontextprotocol.io/specification/2025-06-18/schema#modelpreferences-intelligencepriority)
intelligencePriority?: number
How much to prioritize intelligence and capabilities when selecting a model. A value of 0 means intelligence is not important, while a value of 1 means intelligence is the most important factor.
TJS-type[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tjs-type-1)
number
`Optional`speedPriority[](https://modelcontextprotocol.io/specification/2025-06-18/schema#modelpreferences-speedpriority)
speedPriority?: number
How much to prioritize sampling speed (latency) when selecting a model. A value of 0 means speed is not important, while a value of 1 means speed is the most important factor.
TJS-type[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tjs-type-2)
number
### 
​
`NumberSchema`
interface NumberSchema { 
description?: string; 
maximum?: number; 
minimum?: number; 
title?: string; 
type: “number” | “integer”; 
}
### 
​
`PrimitiveSchemaDefinition`
PrimitiveSchemaDefinition: 
| StringSchema 
| NumberSchema 
| BooleanSchema 
| EnumSchema
Restricted schema definitions that only allow primitive types without nested objects or arrays.
### 
​
`ProgressToken`
ProgressToken: string | number
A progress token, used to associate progress notifications with the original request.
### 
​
`Prompt`
interface Prompt { 
_meta?: { [key: string]: unknown }; 
arguments?: PromptArgument[]; 
description?: string; 
name: string; 
title?: string; 
}
A prompt or prompt template that the server offers.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#prompt-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`arguments[](https://modelcontextprotocol.io/specification/2025-06-18/schema#prompt-arguments)
arguments?: PromptArgument[]
A list of arguments to use for templating the prompt.
`Optional`description[](https://modelcontextprotocol.io/specification/2025-06-18/schema#prompt-description)
description?: string
An optional description of what this prompt provides
name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#prompt-name)
name: string
Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).
Inherited from BaseMetadata.name
`Optional`title[](https://modelcontextprotocol.io/specification/2025-06-18/schema#prompt-title)
title?: string
Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.
If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).
Inherited from BaseMetadata.title
### 
​
`PromptArgument`
interface PromptArgument { 
description?: string; 
name: string; 
required?: boolean; 
title?: string; 
}
Describes an argument that a prompt can accept.
`Optional`description[](https://modelcontextprotocol.io/specification/2025-06-18/schema#promptargument-description)
description?: string
A human-readable description of the argument.
name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#promptargument-name)
name: string
Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).
Inherited from BaseMetadata.name
`Optional`required[](https://modelcontextprotocol.io/specification/2025-06-18/schema#promptargument-required)
required?: boolean
Whether this argument must be provided.
`Optional`title[](https://modelcontextprotocol.io/specification/2025-06-18/schema#promptargument-title)
title?: string
Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.
If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).
Inherited from BaseMetadata.title
### 
​
`PromptMessage`
interface PromptMessage { 
content: ContentBlock; 
role: Role; 
}
Describes a message returned as part of a prompt.
This is similar to `SamplingMessage`, but also supports the embedding of resources from the MCP server.
### 
​
`PromptReference`
interface PromptReference { 
name: string; 
title?: string; 
type: “ref/prompt”; 
}
Identifies a prompt.
name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#promptreference-name)
name: string
Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).
Inherited from BaseMetadata.name
`Optional`title[](https://modelcontextprotocol.io/specification/2025-06-18/schema#promptreference-title)
title?: string
Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.
If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).
Inherited from BaseMetadata.title
### 
​
`RequestId`
RequestId: string | number
A uniquely identifying ID for a request in JSON-RPC.
### 
​
`Resource`
interface Resource { 
_meta?: { [key: string]: unknown }; 
annotations?: Annotations; 
description?: string; 
mimeType?: string; 
name: string; 
size?: number; 
title?: string; 
uri: string; 
}
A known resource that the server is capable of reading.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resource-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`annotations[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resource-annotations)
annotations?: Annotations
Optional annotations for the client.
`Optional`description[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resource-description)
description?: string
A description of what this resource represents.
This can be used by clients to improve the LLM’s understanding of available resources. It can be thought of like a “hint” to the model.
`Optional`mimeType[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resource-mimetype)
mimeType?: string
The MIME type of this resource, if known.
name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resource-name)
name: string
Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).
Inherited from BaseMetadata.name
`Optional`size[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resource-size)
size?: number
The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
This can be used by Hosts to display file sizes and estimate context window usage.
`Optional`title[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resource-title)
title?: string
Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.
If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).
Inherited from BaseMetadata.title
uri[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resource-uri)
uri: string
The URI of this resource.
### 
​
`ResourceContents`
interface ResourceContents { 
_meta?: { [key: string]: unknown }; 
mimeType?: string; 
uri: string; 
}
The contents of a specific resource or sub-resource.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcecontents-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`mimeType[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcecontents-mimetype)
mimeType?: string
The MIME type of this resource, if known.
uri[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcecontents-uri)
uri: string
The URI of this resource.
### 
​
`ResourceLink`
interface ResourceLink { 
_meta?: { [key: string]: unknown }; 
annotations?: Annotations; 
description?: string; 
mimeType?: string; 
name: string; 
size?: number; 
title?: string; 
type: “resource_link”; 
uri: string; 
}
A resource that the server is capable of reading, included in a prompt or tool call result.
Note: resource links returned by tools are not guaranteed to appear in the results of `resources/list` requests.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcelink-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from Resource._meta
`Optional`annotations[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcelink-annotations)
annotations?: Annotations
Optional annotations for the client.
Inherited from Resource.annotations
`Optional`description[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcelink-description)
description?: string
A description of what this resource represents.
This can be used by clients to improve the LLM’s understanding of available resources. It can be thought of like a “hint” to the model.
Inherited from Resource.description
`Optional`mimeType[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcelink-mimetype)
mimeType?: string
The MIME type of this resource, if known.
Inherited from Resource.mimeType
name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcelink-name)
name: string
Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).
Inherited from Resource.name
`Optional`size[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcelink-size)
size?: number
The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
This can be used by Hosts to display file sizes and estimate context window usage.
Inherited from Resource.size
`Optional`title[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcelink-title)
title?: string
Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.
If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).
Inherited from Resource.title
uri[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcelink-uri)
uri: string
The URI of this resource.
Inherited from Resource.uri
### 
​
`ResourceTemplate`
interface ResourceTemplate { 
_meta?: { [key: string]: unknown }; 
annotations?: Annotations; 
description?: string; 
mimeType?: string; 
name: string; 
title?: string; 
uriTemplate: string; 
}
A template description for resources available on the server.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcetemplate-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`annotations[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcetemplate-annotations)
annotations?: Annotations
Optional annotations for the client.
`Optional`description[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcetemplate-description)
description?: string
A description of what this template is for.
This can be used by clients to improve the LLM’s understanding of available resources. It can be thought of like a “hint” to the model.
`Optional`mimeType[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcetemplate-mimetype)
mimeType?: string
The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcetemplate-name)
name: string
Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).
Inherited from BaseMetadata.name
`Optional`title[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcetemplate-title)
title?: string
Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.
If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).
Inherited from BaseMetadata.title
uriTemplate[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcetemplate-uritemplate)
uriTemplate: string
A URI template (according to RFC 6570) that can be used to construct resource URIs.
### 
​
`ResourceTemplateReference`
interface ResourceTemplateReference { 
type: “ref/resource”; 
uri: string; 
}
A reference to a resource or resource template definition.
uri[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcetemplatereference-uri)
uri: string
The URI or URI template of the resource.
### 
​
`Result`
interface Result { 
_meta?: { [key: string]: unknown }; 
[key: string]: unknown; 
}
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#result-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
### 
​
`Role`
Role: “user” | “assistant”
The sender or recipient of messages and data in a conversation.
### 
​
`Root`
interface Root { 
_meta?: { [key: string]: unknown }; 
name?: string; 
uri: string; 
}
Represents a root directory or file that the server can operate on.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#root-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#root-name)
name?: string
An optional name for the root. This can be used to provide a human-readable identifier for the root, which may be useful for display purposes or for referencing the root in other parts of the application.
uri[](https://modelcontextprotocol.io/specification/2025-06-18/schema#root-uri)
uri: string
The URI identifying the root. This _must_ start with file:// for now. This restriction may be relaxed in future versions of the protocol to allow other URI schemes.
### 
​
`SamplingMessage`
interface SamplingMessage { 
content: TextContent | ImageContent | AudioContent; 
role: Role; 
}
Describes a message issued to or received from an LLM API.
### 
​
`ServerCapabilities`
interface ServerCapabilities { 
completions?: object; 
experimental?: { [key: string]: object }; 
logging?: object; 
prompts?: { listChanged?: boolean }; 
resources?: { listChanged?: boolean; subscribe?: boolean }; 
tools?: { listChanged?: boolean }; 
}
Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.
`Optional`completions[](https://modelcontextprotocol.io/specification/2025-06-18/schema#servercapabilities-completions)
completions?: object
Present if the server supports argument autocompletion suggestions.
`Optional`experimental[](https://modelcontextprotocol.io/specification/2025-06-18/schema#servercapabilities-experimental)
experimental?: { [key: string]: object }
Experimental, non-standard capabilities that the server supports.
`Optional`logging[](https://modelcontextprotocol.io/specification/2025-06-18/schema#servercapabilities-logging)
logging?: object
Present if the server supports sending log messages to the client.
`Optional`prompts[](https://modelcontextprotocol.io/specification/2025-06-18/schema#servercapabilities-prompts)
prompts?: { listChanged?: boolean }
Present if the server offers any prompt templates.
Type declaration
 * `Optional`listChanged?: boolean
Whether this server supports notifications for changes to the prompt list.

`Optional`resources[](https://modelcontextprotocol.io/specification/2025-06-18/schema#servercapabilities-resources)
resources?: { listChanged?: boolean; subscribe?: boolean }
Present if the server offers any resources to read.
Type declaration
 * `Optional`listChanged?: boolean
Whether this server supports notifications for changes to the resource list.
 * `Optional`subscribe?: boolean
Whether this server supports subscribing to resource updates.

`Optional`tools[](https://modelcontextprotocol.io/specification/2025-06-18/schema#servercapabilities-tools)
tools?: { listChanged?: boolean }
Present if the server offers any tools to call.
Type declaration
 * `Optional`listChanged?: boolean
Whether this server supports notifications for changes to the tool list.

### 
​
`StringSchema`
interface StringSchema { 
description?: string; 
format?: “uri” | “email” | “date” | “date-time”; 
maxLength?: number; 
minLength?: number; 
title?: string; 
type: “string”; 
}
### 
​
`TextContent`
interface TextContent { 
_meta?: { [key: string]: unknown }; 
annotations?: Annotations; 
text: string; 
type: “text”; 
}
Text provided to or from an LLM.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#textcontent-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`annotations[](https://modelcontextprotocol.io/specification/2025-06-18/schema#textcontent-annotations)
annotations?: Annotations
Optional annotations for the client.
text[](https://modelcontextprotocol.io/specification/2025-06-18/schema#textcontent-text)
text: string
The text content of the message.
### 
​
`TextResourceContents`
interface TextResourceContents { 
_meta?: { [key: string]: unknown }; 
mimeType?: string; 
text: string; 
uri: string; 
}
The contents of a specific resource or sub-resource.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#textresourcecontents-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from ResourceContents._meta
`Optional`mimeType[](https://modelcontextprotocol.io/specification/2025-06-18/schema#textresourcecontents-mimetype)
mimeType?: string
The MIME type of this resource, if known.
Inherited from ResourceContents.mimeType
text[](https://modelcontextprotocol.io/specification/2025-06-18/schema#textresourcecontents-text)
text: string
The text of the item. This must only be set if the item can actually be represented as text (not binary data).
uri[](https://modelcontextprotocol.io/specification/2025-06-18/schema#textresourcecontents-uri)
uri: string
The URI of this resource.
Inherited from ResourceContents.uri
### 
​
`Tool`
interface Tool { 
_meta?: { [key: string]: unknown }; 
annotations?: ToolAnnotations; 
description?: string; 
inputSchema: { 
properties?: { [key: string]: object }; 
required?: string[]; 
type: “object”; 
}; 
name: string; 
outputSchema?: { 
properties?: { [key: string]: object }; 
required?: string[]; 
type: “object”; 
}; 
title?: string; 
}
Definition for a tool the client can call.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tool-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
`Optional`annotations[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tool-annotations)
annotations?: ToolAnnotations
Optional additional tool information.
Display name precedence order is: title, annotations.title, then name.
`Optional`description[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tool-description)
description?: string
A human-readable description of the tool.
This can be used by clients to improve the LLM’s understanding of available tools. It can be thought of like a “hint” to the model.
inputSchema[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tool-inputschema)
inputSchema: { 
properties?: { [key: string]: object }; 
required?: string[]; 
type: “object”; 
}
A JSON Schema object defining the expected parameters for the tool.
name[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tool-name)
name: string
Intended for programmatic or logical use, but used as a display name in past specs or fallback (if title isn’t present).
Inherited from BaseMetadata.name
`Optional`outputSchema[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tool-outputschema)
outputSchema?: { 
properties?: { [key: string]: object }; 
required?: string[]; 
type: “object”; 
}
An optional JSON Schema object defining the structure of the tool’s output returned in the structuredContent field of a CallToolResult.
`Optional`title[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tool-title)
title?: string
Intended for UI and end-user contexts — optimized to be human-readable and easily understood, even by those unfamiliar with domain-specific terminology.
If not provided, the name should be used for display (except for Tool, where `annotations.title` should be given precedence over using `name`, if present).
Inherited from BaseMetadata.title
### 
​
`ToolAnnotations`
interface ToolAnnotations { 
destructiveHint?: boolean; 
idempotentHint?: boolean; 
openWorldHint?: boolean; 
readOnlyHint?: boolean; 
title?: string; 
}
Additional properties describing a Tool to clients.
NOTE: all properties in ToolAnnotations are **hints**. They are not guaranteed to provide a faithful description of tool behavior (including descriptive properties like `title`).
Clients should never make tool use decisions based on ToolAnnotations received from untrusted servers.
`Optional`destructiveHint[](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-destructivehint)
destructiveHint?: boolean
If true, the tool may perform destructive updates to its environment. If false, the tool performs only additive updates.
(This property is meaningful only when `readOnlyHint == false`)
Default: true
`Optional`idempotentHint[](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-idempotenthint)
idempotentHint?: boolean
If true, calling the tool repeatedly with the same arguments will have no additional effect on the its environment.
(This property is meaningful only when `readOnlyHint == false`)
Default: false
`Optional`openWorldHint[](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-openworldhint)
openWorldHint?: boolean
If true, this tool may interact with an “open world” of external entities. If false, the tool’s domain of interaction is closed. For example, the world of a web search tool is open, whereas that of a memory tool is not.
Default: true
`Optional`readOnlyHint[](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint)
readOnlyHint?: boolean
If true, the tool does not modify its environment.
Default: false
`Optional`title[](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-title)
title?: string
A human-readable title for the tool.
## 
​
`completion/complete`
### 
​
`CompleteRequest`
interface CompleteRequest { 
method: “completion/complete”; 
params: { 
argument: { name: string; value: string }; 
context?: { arguments?: { [key: string]: string } }; 
ref: PromptReference | ResourceTemplateReference; 
}; 
}
A request from the client to the server, to ask for completion options.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#completerequest-params)
params: { 
argument: { name: string; value: string }; 
context?: { arguments?: { [key: string]: string } }; 
ref: PromptReference | ResourceTemplateReference; 
}
Type declaration
 * argument: { name: string; value: string }
The argument’s information
 * name: string
The name of the argument
 * value: string
The value of the argument to use for completion matching.
 * `Optional`context?: { arguments?: { [key: string]: string } }
Additional, optional context for completions
 * `Optional`arguments?: { [key: string]: string }
Previously-resolved variables in a URI template or prompt.
 * ref: PromptReference | ResourceTemplateReference

Overrides Request.params
### 
​
`CompleteResult`
interface CompleteResult { 
_meta?: { [key: string]: unknown }; 
completion: { hasMore?: boolean; total?: number; values: string[] }; 
[key: string]: unknown; 
}
The server’s response to a completion/complete request
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#completeresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from Result._meta
completion[](https://modelcontextprotocol.io/specification/2025-06-18/schema#completeresult-completion)
completion: { hasMore?: boolean; total?: number; values: string[] }
Type declaration
 * `Optional`hasMore?: boolean
Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
 * `Optional`total?: number
The total number of completion options available. This can exceed the number of values actually sent in the response.
 * values: string[]
An array of completion values. Must not exceed 100 items.

## 
​
`elicitation/create`
### 
​
`ElicitRequest`
interface ElicitRequest { 
method: “elicitation/create”; 
params: { 
message: string; 
requestedSchema: { 
properties: { [key: string]: PrimitiveSchemaDefinition }; 
required?: string[]; 
type: “object”; 
}; 
}; 
}
A request from the server to elicit additional information from the user via the client.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#elicitrequest-params)
params: { 
message: string; 
requestedSchema: { 
properties: { [key: string]: PrimitiveSchemaDefinition }; 
required?: string[]; 
type: “object”; 
}; 
}
Type declaration
 * message: string
The message to present to the user.
 * requestedSchema: { 
properties: { [key: string]: PrimitiveSchemaDefinition }; 
required?: string[]; 
type: “object”; 
}
A restricted subset of JSON Schema. Only top-level properties are allowed, without nesting.

Overrides Request.params
### 
​
`ElicitResult`
interface ElicitResult { 
_meta?: { [key: string]: unknown }; 
action: “accept” | “decline” | “cancel”; 
content?: { [key: string]: string | number | boolean }; 
[key: string]: unknown; 
}
The client’s response to an elicitation request.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#elicitresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from Result._meta
action[](https://modelcontextprotocol.io/specification/2025-06-18/schema#elicitresult-action)
action: “accept” | “decline” | “cancel”
The user action in response to the elicitation.
 * “accept”: User submitted the form/confirmed the action
 * “decline”: User explicitly declined the action
 * “cancel”: User dismissed without making an explicit choice

`Optional`content[](https://modelcontextprotocol.io/specification/2025-06-18/schema#elicitresult-content)
content?: { [key: string]: string | number | boolean }
The submitted form data, only present when action is “accept”. Contains values matching the requested schema.
## 
​
`initialize`
### 
​
`InitializeRequest`
interface InitializeRequest { 
method: “initialize”; 
params: { 
capabilities: ClientCapabilities; 
clientInfo: Implementation; 
protocolVersion: string; 
}; 
}
This request is sent from the client to the server when it first connects, asking it to begin initialization.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#initializerequest-params)
params: { 
capabilities: ClientCapabilities; 
clientInfo: Implementation; 
protocolVersion: string; 
}
Type declaration
 * capabilities: ClientCapabilities
 * clientInfo: Implementation
 * protocolVersion: string
The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.

Overrides Request.params
### 
​
`InitializeResult`
interface InitializeResult { 
_meta?: { [key: string]: unknown }; 
capabilities: ServerCapabilities; 
instructions?: string; 
protocolVersion: string; 
serverInfo: Implementation; 
[key: string]: unknown; 
}
After receiving an initialize request from the client, the server sends this response.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#initializeresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from Result._meta
`Optional`instructions[](https://modelcontextprotocol.io/specification/2025-06-18/schema#initializeresult-instructions)
instructions?: string
Instructions describing how to use the server and its features.
This can be used by clients to improve the LLM’s understanding of available tools, resources, etc. It can be thought of like a “hint” to the model. For example, this information MAY be added to the system prompt.
protocolVersion[](https://modelcontextprotocol.io/specification/2025-06-18/schema#initializeresult-protocolversion)
protocolVersion: string
The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
## 
​
`logging/setLevel`
### 
​
`SetLevelRequest`
interface SetLevelRequest { 
method: “logging/setLevel”; 
params: { level: LoggingLevel }; 
}
A request from the client to the server, to enable or adjust logging.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#setlevelrequest-params)
params: { level: LoggingLevel }
Type declaration
 * level: LoggingLevel
The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/message.

Overrides Request.params
## 
​
`notifications/cancelled`
### 
​
`CancelledNotification`
interface CancelledNotification { 
method: “notifications/cancelled”; 
params: { reason?: string; requestId: RequestId }; 
}
This notification can be sent by either side to indicate that it is cancelling a previously-issued request.
The request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.
This notification indicates that the result will be unused, so any associated processing SHOULD cease.
A client MUST NOT attempt to cancel its `initialize` request.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#cancellednotification-params)
params: { reason?: string; requestId: RequestId }
Type declaration
 * `Optional`reason?: string
An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
 * requestId: RequestId
The ID of the request to cancel.
This MUST correspond to the ID of a request previously issued in the same direction.

Overrides Notification.params
## 
​
`notifications/initialized`
### 
​
`InitializedNotification`
interface InitializedNotification { 
method: “notifications/initialized”; 
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }; 
}
This notification is sent from the client to the server after initialization has finished.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#initializednotification-params)
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }
Type declaration
 * [key: string]: unknown
 * `Optional`_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.

Inherited from Notification.params
## 
​
`notifications/message`
### 
​
`LoggingMessageNotification`
interface LoggingMessageNotification { 
method: “notifications/message”; 
params: { data: unknown; level: LoggingLevel; logger?: string }; 
}
Notification of a log message passed from server to client. If no logging/setLevel request has been sent from the client, the server MAY decide which messages to send automatically.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#loggingmessagenotification-params)
params: { data: unknown; level: LoggingLevel; logger?: string }
Type declaration
 * data: unknown
The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
 * level: LoggingLevel
The severity of this log message.
 * `Optional`logger?: string
An optional name of the logger issuing this message.

Overrides Notification.params
## 
​
`notifications/progress`
### 
​
`ProgressNotification`
interface ProgressNotification { 
method: “notifications/progress”; 
params: { 
message?: string; 
progress: number; 
progressToken: ProgressToken; 
total?: number; 
}; 
}
An out-of-band notification used to inform the receiver of a progress update for a long-running request.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#progressnotification-params)
params: { 
message?: string; 
progress: number; 
progressToken: ProgressToken; 
total?: number; 
}
Type declaration
 * `Optional`message?: string
An optional message describing the current progress.
 * progress: number
The progress thus far. This should increase every time progress is made, even if the total is unknown.
TJS-type[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tjs-type)
number
 * progressToken: ProgressToken
The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
 * `Optional`total?: number
Total number of items to process (or total progress required), if known.
TJS-type[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tjs-type-1)
number

Overrides Notification.params
## 
​
`notifications/prompts/list_changed`
### 
​
`PromptListChangedNotification`
interface PromptListChangedNotification { 
method: “notifications/prompts/list_changed”; 
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }; 
}
An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#promptlistchangednotification-params)
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }
Type declaration
 * [key: string]: unknown
 * `Optional`_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.

Inherited from Notification.params
## 
​
`notifications/resources/list_changed`
### 
​
`ResourceListChangedNotification`
interface ResourceListChangedNotification { 
method: “notifications/resources/list_changed”; 
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }; 
}
An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourcelistchangednotification-params)
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }
Type declaration
 * [key: string]: unknown
 * `Optional`_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.

Inherited from Notification.params
## 
​
`notifications/resources/updated`
### 
​
`ResourceUpdatedNotification`
interface ResourceUpdatedNotification { 
method: “notifications/resources/updated”; 
params: { uri: string }; 
}
A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a resources/subscribe request.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourceupdatednotification-params)
params: { uri: string }
Type declaration
 * uri: string
The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.

Overrides Notification.params
## 
​
`notifications/roots/list_changed`
### 
​
`RootsListChangedNotification`
interface RootsListChangedNotification { 
method: “notifications/roots/list_changed”; 
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }; 
}
A notification from the client to the server, informing it that the list of roots has changed. This notification should be sent whenever the client adds, removes, or modifies any root. The server should then request an updated list of roots using the ListRootsRequest.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#rootslistchangednotification-params)
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }
Type declaration
 * [key: string]: unknown
 * `Optional`_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.

Inherited from Notification.params
## 
​
`notifications/tools/list_changed`
### 
​
`ToolListChangedNotification`
interface ToolListChangedNotification { 
method: “notifications/tools/list_changed”; 
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }; 
}
An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#toollistchangednotification-params)
params?: { _meta?: { [key: string]: unknown }; [key: string]: unknown }
Type declaration
 * [key: string]: unknown
 * `Optional`_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.

Inherited from Notification.params
## 
​
`ping`
### 
​
`PingRequest`
interface PingRequest { 
method: “ping”; 
params?: { 
_meta?: { progressToken?: ProgressToken; [key: string]: unknown }; 
[key: string]: unknown; 
}; 
}
A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#pingrequest-params)
params?: { 
_meta?: { progressToken?: ProgressToken; [key: string]: unknown }; 
[key: string]: unknown; 
}
Type declaration
 * [key: string]: unknown
 * `Optional`_meta?: { progressToken?: ProgressToken; [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
 * `Optional`progressToken?: ProgressToken
If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from Request.params
## 
​
`prompts/get`
### 
​
`GetPromptRequest`
interface GetPromptRequest { 
method: “prompts/get”; 
params: { arguments?: { [key: string]: string }; name: string }; 
}
Used by the client to get a prompt provided by the server.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#getpromptrequest-params)
params: { arguments?: { [key: string]: string }; name: string }
Type declaration
 * `Optional`arguments?: { [key: string]: string }
Arguments to use for templating the prompt.
 * name: string
The name of the prompt or prompt template.

Overrides Request.params
### 
​
`GetPromptResult`
interface GetPromptResult { 
_meta?: { [key: string]: unknown }; 
description?: string; 
messages: PromptMessage[]; 
[key: string]: unknown; 
}
The server’s response to a prompts/get request from the client.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#getpromptresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from Result._meta
`Optional`description[](https://modelcontextprotocol.io/specification/2025-06-18/schema#getpromptresult-description)
description?: string
An optional description for the prompt.
## 
​
`prompts/list`
### 
​
`ListPromptsRequest`
interface ListPromptsRequest { 
method: “prompts/list”; 
params?: { cursor?: string }; 
}
Sent from the client to request a list of prompts and prompt templates the server has.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listpromptsrequest-params)
params?: { cursor?: string }
Type declaration
 * `Optional`cursor?: string
An opaque token representing the current pagination position. If provided, the server should return results starting after this cursor.

Inherited from PaginatedRequest.params
### 
​
`ListPromptsResult`
interface ListPromptsResult { 
_meta?: { [key: string]: unknown }; 
nextCursor?: string; 
prompts: Prompt[]; 
[key: string]: unknown; 
}
The server’s response to a prompts/list request from the client.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listpromptsresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from PaginatedResult._meta
`Optional`nextCursor[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listpromptsresult-nextcursor)
nextCursor?: string
An opaque token representing the pagination position after the last returned result. If present, there may be more results available.
Inherited from PaginatedResult.nextCursor
## 
​
`resources/list`
### 
​
`ListResourcesRequest`
interface ListResourcesRequest { 
method: “resources/list”; 
params?: { cursor?: string }; 
}
Sent from the client to request a list of resources the server has.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listresourcesrequest-params)
params?: { cursor?: string }
Type declaration
 * `Optional`cursor?: string
An opaque token representing the current pagination position. If provided, the server should return results starting after this cursor.

Inherited from PaginatedRequest.params
### 
​
`ListResourcesResult`
interface ListResourcesResult { 
_meta?: { [key: string]: unknown }; 
nextCursor?: string; 
resources: Resource[]; 
[key: string]: unknown; 
}
The server’s response to a resources/list request from the client.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listresourcesresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from PaginatedResult._meta
`Optional`nextCursor[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listresourcesresult-nextcursor)
nextCursor?: string
An opaque token representing the pagination position after the last returned result. If present, there may be more results available.
Inherited from PaginatedResult.nextCursor
## 
​
`resources/read`
### 
​
`ReadResourceRequest`
interface ReadResourceRequest { 
method: “resources/read”; 
params: { uri: string }; 
}
Sent from the client to the server, to read a specific resource URI.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#readresourcerequest-params)
params: { uri: string }
Type declaration
 * uri: string
The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.

Overrides Request.params
### 
​
`ReadResourceResult`
interface ReadResourceResult { 
_meta?: { [key: string]: unknown }; 
contents: (TextResourceContents | BlobResourceContents)[]; 
[key: string]: unknown; 
}
The server’s response to a resources/read request from the client.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#readresourceresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from Result._meta
## 
​
`resources/subscribe`
### 
​
`SubscribeRequest`
interface SubscribeRequest { 
method: “resources/subscribe”; 
params: { uri: string }; 
}
Sent from the client to request resources/updated notifications from the server whenever a particular resource changes.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#subscriberequest-params)
params: { uri: string }
Type declaration
 * uri: string
The URI of the resource to subscribe to. The URI can use any protocol; it is up to the server how to interpret it.

Overrides Request.params
## 
​
`resources/templates/list`
### 
​
`ListResourceTemplatesRequest`
interface ListResourceTemplatesRequest { 
method: “resources/templates/list”; 
params?: { cursor?: string }; 
}
Sent from the client to request a list of resource templates the server has.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listresourcetemplatesrequest-params)
params?: { cursor?: string }
Type declaration
 * `Optional`cursor?: string
An opaque token representing the current pagination position. If provided, the server should return results starting after this cursor.

Inherited from PaginatedRequest.params
### 
​
`ListResourceTemplatesResult`
interface ListResourceTemplatesResult { 
_meta?: { [key: string]: unknown }; 
nextCursor?: string; 
resourceTemplates: ResourceTemplate[]; 
[key: string]: unknown; 
}
The server’s response to a resources/templates/list request from the client.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listresourcetemplatesresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from PaginatedResult._meta
`Optional`nextCursor[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listresourcetemplatesresult-nextcursor)
nextCursor?: string
An opaque token representing the pagination position after the last returned result. If present, there may be more results available.
Inherited from PaginatedResult.nextCursor
## 
​
`resources/unsubscribe`
### 
​
`UnsubscribeRequest`
interface UnsubscribeRequest { 
method: “resources/unsubscribe”; 
params: { uri: string }; 
}
Sent from the client to request cancellation of resources/updated notifications from the server. This should follow a previous resources/subscribe request.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#unsubscriberequest-params)
params: { uri: string }
Type declaration
 * uri: string
The URI of the resource to unsubscribe from.

Overrides Request.params
## 
​
`roots/list`
### 
​
`ListRootsRequest`
interface ListRootsRequest { 
method: “roots/list”; 
params?: { 
_meta?: { progressToken?: ProgressToken; [key: string]: unknown }; 
[key: string]: unknown; 
}; 
}
Sent from the server to request a list of root URIs from the client. Roots allow servers to ask for specific directories or files to operate on. A common example for roots is providing a set of repositories or directories a server should operate on.
This request is typically used when the server needs to understand the file system structure or access specific locations that the client has permission to read from.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listrootsrequest-params)
params?: { 
_meta?: { progressToken?: ProgressToken; [key: string]: unknown }; 
[key: string]: unknown; 
}
Type declaration
 * [key: string]: unknown
 * `Optional`_meta?: { progressToken?: ProgressToken; [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
 * `Optional`progressToken?: ProgressToken
If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.

Inherited from Request.params
### 
​
`ListRootsResult`
interface ListRootsResult { 
_meta?: { [key: string]: unknown }; 
roots: Root[]; 
[key: string]: unknown; 
}
The client’s response to a roots/list request from the server. This result contains an array of Root objects, each representing a root directory or file that the server can operate on.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listrootsresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from Result._meta
## 
​
`sampling/createMessage`
### 
​
`CreateMessageRequest`
interface CreateMessageRequest { 
method: “sampling/createMessage”; 
params: { 
includeContext?: “none” | “thisServer” | “allServers”; 
maxTokens: number; 
messages: SamplingMessage[]; 
metadata?: object; 
modelPreferences?: ModelPreferences; 
stopSequences?: string[]; 
systemPrompt?: string; 
temperature?: number; 
}; 
}
A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.
params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#createmessagerequest-params)
params: { 
includeContext?: “none” | “thisServer” | “allServers”; 
maxTokens: number; 
messages: SamplingMessage[]; 
metadata?: object; 
modelPreferences?: ModelPreferences; 
stopSequences?: string[]; 
systemPrompt?: string; 
temperature?: number; 
}
Type declaration
 * `Optional`includeContext?: “none” | “thisServer” | “allServers”
A request to include context from one or more MCP servers (including the caller), to be attached to the prompt. The client MAY ignore this request.
 * maxTokens: number
The requested maximum number of tokens to sample (to prevent runaway completions).
The client MAY choose to sample fewer tokens than the requested maximum.
 * messages: SamplingMessage[]
 * `Optional`metadata?: object
Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
 * `Optional`modelPreferences?: ModelPreferences
The server’s preferences for which model to select. The client MAY ignore these preferences.
 * `Optional`stopSequences?: string[]
 * `Optional`systemPrompt?: string
An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
 * `Optional`temperature?: number
TJS-type[](https://modelcontextprotocol.io/specification/2025-06-18/schema#tjs-type)
number

Overrides Request.params
### 
​
`CreateMessageResult`
interface CreateMessageResult { 
_meta?: { [key: string]: unknown }; 
content: TextContent | ImageContent | AudioContent; 
model: string; 
role: Role; 
stopReason?: string; 
[key: string]: unknown; 
}
The client’s response to a sampling/create_message request from the server. The client should inform the user before returning the sampled message, to allow them to inspect the response (human in the loop) and decide whether to allow the server to see it.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#createmessageresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from Result._meta
model[](https://modelcontextprotocol.io/specification/2025-06-18/schema#createmessageresult-model)
model: string
The name of the model that generated the message.
`Optional`stopReason[](https://modelcontextprotocol.io/specification/2025-06-18/schema#createmessageresult-stopreason)
stopReason?: string
The reason why sampling stopped, if known.
## 
​
`tools/call`
### 
​
`CallToolRequest`
interface CallToolRequest { 
method: “tools/call”; 
params: { arguments?: { [key: string]: unknown }; name: string }; 
}
Used by the client to invoke a tool provided by the server.
### 
​
`CallToolResult`
interface CallToolResult { 
_meta?: { [key: string]: unknown }; 
content: ContentBlock[]; 
isError?: boolean; 
structuredContent?: { [key: string]: unknown }; 
[key: string]: unknown; 
}
The server’s response to a tool call.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#calltoolresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from Result._meta
content[](https://modelcontextprotocol.io/specification/2025-06-18/schema#calltoolresult-content)
content: ContentBlock[]
A list of content objects that represent the unstructured result of the tool call.
`Optional`isError[](https://modelcontextprotocol.io/specification/2025-06-18/schema#calltoolresult-iserror)
isError?: boolean
Whether the tool call ended in an error.
If not set, this is assumed to be false (the call was successful).
Any errors that originate from the tool SHOULD be reported inside the result object, with `isError` set to true, _not_ as an MCP protocol-level error response. Otherwise, the LLM would not be able to see that an error occurred and self-correct.
However, any errors in _finding_ the tool, an error indicating that the server does not support tool calls, or any other exceptional conditions, should be reported as an MCP error response.
`Optional`structuredContent[](https://modelcontextprotocol.io/specification/2025-06-18/schema#calltoolresult-structuredcontent)
structuredContent?: { [key: string]: unknown }
An optional JSON object that represents the structured result of the tool call.
## 
​
`tools/list`
### 
​
`ListToolsRequest`
interface ListToolsRequest { 
method: “tools/list”; 
params?: { cursor?: string }; 
}
Sent from the client to request a list of tools the server has.
`Optional`params[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listtoolsrequest-params)
params?: { cursor?: string }
Type declaration
 * `Optional`cursor?: string
An opaque token representing the current pagination position. If provided, the server should return results starting after this cursor.

Inherited from PaginatedRequest.params
### 
​
`ListToolsResult`
interface ListToolsResult { 
_meta?: { [key: string]: unknown }; 
nextCursor?: string; 
tools: Tool[]; 
[key: string]: unknown; 
}
The server’s response to a tools/list request from the client.
`Optional`_meta[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listtoolsresult-_meta)
_meta?: { [key: string]: unknown }
See General fields: `_meta` for notes on `_meta` usage.
Inherited from PaginatedResult._meta
`Optional`nextCursor[](https://modelcontextprotocol.io/specification/2025-06-18/schema#listtoolsresult-nextcursor)
nextCursor?: string
An opaque token representing the pagination position after the last returned result. If present, there may be more results available.
Inherited from PaginatedResult.nextCursor
Was this page helpful?
YesNo
Pagination
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# What is the Model Context Protocol (MCP)? - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/getting-started/intro

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.135166

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Get started
What is the Model Context Protocol (MCP)?
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * What can MCP enable?
 * Why does MCP matter?
 * Start Building
 * Learn more

Get started
# What is the Model Context Protocol (MCP)?
Copy page
Copy page
MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems. Using MCP, AI applications like Claude or ChatGPT can connect to data sources (e.g. local files, databases), tools (e.g. search engines, calculators) and workflows (e.g. specialized prompts)—enabling them to access key information and perform tasks. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems.

## 
​
What can MCP enable?
 * Agents can access your Google Calendar and Notion, acting as a more personalized AI assistant.
 * Claude Code can generate an entire web app using a Figma design.
 * Enterprise chatbots can connect to multiple databases across an organization, empowering users to analyze data using chat.
 * AI models can create 3D designs on Blender and print them out using a 3D printer.

## 
​
Why does MCP matter?
Depending on where you sit in the ecosystem, MCP can have a range of benefits.
 * **Developers** : MCP reduces development time and complexity when building, or integrating with, an AI application or agent.
 * **AI applications or agents** : MCP provides access to an ecosystem of data sources, tools and apps which will enhance capabilities and improve the end-user experience.
 * **End-users** : MCP results in more capable AI applications or agents which can access your data and take actions on your behalf when necessary.

## 
​
Start Building
## Build servers Create MCP servers to expose your data and tools ## Build clients Develop applications that connect to MCP servers 
## 
​
Learn more
## Understand concepts Learn the core concepts and architecture of MCP 
Was this page helpful?
YesNo
Architecture
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.



---

# Lifecycle - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.135337

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Base Protocol
Lifecycle
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Lifecycle Phases
 * Initialization
 * Version Negotiation
 * Capability Negotiation
 * Operation
 * Shutdown
 * stdio
 * HTTP
 * Timeouts
 * Error Handling

Base Protocol
# Lifecycle
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) defines a rigorous lifecycle for client-server connections that ensures proper capability negotiation and state management.
 1. **Initialization** : Capability negotiation and protocol version agreement
 2. **Operation** : Normal protocol communication
 3. **Shutdown** : Graceful termination of the connection

ServerClientServerClientInitialization PhaseOperation PhaseNormal protocol operationsShutdownConnection closedinitialize requestinitialize responseinitialized notificationDisconnect
## 
​
Lifecycle Phases
### 
​
Initialization
The initialization phase **MUST** be the first interaction between client and server. During this phase, the client and server:
 * Establish protocol version compatibility
 * Exchange and negotiate capabilities
 * Share implementation details

The client **MUST** initiate this phase by sending an `initialize` request containing:
 * Protocol version supported
 * Client capabilities
 * Client implementation information

Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "roots": {
        "listChanged": true
      },
      "sampling": {},
      "elicitation": {}
    },
    "clientInfo": {
      "name": "ExampleClient",
      "title": "Example Client Display Name",
      "version": "1.0.0"
    }
  }
}

```

The server **MUST** respond with its own capabilities and information:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "logging": {},
      "prompts": {
        "listChanged": true
      },
      "resources": {
        "subscribe": true,
        "listChanged": true
      },
      "tools": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "ExampleServer",
      "title": "Example Server Display Name",
      "version": "1.0.0"
    },
    "instructions": "Optional instructions for the client"
  }
}

```

After successful initialization, the client **MUST** send an `initialized` notification to indicate it is ready to begin normal operations:
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}

```

 * The client **SHOULD NOT** send requests other than pings before the server has responded to the `initialize` request.
 * The server **SHOULD NOT** send requests other than pings and logging before receiving the `initialized` notification.

#### 
​
Version Negotiation
In the `initialize` request, the client **MUST** send a protocol version it supports. This **SHOULD** be the _latest_ version supported by the client. If the server supports the requested protocol version, it **MUST** respond with the same version. Otherwise, the server **MUST** respond with another protocol version it supports. This **SHOULD** be the _latest_ version supported by the server. If the client does not support the version in the server’s response, it **SHOULD** disconnect.
If using HTTP, the client **MUST** include the `MCP-Protocol-Version: <protocol-version>` HTTP header on all subsequent requests to the MCP server. For details, see the Protocol Version Header section in Transports.
#### 
​
Capability Negotiation
Client and server capabilities establish which optional protocol features will be available during the session. Key capabilities include: Category | Capability | Description 
---|---|--- 
Client | `roots` | Ability to provide filesystem roots 
Client | `sampling` | Support for LLM sampling requests 
Client | `elicitation` | Support for server elicitation requests 
Client | `experimental` | Describes support for non-standard experimental features 
Server | `prompts` | Offers prompt templates 
Server | `resources` | Provides readable resources 
Server | `tools` | Exposes callable tools 
Server | `logging` | Emits structured log messages 
Server | `completions` | Supports argument autocompletion 
Server | `experimental` | Describes support for non-standard experimental features 
Capability objects can describe sub-capabilities like:
 * `listChanged`: Support for list change notifications (for prompts, resources, and tools)
 * `subscribe`: Support for subscribing to individual items’ changes (resources only)

### 
​
Operation
During the operation phase, the client and server exchange messages according to the negotiated capabilities. Both parties **MUST** :
 * Respect the negotiated protocol version
 * Only use capabilities that were successfully negotiated

### 
​
Shutdown
During the shutdown phase, one side (usually the client) cleanly terminates the protocol connection. No specific shutdown messages are defined—instead, the underlying transport mechanism should be used to signal connection termination:
#### 
​
stdio
For the stdio transport, the client **SHOULD** initiate shutdown by:
 1. First, closing the input stream to the child process (the server)
 2. Waiting for the server to exit, or sending `SIGTERM` if the server does not exit within a reasonable time
 3. Sending `SIGKILL` if the server does not exit within a reasonable time after `SIGTERM`

The server **MAY** initiate shutdown by closing its output stream to the client and exiting.
#### 
​
HTTP
For HTTP transports, shutdown is indicated by closing the associated HTTP connection(s).
## 
​
Timeouts
Implementations **SHOULD** establish timeouts for all sent requests, to prevent hung connections and resource exhaustion. When the request has not received a success or error response within the timeout period, the sender **SHOULD** issue a cancellation notification for that request and stop waiting for a response. SDKs and other middleware **SHOULD** allow these timeouts to be configured on a per-request basis. Implementations **MAY** choose to reset the timeout clock when receiving a progress notification corresponding to the request, as this implies that work is actually happening. However, implementations **SHOULD** always enforce a maximum timeout, regardless of progress notifications, to limit the impact of a misbehaving client or server.
## 
​
Error Handling
Implementations **SHOULD** be prepared to handle these error cases:
 * Protocol version mismatch
 * Failure to negotiate required capabilities
 * Request timeouts

Example initialization error:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Unsupported protocol version",
    "data": {
      "supported": ["2024-11-05"],
      "requested": "1.0.0"
    }
  }
}

```

Was this page helpful?
YesNo
OverviewTransports
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Security Best Practices - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.135744

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Base Protocol
Security Best Practices
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Introduction
 * Purpose and Scope
 * Attacks and Mitigations
 * Confused Deputy Problem
 * Terminology
 * Architecture and Attack Flows
 * Attack Description
 * Mitigation
 * Token Passthrough
 * Risks
 * Mitigation
 * Session Hijacking
 * Session Hijack Prompt Injection
 * Session Hijack Impersonation
 * Attack Description
 * Mitigation

Base Protocol
# Security Best Practices
Copy page
Copy page
## 
​
Introduction
### 
​
Purpose and Scope
This document provides security considerations for the Model Context Protocol (MCP), complementing the MCP Authorization specification. This document identifies security risks, attack vectors, and best practices specific to MCP implementations. The primary audience for this document includes developers implementing MCP authorization flows, MCP server operators, and security professionals evaluating MCP-based systems. This document should be read alongside the MCP Authorization specification and OAuth 2.0 security best practices.
## 
​
Attacks and Mitigations
This section gives a detailed description of attacks on MCP implementations, along with potential countermeasures.
### 
​
Confused Deputy Problem
Attackers can exploit MCP servers proxying other resource servers, creating “confused deputy” vulnerabilities.
#### 
​
Terminology
**MCP Proxy Server** : An MCP server that connects MCP clients to third-party APIs, offering MCP features while delegating operations and acting as a single OAuth client to the third-party API server. **Third-Party Authorization Server** : Authorization server that protects the third-party API. It may lack dynamic client registration support, requiring MCP proxy to use a static client ID for all requests. **Third-Party API** : The protected resource server that provides the actual API functionality. Access to this API requires tokens issued by the third-party authorization server. **Static Client ID** : A fixed OAuth 2.0 client identifier used by the MCP proxy server when communicating with the third-party authorization server. This Client ID refers to the MCP server acting as a client to the Third-Party API. It is the same value for all MCP server to Third-Party API interactions regardless of which MCP client initiated the request.
#### 
​
Architecture and Attack Flows
##### Normal OAuth proxy usage (preserves user consent)
Third-Party Authorization ServerMCP Proxy ServerMCP ClientUser-Agent (Browser)Third-Party Authorization ServerMCP Proxy ServerMCP ClientUser-Agent (Browser)Initial Auth flow completedStep 1: Legitimate user consent for Third Party ServerReview consent screenExchange 3P code for 3P tokenGenerate MCP authorization codeExchange code for token, etc.Redirect to third party authorization serverAuthorization request (client_id: mcp-proxy)Authorization consent screenApproveSet consent cookie for client ID: mcp-proxy3P Authorization code + redirect to mcp-proxy-server.com3P Authorization codeRedirect to MCP Client with MCP authorization code
##### Malicious OAuth proxy usage (skips user consent)
AttackerThird-Party Authorization ServerMCP Proxy ServerUser-Agent (Browser)AttackerThird-Party Authorization ServerMCP Proxy ServerUser-Agent (Browser)Step 2: Attack (leveraging existing cookie, skipping consent)Exchange 3P code for 3P tokenGenerate MCP authorization codeAttacker exchanges MCP code for MCP tokenDynamically register malicious client, redirect_uri: attacker.comSends malicious linkAuthorization request (client_id: mcp-proxy) + consent cookieCookie present, consent skipped3P Authorization code + redirect to mcp-proxy-server.com3P Authorization codeRedirect to attacker.com with MCP Authorization codeMCP Authorization code delivered to attacker.comAttacker impersonates user to MCP server
#### 
​
Attack Description
When an MCP proxy server uses a static client ID to authenticate with a third-party authorization server that does not support dynamic client registration, the following attack becomes possible:
 1. A user authenticates normally through the MCP proxy server to access the third-party API
 2. During this flow, the third-party authorization server sets a cookie on the user agent indicating consent for the static client ID
 3. An attacker later sends the user a malicious link containing a crafted authorization request which contains a malicious redirect URI along with a new dynamically registered client ID
 4. When the user clicks the link, their browser still has the consent cookie from the previous legitimate request
 5. The third-party authorization server detects the cookie and skips the consent screen
 6. The MCP authorization code is redirected to the attacker’s server (specified in the crafted redirect_uri during dynamic client registration)
 7. The attacker exchanges the stolen authorization code for access tokens for the MCP server without the user’s explicit approval
 8. Attacker now has access to the third-party API as the compromised user

#### 
​
Mitigation
MCP proxy servers using static client IDs **MUST** obtain user consent for each dynamically registered client before forwarding to third-party authorization servers (which may require additional consent).
### 
​
Token Passthrough
“Token passthrough” is an anti-pattern where an MCP server accepts tokens from an MCP client without validating that the tokens were properly issued _to the MCP server_ and “passing them through” to the downstream API.
#### 
​
Risks
Token passthrough is explicitly forbidden in the authorization specification as it introduces a number of security risks, that include:
 * **Security Control Circumvention**
 * The MCP Server or downstream APIs might implement important security controls like rate limiting, request validation, or traffic monitoring, that depend on the token audience or other credential constraints. If clients can obtain and use tokens directly with the downstream APIs without the MCP server validating them properly or ensuring that the tokens are issued for the right service, they bypass these controls.
 * **Accountability and Audit Trail Issues**
 * The MCP Server will be unable to identify or distinguish between MCP Clients when clients are calling with an upstream-issued access token which may be opaque to the MCP Server.
 * The downstream Resource Server’s logs may show requests that appear to come from a different source with a different identity, rather than the MCP server that is actually forwarding the tokens.
 * Both factors make incident investigation, controls, and auditing more difficult.
 * If the MCP Server passes tokens without validating their claims (e.g., roles, privileges, or audience) or other metadata, a malicious actor in possession of a stolen token can use the server as a proxy for data exfiltration.
 * **Trust Boundary Issues**
 * The downstream Resource Server grants trust to specific entities. This trust might include assumptions about origin or client behavior patterns. Breaking this trust boundary could lead to unexpected issues.
 * If the token is accepted by multiple services without proper validation, an attacker compromising one service can use the token to access other connected services.
 * **Future Compatibility Risk**
 * Even if an MCP Server starts as a “pure proxy” today, it might need to add security controls later. Starting with proper token audience separation makes it easier to evolve the security model.

#### 
​
Mitigation
MCP servers **MUST NOT** accept any tokens that were not explicitly issued for the MCP server.
### 
​
Session Hijacking
Session hijacking is an attack vector where a client is provided a session ID by the server, and an unauthorized party is able to obtain and use that same session ID to impersonate the original client and perform unauthorized actions on their behalf.
#### 
​
Session Hijack Prompt Injection
AttackerServerBQueueServerAClientAttackerServerBQueueServerAClientAttacker knows/guesses session IDInitialize (connect to streamable HTTP server)Respond with session IDAccess/guess session IDTrigger event (malicious payload, using session ID)Enqueue event (keyed by session ID)Poll for events (using session ID)Event data (malicious payload)Async response (malicious payload)Acts based on malicious payload
#### 
​
Session Hijack Impersonation
AttackerServerClientAttackerServerClientAttacker knows/guesses session IDInitialize (login/authenticate)Respond with session ID (persistent session created)Access/guess session IDMake API call (using session ID, no re-auth)Respond as if Attacker is Client (session hijack)
#### 
​
Attack Description
When you have multiple stateful HTTP servers that handle MCP requests, the following attack vectors are possible: **Session Hijack Prompt Injection**
 1. The client connects to **Server A** and receives a session ID.
 2. The attacker obtains an existing session ID and sends a malicious event to **Server B** with said session ID.
 * When a server supports redelivery/resumable streams, deliberately terminating the request before receiving the response could lead to it being resumed by the original client via the GET request for server sent events.
 * If a particular server initiates server sent events as a consequence of a tool call such as a `notifications/tools/list_changed`, where it is possible to affect the tools that are offered by the server, a client could end up with tools that they were not aware were enabled.
 3. **Server B** enqueues the event (associated with session ID) into a shared queue.
 4. **Server A** polls the queue for events using the session ID and retrieves the malicious payload.
 5. **Server A** sends the malicious payload to the client as an asynchronous or resumed response.
 6. The client receives and acts on the malicious payload, leading to potential compromise.

**Session Hijack Impersonation**
 1. The MCP client authenticates with the MCP server, creating a persistent session ID.
 2. The attacker obtains the session ID.
 3. The attacker makes calls to the MCP server using the session ID.
 4. MCP server does not check for additional authorization and treats the attacker as a legitimate user, allowing unauthorized access or actions.

#### 
​
Mitigation
To prevent session hijacking and event injection attacks, the following mitigations should be implemented: MCP servers that implement authorization **MUST** verify all inbound requests. MCP Servers **MUST NOT** use sessions for authentication. MCP servers **MUST** use secure, non-deterministic session IDs. Generated session IDs (e.g., UUIDs) **SHOULD** use secure random number generators. Avoid predictable or sequential session identifiers that could be guessed by an attacker. Rotating or expiring session IDs can also reduce the risk. MCP servers **SHOULD** bind session IDs to user-specific information. When storing or transmitting session-related data (e.g., in a queue), combine the session ID with information unique to the authorized user, such as their internal user ID. Use a key format like `<user_id>:<session_id>`. This ensures that even if an attacker guesses a session ID, they cannot impersonate another user as the user ID is derived from the user token and not provided by the client. MCP servers can optionally leverage additional unique identifiers.
Was this page helpful?
YesNo
AuthorizationCancellation
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Overview - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/server

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.135847

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Server Features
Overview
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

Server Features
# Overview
Copy page
Copy page
**Protocol Revision** : 2025-06-18
Servers provide the fundamental building blocks for adding context to language models via MCP. These primitives enable rich interactions between clients, servers, and language models:
 * **Prompts** : Pre-defined templates or instructions that guide language model interactions
 * **Resources** : Structured data or content that provides additional context to the model
 * **Tools** : Executable functions that allow models to perform actions or retrieve information

Each primitive can be summarized in the following control hierarchy: Primitive | Control | Description | Example 
---|---|---|--- 
Prompts | User-controlled | Interactive templates invoked by user choice | Slash commands, menu options 
Resources | Application-controlled | Contextual data attached and managed by the client | File contents, git history 
Tools | Model-controlled | Functions exposed to the LLM to take actions | API POST requests, file writing 
Explore these key primitives in more detail below:
## Prompts## Resources## Tools
Was this page helpful?
YesNo
ElicitationPrompts
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Model Context Protocol - Model Context Protocol

## URL
https://modelcontextprotocol.io/about

## Metadata
- Depth: 1
- Timestamp: 2025-10-15T18:26:42.135886

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Model Context Protocol
DocumentationSpecificationCommunityAbout MCP
!MCP Logo
## Connect your AI applications to the world
AI-enabled tools are powerful, but they’re often limited to the information you manually provide or require bespoke integrations.
Whether it’s reading files from your computer, searching through an internal or external knowledge base, or updating tasks in an project management tool, MCP provides a secure, standardized, _simple_ way to give AI systems the context they need.
## How it works
1
### Choose MCP servers
Pick from pre-built servers for popular tools like GitHub, Google Drive, Slack and hundreds of others. Combine multiple servers for complete workflows, or easily build your own for custom integrations.
2
### Connect your AI application
Configure your AI application (like Claude, VS Code, or ChatGPT) to connect to your MCP servers. The application can now see available tools, resources and prompts from all connected servers.
3
### Work with context
Your AI-powered application can now access real data, execute actions, and provide more helpful responses based on your actual context.
## Join a growing ecosystem
10 Official SDKs80+ Compatible Clients1000+ Available Servers
Get Started
⌘I
Assistant
Responses are generated using AI and may contain mistakes.
!MCP Logo


---

# mcp blog

## URL
http://blog.modelcontextprotocol.io

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.135952

## Content
mcp blog")
 * Documentation 
 * GitHub 

## Update on the Next MCP Protocol Release
Release Timeline The next version of the Model Context Protocol specification will be released on November 25th, 2025, with a release candidate (RC) available on November 11th, 2025. We’re building in a 14-day RC validation window so client implementors and SDK maintainers can thoroughly test the protocol changes. This approach gives us the focused time we need to deliver critical improvements while applying our new governance model to the process. Summer Progress Our last spec was released on June 18, 2025, and focused on structured tool outputs, OAuth-based authorization, elicitation for server-initiated user interactions, and improved security best practices. ...
September 26, 2025 · 5 min · David Soria Parra[](http://blog.modelcontextprotocol.io/posts/2025-09-26-mcp-next-version-update/)
## Introducing the MCP Registry
Today, we’re launching the Model Context Protocol (MCP) Registry—an open catalog and API for publicly available MCP servers to improve discoverability and implementation. By standardizing how servers are distributed and discovered, we’re expanding their reach while making it easier for clients to get connected. The MCP Registry is now available in preview. To get started: Add your server by following our guide on Adding Servers to the MCP Registry (for server maintainers) Access server data by following our guide on Accessing MCP Registry Data (for client maintainers) Single source of truth for MCP servers In March 2025, we shared that we wanted to build a central registry for the MCP ecosystem. Today we are announcing that we’ve launched https://registry.modelcontextprotocol.io as the official MCP Registry. As part of the MCP project, the MCP Registry, as well as a parent OpenAPI specification, are open source—allowing everyone to build a compatible sub-registry. ...
September 8, 2025 · 4 min · David Soria Parra (Lead Maintainer), Adam Jones (Registry Maintainer), Tadas Antanavicius (Registry Maintainer), Toby Padilla (Registry Maintainer), Theodora Chu (MCP PM at Anthropic)[](http://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/)
## Announcing the Official PHP SDK for MCP
The official PHP SDK for the Model Context Protocol is now generally available. Built in collaboration with the PHP Foundation and Symfony, the PHP SDK handles protocol details, so developers don’t have to worry about low-level mechanics and can focus on building their applications. The initial release enables PHP developers to build MCP servers, exposing tools, prompts, and resources to AI applications. Support for PHP applications to act as MCP clients will follow. The PHP SDK now joins 9 other officially supported language SDKs in the MCP ecosystem, making it easier for developers everywhere to adopt MCP in their preferred language. ...
September 5, 2025 · 1 min · David Soria Parra (Lead Maintainer), Christopher Hertel (Symfony), Roman Pronskiy (PHP Foundation)[](http://blog.modelcontextprotocol.io/posts/2025-09-05-php-sdk/)
## Evolving OAuth Client Registration in the Model Context Protocol
The Model Context Protocol (MCP) has adopted OAuth 2.1 as the foundation for its authorization framework. A key part of the authorization flow that MCP is particularly reliant on is client registration. This is especially important in a world where clients and servers don’t have a pre-existing relationship - we can’t assume that we will always know which MCP clients will connect to which MCP servers. This design highlights two challenges that need to be addressed: ...
August 22, 2025 · 10 min · Paul Carleton (Core Maintainer)[](http://blog.modelcontextprotocol.io/posts/client_registration/)
## MCP Prompts: Building Workflow Automation
MCP (Model Context Protocol) prompts enable workflow automation by combining AI capabilities with structured data access. This post demonstrates how to build automations using MCP’s prompts and resource templates through a practical example. This guide demonstrates how MCP prompts can automate repetitive workflows. Whether you’re interested in the MCP ecosystem or simply want to leverage AI for workflow automation, you’ll learn how to build practical automations through a concrete meal planning example. No prior MCP experience needed—we’ll cover the fundamentals before diving into implementation. ...
August 4, 2025 · 8 min · Inna Harper (Core Maintainer)[](http://blog.modelcontextprotocol.io/posts/2025-07-29-prompts-for-automation/)Next »© 2025 mcp blog · Powered by Hugo & PaperMod[](http://blog.modelcontextprotocol.io/#top "Go to Top \(Alt + G\)")


---

# Example Clients - Model Context Protocol

## URL
https://modelcontextprotocol.io/clients

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.137010

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Examples
Example Clients
DocumentationSpecificationCommunityAbout MCP
 * Contributor Communication

##### Governance
 * Governance and Stewardship
 * SEP Guidelines
 * Working and Interest Groups
 * Antitrust Policy

##### Roadmap
 * Roadmap

##### Examples
 * Example Clients
 * Example Servers

On this page
 * Feature support matrix
 * Client details
 * 5ire
 * AgentAI
 * AgenticFlow
 * AIQL TUUI
 * Amazon Q CLI
 * Amazon Q IDE
 * Apify MCP Tester
 * Amp
 * Augment Code
 * BeeAI Framework
 * BoltAI
 * Call Chirp
 * Chatbox
 * ChatFrame
 * ChatGPT
 * ChatWise
 * Claude Code
 * Claude.ai
 * Claude Desktop App
 * Chorus
 * Cline
 * CodeGPT
 * Continue
 * Copilot-MCP
 * Cursor
 * Daydreams
 * ECA - Editor Code Assistant
 * Emacs Mcp
 * fast-agent
 * FlowDown
 * FLUJO
 * Genkit
 * Glama
 * GenAIScript
 * Goose
 * GitHub Copilot coding agent
 * gptme
 * HyperAgent
 * Jenova
 * JetBrains AI Assistant
 * JetBrains Junie
 * Kilo Code
 * Klavis AI Slack/Discord/Web
 * Langflow
 * LibreChat
 * LM Studio
 * Lutra
 * mcp-agent
 * mcp-client-chatbot
 * MCPJam
 * mcp-use
 * modelcontextchat.com
 * MCPHub
 * MCPOmni-Connect
 * Memex
 * Microsoft Copilot Studio
 * MindPal
 * MooPoint
 * Mistral AI: Le Chat
 * Msty Studio
 * Needle
 * NVIDIA Agent Intelligence (AIQ) toolkit
 * OpenSumi
 * oterm
 * Roo Code
 * Postman
 * RecurseChat
 * Shortwave
 * Simtheory
 * Slack MCP Client
 * Smithery Playground
 * SpinAI
 * Superinterface
 * Superjoin
 * Swarms
 * systemprompt
 * Tambo
 * Tencent CloudBase AI DevKit
 * TheiaAI/TheiaIDE
 * Tome
 * TypingMind App
 * VS Code GitHub Copilot
 * Warp
 * WhatsMCP
 * Windsurf Editor
 * Witsy
 * Zed
 * Zencoder
 * Adding MCP support to your application
 * Updates and corrections

Examples
# Example Clients
Copy page
A list of applications that support MCP integrations
Copy page
This page provides an overview of applications that support the Model Context Protocol (MCP). Each client may support different MCP features, allowing for varying levels of integration with MCP servers.
## 
​
Feature support matrix
Client | Resources | Prompts | Tools | Discovery | Sampling | Roots | Elicitation 
---|---|---|---|---|---|---|--- 
5ire | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
AgentAI | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
AgenticFlow | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❓ 
AIQL TUUI | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ 
Amazon Q CLI | ❌ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
Amazon Q IDE | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
Amp | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❓ 
Apify MCP Tester | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❓ 
Augment Code | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
BeeAI Framework | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
BoltAI | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Call Chirp | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❓ 
Chatbox | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ 
ChatFrame | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ 
ChatGPT | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
ChatWise | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
Claude.ai | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❓ 
Claude Code | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❓ 
Claude Desktop App | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❓ 
Chorus | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Cline | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❓ 
CodeGPT | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Continue | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
Copilot-MCP | ✅ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Cursor | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ 
Daydreams Agents | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❓ 
ECA | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❓ 
Emacs Mcp | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
fast-agent | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 
FlowDown | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❌ 
FLUJO | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Genkit | ⚠️ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
Glama | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
Gemini CLI | ❌ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
GenAIScript | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
GitHub Copilot coding agent | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ 
Goose | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
gptme | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
HyperAgent | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Jenova | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❓ 
JetBrains AI Assistant | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
JetBrains Junie | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ 
Kilo Code | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❓ 
Klavis AI Slack/Discord/Web | ✅ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Langflow | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
LibreChat | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
LM Studio | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Lutra | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
mcp-agent | ✅ | ✅ | ✅ | ❓ | ⚠️ | ✅ | ✅ 
mcp-client-chatbot | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
MCPJam | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ✅ 
mcp-use | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ 
modelcontextchat.com | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
MCPHub | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
MCPOmni-Connect | ✅ | ✅ | ✅ | ❓ | ✅ | ❌ | ❓ 
Memex | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
Microsoft Copilot Studio | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❓ 
MindPal | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Mistral AI: Le Chat | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
MooPoint | ❌ | ❌ | ✅ | ❓ | ✅ | ❌ | ❓ 
Msty Studio | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Needle | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❓ 
NVIDIA Agent Intelligence toolkit | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
OpenSumi | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
oterm | ❌ | ✅ | ✅ | ❓ | ✅ | ❌ | ❓ 
Postman | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
RecurseChat | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Roo Code | ✅ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Shortwave | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Simtheory | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❓ 
Slack MCP Client | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Smithery Playground | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ 
SpinAI | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Superinterface | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Superjoin | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Swarms | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❓ 
systemprompt | ✅ | ✅ | ✅ | ❓ | ✅ | ❌ | ❓ 
Tambo | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Tencent CloudBase AI DevKit | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
TheiaAI/TheiaIDE | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Tome | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
TypingMind App | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
VS Code GitHub Copilot | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 
Warp | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❓ 
WhatsMCP | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
Windsurf Editor | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❓ 
Witsy | ❌ | ❌ | ✅ | ❓ | ❌ | ❌ | ❓ 
Zed | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❓ 
Zencoder | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ 
## 
​
Client details
### 
​
5ire
5ire is an open source cross-platform desktop AI assistant that supports tools through MCP servers. **Key features:**
 * Built-in MCP servers can be quickly enabled and disabled.
 * Users can add more servers by modifying the configuration file.
 * It is open-source and user-friendly, suitable for beginners.
 * Future support for MCP will be continuously improved.

### 
​
AgentAI
AgentAI is a Rust library designed to simplify the creation of AI agents. The library includes seamless integration with MCP Servers. Example of MCP Server integration **Key features:**
 * Multi-LLM – We support most LLM APIs (OpenAI, Anthropic, Gemini, Ollama, and all OpenAI API Compatible).
 * Built-in support for MCP Servers.
 * Create agentic flows in a type- and memory-safe language like Rust.

### 
​
AgenticFlow
AgenticFlow is a no-code AI platform that helps you build agents that handle sales, marketing, and creative tasks around the clock. Connect 2,500+ APIs and 10,000+ tools securely via MCP. **Key features:**
 * No-code AI agent creation and workflow building.
 * Access a vast library of 10,000+ tools and 2,500+ APIs through MCP.
 * Simple 3-step process to connect MCP servers.
 * Securely manage connections and revoke access anytime.

**Learn more:**
 * AgenticFlow MCP Integration

### 
​
AIQL TUUI
AIQL TUUI is a native, cross-platform desktop AI chat application with MCP support. It supports multiple AI providers (e.g., Anthropic, Cloudflare, Deepseek, OpenAI, Qwen), local AI models (via vLLM, Ray, etc.), and aggregated API platforms (such as Deepinfra, Openrouter, and more). **Key features:**
 * **Dynamic LLM API & Agent Switching**: Seamlessly toggle between different LLM APIs and agents on the fly.
 * **Comprehensive Capabilities Support** : Built-in support for tools, prompts, resources, and sampling methods.
 * **Configurable Agents** : Enhanced flexibility with selectable and customizable tools via agent settings.
 * **Advanced Sampling Control** : Modify sampling parameters and leverage multi-round sampling for optimal results.
 * **Cross-Platform Compatibility** : Fully compatible with macOS, Windows, and Linux.
 * **Free & Open-Source (FOSS)**: Permissive licensing allows modifications and custom app bundling.

**Learn more:**
 * TUUI document
 * AIQL GitHub repository

### 
​
Amazon Q CLI
Amazon Q CLI is an open-source, agentic coding assistant for terminals. **Key features:**
 * Full support for MCP servers.
 * Edit prompts using your preferred text editor.
 * Access saved prompts instantly with `@`.
 * Control and organize AWS resources directly from your terminal.
 * Tools, profiles, context management, auto-compact, and so much more!

**Get Started**
Copy
```
brew install amazon-q

```

### 
​
Amazon Q IDE
Amazon Q IDE is an open-source, agentic coding assistant for IDEs. **Key features:**
 * Support for the VSCode, JetBrains, Visual Studio, and Eclipse IDEs.
 * Control and organize AWS resources directly from your IDE.
 * Manage permissions for each MCP tool via the IDE user interface.

### 
​
Apify MCP Tester
Apify MCP Tester is an open-source client that connects to any MCP server using Server-Sent Events (SSE). It is a standalone Apify Actor designed for testing MCP servers over SSE, with support for Authorization headers. It uses plain JavaScript (old-school style) and is hosted on Apify, allowing you to run it without any setup. **Key features:**
 * Connects to any MCP server via SSE.
 * Works with the Apify MCP Server to interact with one or more Apify Actors.
 * Dynamically utilizes tools based on context and user queries (if supported by the server).

### 
​
Amp
Amp is an agentic coding tool built by Sourcegraph. It runs in VS Code (and compatible forks like Cursor, Windsurf, and VSCodium), JetBrains IDEs, Neovim, and as a command-line tool. It’s also multiplayer — you can share threads and collaborate with your team. **Key features:**
 * Granular control over enabled tools and permissions
 * Support for MCP servers defined in VS Code `mcp.json`

### 
​
Augment Code
Augment Code is an AI-powered coding platform for VS Code and JetBrains with autonomous agents, chat, and completions. Both local and remote agents are backed by full codebase awareness and native support for MCP, enabling enhanced context through external sources and tools. **Key features:**
 * Full MCP support in local and remote agents.
 * Add additional context through MCP servers.
 * Automate your development workflows with MCP tools.
 * Works in VS Code and JetBrains IDEs.

### 
​
BeeAI Framework
BeeAI Framework is an open-source framework for building, deploying, and serving powerful agentic workflows at scale. The framework includes the **MCP Tool** , a native feature that simplifies the integration of MCP servers into agentic workflows. **Key features:**
 * Seamlessly incorporate MCP tools into agentic workflows.
 * Quickly instantiate framework-native tools from connected MCP client(s).
 * Planned future support for agentic MCP capabilities.

**Learn more:**
 * Example of using MCP tools in agentic workflow

### 
​
BoltAI
BoltAI is a native, all-in-one AI chat client with MCP support. BoltAI supports multiple AI providers (OpenAI, Anthropic, Google AI…), including local AI models (via Ollama, LM Studio or LMX) **Key features:**
 * MCP Tool integrations: once configured, user can enable individual MCP server in each chat
 * MCP quick setup: import configuration from Claude Desktop app or Cursor editor
 * Invoke MCP tools inside any app with AI Command feature
 * Integrate with remote MCP servers in the mobile app

**Learn more:**
 * BoltAI docs
 * BoltAI website

### 
​
Call Chirp
Call Chirp <https://www.call-chirp.com> uses AI to capture every critical detail from your business conversations, automatically syncing insights to your CRM and project tools so you never miss another deal-closing moment. **Key features:**
 * Save transcriptions from Zoom, Google Meet, and more
 * MCP Tools for voice AI agents
 * Remote MCP servers support

### 
​
Chatbox
Chatbox is a better UI and desktop app for ChatGPT, Claude, and other LLMs, available on Windows, Mac, Linux, and the web. It’s open-source and has garnered 37K stars⭐ on GitHub. **Key features:**
 * Tools support for MCP servers
 * Support both local and remote MCP servers
 * Built-in MCP servers marketplace

### 
​
ChatFrame
A cross-platform desktop chatbot that unifies access to multiple AI language models, supports custom tool integration via MCP servers, and enables RAG conversations with your local files—all in a single, polished app for macOS and Windows. **Key features:**
 * Unified access to top LLM providers (OpenAI, Anthropic, DeepSeek, xAI, and more) in one interface
 * Built-in retrieval-augmented generation (RAG) for instant, private search across your PDFs, text, and code files
 * Plug-in system for custom tools via Model Context Protocol (MCP) servers
 * Multimodal chat: supports images, text, and live interactive artifacts

### 
​
ChatGPT
ChatGPT is OpenAI’s AI assistant that provides MCP support for remote servers to conduct deep research. **Key features:**
 * Support for MCP via connections UI in settings
 * Access to search tools from configured MCP servers for deep research
 * Enterprise-grade security and compliance features

### 
​
ChatWise
ChatWise is a desktop-optimized, high-performance chat application that lets you bring your own API keys. It supports a wide range of LLMs and integrates with MCP to enable tool workflows. **Key features:**
 * Tools support for MCP servers
 * Offer built-in tools like web search, artifacts and image generation.

### 
​
Claude Code
Claude Code is an interactive agentic coding tool from Anthropic that helps you code faster through natural language commands. It supports MCP integration for resources, prompts, tools, and roots, and also functions as an MCP server to integrate with other clients. **Key features:**
 * Full support for resources, prompts, tools, and roots from MCP servers
 * Offers its own tools through an MCP server for integrating with other MCP clients

### 
​
Claude.ai
Claude.ai is Anthropic’s web-based AI assistant that provides MCP support for remote servers. **Key features:**
 * Support for remote MCP servers via integrations UI in settings
 * Access to tools, prompts, and resources from configured MCP servers
 * Seamless integration with Claude’s conversational interface
 * Enterprise-grade security and compliance features

### 
​
Claude Desktop App
The Claude desktop application provides comprehensive support for MCP, enabling deep integration with local tools and data sources. **Key features:**
 * Full support for resources, allowing attachment of local files and data
 * Support for prompt templates
 * Tool integration for executing commands and scripts
 * Local server connections for enhanced privacy and security

### 
​
Chorus
Chorus is a native Mac app for chatting with AIs. Chat with multiple models at once, run tools and MCPs, create projects, quick chat, bring your own key, all in a blazing fast, keyboard shortcut friendly app. **Key features:**
 * MCP support with one-click install
 * Built in tools, like web search, terminal, and image generation
 * Chat with multiple models at once (cloud or local)
 * Create projects with scoped memory
 * Quick chat with an AI that can see your screen

### 
​
Cline
Cline is an autonomous coding agent in VS Code that edits files, runs commands, uses a browser, and more–with your permission at each step. **Key features:**
 * Create and add tools through natural language (e.g. “add a tool that searches the web”)
 * Share custom MCP servers Cline creates with others via the `~/Documents/Cline/MCP` directory
 * Displays configured MCP servers along with their tools, resources, and any error logs

### 
​
CodeGPT
CodeGPT is a popular VS Code and Jetbrains extension that brings AI-powered coding assistance to your editor. It supports integration with MCP servers for tools, allowing users to leverage external AI capabilities directly within their development workflow. **Key features:**
 * Use MCP tools from any configured MCP server
 * Seamless integration with VS Code and Jetbrains UI
 * Supports multiple LLM providers and custom endpoints

**Learn more:**
 * CodeGPT Documentation

### 
​
Continue
Continue is an open-source AI code assistant, with built-in support for all MCP features. **Key features:**
 * Type ”@” to mention MCP resources
 * Prompt templates surface as slash commands
 * Use both built-in and MCP tools directly in chat
 * Supports VS Code and JetBrains IDEs, with any LLM

### 
​
Copilot-MCP
Copilot-MCP enables AI coding assistance via MCP. **Key features:**
 * Support for MCP tools and resources
 * Integration with development workflows
 * Extensible AI capabilities

### 
​
Cursor
Cursor is an AI code editor. **Key features:**
 * Support for MCP tools in Cursor Composer
 * Support for roots
 * Support for prompts
 * Support for elicitation
 * Support for both STDIO and SSE

### 
​
Daydreams
Daydreams is a generative agent framework for executing anything onchain **Key features:**
 * Supports MCP Servers in config
 * Exposes MCP Client

### 
​
ECA - Editor Code Assistant
ECA is a Free and open-source editor-agnostic tool that aims to easily link LLMs and Editors, giving the best UX possible for AI pair programming using a well-defined protocol **Key features:**
 * **Editor-agnostic** : protocol for any editor to integrate.
 * **Single configuration** : Configure eca making it work the same in any editor via global or local configs.
 * **Chat** interface: ask questions, review code, work together to code.
 * **Agentic** : let LLM work as an agent with its native tools and MCPs you can configure.
 * **Context** : support: giving more details about your code to the LLM, including MCP resources and prompts.
 * **Multi models** : Login to OpenAI, Anthropic, Copilot, Ollama local models and many more.
 * **OpenTelemetry** : Export metrics of tools, prompts, server usage.

**Learn more:**
 * ECA website
 * ECA source code

### 
​
Emacs Mcp
Emacs Mcp is an Emacs client designed to interface with MCP servers, enabling seamless connections and interactions. It provides MCP tool invocation support for AI plugins like gptel and llm, adhering to Emacs’ standard tool invocation format. This integration enhances the functionality of AI tools within the Emacs ecosystem. **Key features:**
 * Provides MCP tool support for Emacs.

### 
​
fast-agent
fast-agent is a Python Agent framework, with simple declarative support for creating Agents and Workflows, with full multi-modal support for Anthropic and OpenAI models. **Key features:**
 * PDF and Image support, based on MCP Native types
 * Interactive front-end to develop and diagnose Agent applications, including passthrough and playback simulators
 * Built in support for “Building Effective Agents” workflows.
 * Deploy Agents as MCP Servers

### 
​
FlowDown
FlowDown is a blazing fast and smooth client app for using AI/LLM, with a strong emphasis on privacy and user experience. It supports MCP servers to extend its capabilities with external tools, allowing users to build powerful, customized workflows. **Key features:**
 * **Seamless MCP Integration** : Easily connect to MCP servers to utilize a wide range of external tools.
 * **Privacy-First Design** : Your data stays on your device. We don’t collect any user data, ensuring complete privacy.
 * **Lightweight & Efficient**: A compact and optimized design ensures a smooth and responsive experience with any AI model.
 * **Broad Compatibility** : Works with all OpenAI-compatible service providers and supports local offline models through MLX.
 * **Rich User Experience** : Features beautifully formatted Markdown, blazing-fast text rendering, and intelligent, automated chat titling.

**Learn more:**
 * FlowDown website
 * FlowDown documentation

### 
​
FLUJO
Think n8n + ChatGPT. FLUJO is an desktop application that integrates with MCP to provide a workflow-builder interface for AI interactions. Built with Next.js and React, it supports both online and offline (ollama) models, it manages API Keys and environment variables centrally and can install MCP Servers from GitHub. FLUJO has an ChatCompletions endpoint and flows can be executed from other AI applications like Cline, Roo or Claude. **Key features:**
 * Environment & API Key Management
 * Model Management
 * MCP Server Integration
 * Workflow Orchestration
 * Chat Interface

### 
​
Genkit
Genkit is a cross-language SDK for building and integrating GenAI features into applications. The genkitx-mcp plugin enables consuming MCP servers as a client or creating MCP servers from Genkit tools and prompts. **Key features:**
 * Client support for tools and prompts (resources partially supported)
 * Rich discovery with support in Genkit’s Dev UI playground
 * Seamless interoperability with Genkit’s existing tools and prompts
 * Works across a wide variety of GenAI models from top providers

### 
​
Glama
Glama is a comprehensive AI workspace and integration platform that offers a unified interface to leading LLM providers, including OpenAI, Anthropic, and others. It supports the Model Context Protocol (MCP) ecosystem, enabling developers and enterprises to easily discover, build, and manage MCP servers. **Key features:**
 * Integrated MCP Server Directory
 * Integrated MCP Tool Directory
 * Host MCP servers and access them via the Chat or SSE endpoints – Ability to chat with multiple LLMs and MCP servers at once
 * Upload and analyze local files and data
 * Full-text search across all your chats and data

### 
​
GenAIScript
Programmatically assemble prompts for LLMs using GenAIScript (in JavaScript). Orchestrate LLMs, tools, and data in JavaScript. **Key features:**
 * JavaScript toolbox to work with prompts
 * Abstraction to make it easy and productive
 * Seamless Visual Studio Code integration

### 
​
Goose
Goose is an open source AI agent that supercharges your software development by automating coding tasks. **Key features:**
 * Expose MCP functionality to Goose through tools.
 * MCPs can be installed directly via the extensions directory, CLI, or UI.
 * Goose allows you to extend its functionality by building your own MCP servers.
 * Includes built-in tools for development, web scraping, automation, memory, and integrations with JetBrains and Google Drive.

### 
​
GitHub Copilot coding agent
Delegate tasks to GitHub Copilot coding agent and let it work in the background while you stay focused on the highest-impact and most interesting work **Key features:**
 * Delegate tasks to Copilot from GitHub Issues, Visual Studio Code, GitHub Copilot Chat or from your favorite MCP host using the GitHub MCP Server
 * Tailor Copilot to your project by customizing the agent’s development environment or writing custom instructions
 * Augment Copilot’s context and capabilities with MCP tools, with support for both local and remote MCP servers

### 
​
gptme
gptme is a open-source terminal-based personal AI assistant/agent, designed to assist with programming tasks and general knowledge work. **Key features:**
 * CLI-first design with a focus on simplicity and ease of use
 * Rich set of built-in tools for shell commands, Python execution, file operations, and web browsing
 * Local-first approach with support for multiple LLM providers
 * Open-source, built to be extensible and easy to modify

### 
​
HyperAgent
HyperAgent is Playwright supercharged with AI. With HyperAgent, you no longer need brittle scripts, just powerful natural language commands. Using MCP servers, you can extend the capability of HyperAgent, without having to write any code. **Key features:**
 * AI Commands: Simple APIs like page.ai(), page.extract() and executeTask() for any AI automation
 * Fallback to Regular Playwright: Use regular Playwright when AI isn’t needed
 * Stealth Mode – Avoid detection with built-in anti-bot patches
 * Cloud Ready – Instantly scale to hundreds of sessions via Hyperbrowser
 * MCP Client – Connect to tools like Composio for full workflows (e.g. writing web data to Google Sheets)

### 
​
Jenova
Jenova is the best MCP client for non-technical users, especially on mobile. **Key features:**
 * 30+ pre-integrated MCP servers with one-click integration of custom servers
 * MCP recommendation capability that suggests the best servers for specific tasks
 * Multi-agent architecture with leading tool use reliability and scalability, supporting unlimited concurrent MCP server connections through RAG-powered server metadata
 * Model agnostic platform supporting any leading LLMs (OpenAI, Anthropic, Google, etc.)
 * Unlimited chat history and global persistent memory powered by RAG
 * Easy creation of custom agents with custom models, instructions, knowledge bases, and MCP servers
 * Local MCP server (STDIO) support coming soon with desktop apps

### 
​
JetBrains AI Assistant
JetBrains AI Assistant plugin provides AI-powered features for software development available in all JetBrains IDEs. **Key features:**
 * Unlimited code completion powered by Mellum, JetBrains’ proprietary AI model.
 * Context-aware AI chat that understands your code and helps you in real time.
 * Access to top-tier models from OpenAI, Anthropic, and Google.
 * Offline mode with connected local LLMs via Ollama or LM Studio.
 * Deep integration into IDE workflows, including code suggestions in the editor, VCS assistance, runtime error explanation, and more.

### 
​
JetBrains Junie
Junie is JetBrains’ AI coding agent for JetBrains IDEs and Android Studio. **Key features:**
 * Connects to MCP servers over **stdio** to use external tools and data sources.
 * Per-command approval with an optional allowlist.
 * Config via `mcp.json` (global `~/.junie/mcp.json` or project `.junie/mcp/`).

### 
​
Kilo Code
Kilo Code is an autonomous coding AI dev team in VS Code that edits files, runs commands, uses a browser, and more. **Key features:**
 * Create and add tools through natural language (e.g. “add a tool that searches the web”)
 * Discover MCP servers via the MCP Marketplace
 * One click MCP server installs via MCP Marketplace
 * Displays configured MCP servers along with their tools, resources, and any error logs

### 
​
Klavis AI Slack/Discord/Web
Klavis AI is an Open-Source Infra to Use, Build & Scale MCPs with ease. **Key features:**
 * Slack/Discord/Web MCP clients for using MCPs directly
 * Simple web UI dashboard for easy MCP configuration
 * Direct OAuth integration with Slack & Discord Clients and MCP Servers for secure user authentication
 * SSE transport support
 * Open-source infrastructure (GitHub repository)

**Learn more:**
 * Demo video showing MCP usage in Slack/Discord

### 
​
Langflow
Langflow is an open-source visual builder that lets developers rapidly prototype and build AI applications, it integrates with the Model Context Protocol (MCP) as both an MCP server and an MCP client. **Key features:**
 * Full support for using MCP server tools to build agents and flows.
 * Export agents and flows as MCP server
 * Local & remote server connections for enhanced privacy and security

**Learn more:**
 * Demo video showing how to use Langflow as both an MCP client & server

### 
​
LibreChat
LibreChat is an open-source, customizable AI chat UI that supports multiple AI providers, now including MCP integration. **Key features:**
 * Extend current tool ecosystem, including Code Interpreter and Image generation tools, through MCP servers
 * Add tools to customizable Agents, using a variety of LLMs from top providers
 * Open-source and self-hostable, with secure multi-user support
 * Future roadmap includes expanded MCP feature support

### 
​
LM Studio
LM Studio is a cross-platform desktop app for discovering, downloading, and running open-source LLMs locally. You can now connect local models to tools via Model Context Protocol (MCP). **Key features:**
 * Use MCP servers with local models on your computer. Add entries to `mcp.json` and save to get started.
 * Tool confirmation UI: when a model calls a tool, you can confirm the call in the LM Studio app.
 * Cross-platform: runs on macOS, Windows, and Linux, one-click installer with no need to fiddle in the command line
 * Supports GGUF (llama.cpp) or MLX models with GPU acceleration
 * GUI & terminal mode: use the LM Studio app or CLI (lms) for scripting and automation

**Learn more:**
 * Docs: Using MCP in LM Studio
 * Create a ‘Add to LM Studio’ button for your server
 * Announcement blog: LM Studio + MCP

### 
​
Lutra
Lutra is an AI agent that transforms conversations into actionable, automated workflows. **Key features:**
 * Easy MCP Integration: Connecting Lutra to MCP servers is as simple as providing the server URL; Lutra handles the rest behind the scenes.
 * Chat to Take Action: Lutra understands your conversational context and goals, automatically integrating with your existing apps to perform tasks.
 * Reusable Playbooks: After completing a task, save the steps as reusable, automated workflows—simplifying repeatable processes and reducing manual effort.
 * Shareable Automations: Easily share your saved playbooks with teammates to standardize best practices and accelerate collaborative workflows.

**Learn more:**
 * Lutra AI agent explained

### 
​
mcp-agent
mcp-agent is a simple, composable framework to build agents using Model Context Protocol. **Key features:**
 * Automatic connection management of MCP servers.
 * Expose tools from multiple servers to an LLM.
 * Implements every pattern defined in Building Effective Agents.
 * Supports workflow pause/resume signals, such as waiting for human feedback.

### 
​
mcp-client-chatbot
mcp-client-chatbot is a local-first chatbot built with Vercel’s Next.js, AI SDK, and Shadcn UI. **Key features:**
 * It supports standard MCP tool calling and includes both a custom MCP server and a standalone UI for testing MCP tools outside the chat flow.
 * All MCP tools are provided to the LLM by default, but the project also includes an optional `@toolname` mention feature to make tool invocation more explicit—particularly useful when connecting to multiple MCP servers with many tools.
 * Visual workflow builder that lets you create custom tools by chaining LLM nodes and MCP tools together. Published workflows become callable as `@workflow_name` tools in chat, enabling complex multi-step automation sequences.

### 
​
MCPJam
MCPJam is an open source testing and debugging tool for MCP servers - Postman for MCP servers. **Key features:**
 * Test your MCP server’s tools, resources, prompts, and OAuth. MCP spec compliant.
 * LLM playground to test your server against different LLMs.
 * Tracing and logging error messages.
 * Connect and test multiple MCP servers simultaneously.
 * Supports all transports - STDIO, SSE, and Streamable HTTP.

### 
​
mcp-use
mcp-use is an open source python library to very easily connect any LLM to any MCP server both locally and remotely. **Key features:**
 * Very simple interface to connect any LLM to any MCP.
 * Support the creation of custom agents, workflows.
 * Supports connection to multiple MCP servers simultaneously.
 * Supports all langchain supported models, also locally.
 * Offers efficient tool orchestration and search functionalities.

### 
​
modelcontextchat.com
modelcontextchat.com is a web-based MCP client designed for working with remote MCP servers, featuring comprehensive authentication support and integration with OpenRouter. **Key features:**
 * Web-based interface for remote MCP server connections
 * Header-based Authorization support for secure server access
 * OAuth authentication integration
 * OpenRouter API Key support for accessing various LLM providers
 * No installation required - accessible from any web browser

### 
​
MCPHub
MCPHub is a powerful Neovim plugin that integrates MCP (Model Context Protocol) servers into your workflow. **Key features:**
 * Install, configure and manage MCP servers with an intuitive UI.
 * Built-in Neovim MCP server with support for file operations (read, write, search, replace), command execution, terminal integration, LSP integration, buffers, and diagnostics.
 * Create Lua-based MCP servers directly in Neovim.
 * Inegrates with popular Neovim chat plugins Avante.nvim and CodeCompanion.nvim

### 
​
MCPOmni-Connect
MCPOmni-Connect is a versatile command-line interface (CLI) client designed to connect to various Model Context Protocol (MCP) servers using both stdio and SSE transport. **Key features:**
 * Support for resources, prompts, tools, and sampling
 * Agentic mode with ReAct and orchestrator capabilities
 * Seamless integration with OpenAI models and other LLMs
 * Dynamic tool and resource management across multiple servers
 * Support for both stdio and SSE transport protocols
 * Comprehensive tool orchestration and resource analysis capabilities

### 
​
Memex
Memex is the first MCP client and MCP server builder - all-in-one desktop app. Unlike traditional MCP clients that only consume existing servers, Memex can create custom MCP servers from natural language prompts, immediately integrate them into its toolkit, and use them to solve problems—all within a single conversation. **Key features:**
 * **Prompt-to-MCP Server** : Generate fully functional MCP servers from natural language descriptions
 * **Self-Testing & Debugging**: Autonomously test, debug, and improve created MCP servers
 * **Universal MCP Client** : Works with any MCP server through intuitive, natural language integration
 * **Curated MCP Directory** : Access to tested, one-click installable MCP servers (Neon, Netlify, GitHub, Context7, and more)
 * **Multi-Server Orchestration** : Leverage multiple MCP servers simultaneously for complex workflows

**Learn more:**
 * Memex Launch 2: MCP Teams and Agent API

### 
​
Microsoft Copilot Studio
Microsoft Copilot Studio is a robust SaaS platform designed for building custom AI-driven applications and intelligent agents, empowering developers to create, deploy, and manage sophisticated AI solutions. **Key features:**
 * Support for MCP tools
 * Extend Copilot Studio agents with MCP servers
 * Leveraging Microsoft unified, governed, and secure API management solutions

### 
​
MindPal
MindPal is a no-code platform for building and running AI agents and multi-agent workflows for business processes. **Key features:**
 * Build custom AI agents with no-code
 * Connect any SSE MCP server to extend agent tools
 * Create multi-agent workflows for complex business processes
 * User-friendly for both technical and non-technical professionals
 * Ongoing development with continuous improvement of MCP support

**Learn more:**
 * MindPal MCP Documentation

### 
​
MooPoint
MooPoint MooPoint is a web-based AI chat platform built for developers and advanced users, letting you interact with multiple large language models (LLMs) through a single, unified interface. Connect your own API keys (OpenAI, Anthropic, and more) and securely manage custom MCP server integrations. **Key features:**
 * Accessible from any PC or smartphone—no installation required
 * Choose your preferred LLM provider
 * Supports `SSE`, `Streamable HTTP`, `npx`, and `uvx` MCP servers
 * OAuth and sampling support
 * New features added daily

### 
​
Mistral AI: Le Chat
Mistral AI: Le Chat is Mistral AI assistant with MCP support for remote servers and enterprise workflows. **Key features:**
 * Remote MCP server integration
 * Enterprise-grade security
 * Low-latency, high-throughput interactions with structured data

**Learn more:**
 * Mistral MCP Documentation

### 
​
Msty Studio
Msty Studio is a privacy-first AI productivity platform that seamlessly integrates local and online language models (LLMs) into customizable workflows. Designed for both technical and non-technical users, Msty Studio offers a suite of tools to enhance AI interactions, automate tasks, and maintain full control over data and model behavior. **Key features:**
 * **Toolbox & Toolsets**: Connect AI models to local tools and scripts using MCP-compliant configurations. Group tools into Toolsets to enable dynamic, multi-step workflows within conversations.
 * **Turnstiles** : Create automated, multi-step AI interactions, allowing for complex data processing and decision-making flows.
 * **Real-Time Data Integration** : Enhance AI responses with up-to-date information by integrating real-time web search capabilities.
 * **Split Chats & Branching**: Engage in parallel conversations with multiple models simultaneously, enabling comparative analysis and diverse perspectives.

**Learn more:**
 * Msty Studio Documentation

### 
​
Needle
Needle is a RAG worflow platform that also works as an MCP client, letting you connect and use MCP servers in seconds. **Key features:**
 * **Instant MCP integration:** Connect any remote MCP server to your collection in seconds
 * **Built-in RAG:** Automatically get retrieval-augmented generation out of the box
 * **Secure OAuth:** Safe, token-based authorization when connecting to servers
 * **Smart previews:** See what each MCP server can do and selectively enable the tools you need

**Learn more:**
 * Getting Started
 * Needle MCP Client

### 
​
NVIDIA Agent Intelligence (AIQ) toolkit
NVIDIA Agent Intelligence (AIQ) toolkit is a flexible, lightweight, and unifying library that allows you to easily connect existing enterprise agents to data sources and tools across any framework. **Key features:**
 * Acts as an MCP **client** to consume remote tools
 * Acts as an MCP **server** to expose tools
 * Framework agnostic and compatible with LangChain, CrewAI, Semantic Kernel, and custom agents
 * Includes built-in observability and evaluation tools

**Learn more:**
 * AIQ toolkit GitHub repository
 * AIQ toolkit MCP documentation

### 
​
OpenSumi
OpenSumi is a framework helps you quickly build AI Native IDE products. **Key features:**
 * Supports MCP tools in OpenSumi
 * Supports built-in IDE MCP servers and custom MCP servers

### 
​
oterm
oterm is a terminal client for Ollama allowing users to create chats/agents. **Key features:**
 * Support for multiple fully customizable chat sessions with Ollama connected with tools.
 * Support for MCP tools.

### 
​
Roo Code
Roo Code enables AI coding assistance via MCP. **Key features:**
 * Support for MCP tools and resources
 * Integration with development workflows
 * Extensible AI capabilities

### 
​
Postman
Postman is the most popular API client and now supports MCP server testing and debugging. **Key features:**
 * Full support of all major MCP features (tools, prompts, resources, and subscriptions)
 * Fast, seamless UI for debugging MCP capabilities
 * MCP config integration (Claude, VSCode, etc.) for fast first-time experience in testing MCPs
 * Integration with history, variables, and collections for reuse and collaboration

### 
​
RecurseChat
RecurseChat is a powerful, fast, local-first chat client with MCP support. RecurseChat supports multiple AI providers including LLaMA.cpp, Ollama, and OpenAI, Anthropic. **Key features:**
 * Local AI: Support MCP with Ollama models.
 * MCP Tools: Individual MCP server management. Easily visualize the connection states of MCP servers.
 * MCP Import: Import configuration from Claude Desktop app or JSON

**Learn more:**
 * RecurseChat docs

### 
​
Shortwave
Shortwave is an AI-powered email client that supports MCP tools to enhance email productivity and workflow automation. **Key features:**
 * MCP tool integration for enhanced email workflows
 * Rich UI for adding, managing and interacting with a wide range of MCP servers
 * Support for both remote (Streamable HTTP and SSE) and local (Stdio) MCP servers
 * AI assistance for managing your emails, calendar, tasks and other third-party services

### 
​
Simtheory
Simtheory is an agentic AI workspace that unifies multiple AI models, tools, and capabilities under a single subscription. It provides comprehensive MCP support through its MCP Store, allowing users to extend their workspace with productivity tools and integrations. **Key features:**
 * **MCP Store** : Marketplace for productivity tools and MCP server integrations
 * **Parallel Tasking** : Run multiple AI tasks simultaneously with MCP tool support
 * **Model Catalogue** : Access to frontier models with MCP tool integration
 * **Hosted MCP Servers** : Plug-and-play MCP integrations with no technical setup
 * **Advanced MCPs** : Specialized tools like Tripo3D (3D creation), Podcast Maker, and Video Maker
 * **Enterprise Ready** : Flexible workspaces with granular access control for MCP tools

**Learn more:**
 * Simtheory website

### 
​
Slack MCP Client
Slack MCP Client acts as a bridge between Slack and Model Context Protocol (MCP) servers. Using Slack as the interface, it enables large language models (LLMs) to connect and interact with various MCP servers through standardized MCP tools. **Key features:**
 * **Supports Popular LLM Providers:** Integrates seamlessly with leading large language model providers such as OpenAI, Anthropic, and Ollama, allowing users to leverage advanced conversational AI and orchestration capabilities within Slack.
 * **Dynamic and Secure Integration:** Supports dynamic registration of MCP tools, works in both channels and direct messages and manages credentials securely via environment variables or Kubernetes secrets.
 * **Easy Deployment and Extensibility:** Offers official Docker images, a Helm chart for Kubernetes, and Docker Compose for local development, making it simple to deploy, configure, and extend with additional MCP servers or tools.

### 
​
Smithery Playground
Smithery Playground is a developer-first MCP client for exploring, testing and debugging MCP servers against LLMs. It provides detailed traces of MCP RPCs to help troubleshoot implementation issues. **Key features:**
 * One-click connect to MCP servers via URL or from Smithery’s registry
 * Develop MCP servers that are running on localhost
 * Inspect tools, prompts, resources, and sampling configurations with live previews
 * Run conversational or raw tool calls to verify MCP behavior before shipping
 * Full OAuth MCP-spec support

### 
​
SpinAI
SpinAI is an open-source TypeScript framework for building observable AI agents. The framework provides native MCP compatibility, allowing agents to seamlessly integrate with MCP servers and tools. **Key features:**
 * Built-in MCP compatibility for AI agents
 * Open-source TypeScript framework
 * Observable agent architecture
 * Native support for MCP tools integration

### 
​
Superinterface
Superinterface is AI infrastructure and a developer platform to build in-app AI assistants with support for MCP, interactive components, client-side function calling and more. **Key features:**
 * Use tools from MCP servers in assistants embedded via React components or script tags
 * SSE transport support
 * Use any AI model from any AI provider (OpenAI, Anthropic, Ollama, others)

### 
​
Superjoin
Superjoin brings the power of MCP directly into Google Sheets extension. With Superjoin, users can access and invoke MCP tools and agents without leaving their spreadsheets, enabling powerful AI workflows and automation right where their data lives. **Key features:**
 * Native Google Sheets add-on providing effortless access to MCP capabilities
 * Supports OAuth 2.1 and header-based authentication for secure and flexible connections
 * Compatible with both SSE and Streamable HTTP transport for efficient, real-time streaming communication
 * Fully web-based, cross-platform client requiring no additional software installation

### 
​
Swarms
Swarms is a production-grade multi-agent orchestration framework that supports MCP integration for dynamic tool discovery and execution. **Key features:**
 * Connects to MCP servers via SSE transport for real-time tool integration
 * Automatic tool discovery and loading from MCP servers
 * Support for distributed tool functionality across multiple agents
 * Enterprise-ready with high availability and observability features
 * Modular architecture supporting multiple AI model providers

**Learn more:**
 * Swarms MCP Integration Documentation
 * GitHub Repository

### 
​
systemprompt
systemprompt is a voice-controlled mobile app that manages your MCP servers. Securely leverage MCP agents from your pocket. Available on iOS and Android. **Key features:**
 * **Native Mobile Experience** : Access and manage your MCP servers anytime, anywhere on both Android and iOS devices
 * **Advanced AI-Powered Voice Recognition** : Sophisticated voice recognition engine enhanced with cutting-edge AI and Natural Language Processing (NLP), specifically tuned to understand complex developer terminology and command structures
 * **Unified Multi-MCP Server Management** : Effortlessly manage and interact with multiple Model Context Protocol (MCP) servers from a single, centralized mobile application

### 
​
Tambo
Tambo is a platform for building custom chat experiences in React, with integrated custom user interface components. **Key features:**
 * Hosted platform with React SDK for integrating chat or other LLM-based experiences into your own app.
 * Support for selection of arbitrary React components in the chat experience, with state management and tool calling.
 * Support for MCP servers, from Tambo’s servers or directly from the browser.
 * Supports OAuth 2.1 and custom header-based authentication.
 * Support for MCP tools, with additional MCP features coming soon.

### 
​
Tencent CloudBase AI DevKit
Tencent CloudBase AI DevKit is a tool for building AI agents in minutes, featuring zero-code tools, secure data integration, and extensible plugins via MCP. **Key features:**
 * Support for MCP tools
 * Extend agents with MCP servers
 * MCP servers hosting: serverless hosting and authentication support

### 
​
TheiaAI/TheiaIDE
Theia AI is a framework for building AI-enhanced tools and IDEs. The AI-powered Theia IDE is an open and flexible development environment built on Theia AI. **Key features:**
 * **Tool Integration** : Theia AI enables AI agents, including those in the Theia IDE, to utilize MCP servers for seamless tool interaction.
 * **Customizable Prompts** : The Theia IDE allows users to define and adapt prompts, dynamically integrating MCP servers for tailored workflows.
 * **Custom agents** : The Theia IDE supports creating custom agents that leverage MCP capabilities, enabling users to design dedicated workflows on the fly.

Theia AI and Theia IDE’s MCP integration provide users with flexibility, making them powerful platforms for exploring and adapting MCP. **Learn more:**
 * Theia IDE and Theia AI MCP Announcement
 * Download the AI-powered Theia IDE

### 
​
Tome
Tome is an open source cross-platform desktop app designed for working with local LLMs and MCP servers. It is designed to be beginner friendly and abstract away the nitty gritty of configuration for people getting started with MCP. **Key features:**
 * MCP servers are managed by Tome so there is no need to install uv or npm or configure JSON
 * Users can quickly add or remove MCP servers via UI
 * Any tool-supported local model on Ollama is compatible

### 
​
TypingMind App
TypingMind is an advanced frontend for LLMs with MCP support. TypingMind supports all popular LLM providers like OpenAI, Gemini, Claude, and users can use with their own API keys. **Key features:**
 * **MCP Tool Integration** : Once MCP is configured, MCP tools will show up as plugins that can be enabled/disabled easily via the main app interface.
 * **Assign MCP Tools to Agents** : TypingMind allows users to create AI agents that have a set of MCP servers assigned.
 * **Remote MCP servers** : Allows users to customize where to run the MCP servers via its MCP Connector configuration, allowing the use of MCP tools across multiple devices (laptop, mobile devices, etc.) or control MCP servers from a remote private server.

**Learn more:**
 * TypingMind MCP Document
 * Download TypingMind (PWA)

### 
​
VS Code GitHub Copilot
VS Code integrates MCP with GitHub Copilot through agent mode, allowing direct interaction with MCP-provided tools within your agentic coding workflow. Configure servers in Claude Desktop, workspace or user settings, with guided MCP installation and secure handling of keys in input variables to avoid leaking hard-coded keys. **Key features:**
 * Support for stdio and server-sent events (SSE) transport
 * Per-session selection of tools per agent session for optimal performance
 * Easy server debugging with restart commands and output logging
 * Tool calls with editable inputs and always-allow toggle
 * Integration with existing VS Code extension system to register MCP servers from extensions

### 
​
Warp
Warp is the intelligent terminal with AI and your dev team’s knowledge built-in. With natural language capabilities integrated directly into an agentic command line, Warp enables developers to code, automate, and collaborate more efficiently — all within a terminal that features a modern UX. **Key features:**
 * **Agent Mode with MCP support** : invoke tools and access data from MCP servers using natural language prompts
 * **Flexible server management** : add and manage CLI or SSE-based MCP servers via Warp’s built-in UI
 * **Live tool/resource discovery** : view tools and resources from each running MCP server
 * **Configurable startup** : set MCP servers to start automatically with Warp or launch them manually as needed

### 
​
WhatsMCP
WhatsMCP is an MCP client for WhatsApp. WhatsMCP lets you interact with your AI stack from the comfort of a WhatsApp chat. **Key features:**
 * Supports MCP tools
 * SSE transport, full OAuth2 support
 * Chat flow management for WhatsApp messages
 * One click setup for connecting to your MCP servers
 * In chat management of MCP servers
 * Oauth flow natively supported in WhatsApp

### 
​
Windsurf Editor
Windsurf Editor is an agentic IDE that combines AI assistance with developer workflows. It features an innovative AI Flow system that enables both collaborative and independent AI interactions while maintaining developer control. **Key features:**
 * Revolutionary AI Flow paradigm for human-AI collaboration
 * Intelligent code generation and understanding
 * Rich development tools with multi-model support

### 
​
Witsy
Witsy is an AI desktop assistant, supporting Anthropic models and MCP servers as LLM tools. **Key features:**
 * Multiple MCP servers support
 * Tool integration for executing commands and scripts
 * Local server connections for enhanced privacy and security
 * Easy-install from Smithery.ai
 * Open-source, available for macOS, Windows and Linux

### 
​
Zed
Zed is a high-performance code editor with built-in MCP support, focusing on prompt templates and tool integration. **Key features:**
 * Prompt templates surface as slash commands in the editor
 * Tool integration for enhanced coding workflows
 * Tight integration with editor features and workspace context
 * Does not support MCP resources

### 
​
Zencoder
Zencoder is a coding agent that’s available as an extension for VS Code and JetBrains family of IDEs, meeting developers where they already work. It comes with RepoGrokking (deep contextual codebase understanding), agentic pipeline, and the ability to create and share custom agents. **Key features:**
 * RepoGrokking - deep contextual understanding of codebases
 * Agentic pipeline - runs, tests, and executes code before outputting it
 * Zen Agents platform - ability to build and create custom agents and share with the team
 * Integrated MCP tool library with one-click installations
 * Specialized agents for Unit and E2E Testing

**Learn more:**
 * Zencoder Documentation

## 
​
Adding MCP support to your application
If you’ve added MCP support to your application, we encourage you to submit a pull request to add it to this list. MCP integration can provide your users with powerful contextual AI capabilities and make your application part of the growing MCP ecosystem. Benefits of adding MCP support:
 * Enable users to bring their own context and tools
 * Join a growing ecosystem of interoperable AI applications
 * Provide users with flexible integration options
 * Support local-first AI workflows

To get started with implementing MCP in your application, check out our Python or TypeScript SDK Documentation
## 
​
Updates and corrections
This list is maintained by the community. If you notice any inaccuracies or would like to update information about MCP support in your application, please submit a pull request or open an issue in our documentation repository.
Was this page helpful?
YesNo
RoadmapExample Servers
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# SDKs - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/sdk

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.137126

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Develop with MCP
SDKs
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * Available SDKs
 * Getting Started
 * Next Steps

Develop with MCP
# SDKs
Copy page
Official SDKs for building with Model Context Protocol
Copy page
Build MCP servers and clients using our official SDKs. All SDKs provide the same core functionality and full protocol support.
## 
​
Available SDKs
## TypeScript## Python## Go## Kotlin## Swift## Java## C### Ruby## Rust## PHP
## 
​
Getting Started
Each SDK provides the same functionality but follows the idioms and best practices of its language. All SDKs support:
 * Creating MCP servers that expose tools, resources, and prompts
 * Building MCP clients that can connect to any MCP server
 * Local and remote transport protocols
 * Protocol compliance with type safety

Visit the SDK page for your chosen language to find installation instructions, documentation, and examples.
## 
​
Next Steps
Ready to start building with MCP? Choose your path:
## Build a Server Learn how to create your first MCP server ## Build a Client Create applications that connect to MCP servers 
Was this page helpful?
YesNo
Build an MCP clientUnderstanding Authorization in MCP
⌘I
github


---

# MCP Prompts: Building Workflow Automation | mcp blog

## URL
http://blog.modelcontextprotocol.io/posts/2025-07-29-prompts-for-automation

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.137587

## Content
mcp blog")
 * Documentation 
 * GitHub 

Home » Posts
# MCP Prompts: Building Workflow Automation
August 4, 2025 · 8 min · Inna Harper (Core Maintainer)
MCP (Model Context Protocol) prompts enable workflow automation by combining AI capabilities with structured data access. This post demonstrates how to build automations using MCP’s prompts and resource templates through a practical example.
This guide demonstrates how MCP prompts can automate repetitive workflows. Whether you’re interested in the MCP ecosystem or simply want to leverage AI for workflow automation, you’ll learn how to build practical automations through a concrete meal planning example. No prior MCP experience needed—we’ll cover the fundamentals before diving into implementation.
## The Problem: Time-Consuming Repetitive Tasks#
Everyone has a collection of repetitive tasks that eat away at their productive hours. Common examples include applying code review feedback, generating weekly reports, updating documentation, or creating boilerplate code. These tasks aren’t complex—they follow predictable patterns—but they’re cumbersome and time-consuming. MCP prompts were designed to help automate this kind of work.
MCP prompts offer more than command shortcuts. They’re a primitive for building workflow automation that combines the flexibility of scripting with the intelligence of modern AI systems. This post explores how to build automations using MCP’s prompt system, resource templates, and modular servers. I’ll demonstrate these concepts through a meal planning automation I built, but the patterns apply broadly to any structured, repetitive workflow.
## Example: Automating Weekly Meal Planning#
I needed to solve a recurring problem: planning weekly meals by cuisine to manage ingredients efficiently. The manual process involved selecting a cuisine, choosing dishes, listing ingredients, shopping, and organizing recipes—repetitive steps that took significant time each week.
So I decided to use MCP! By automating these steps, I could reduce the entire workflow to selecting a cuisine and receiving a complete meal plan with shopping list. (Any client that supports MCP prompts should work!)
 1. **Select a prompt**
!MCP prompts list showing available automation commands
 2. **Select a cuisine from a dropdown** !Dropdown showing cuisine suggestions as user types
 3. **Done!** The system generates a meal plan, shopping list, and even prints the shopping list and recipes.

!Final generated meal plan and shopping list output
Here we are focuses primarily on the Recipe Server with its prompts and resources. You can find the printing server example here (it works with a specific thermal printer model, but you could easily swap it for email, Notion, or any other output method). The beauty of separate servers is that you can mix and match different capabilities.
## Core Components#
Let’s dive into the three components that make this automation possible: prompts, resources, and completions. I’ll show you how each works conceptually, then we’ll implement them together.
### 1. Resource Templates#
In MCP, static resources represent specific pieces of content with unique URIs—like `file://recipes/italian.md` or `file://recipes/mexican.md`. While straightforward, this approach doesn’t scale well. If you have recipes for 20 cuisines, you’d need to define 20 separate resources, each with its own URI and metadata.
Resource templates solve this through URI patterns with parameters, transforming static resource definitions into dynamic content providers.
For example, a template like `file://recipes/{cuisine}.md` might represent a set of resources like these:
 * `file://recipes/italian.md` returns Italian recipes
 * `file://recipes/mexican.md` returns Mexican recipes

This pattern extends beyond simple filtering. You can create templates for:
 * Hierarchical data: `file://docs/{category}/{topic}`
 * Git repository content: `git://repo/{branch}/path/{file}`
 * Web resources: `https://api.example.com/users/{userId}/data`
 * Query parameters: `https://example.com/{collection}?type={filter}`

For more details on URI schemes and resource templates, see the MCP Resource specification.
### 2. Completions#
Nobody remembers exact parameter values. Is it “italian” or “Italian” or “it”? Completions bridge this gap by providing suggestions as users type, creating an interface that feels intuitive rather than restrictive.
Different MCP clients present completions differently:
 * VS Code shows a filterable dropdown
 * Command-line tools might use fuzzy matching
 * Web interfaces could provide rich previews

But the underlying data comes from your server, maintaining consistency across all clients.
### 3. Prompts: Commands That Evolve With Context#
Prompts are the entry points to your automation. They define what commands are available and can range from simple text instructions to rich, context-aware operations.
Let’s see how prompts can evolve to handle increasingly sophisticated use cases:
**Basic prompt: Static instruction**
```
"Create a meal plan for a week"

```
copy
This works, but it’s generic. The AI will create a meal plan based on general knowledge.
**Adding parameters: Dynamic customization**
```
"Create a meal plan for a week using {cuisine} cuisine"

```
copy
Now users can specify Italian, Mexican, or any other cuisine. The prompt adapts to user input, but still relies on the AI’s general knowledge about these cuisines.
**Including resources: Your data**
Prompts can include resources to add context data beyond simple text instructions. This is crucial when you need the AI to work with your specific context rather than general knowledge.
In my meal planning example, I don’t want generic recipes—I want the AI to use **my** collection of tested recipes that I know I like. Complex prompts make this possible by bundling prompt text with embedded resources.
Here’s how it works:
 1. **User selects a prompt** with parameters (e.g., “plan-meals” with cuisine=“italian”)
 2. **Server returns** both instructional text AND resource references
 3. **Client decides how to handle resources** - Applications might choose to select a subset of data using embeddings or keyword search, or pass the raw data directly to the model
 4. **AI receives the context** and generates a response

In my example, VS Code attached the entire resource to the prompt, which worked great for this use case. The AI had access to all my Italian recipes when planning an Italian week, ensuring it only suggested dishes I actually had recipes for.
The key difference from simple prompts: instead of asking “Plan Italian meals” and getting generic suggestions, the AI works with your actual recipe collection, dietary preferences, and constraints.
!VS Code showing the rendered prompt with attached recipe resources
The recipe resources we’ve been using are **embedded resources** that have inline content from the server. According to the MCP specification, prompts can also include other data types.
This enables advanced use cases beyond our text-based recipes, like design review prompts with screenshots or voice transcription services.
## Building the Recipe Server#
Let’s implement a complete MCP server that brings together all the concepts we’ve discussed. We’ll start with the server setup and then implement each capability.
### Prerequisites#
Before diving into the code, make sure you have:
 1. **Node.js** (v18 or higher) and npm installed
 2. **MCP SDK** installed:
```
npm install @modelcontextprotocol/sdk

```
copy
 3. **An MCP-compatible client with prompt and resource support** ,like VS Code with the MCP extension

For this tutorial, I’ll use the TypeScript SDK, but MCP also supports Python and other languages.
### Server Setup and Capabilities#
First, let’s create our MCP server:
```
const server = new McpServer({
  name: "favorite-recipes",
  version: "1.0.0",
});
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

```
copy
### Implementing Resources#
Next, let’s register a resource template with completions.
```
server.registerResource(
  "recipes",
  new ResourceTemplate("file://recipes/{cuisine}", {
    list: undefined,
    complete: {
      cuisine: (value) => {
        return CUISINES.filter((cuisine) => cuisine.startsWith(value));
      },
    },
  }),
  {
    title: "Cuisine-Specific Recipes",
    description: "Traditional recipes organized by cuisine",
  },
  async (uri, variables, _extra) => {
    const cuisine = variables.cuisine as string;
    if (!CUISINES.includes(cuisine)) {
      throw new Error(`Unknown cuisine: ${cuisine}`);
    }
    const content = formatRecipesAsMarkdown(cuisine);
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  },
);

```
copy
### Implementing Prompts#
Finally, let’s register the prompt, which also has completions:
```
server.registerPrompt(
  "weekly-meal-planner",
  {
    title: "Weekly Meal Planner",
    description:
      "Create a weekly meal plan and grocery shopping list from cuisine-specific recipes",
    argsSchema: {
      cuisine: completable(z.string(), (value) => {
        return CUISINES.filter((cuisine) => cuisine.startsWith(value));
      }),
    },
  },
  async ({ cuisine }) => {
    const resourceUri = `file://recipes/${cuisine}`;
    const recipeContent = formatRecipesAsMarkdown(cuisine);
    return {
      title: `Weekly Meal Planner - ${cuisine} Cuisine`,
      description: `Weekly meal planner for ${cuisine} cuisine`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Plan cooking for the week. I've attached the recipes from ${cuisine} cuisine.
Please create:
1. A 7-day meal plan using these recipes
2. An optimized grocery shopping list that minimizes waste by reusing ingredients across multiple recipes
3. Daily meal schedule with specific dishes for breakfast, lunch, and dinner
4. Preparation tips to make the week more efficient
5. Print Shopping list
Focus on ingredient overlap between recipes to reduce food waste.`,
          },
        },
        {
          role: "user",
          content: {
            type: "resource",
            resource: {
              uri: resourceUri,
              mimeType: "text/markdown",
              text: recipeContent,
            },
          },
        },
      ],
    };
  },
);

```
copy
## Running It Yourself#
The full code for the recipe server is available here.
Follow VS Code’s documentation to set up the server. Once a server is set up in VS Code, you can see its status, debug what’s happening, and iterate quickly on your automations.
After the server is set up in VS Code, type “/” in chat and select the prompt.
!MCP prompts list showing available automation commands
## Extending Your Automations#
MCP prompts open up exciting automation possibilities:
 * **Prompt Chains** : Execute multiple prompts in sequence (plan meals → generate shopping list → place grocery order)
 * **Dynamic Prompts** : Adapt based on available resources or time of year
 * **Cross-Server Workflows** : Coordinate multiple MCP servers for complex automations
 * **External Triggers** : Activate prompts via webhooks or schedules

The patterns demonstrated in meal planning apply to many domains:
 * Documentation generation that knows your codebase
 * Report creation with access to your data sources
 * Development workflows that understand your project structure
 * Customer support automations with full context

**Key takeaways:**
 * MCP prompts can include dynamic resources, giving AI full context for tasks
 * Resource templates enable scalable content serving without duplication
 * Modular server architecture lets you mix and match capabilities

## Wrapping Up#
This meal planning automation started as a simple desire to avoid rewriting shopping lists every week. It evolved into a complete system that handles meal planning, shopping lists, and recipe printing with just a few clicks.
MCP prompts provide practical tools to automate repetitive tasks. The modular architecture means you can start small—perhaps just automating one part of your workflow—and expand as needed. Whether you’re automating documentation, reports, or meal planning, the patterns remain the same: identify repetitive tasks, build focused automations, and let the system handle the tedious parts.
 * Automation
 * Mcp
 * Prompts
 * Tutorial

« Prev 
Evolving OAuth Client Registration in the Model Context Protocol Next » 
Building to Last: A New Governance Model for MCP© 2025 mcp blog · Powered by Hugo & PaperMod[](http://blog.modelcontextprotocol.io/posts/2025-07-29-prompts-for-automation/#top "Go to Top \(Alt + G\)")


---

# Roadmap - Model Context Protocol

## URL
https://modelcontextprotocol.io/development/roadmap

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.137723

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Roadmap
Roadmap
DocumentationSpecificationCommunityAbout MCP
 * Contributor Communication

##### Governance
 * Governance and Stewardship
 * SEP Guidelines
 * Working and Interest Groups
 * Antitrust Policy

##### Roadmap
 * Roadmap

##### Examples
 * Example Clients
 * Example Servers

On this page
 * Agents
 * Authentication and Security
 * Validation
 * Registry
 * Multimodality
 * Get Involved

Roadmap
# Roadmap
Copy page
Our plans for evolving Model Context Protocol
Copy page
Last updated: **2025-07-22**
The Model Context Protocol is rapidly evolving. This page outlines our current thinking on key priorities and direction for approximately **the next six months** , though these may change significantly as the project develops. To see what’s changed recently, check out the **specification changelog**.
The ideas presented here are not commitments—we may solve these challenges differently than described, or some may not materialize at all. This is also not an _exhaustive_ list; we may incorporate work that isn’t mentioned here.
We value community participation! Each section links to relevant discussions where you can learn more and contribute your thoughts. For a technical view of our standardization process, visit the Standards Track on GitHub, which tracks how proposals progress toward inclusion in the official MCP specification.
## 
​
Agents
As MCP increasingly becomes part of agentic workflows, we’re focusing on key improvements:
 * **Asynchronous Operations** : supporting long-running operations that may take extended periods, with resilient handling of disconnections and reconnections

## 
​
Authentication and Security
We’re evolving our authorization and security resources to improve user safety and provide a better developer experience:
 * **Guides and Best Practices** : documenting specifics about deploying MCP securely in the form of guides and best practices to help developers avoid common pitfalls.
 * **Alternatives to Dynamic Client Registration (DCR)** : exploring alternatives to DCR, attempting to address operational challenges while preserving a smooth user experience.
 * **Fine-grained Authorization** : developing mechanisms and guidelines for primitive authorization for sensitive actions
 * **Enterprise Managed Authorization** : adding the capability for enterprises to simplify MCP server authorization with the help of Single Sign-On (SSO)
 * **Secure Authorization Elicitation** : enable developers to integrate secure authorization flows for downstream APIs outside the main MCP server authorization

## 
​
Validation
To foster a robust developer ecosystem, we plan to invest in:
 * **Reference Client Implementations** : demonstrating protocol features with high-quality AI applications
 * **Reference Server Implementation** : showcasing authentication patterns and remote deployment best practices
 * **Compliance Test Suites** : automated verification that clients, servers, and SDKs properly implement the specification

These tools will help developers confidently implement MCP while ensuring consistent behavior across the ecosystem.
## 
​
Registry
For MCP to reach its full potential, we need streamlined ways to distribute and discover MCP servers. We plan to develop an **MCP Registry** that will enable centralized server discovery and metadata. This registry will primarily function as an API layer that third-party marketplaces and discovery services can build upon.
## 
​
Multimodality
Supporting the full spectrum of AI capabilities in MCP, including:
 * **Additional Modalities** : video and other media types
 * **Streaming** : multipart, chunked messages, and bidirectional communication for interactive experiences

## 
​
Get Involved
We welcome your contributions to MCP’s future! Join our GitHub Discussions to share ideas, provide feedback, or participate in the development process.
Was this page helpful?
YesNo
Antitrust PolicyExample Clients
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Connect to local MCP servers - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/develop/connect-local-servers

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.137946

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Develop with MCP
Connect to local MCP servers
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * Prerequisites
 * Claude Desktop
 * Node.js
 * Understanding MCP Servers
 * Installing the Filesystem Server
 * Using the Filesystem Server
 * File Management Examples
 * How Approval Works
 * Troubleshooting
 * Next Steps

Develop with MCP
# Connect to local MCP servers
Copy page
Learn how to extend Claude Desktop with local MCP servers to enable file system access and other powerful integrations
Copy page
Model Context Protocol (MCP) servers extend AI applications’ capabilities by providing secure, controlled access to local resources and tools. Many clients support MCP, enabling diverse integration possibilities across different platforms and applications. This guide demonstrates how to connect to local MCP servers using Claude Desktop as an example, one of the many clients that support MCP. While we focus on Claude Desktop’s implementation, the concepts apply broadly to other MCP-compatible clients. By the end of this tutorial, Claude will be able to interact with files on your computer, create new documents, organize folders, and search through your file system—all with your explicit permission for each action.
!Claude Desktop with filesystem integration showing file management capabilities
## 
​
Prerequisites
Before starting this tutorial, ensure you have the following installed on your system:
### 
​
Claude Desktop
Download and install Claude Desktop for your operating system. Claude Desktop is available for macOS and Windows. If you already have Claude Desktop installed, verify you’re running the latest version by clicking the Claude menu and selecting “Check for Updates…”
### 
​
Node.js
The Filesystem Server and many other MCP servers require Node.js to run. Verify your Node.js installation by opening a terminal or command prompt and running:
Copy
```
node --version

```

If Node.js is not installed, download it from nodejs.org. We recommend the LTS (Long Term Support) version for stability.
## 
​
Understanding MCP Servers
MCP servers are programs that run on your computer and provide specific capabilities to Claude Desktop through a standardized protocol. Each server exposes tools that Claude can use to perform actions, with your approval. The Filesystem Server we’ll install provides tools for:
 * Reading file contents and directory structures
 * Creating new files and directories
 * Moving and renaming files
 * Searching for files by name or content

All actions require your explicit approval before execution, ensuring you maintain full control over what Claude can access and modify.
## 
​
Installing the Filesystem Server
The process involves configuring Claude Desktop to automatically start the Filesystem Server whenever you launch the application. This configuration is done through a JSON file that tells Claude Desktop which servers to run and how to connect to them.
1
Open Claude Desktop Settings
Start by accessing the Claude Desktop settings. Click on the Claude menu in your system’s menu bar (not the settings within the Claude window itself) and select “Settings…”On macOS, this appears in the top menu bar:
!Claude Desktop menu showing Settings option
This opens the Claude Desktop configuration window, which is separate from your Claude account settings.
2
Access Developer Settings
In the Settings window, navigate to the “Developer” tab in the left sidebar. This section contains options for configuring MCP servers and other developer features.Click the “Edit Config” button to open the configuration file:
!Developer settings showing Edit Config button
This action creates a new configuration file if one doesn’t exist, or opens your existing configuration. The file is located at:
 * **macOS** : `~/Library/Application Support/Claude/claude_desktop_config.json`
 * **Windows** : `%APPDATA%\Claude\claude_desktop_config.json`

3
Configure the Filesystem Server
Replace the contents of the configuration file with the following JSON structure. This configuration tells Claude Desktop to start the Filesystem Server with access to specific directories:
macOS
Windows
Copy
```
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/Users/username/Downloads"
      ]
    }
  }
}

```

Replace `username` with your actual computer username. The paths listed in the `args` array specify which directories the Filesystem Server can access. You can modify these paths or add additional directories as needed.
**Understanding the Configuration**
 * `"filesystem"`: A friendly name for the server that appears in Claude Desktop
 * `"command": "npx"`: Uses Node.js’s npx tool to run the server
 * `"-y"`: Automatically confirms the installation of the server package
 * `"@modelcontextprotocol/server-filesystem"`: The package name of the Filesystem Server
 * The remaining arguments: Directories the server is allowed to access

**Security Consideration** Only grant access to directories you’re comfortable with Claude reading and modifying. The server runs with your user account permissions, so it can perform any file operations you can perform manually.
4
Restart Claude Desktop
After saving the configuration file, completely quit Claude Desktop and restart it. The application needs to restart to load the new configuration and start the MCP server.Upon successful restart, you’ll see an MCP server indicator in the bottom-right corner of the conversation input box:
!Claude Desktop interface showing MCP server indicator
Click on this indicator to view the available tools provided by the Filesystem Server:
!Available filesystem tools in Claude Desktop
If the server indicator doesn’t appear, refer to the Troubleshooting section for debugging steps.
## 
​
Using the Filesystem Server
With the Filesystem Server connected, Claude can now interact with your file system. Try these example requests to explore the capabilities:
### 
​
File Management Examples
 * **“Can you write a poem and save it to my desktop?”** - Claude will compose a poem and create a new text file on your desktop
 * **“What work-related files are in my downloads folder?”** - Claude will scan your downloads and identify work-related documents
 * **“Please organize all images on my desktop into a new folder called ‘Images’”** - Claude will create a folder and move image files into it

### 
​
How Approval Works
Before executing any file system operation, Claude will request your approval. This ensures you maintain control over all actions:
!Claude requesting approval to perform a file operation
Review each request carefully before approving. You can always deny a request if you’re not comfortable with the proposed action.
## 
​
Troubleshooting
If you encounter issues setting up or using the Filesystem Server, these solutions address common problems:
Server not showing up in Claude / hammer icon missing
 1. Restart Claude Desktop completely
 2. Check your `claude_desktop_config.json` file syntax
 3. Make sure the file paths included in `claude_desktop_config.json` are valid and that they are absolute and not relative
 4. Look at logs to see why the server is not connecting
 5. In your command line, try manually running the server (replacing `username` as you did in `claude_desktop_config.json`) to see if you get any errors:

macOS/Linux
Windows
Copy
```
npx -y @modelcontextprotocol/server-filesystem /Users/username/Desktop /Users/username/Downloads

```

Getting logs from Claude Desktop
Claude.app logging related to MCP is written to log files in:
 * macOS: `~/Library/Logs/Claude`
 * Windows: `%APPDATA%\Claude\logs`
 * `mcp.log` will contain general logging about MCP connections and connection failures.
 * Files named `mcp-server-SERVERNAME.log` will contain error (stderr) logging from the named server.

You can run the following command to list recent logs and follow along with any new ones (on Windows, it will only show recent logs):
macOS/Linux
Windows
Copy
```
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log

```

Tool calls failing silently
If Claude attempts to use the tools but they fail:
 1. Check Claude’s logs for errors
 2. Verify your server builds and runs without errors
 3. Try restarting Claude Desktop

None of this is working. What do I do?
Please refer to our debugging guide for better debugging tools and more detailed guidance.
ENOENT error and `${APPDATA}` in paths on Windows
If your configured server fails to load, and you see within its logs an error referring to `${APPDATA}` within a path, you may need to add the expanded value of `%APPDATA%` to your `env` key in `claude_desktop_config.json`:
Copy
```
{
  "brave-search": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"],
    "env": {
      "APPDATA": "C:\\Users\\user\\AppData\\Roaming\\",
      "BRAVE_API_KEY": "..."
    }
  }
}

```

With this change in place, launch Claude Desktop once again.
**NPM should be installed globally** The `npx` command may continue to fail if you have not installed NPM globally. If NPM is already installed globally, you will find `%APPDATA%\npm` exists on your system. If not, you can install NPM globally by running the following command:
Copy
```
npm install -g npm

```

## 
​
Next Steps
Now that you’ve successfully connected Claude Desktop to a local MCP server, explore these options to expand your setup:
## Explore other servers Browse our collection of official and community-created MCP servers for additional capabilities ## Build your own server Create custom MCP servers tailored to your specific workflows and integrations ## Connect to remote servers Learn how to connect Claude to remote MCP servers for cloud-based tools and services ## Understand the protocol Dive deeper into how MCP works and its architecture 
Was this page helpful?
YesNo
VersioningConnect to remote MCP Servers
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.
!Claude Desktop with filesystem integration showing file management capabilities
!Claude Desktop menu showing Settings option
!Developer settings showing Edit Config button
!Claude Desktop interface showing MCP server indicator
!Available filesystem tools in Claude Desktop
!Claude requesting approval to perform a file operation


---

# Understanding MCP clients - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/learn/client-concepts

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.138191

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
About MCP
Understanding MCP clients
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * Core Client Features
 * Elicitation
 * Overview
 * Example: Holiday Booking Approval
 * User Interaction Model
 * Roots
 * Overview
 * Example: Travel Planning Workspace
 * Design Philosophy
 * User Interaction Model
 * Sampling
 * Overview
 * Example: Flight Analysis Tool
 * User Interaction Model

About MCP
# Understanding MCP clients
Copy page
Copy page
MCP clients are instantiated by host applications to communicate with particular MCP servers. The host application, like Claude.ai or an IDE, manages the overall user experience and coordinates multiple clients. Each client handles one direct communication with one server. Understanding the distinction is important: the _host_ is the application users interact with, while _clients_ are the protocol-level components that enable server connections.
## 
​
Core Client Features
In addition to making use of context provided by servers, clients may provide several features to servers. These client features allow server authors to build richer interactions. Feature | Explanation | Example 
---|---|--- 
**Sampling** | Sampling allows servers to request LLM completions through the client, enabling an agentic workflow. This approach puts the client in complete control of user permissions and security measures. | A server for booking travel may send a list of flights to an LLM and request that the LLM pick the best flight for the user. 
**Roots** | Roots allow clients to specify which directories servers should focus on, communicating intended scope through a coordination mechanism. | A server for booking travel may be given access to a specific directory, from which it can read a user’s calendar. 
**Elicitation** | Elicitation enables servers to request specific information from users during interactions, providing a structured way for servers to gather information on demand. | A server booking travel may ask for the user’s preferences on airplane seats, room type or their contact number to finalise a booking. 
### 
​
Elicitation
Elicitation enables servers to request specific information from users during interactions, creating more dynamic and responsive workflows.
#### 
​
Overview
Elicitation provides a structured way for servers to gather necessary information on demand. Instead of requiring all information up front or failing when data is missing, servers can pause their operations to request specific inputs from users. This creates more flexible interactions where servers adapt to user needs rather than following rigid patterns. **Elicitation flow:**
ServerClientUserServerClientUserServer initiates elicitationHuman interactionComplete requestContinue processing with new informationelicitation/createPresent elicitation UIProvide requested informationReturn user response
The flow enables dynamic information gathering. Servers can request specific data when needed, users provide information through appropriate UI, and servers continue processing with the newly acquired context. **Elicitation components example:**
Copy
```
{
  method: "elicitation/requestInput",
  params: {
    message: "Please confirm your Barcelona vacation booking details:",
    schema: {
      type: "object",
      properties: {
        confirmBooking: {
          type: "boolean",
          description: "Confirm the booking (Flights + Hotel = $3,000)"
        },
        seatPreference: {
          type: "string",
          enum: ["window", "aisle", "no preference"],
          description: "Preferred seat type for flights"
        },
        roomType: {
          type: "string",
          enum: ["sea view", "city view", "garden view"],
          description: "Preferred room type at hotel"
        },
        travelInsurance: {
          type: "boolean",
          default: false,
          description: "Add travel insurance ($150)"
        }
      },
      required: ["confirmBooking"]
    }
  }
}

```

#### 
​
Example: Holiday Booking Approval
A travel booking server demonstrates elicitation’s power through the final booking confirmation process. When a user has selected their ideal vacation package to Barcelona, the server needs to gather final approval and any missing details before proceeding. The server elicits booking confirmation with a structured request that includes the trip summary (Barcelona flights June 15-22, beachfront hotel, total $3,000) and fields for any additional preferences—such as seat selection, room type, or travel insurance options. As the booking progresses, the server elicits contact information needed to complete the reservation. It might ask for traveler details for flight bookings, special requests for the hotel, or emergency contact information.
#### 
​
User Interaction Model
Elicitation interactions are designed to be clear, contextual, and respectful of user autonomy: **Request presentation** : Clients display elicitation requests with clear context about which server is asking, why the information is needed, and how it will be used. The request message explains the purpose while the schema provides structure and validation. **Response options** : Users can provide the requested information through appropriate UI controls (text fields, dropdowns, checkboxes), decline to provide information with optional explanation, or cancel the entire operation. Clients validate responses against the provided schema before returning them to servers. **Privacy considerations** : Elicitation never requests passwords or API keys. Clients warn about suspicious requests and let users review data before sending.
### 
​
Roots
Roots define filesystem boundaries for server operations, allowing clients to specify which directories servers should focus on.
#### 
​
Overview
Roots are a mechanism for clients to communicate filesystem access boundaries to servers. They consist of file URIs that indicate directories where servers can operate, helping servers understand the scope of available files and folders. While roots communicate intended boundaries, they do not enforce security restrictions. Actual security must be enforced at the operating system level, via file permissions and/or sandboxing. **Root structure:**
Copy
```
{
  "uri": "file:///Users/agent/travel-planning",
  "name": "Travel Planning Workspace"
}

```

Roots are exclusively filesystem paths and always use the `file://` URI scheme. They help servers understand project boundaries, workspace organization, and accessible directories. The roots list can be updated dynamically as users work with different projects or folders, with servers receiving notifications through `roots/list_changed` when boundaries change.
#### 
​
Example: Travel Planning Workspace
A travel agent working with multiple client trips benefits from roots to organize filesystem access. Consider a workspace with different directories for various aspects of travel planning. The client provides filesystem roots to the travel planning server:
 * `file:///Users/agent/travel-planning` - Main workspace containing all travel files
 * `file:///Users/agent/travel-templates` - Reusable itinerary templates and resources
 * `file:///Users/agent/client-documents` - Client passports and travel documents

When the agent creates a Barcelona itinerary, well-behaved servers respect these boundaries—accessing templates, saving the new itinerary, and referencing client documents within the specified roots. Servers typically access files within roots by using relative paths from the root directories or by utilizing file search tools that respect the root boundaries. If the agent opens an archive folder like `file:///Users/agent/archive/2023-trips`, the client updates the roots list via `roots/list_changed`. For a complete implementation of a server that respects roots, see the filesystem server in the official servers repository.
#### 
​
Design Philosophy
Roots serve as a coordination mechanism between clients and servers, not a security boundary. The specification requires that servers “SHOULD respect root boundaries,” and not that they “MUST enforce” them, because servers run code the client cannot control. Roots work best when servers are trusted or vetted, users understand their advisory nature, and the goal is preventing accidents rather than stopping malicious behavior. They excel at context scoping (telling servers where to focus), accident prevention (helping well-behaved servers stay in bounds), and workflow organization (such as managing project boundaries automatically).
#### 
​
User Interaction Model
Roots are typically managed automatically by host applications based on user actions, though some applications may expose manual root management: **Automatic root detection** : When users open folders, clients automatically expose them as roots. Opening a travel workspace allows the client to expose that directory as a root, helping servers understand which itineraries and documents are in scope for the current work. **Manual root configuration** : Advanced users can specify roots through configuration. For example, adding `/travel-templates` for reusable resources while excluding directories with financial records.
### 
​
Sampling
Sampling allows servers to request language model completions through the client, enabling agentic behaviors while maintaining security and user control.
#### 
​
Overview
Sampling enables servers to perform AI-dependent tasks without directly integrating with or paying for AI models. Instead, servers can request that the client—which already has AI model access—handle these tasks on their behalf. This approach puts the client in complete control of user permissions and security measures. Because sampling requests occur within the context of other operations—like a tool analyzing data—and are processed as separate model calls, they maintain clear boundaries between different contexts, allowing for more efficient use of the context window. **Sampling flow:**
ServerClientUserLLMServerClientUserLLMServer initiates samplingHuman-in-the-loop reviewModel interactionResponse reviewComplete requestsampling/createMessagePresent request for approvalReview and approve/modifyForward approved requestReturn generationPresent response for approvalReview and approve/modifyReturn approved response
The flow ensures security through multiple human-in-the-loop checkpoints. Users review and can modify both the initial request and the generated response before it returns to the server. **Request parameters example:**
Copy
```
{
  messages: [
    {
      role: "user",
      content: "Analyze these flight options and recommend the best choice:\n" +
               "[47 flights with prices, times, airlines, and layovers]\n" +
               "User preferences: morning departure, max 1 layover"
    }
  ],
  modelPreferences: {
    hints: [{
      name: "claude-3-5-sonnet"  // Suggested model
    }],
    costPriority: 0.3,      // Less concerned about API cost
    speedPriority: 0.2,     // Can wait for thorough analysis
    intelligencePriority: 0.9  // Need complex trade-off evaluation
  },
  systemPrompt: "You are a travel expert helping users find the best flights based on their preferences",
  maxTokens: 1500
}

```

#### 
​
Example: Flight Analysis Tool
Consider a travel booking server with a tool called `findBestFlight` that uses sampling to analyze available flights and recommend the optimal choice. When a user asks “Book me the best flight to Barcelona next month,” the tool needs AI assistance to evaluate complex trade-offs. The tool queries airline APIs and gathers 47 flight options. It then requests AI assistance to analyze these options: “Analyze these flight options and recommend the best choice: [47 flights with prices, times, airlines, and layovers] User preferences: morning departure, max 1 layover.” The client initiates the sampling request, allowing the AI to evaluate trade-offs—like cheaper red-eye flights versus convenient morning departures. The tool uses this analysis to present the top three recommendations.
#### 
​
User Interaction Model
While not a requirement, sampling is designed to allow human-in-the-loop control. Users can maintain oversight through several mechanisms: **Approval controls** : Sampling requests may require explicit user consent. Clients can show what the server wants to analyze and why. Users can approve, deny, or modify requests. **Transparency features** : Clients can display the exact prompt, model selection, and token limits, allowing users to review AI responses before they return to the server. **Configuration options** : Users can set model preferences, configure auto-approval for trusted operations, or require approval for everything. Clients may provide options to redact sensitive information. **Security considerations** : Both clients and servers must handle sensitive data appropriately during sampling. Clients should implement rate limiting and validate all message content. The human-in-the-loop design ensures that server-initiated AI interactions cannot compromise security or access sensitive data without explicit user consent.
Was this page helpful?
YesNo
ServersVersioning
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Connect to remote MCP Servers - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/develop/connect-remote-servers

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.138336

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Develop with MCP
Connect to remote MCP Servers
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * Understanding Remote MCP Servers
 * What are Custom Connectors?
 * Connecting to a Remote MCP Server
 * Best Practices for Using Remote MCP Servers
 * Next Steps

Develop with MCP
# Connect to remote MCP Servers
Copy page
Learn how to connect Claude to remote MCP servers and extend its capabilities with internet-hosted tools and data sources
Copy page
Remote MCP servers extend AI applications’ capabilities beyond your local environment, providing access to internet-hosted tools, services, and data sources. By connecting to remote MCP servers, you transform AI assistants from helpful tools into informed teammates capable of handling complex, multi-step projects with real-time access to external resources. Many clients now support remote MCP servers, enabling a wide range of integration possibilities. This guide demonstrates how to connect to remote MCP servers using Claude as an example, one of the many clients that support MCP. While we focus on Claude’s implementation through Custom Connectors, the concepts apply broadly to other MCP-compatible clients.
## 
​
Understanding Remote MCP Servers
Remote MCP servers function similarly to local MCP servers but are hosted on the internet rather than your local machine. They expose tools, prompts, and resources that Claude can use to perform tasks on your behalf. These servers can integrate with various services such as project management tools, documentation systems, code repositories, and any other API-enabled service. The key advantage of remote MCP servers is their accessibility. Unlike local servers that require installation and configuration on each device, remote servers are available from any MCP client with an internet connection. This makes them ideal for web-based AI applications, integrations that emphasize ease-of-use and services that require server-side processing or authentication.
## 
​
What are Custom Connectors?
Custom Connectors serve as the bridge between Claude and remote MCP servers. They allow you to connect Claude directly to the tools and data sources that matter most to your workflows, enabling Claude to operate within your favorite software and draw insights from the complete context of your external tools. With Custom Connectors, you can:
 * Connect Claude to existing remote MCP servers provided by third-party developers
 * Build your own remote MCP servers to connect with any tool

## 
​
Connecting to a Remote MCP Server
The process of connecting Claude to a remote MCP server involves adding a Custom Connector through the Claude interface. This establishes a secure connection between Claude and your chosen remote server.
1
Navigate to Connector Settings
Open Claude in your browser and navigate to the settings page. You can access this by clicking on your profile icon and selecting “Settings” from the dropdown menu. Once in settings, locate and click on the “Connectors” section in the sidebar.This will display your currently configured connectors and provide options to add new ones.
2
Add a Custom Connector
In the Connectors section, scroll to the bottom where you’ll find the “Add custom connector” button. Click this button to begin the connection process.
!Add custom connector button in Claude settings
A dialog will appear prompting you to enter the remote MCP server URL. This URL should be provided by the server developer or administrator. Enter the complete URL, ensuring it includes the proper protocol (https://) and any necessary path components.
!Dialog for entering remote MCP server URL
After entering the URL, click “Add” to proceed with the connection.
3
Complete Authentication
Most remote MCP servers require authentication to ensure secure access to their resources. The authentication process varies depending on the server implementation but commonly involves OAuth, API keys, or username/password combinations.
!Authentication screen for remote MCP server
Follow the authentication prompts provided by the server. This may redirect you to a third-party authentication provider or display a form within Claude. Once authentication is complete, Claude will establish a secure connection to the remote server.
4
Access Resources and Prompts
After successful connection, the remote server’s resources and prompts become available in your Claude conversations. You can access these by clicking the paperclip icon in the message input area, which opens the attachment menu.
!Attachment menu showing available resources
The menu displays all available resources and prompts from your connected servers. Select the items you want to include in your conversation. These resources provide Claude with context and information from your external tools.
!Selecting specific resources and prompts from the menu
5
Configure Tool Permissions
Remote MCP servers often expose multiple tools with varying capabilities. You can control which tools Claude is allowed to use by configuring permissions in the connector settings. This ensures Claude only performs actions you’ve explicitly authorized.
!Tool permission configuration interface
Navigate back to the Connectors settings and click on your connected server. Here you can enable or disable specific tools, set usage limits, and configure other security parameters according to your needs.
## 
​
Best Practices for Using Remote MCP Servers
When working with remote MCP servers, consider these recommendations to ensure a secure and efficient experience: **Security considerations** : Always verify the authenticity of remote MCP servers before connecting. Only connect to servers from trusted sources, and review the permissions requested during authentication. Be cautious about granting access to sensitive data or systems. **Managing multiple connectors** : You can connect to multiple remote MCP servers simultaneously. Organize your connectors by purpose or project to maintain clarity. Regularly review and remove connectors you no longer use to keep your workspace organized and secure.
## 
​
Next Steps
Now that you’ve connected Claude to a remote MCP server, you can explore its capabilities in your conversations. Try using the connected tools to automate tasks, access external data, or integrate with your existing workflows.
## Build your own remote server Create custom remote MCP servers to integrate with proprietary tools and services ## Explore available servers Browse our collection of official and community-created MCP servers ## Connect local servers Learn how to connect Claude Desktop to local MCP servers for direct system access ## Understand the architecture Dive deeper into how MCP works and its architecture 
Remote MCP servers unlock powerful possibilities for extending Claude’s capabilities. As you become familiar with these integrations, you’ll discover new ways to streamline your workflows and accomplish complex tasks more efficiently.
Was this page helpful?
YesNo
Connect to local MCP serversBuild an MCP server
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.
!Add custom connector button in Claude settings
!Dialog for entering remote MCP server URL
!Authentication screen for remote MCP server
!Attachment menu showing available resources
!Selecting specific resources and prompts from the menu
!Tool permission configuration interface


---

# Governance and Stewardship - Model Context Protocol

## URL
https://modelcontextprotocol.io/community/governance

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.138556

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Governance
Governance and Stewardship
DocumentationSpecificationCommunityAbout MCP
 * Contributor Communication

##### Governance
 * Governance and Stewardship
 * SEP Guidelines
 * Working and Interest Groups
 * Antitrust Policy

##### Roadmap
 * Roadmap

##### Examples
 * Example Clients
 * Example Servers

On this page
 * Technical Governance
 * Channels
 * Maintainers
 * Core Maintainers
 * Lead Maintainers (BDFL)
 * Decision Process
 * Processes
 * Working and Interest Groups
 * Governance Principles
 * Maintenance Responsibilities
 * Specification Project
 * Specification Enhancement Proposal (SEP)
 * Communication
 * Core Maintainer Meetings
 * Public Chat
 * Nominating, Confirming and Removing Maintainers
 * The Principles
 * Nomination and Removal
 * Nomination Process
 * Current Core Maintainers
 * Current Maintainers and Working Groups

Governance
# Governance and Stewardship
Copy page
Learn about the Model Context Protocol’s governance structure and how to participate in the community
Copy page
The Model Context Protocol (MCP) follows a formal governance model to ensure transparent decision-making and community participation. This document outlines how the project is organized and how decisions are made.
## 
​
Technical Governance
The MCP project adopts a hierarchical structure, similar to Python, PyTorch and other open source projects:
 * A community of **contributors** who file issues, make pull requests, and contribute to the project.
 * A small set of **maintainers** drive components within the MCP project, such as SDKs, documentation, and others.
 * Contributors and maintainers are overseen by **core maintainers** , who drive the overall project direction.
 * The core maintainers have two **lead core maintainers** who are the catch-all decision makers.
 * Maintainers, core maintainers, and lead core maintainers form the **MCP steering group**.

All maintainers are expected to have a strong bias towards MCP’s design philosophy. Membership in the technical governance process is for individuals, not companies. That is, there are no seats reserved for specific companies, and membership is associated with the person rather than the company employing that person. This ensures that maintainers act in the best interests of the protocol itself and the open source community.
### 
​
Channels
Technical Governance is facilitated through a shared Discord server of all **maintainers, core maintainers** and **lead maintainers**. Each maintainer group can choose additional communication channels, but all decisions and their supporting discussions must be recorded and made transparently available on the Discord server.
### 
​
Maintainers
Maintainers are responsible for Working or Interest Groups within the MCP project. These generally are independent repositories such as language-specific SDKs, but can also extend to subdirectories of a repository, such as the MCP documentation. Maintainers may adopt their own rules and procedures for making decisions. Maintainers are expected to make decisions for their respective projects independently, but can defer or escalate to the core maintainers when needed. Maintainers are responsible for the:
 * Thoughtful and productive engagement with community contributors,
 * Maintaining and improving their respective area of the MCP project,
 * Supporting documentation, roadmaps and other adjacent parts of the MCP project,
 * Present ideas from community to core.

Maintainers are encouraged to propose additional maintainers when needed. Maintainers can only be appointed and removed by core maintainers or lead core maintainers at any time and without reason. Maintainers have write and/or admin access to their respective repositories.
### 
​
Core Maintainers
The core maintainers are expected to have a deep understanding of the Model Context Protocol and its specification. Their responsibilities include:
 * Designing, reviewing and steering the evolution of the MCP specification, as well as all other parts of the MCP project, such as documentation,
 * Articulating a cohesive long-term vision for the project,
 * Mediating and resolving contentious issues with fairness and transparency, seeking consensus where possible while making decisive choices when necessary,
 * Appoint or remove maintainers,
 * Stewardship of the MCP project in the best interest of MCP.

The core maintainers as a group have the power to veto any decisions made by maintainers by majority vote. The core maintainers have power to resolve disputes as they see fit. The core maintainers should publicly articulate their decision-making. The core group is responsible for adopting their own procedures for making decisions. Core maintainers generally have write and admin access to all MCP repositories, but should use the same contribution (usually pull-requests) mechanism as outside contributors. Exceptions can be made based on security considerations.
### 
​
Lead Maintainers (BDFL)
MCP has two lead maintainers: Justin Spahr-Summers and David Soria Parra. Lead Maintainers can veto any decision by core maintainers or maintainers. This model is also commonly known as Benevolent Dictator for Life (BDFL) in the open source community. The Lead Maintainers should publicly articulate their decision-making and give clear reasoning for their decisions. Lead maintainers are part of the core maintainer group. The Lead Maintainers are responsible for confirming or removing core maintainers. Lead Maintainers are administrators on all infrastructure for the MCP project where possible. This includes but is not restricted to all communication channels, GitHub organizations and repositories.
### 
​
Decision Process
The core maintainer group meets every two weeks to discuss and vote on proposals, as well as discuss any topics needed. The shared Discord server can be used to discuss and vote on smaller proposals if needed. The lead maintainer, core maintainer, and maintainer group should attempt to meet in person every three to six months.
## 
​
Processes
Core and lead maintainers are responsible for all aspects of Model Context Protocol, including documentation, issues, suggestions for content, and all other parts under the MCP project. Maintainers are responsible for documentation, issues, and suggestions of content for their area of the MCP project, but are encouraged to partake in general maintenance of the MCP projects. Maintainers, core maintainers, and lead maintainers should use the same contribution process as external contributors, rather than making direct changes to repos. This provides insight into intent and opportunity for discussion.
### 
​
Working and Interest Groups
MCP collaboration and contributions are organized around two structures: Working Groups and Interest Groups. Interest Groups are responsible for identifying and articulating problems that MCP should address, primarily by facilitating open discussions within the community. In contrast, Working Groups focus on developing concrete solutions by collaboratively producing deliverables, such as SEPs or community-owned implementations of the specification. While input from Interest Groups can help justify the formation of a Working Group, it is not a strict requirement. Similarly, contributions from either Interest Groups or Working Groups are encouraged, but not mandatory, when submitting SEPs or other community proposals. We strongly encourage all contributors interested in working on a specific SEP to first collaborate within an Interest Group. This collaborative process helps ensure that the proposed SEP aligns with protocol needs and is the right direction for its adopters.
#### 
​
Governance Principles
All groups are self-governed while adhering to these core principles:
 1. Clear contribution and decision-making processes
 2. Open communication and transparent decisions

Both must:
 * Document their contribution process
 * Maintain transparent communication
 * Make decisions publicly (groups must publish meeting notes and proposals)

Projects and working groups without specified processes default to:
 * GitHub pull requests and issues for contributions
 * A public channel in the official MCP Contributor Discord

#### 
​
Maintenance Responsibilities
Components without dedicated maintainers (such as documentation) fall under core maintainer responsibility. These follow standard contribution guidelines through pull requests, with maintainers handling reviews and escalating to core maintainer review for any significant changes. Core maintainers and maintainers are encouraged to improve any part of the MCP project, regardless of formal maintenance assignments.
### 
​
Specification Project
#### 
​
Specification Enhancement Proposal (SEP)
Proposed changes to the specification must come in the form of a written version, starting with a summary of the proposal, outlining the **problem** it tries to solve, propose **solution** , **alternatives** , **considerations, outcomes** and **risks**. The SEP Guidelines outline information on the expected structure of SEPs. SEP’s should be created as issues in the specification repository and tagged with the labels `proposal, sep`. All proposals must have a **sponsor** from the MCP steering group (maintainer, core maintainer or lead core maintainer). The sponsor is responsible for ensuring that the proposal is actively developed, meets the quality standard for proposals and is responsible for presenting and discussing it in meetings of core maintainers. Maintainer and Core Maintainer groups should review open proposals without sponsors in regular intervals. Proposals that do not find a sponsor within six months are automatically rejected. Once proposals have a sponsor, they are assigned to the sponsor and are tagged `draft`.
## 
​
Communication
### 
​
Core Maintainer Meetings
The core maintainer group meets on a bi-weekly basis to discuss proposals and the project. Notes on proposals should be made public. The core maintainer group will strive to meet in person every 3-6 months.
### 
​
Public Chat
The MCP project maintains a public Discord server with open chats for interest groups. The MCP project may have private channels for certain communications.
## 
​
Nominating, Confirming and Removing Maintainers
### 
​
The Principles
 * Membership in module maintainer groups is given to **individuals** on merit basis after they demonstrated strong expertise of their area of work through contributions, reviews, and discussions and are aligned with the overall MCP direction.
 * For membership in the **maintainer** group the individual has to demonstrate strong and continued alignment with the overall MCP principles.
 * No term limits for module maintainers or core maintainers
 * Light criteria of moving working-group or sub-project maintenance to ‘emeritus’ status if they don’t actively participate over long periods of time. Each maintainer group may define the inactive period that’s appropriate for their area.
 * The membership is for an individual, not a company.

### 
​
Nomination and Removal
 * Core Maintainers are responsible for adding and removing maintainers. They will take the consideration of existing maintainers into account.
 * The lead maintainers are responsible for adding and removing core maintainers.

#### 
​
Nomination Process
If a Maintainer (or Core / Lead Maintainer) wishes to propose a nomination for the Core / Lead Maintainers’ consideration, they should follow the following process:
 1. Collect evidence for the nomination. This will generally come in the form of a history of merged PRs on the repositories for which maintainership is being considered.
 2. Discuss among maintainers of the relevant group(s) as to whether they would be supportive of approving the nomination.
 3. DM a Community Moderator or Core Maintainer to create a private channel in Discord, in the format `nomination-{name}-{group}`. Add all core maintainers, lead maintainers, and co-maintainers on the relevant group.
 4. Provide context for the individual under nomination. See below for suggestions on what to include here.
 5. Create a Discord Poll and ask Core / Lead Maintainers to vote Yes / No on the nomination. Reaching consensus is encouraged though not required.
 6. After Core / Lead Maintainers discuss and/or vote, if the nomination is favorable, relevant members with permissions to update GitHub an Discord roles will add the nominee to the appropriate groups. The nominator should announce the new maintainership in the relevant Discord channel.
 7. The temporary Discord channel will be deleted a week later.

Suggestions for the kind of information to share with core maintainers when nominating someone:
 * GitHub profile link, LinkedIn profile link, Discord username
 * For what group(s) are you nominating the individual for maintainership
 * Whether the group(s) agree that this person should be elevated to maintainership
 * Description of their contributions to date (including links to most substantial contributions)
 * Description of expected contributions moving forward (e.g. Are they eager to be a maintainer? Will they have capacity to do so?)
 * Other context about the individual (e.g. current employer, motivations behind MCP involvement)
 * Anything else you think may be relevant to consider for the nomination

## 
​
Current Core Maintainers
 * Inna Harper
 * Basil Hosmer
 * Paul Carleton
 * Nick Cooper
 * Nick Aldridge
 * Che Liu
 * Den Delimarsky

## 
​
Current Maintainers and Working Groups
Refer to the maintainer list.
Was this page helpful?
YesNo
Contributor CommunicationSEP Guidelines
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Architecture overview - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/learn/architecture

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.138999

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
About MCP
Architecture overview
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * Scope
 * Concepts of MCP
 * Participants
 * Layers
 * Data layer
 * Transport layer
 * Data Layer Protocol
 * Lifecycle management
 * Primitives
 * Notifications
 * Example
 * Data Layer
 * Understanding the Initialization Exchange
 * How This Works in AI Applications
 * Understanding the Tool Discovery Request
 * Understanding the Tool Discovery Response
 * How This Works in AI Applications
 * Understanding the Tool Execution Request
 * Key Elements of Tool Execution
 * Understanding the Tool Execution Response
 * How This Works in AI Applications
 * Understanding Tool List Change Notifications
 * Key Features of MCP Notifications
 * Client Response to Notifications
 * Why Notifications Matter
 * How This Works in AI Applications

About MCP
# Architecture overview
Copy page
Copy page
This overview of the Model Context Protocol (MCP) discusses its scope and core concepts, and provides an example demonstrating each core concept. Because MCP SDKs abstract away many concerns, most developers will likely find the data layer protocol section to be the most useful. It discusses how MCP servers can provide context to an AI application. For specific implementation details, please refer to the documentation for your language-specific SDK.
## 
​
Scope
The Model Context Protocol includes the following projects:
 * MCP Specification: A specification of MCP that outlines the implementation requirements for clients and servers.
 * MCP SDKs: SDKs for different programming languages that implement MCP.
 * **MCP Development Tools** : Tools for developing MCP servers and clients, including the MCP Inspector
 * MCP Reference Server Implementations: Reference implementations of MCP servers.

MCP focuses solely on the protocol for context exchange—it does not dictate how AI applications use LLMs or manage the provided context.
## 
​
Concepts of MCP
### 
​
Participants
MCP follows a client-server architecture where an MCP host — an AI application like Claude Code or Claude Desktop — establishes connections to one or more MCP servers. The MCP host accomplishes this by creating one MCP client for each MCP server. Each MCP client maintains a dedicated one-to-one connection with its corresponding MCP server. The key participants in the MCP architecture are:
 * **MCP Host** : The AI application that coordinates and manages one or multiple MCP clients
 * **MCP Client** : A component that maintains a connection to an MCP server and obtains context from an MCP server for the MCP host to use
 * **MCP Server** : A program that provides context to MCP clients

**For example** : Visual Studio Code acts as an MCP host. When Visual Studio Code establishes a connection to an MCP server, such as the Sentry MCP server, the Visual Studio Code runtime instantiates an MCP client object that maintains the connection to the Sentry MCP server. When Visual Studio Code subsequently connects to another MCP server, such as the local filesystem server, the Visual Studio Code runtime instantiates an additional MCP client object to maintain this connection, hence maintaining a one-to-one relationship of MCP clients to MCP servers.
MCP Host (AI Application)
One-to-one 
connection
One-to-one 
connection
One-to-one 
connection
MCP Client 1
MCP Client 2
MCP Client 3
MCP Server 1 
(e.g., Sentry)
MCP Server 2 
(e.g., Filesystem)
MCP Server 3 
(e.g., Database)
Note that **MCP server** refers to the program that serves context data, regardless of where it runs. MCP servers can execute locally or remotely. For example, when Claude Desktop launches the filesystem server, the server runs locally on the same machine because it uses the STDIO transport. This is commonly referred to as a “local” MCP server. The official Sentry MCP server runs on the Sentry platform, and uses the Streamable HTTP transport. This is commonly referred to as a “remote” MCP server.
### 
​
Layers
MCP consists of two layers:
 * **Data layer** : Defines the JSON-RPC based protocol for client-server communication, including lifecycle management, and core primitives, such as tools, resources, prompts and notifications.
 * **Transport layer** : Defines the communication mechanisms and channels that enable data exchange between clients and servers, including transport-specific connection establishment, message framing, and authorization.

Conceptually the data layer is the inner layer, while the transport layer is the outer layer.
#### 
​
Data layer
The data layer implements a JSON-RPC 2.0 based exchange protocol that defines the message structure and semantics. This layer includes:
 * **Lifecycle management** : Handles connection initialization, capability negotiation, and connection termination between clients and servers
 * **Server features** : Enables servers to provide core functionality including tools for AI actions, resources for context data, and prompts for interaction templates from and to the client
 * **Client features** : Enables servers to ask the client to sample from the host LLM, elicit input from the user, and log messages to the client
 * **Utility features** : Supports additional capabilities like notifications for real-time updates and progress tracking for long-running operations

#### 
​
Transport layer
The transport layer manages communication channels and authentication between clients and servers. It handles connection establishment, message framing, and secure communication between MCP participants. MCP supports two transport mechanisms:
 * **Stdio transport** : Uses standard input/output streams for direct process communication between local processes on the same machine, providing optimal performance with no network overhead.
 * **Streamable HTTP transport** : Uses HTTP POST for client-to-server messages with optional Server-Sent Events for streaming capabilities. This transport enables remote server communication and supports standard HTTP authentication methods including bearer tokens, API keys, and custom headers. MCP recommends using OAuth to obtain authentication tokens.

The transport layer abstracts communication details from the protocol layer, enabling the same JSON-RPC 2.0 message format across all transport mechanisms.
### 
​
Data Layer Protocol
A core part of MCP is defining the schema and semantics between MCP clients and MCP servers. Developers will likely find the data layer — in particular, the set of primitives — to be the most interesting part of MCP. It is the part of MCP that defines the ways developers can share context from MCP servers to MCP clients. MCP uses JSON-RPC 2.0 as its underlying RPC protocol. Client and servers send requests to each other and respond accordingly. Notifications can be used when no response is required.
#### 
​
Lifecycle management
MCP is a stateful protocol that requires lifecycle management. The purpose of lifecycle management is to negotiate the capabilities that both client and server support. Detailed information can be found in the specification, and the example showcases the initialization sequence.
#### 
​
Primitives
MCP primitives are the most important concept within MCP. They define what clients and servers can offer each other. These primitives specify the types of contextual information that can be shared with AI applications and the range of actions that can be performed. MCP defines three core primitives that _servers_ can expose:
 * **Tools** : Executable functions that AI applications can invoke to perform actions (e.g., file operations, API calls, database queries)
 * **Resources** : Data sources that provide contextual information to AI applications (e.g., file contents, database records, API responses)
 * **Prompts** : Reusable templates that help structure interactions with language models (e.g., system prompts, few-shot examples)

Each primitive type has associated methods for discovery (`*/list`), retrieval (`*/get`), and in some cases, execution (`tools/call`). MCP clients will use the `*/list` methods to discover available primitives. For example, a client can first list all available tools (`tools/list`) and then execute them. This design allows listings to be dynamic. As a concrete example, consider an MCP server that provides context about a database. It can expose tools for querying the database, a resource that contains the schema of the database, and a prompt that includes few-shot examples for interacting with the tools. For more details about server primitives see server concepts. MCP also defines primitives that _clients_ can expose. These primitives allow MCP server authors to build richer interactions.
 * **Sampling** : Allows servers to request language model completions from the client’s AI application. This is useful when servers’ authors want access to a language model, but want to stay model independent and not include a language model SDK in their MCP server. They can use the `sampling/complete` method to request a language model completion from the client’s AI application.
 * **Elicitation** : Allows servers to request additional information from users. This is useful when servers’ authors want to get more information from the user, or ask for confirmation of an action. They can use the `elicitation/request` method to request additional information from the user.
 * **Logging** : Enables servers to send log messages to clients for debugging and monitoring purposes.

For more details about client primitives see client concepts.
#### 
​
Notifications
The protocol supports real-time notifications to enable dynamic updates between servers and clients. For example, when a server’s available tools change—such as when new functionality becomes available or existing tools are modified—the server can send tool update notifications to inform connected clients about these changes. Notifications are sent as JSON-RPC 2.0 notification messages (without expecting a response) and enable MCP servers to provide real-time updates to connected clients.
## 
​
Example
### 
​
Data Layer
This section provides a step-by-step walkthrough of an MCP client-server interaction, focusing on the data layer protocol. We’ll demonstrate the lifecycle sequence, tool operations, and notifications using JSON-RPC 2.0 messages.
1
Initialization (Lifecycle Management)
MCP begins with lifecycle management through a capability negotiation handshake. As described in the lifecycle management section, the client sends an `initialize` request to establish the connection and negotiate supported features.
Initialize Request
Initialize Response
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "elicitation": {}
    },
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}

```

#### 
​
Understanding the Initialization Exchange
The initialization process is a key part of MCP’s lifecycle management and serves several critical purposes:
 1. **Protocol Version Negotiation** : The `protocolVersion` field (e.g., “2025-06-18”) ensures both client and server are using compatible protocol versions. This prevents communication errors that could occur when different versions attempt to interact. If a mutually compatible version is not negotiated, the connection should be terminated.
 2. **Capability Discovery** : The `capabilities` object allows each party to declare what features they support, including which primitives they can handle (tools, resources, prompts) and whether they support features like notifications. This enables efficient communication by avoiding unsupported operations.
 3. **Identity Exchange** : The `clientInfo` and `serverInfo` objects provide identification and versioning information for debugging and compatibility purposes.

In this example, the capability negotiation demonstrates how MCP primitives are declared:**Client Capabilities** :
 * `"elicitation": {}` - The client declares it can work with user interaction requests (can receive `elicitation/create` method calls)

**Server Capabilities** :
 * `"tools": {"listChanged": true}` - The server supports the tools primitive AND can send `tools/list_changed` notifications when its tool list changes
 * `"resources": {}` - The server also supports the resources primitive (can handle `resources/list` and `resources/read` methods)

After successful initialization, the client sends a notification to indicate it’s ready:
Notification
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}

```

#### 
​
How This Works in AI Applications
During initialization, the AI application’s MCP client manager establishes connections to configured servers and stores their capabilities for later use. The application uses this information to determine which servers can provide specific types of functionality (tools, resources, prompts) and whether they support real-time updates.
Pseudo-code for AI application initialization
Copy
```
# Pseudo Code
async with stdio_client(server_config) as (read, write):
    async with ClientSession(read, write) as session:
        init_response = await session.initialize()
        if init_response.capabilities.tools:
            app.register_mcp_server(session, supports_tools=True)
        app.set_server_ready(session)

```

2
Tool Discovery (Primitives)
Now that the connection is established, the client can discover available tools by sending a `tools/list` request. This request is fundamental to MCP’s tool discovery mechanism — it allows clients to understand what tools are available on the server before attempting to use them.
Tools List Request
Tools List Response
Copy
```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}

```

#### 
​
Understanding the Tool Discovery Request
The `tools/list` request is simple, containing no parameters.
#### 
​
Understanding the Tool Discovery Response
The response contains a `tools` array that provides comprehensive metadata about each available tool. This array-based structure allows servers to expose multiple tools simultaneously while maintaining clear boundaries between different functionalities.Each tool object in the response includes several key fields:
 * **`name`**: A unique identifier for the tool within the server’s namespace. This serves as the primary key for tool execution and should follow a clear naming pattern (e.g.,`calculator_arithmetic` rather than just `calculate`)
 * **`title`**: A human-readable display name for the tool that clients can show to users
 * **`description`**: Detailed explanation of what the tool does and when to use it
 * **`inputSchema`**: A JSON Schema that defines the expected input parameters, enabling type validation and providing clear documentation about required and optional parameters

#### 
​
How This Works in AI Applications
The AI application fetches available tools from all connected MCP servers and combines them into a unified tool registry that the language model can access. This allows the LLM to understand what actions it can perform and automatically generates the appropriate tool calls during conversations.
Pseudo-code for AI application tool discovery
Copy
```
# Pseudo-code using MCP Python SDK patterns
available_tools = []
for session in app.mcp_server_sessions():
    tools_response = await session.list_tools()
    available_tools.extend(tools_response.tools)
conversation.register_available_tools(available_tools)

```

3
Tool Execution (Primitives)
The client can now execute a tool using the `tools/call` method. This demonstrates how MCP primitives are used in practice: after discovering available tools, the client can invoke them with appropriate arguments.
#### 
​
Understanding the Tool Execution Request
The `tools/call` request follows a structured format that ensures type safety and clear communication between client and server. Note that we’re using the proper tool name from the discovery response (`weather_current`) rather than a simplified name:
Tool Call Request
Tool Call Response
Copy
```
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "weather_current",
    "arguments": {
      "location": "San Francisco",
      "units": "imperial"
    }
  }
}

```

#### 
​
Key Elements of Tool Execution
The request structure includes several important components:
 1. **`name`**: Must match exactly the tool name from the discovery response (`weather_current`). This ensures the server can correctly identify which tool to execute.
 2. **`arguments`**: Contains the input parameters as defined by the tool’s`inputSchema`. In this example:
 * `location`: “San Francisco” (required parameter)
 * `units`: “imperial” (optional parameter, defaults to “metric” if not specified)
 3. **JSON-RPC Structure** : Uses standard JSON-RPC 2.0 format with unique `id` for request-response correlation.

#### 
​
Understanding the Tool Execution Response
The response demonstrates MCP’s flexible content system:
 1. **`content`Array** : Tool responses return an array of content objects, allowing for rich, multi-format responses (text, images, resources, etc.)
 2. **Content Types** : Each content object has a `type` field. In this example, `"type": "text"` indicates plain text content, but MCP supports various content types for different use cases.
 3. **Structured Output** : The response provides actionable information that the AI application can use as context for language model interactions.

This execution pattern allows AI applications to dynamically invoke server functionality and receive structured responses that can be integrated into conversations with language models.
#### 
​
How This Works in AI Applications
When the language model decides to use a tool during a conversation, the AI application intercepts the tool call, routes it to the appropriate MCP server, executes it, and returns the results back to the LLM as part of the conversation flow. This enables the LLM to access real-time data and perform actions in the external world.
Copy
```
# Pseudo-code for AI application tool execution
async def handle_tool_call(conversation, tool_name, arguments):
    session = app.find_mcp_session_for_tool(tool_name)
    result = await session.call_tool(tool_name, arguments)
    conversation.add_tool_result(result.content)

```

4
Real-time Updates (Notifications)
MCP supports real-time notifications that enable servers to inform clients about changes without being explicitly requested. This demonstrates the notification system, a key feature that keeps MCP connections synchronized and responsive.
#### 
​
Understanding Tool List Change Notifications
When the server’s available tools change—such as when new functionality becomes available, existing tools are modified, or tools become temporarily unavailable—the server can proactively notify connected clients:
Request
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}

```

#### 
​
Key Features of MCP Notifications
 1. **No Response Required** : Notice there’s no `id` field in the notification. This follows JSON-RPC 2.0 notification semantics where no response is expected or sent.
 2. **Capability-Based** : This notification is only sent by servers that declared `"listChanged": true` in their tools capability during initialization (as shown in Step 1).
 3. **Event-Driven** : The server decides when to send notifications based on internal state changes, making MCP connections dynamic and responsive.

#### 
​
Client Response to Notifications
Upon receiving this notification, the client typically reacts by requesting the updated tool list. This creates a refresh cycle that keeps the client’s understanding of available tools current:
Request
Copy
```
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/list"
}

```

#### 
​
Why Notifications Matter
This notification system is crucial for several reasons:
 1. **Dynamic Environments** : Tools may come and go based on server state, external dependencies, or user permissions
 2. **Efficiency** : Clients don’t need to poll for changes; they’re notified when updates occur
 3. **Consistency** : Ensures clients always have accurate information about available server capabilities
 4. **Real-time Collaboration** : Enables responsive AI applications that can adapt to changing contexts

This notification pattern extends beyond tools to other MCP primitives, enabling comprehensive real-time synchronization between clients and servers.
#### 
​
How This Works in AI Applications
When the AI application receives a notification about changed tools, it immediately refreshes its tool registry and updates the LLM’s available capabilities. This ensures that ongoing conversations always have access to the most current set of tools, and the LLM can dynamically adapt to new functionality as it becomes available.
Copy
```
# Pseudo-code for AI application notification handling
async def handle_tools_changed_notification(session):
    tools_response = await session.list_tools()
    app.update_available_tools(session, tools_response.tools)
    if app.conversation.is_active():
        app.conversation.notify_llm_of_new_capabilities()

```

Was this page helpful?
YesNo
What is MCP?Servers
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Announcing the Official PHP SDK for MCP | mcp blog

## URL
http://blog.modelcontextprotocol.io/posts/2025-09-05-php-sdk

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.139067

## Content
mcp blog")
 * Documentation 
 * GitHub 

Home » Posts
# Announcing the Official PHP SDK for MCP
September 5, 2025 · 1 min · David Soria Parra (Lead Maintainer), Christopher Hertel (Symfony), Roman Pronskiy (PHP Foundation)
The official PHP SDK for the Model Context Protocol is now generally available.
Built in collaboration with the PHP Foundation and Symfony, the PHP SDK handles protocol details, so developers don’t have to worry about low-level mechanics and can focus on building their applications.
The initial release enables PHP developers to build MCP servers, exposing tools, prompts, and resources to AI applications. Support for PHP applications to act as MCP clients will follow.
The PHP SDK now joins 9 other officially supported language SDKs in the MCP ecosystem, making it easier for developers everywhere to adopt MCP in their preferred language.
## Get involved#
The PHP SDK is now open to the community to install, test, and contribute:
 * SDK repo: modelcontextprotocol/php-sdk
 * Composer package: mcp/sdk

We welcome your feedback and contribution, including issues, documentation improvements, and pull requests. Framework-specific integrations and real-world examples are also particularly valuable.
## Thanks to the MCP community#
This release consolidates earlier community work into a single, trusted implementation. The SDK is maintained by the Symfony team, with Kyrian Obikwelu joining as a maintainer based on his previous PHP-MCP work. The PHP Foundation helped to coordinate the initiative with support from the members of MCP steering group.
Thank you to all involved in bringing PHP to the MCP ecosystem.
 * Announcement
 * Community

« Prev 
Introducing the MCP Registry Next » 
Evolving OAuth Client Registration in the Model Context Protocol© 2025 mcp blog · Powered by Hugo & PaperMod[](http://blog.modelcontextprotocol.io/posts/2025-09-05-php-sdk/#top "Go to Top \(Alt + G\)")


---

# Understanding MCP servers - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/learn/server-concepts

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.139328

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
About MCP
Understanding MCP servers
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * Core Server Features
 * Tools
 * How Tools Work
 * Example: Travel Booking
 * User Interaction Model
 * Resources
 * How Resources Work
 * Example: Getting Travel Planning Context
 * Parameter Completion
 * User Interaction Model
 * Prompts
 * How Prompts Work
 * Example: Streamlined Workflows
 * User Interaction Model
 * Bringing Servers Together
 * Example: Multi-Server Travel Planning
 * The Complete Flow

About MCP
# Understanding MCP servers
Copy page
Copy page
MCP servers are programs that expose specific capabilities to AI applications through standardized protocol interfaces. Common examples include file system servers for document access, database servers for data queries, GitHub servers for code management, Slack servers for team communication, and calendar servers for scheduling.
## 
​
Core Server Features
Servers provide functionality through three building blocks: Feature | Explanation | Examples | Who controls it 
---|---|---|--- 
**Tools** | Functions that your LLM can actively call, and decides when to use them based on user requests. Tools can write to databases, call external APIs, modify files, or trigger other logic. | Search flights 
Send messages 
Create calendar events | Model 
**Resources** | Passive data sources that provide read-only access to information for context, such as file contents, database schemas, or API documentation. | Retrieve documents 
Access knowledge bases 
Read calendars | Application 
**Prompts** | Pre-built instruction templates that tell the model to work with specific tools and resources. | Plan a vacation 
Summarize my meetings 
Draft an email | User 
We will use a hypothetical scenario to demonstrate the role of each of these features, and show how they can work together.
### 
​
Tools
Tools enable AI models to perform actions. Each tool defines a specific operation with typed inputs and outputs. The model requests tool execution based on context.
#### 
​
How Tools Work
Tools are schema-defined interfaces that LLMs can invoke. MCP uses JSON Schema for validation. Each tool performs a single operation with clearly defined inputs and outputs. Tools may require user consent prior to execution, helping to ensure users maintain control over actions taken by a model. **Protocol operations:** Method | Purpose | Returns 
---|---|--- 
`tools/list` | Discover available tools | Array of tool definitions with schemas 
`tools/call` | Execute a specific tool | Tool execution result 
**Example tool definition:**
Copy
```
{
  name: "searchFlights",
  description: "Search for available flights",
  inputSchema: {
    type: "object",
    properties: {
      origin: { type: "string", description: "Departure city" },
      destination: { type: "string", description: "Arrival city" },
      date: { type: "string", format: "date", description: "Travel date" }
    },
    required: ["origin", "destination", "date"]
  }
}

```

#### 
​
Example: Travel Booking
Tools enable AI applications to perform actions on behalf of users. In a travel planning scenario, the AI application might use several tools to help book a vacation: **Flight Search**
Copy
```
searchFlights(origin: "NYC", destination: "Barcelona", date: "2024-06-15")

```

Queries multiple airlines and returns structured flight options. **Calendar Blocking**
Copy
```
createCalendarEvent(title: "Barcelona Trip", startDate: "2024-06-15", endDate: "2024-06-22")

```

Marks the travel dates in the user’s calendar. **Email notification**
Copy
```
sendEmail(to: "team@work.com", subject: "Out of Office", body: "...")

```

Sends an automated out-of-office message to colleagues.
#### 
​
User Interaction Model
Tools are model-controlled, meaning AI models can discover and invoke them automatically. However, MCP emphasizes human oversight through several mechanisms. For trust and safety, applications can implement user control through various mechanisms, such as:
 * Displaying available tools in the UI, enabling users to define whether a tool should be made available in specific interactions
 * Approval dialogs for individual tool executions
 * Permission settings for pre-approving certain safe operations
 * Activity logs that show all tool executions with their results

### 
​
Resources
Resources provide structured access to information that the AI application can retrieve and provide to models as context.
#### 
​
How Resources Work
Resources expose data from files, APIs, databases, or any other source that an AI needs to understand context. Applications can access this information directly and decide how to use it - whether that’s selecting relevant portions, searching with embeddings, or passing it all to the model. Each resource has a unique URI (like `file:///path/to/document.md`) and declares its MIME type for appropriate content handling. They declare MIME types for appropriate content handling and support two discovery patterns:
 * **Direct Resources** - fixed URIs that point to specific data. Example: `calendar://events/2024` - returns calendar availability for 2024
 * **Resource Templates** - dynamic URIs with parameters for flexible queries. Example: 
 * `travel://activities/{city}/{category}` - returns activities by city and category
 * `travel://activities/barcelona/museums` - returns all museums in Barcelona

Resource Templates include metadata such as title, description, and expected MIME type, making them discoverable and self-documenting. **Protocol operations:** Method | Purpose | Returns 
---|---|--- 
`resources/list` | List available direct resources | Array of resource descriptors 
`resources/templates/list` | Discover resource templates | Array of resource template definitions 
`resources/read` | Retrieve resource contents | Resource data with metadata 
`resources/subscribe` | Monitor resource changes | Subscription confirmation 
#### 
​
Example: Getting Travel Planning Context
Continuing with the travel planning example, resources provide the AI application with access to relevant information:
 * **Calendar data** (`calendar://events/2024`) - Checks user availability
 * **Travel documents** (`file:///Documents/Travel/passport.pdf`) - Accesses important documents
 * **Previous itineraries** (`trips://history/barcelona-2023`) - References past trips and preferences

The AI application retrieves these resources and decides how to process them, whether selecting a subset of data using embeddings or keyword search, or passing raw data directly to the model. In this case, it provides calendar data, weather information, and travel preferences to the model, enabling it to check availability, look up weather patterns, and reference past travel preferences. **Resource Template Examples:**
Copy
```
{
  "uriTemplate": "weather://forecast/{city}/{date}",
  "name": "weather-forecast",
  "title": "Weather Forecast",
  "description": "Get weather forecast for any city and date",
  "mimeType": "application/json"
}
{
  "uriTemplate": "travel://flights/{origin}/{destination}",
  "name": "flight-search",
  "title": "Flight Search",
  "description": "Search available flights between cities",
  "mimeType": "application/json"
}

```

These templates enable flexible queries. For weather data, users can access forecasts for any city/date combination. For flights, they can search routes between any two airports. When a user has input “NYC” as the `origin` airport and begins to input “Bar” as the `destination` airport, the system can suggest “Barcelona (BCN)” or “Barbados (BGI)”.
#### 
​
Parameter Completion
Dynamic resources support parameter completion. For example:
 * Typing “Par” as input for `weather://forecast/{city}` might suggest “Paris” or “Park City”
 * Typing “JFK” for `flights://search/{airport}` might suggest “JFK - John F. Kennedy International”

The system helps discover valid values without requiring exact format knowledge.
#### 
​
User Interaction Model
Resources are application-driven, giving them flexibility in how they retrieve, process, and present available context. Common interaction patterns include:
 * Tree or list views for browsing resources in familiar folder-like structures
 * Search and filter interfaces for finding specific resources
 * Automatic context inclusion or smart suggestions based on heuristics or AI selection
 * Manual or bulk selection interfaces for including single or multiple resources

Applications are free to implement resource discovery through any interface pattern that suits their needs. The protocol doesn’t mandate specific UI patterns, allowing for resource pickers with preview capabilities, smart suggestions based on current conversation context, bulk selection for including multiple resources, or integration with existing file browsers and data explorers.
### 
​
Prompts
Prompts provide reusable templates. They allow MCP server authors to provide parameterized prompts for a domain, or showcase how to best use the MCP server.
#### 
​
How Prompts Work
Prompts are structured templates that define expected inputs and interaction patterns. They are user-controlled, requiring explicit invocation rather than automatic triggering. Prompts can be context-aware, referencing available resources and tools to create comprehensive workflows. Similar to resources, prompts support parameter completion to help users discover valid argument values. **Protocol operations:** Method | Purpose | Returns 
---|---|--- 
`prompts/list` | Discover available prompts | Array of prompt descriptors 
`prompts/get` | Retrieve prompt details | Full prompt definition with arguments 
#### 
​
Example: Streamlined Workflows
Prompts provide structured templates for common tasks. In the travel planning context: **“Plan a vacation” prompt:**
Copy
```
{
  "name": "plan-vacation",
  "title": "Plan a vacation",
  "description": "Guide through vacation planning process",
  "arguments": [
    { "name": "destination", "type": "string", "required": true },
    { "name": "duration", "type": "number", "description": "days" },
    { "name": "budget", "type": "number", "required": false },
    { "name": "interests", "type": "array", "items": { "type": "string" } }
  ]
}

```

Rather than unstructured natural language input, the prompt system enables:
 1. Selection of the “Plan a vacation” template
 2. Structured input: Barcelona, 7 days, $3000, [“beaches”, “architecture”, “food”]
 3. Consistent workflow execution based on the template

#### 
​
User Interaction Model
Prompts are user-controlled, requiring explicit invocation. The protocol gives implementers freedom to design interfaces that feel natural within their application. Key principles include:
 * Easy discovery of available prompts
 * Clear descriptions of what each prompt does
 * Natural argument input with validation
 * Transparent display of the prompt’s underlying template

Applications typically expose prompts through various UI patterns such as:
 * Slash commands (typing ”/” to see available prompts like /plan-vacation)
 * Command palettes for searchable access
 * Dedicated UI buttons for frequently used prompts
 * Context menus that suggest relevant prompts

## 
​
Bringing Servers Together
The real power of MCP emerges when multiple servers work together, combining their specialized capabilities through a unified interface.
### 
​
Example: Multi-Server Travel Planning
Consider a personalized AI travel planner application, with three connected servers:
 * **Travel Server** - Handles flights, hotels, and itineraries
 * **Weather Server** - Provides climate data and forecasts
 * **Calendar/Email Server** - Manages schedules and communications

#### 
​
The Complete Flow
 1. **User invokes a prompt with parameters:**
Copy
```
{
  "prompt": "plan-vacation",
  "arguments": {
    "destination": "Barcelona",
    "departure_date": "2024-06-15",
    "return_date": "2024-06-22",
    "budget": 3000,
    "travelers": 2
  }
}

```

 2. **User selects resources to include:**
 * `calendar://my-calendar/June-2024` (from Calendar Server)
 * `travel://preferences/europe` (from Travel Server)
 * `travel://past-trips/Spain-2023` (from Travel Server)
 3. **AI processes the request using tools:** The AI first reads all selected resources to gather context - identifying available dates from the calendar, learning preferred airlines and hotel types from travel preferences, and discovering previously enjoyed locations from past trips. Using this context, the AI then executes a series of Tools:
 * `searchFlights()` - Queries airlines for NYC to Barcelona flights
 * `checkWeather()` - Retrieves climate forecasts for travel dates
The AI then uses this information to create the booking and following steps, requesting approval from the user where necessary:
 * `bookHotel()` - Finds hotels within the specified budget
 * `createCalendarEvent()` - Adds the trip to the user’s calendar
 * `sendEmail()` - Sends confirmation with trip details

**The result:** Through multiple MCP servers, the user researched and booked a Barcelona trip tailored to their schedule. The “Plan a Vacation” prompt guided the AI to combine Resources (calendar availability and travel history) with Tools (searching flights, booking hotels, updating calendars) across different servers—gathering context and executing the booking. A task that could’ve taken hours was completed in minutes using MCP.
Was this page helpful?
YesNo
ArchitectureClients
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Update on the Next MCP Protocol Release | mcp blog

## URL
http://blog.modelcontextprotocol.io/posts/2025-09-26-mcp-next-version-update

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.139463

## Content
mcp blog")
 * Documentation 
 * GitHub 

Home » Posts
# Update on the Next MCP Protocol Release
An update on the timeline and priorities for the next Model Context Protocol specification version
September 26, 2025 · 5 min · David Soria Parra
## Release Timeline#
The next version of the Model Context Protocol specification will be released on **November 25th, 2025** , with a release candidate (RC) available on **November 11th, 2025**.
We’re building in a 14-day RC validation window so client implementors and SDK maintainers can thoroughly test the protocol changes. This approach gives us the focused time we need to deliver critical improvements while applying our new governance model to the process.
## Summer Progress#
Our last spec was released on June 18, 2025, and focused on structured tool outputs, OAuth-based authorization, elicitation for server-initiated user interactions, and improved security best practices.
Since then, we’ve focused on establishing additional foundations for the MCP ecosystem:
### Formal Governance Structures#
We established a formal governance model for MCP, including defined roles and decision-making mechanisms. We also developed the Specification Enhancement Proposal (SEP) process to provide clear guidelines for contributing specification changes.
Our goal is transparency—making decision-making procedures clear and accessible to everyone. Like any new system serving a fast-evolving community, our governance model is still finding its footing. We’re actively refining it as both the protocol and community continue to grow.
### Working Groups#
We’ve launched Working Groups and Interest Groups to foster community collaboration. These groups serve multiple purposes:
 * Provide clear entry points for new contributors
 * Empower community members to lead initiatives in their areas of expertise
 * Distribute ownership across the ecosystem rather than concentrating it among core maintainers

We’re developing governance structures that will grant these groups greater autonomy in decision-making and implementation. This distributed approach ensures the protocol can grow to meet community needs while maintaining quality and consistency across different domains.
### Registry Development#
In September, we launched the MCP Registry preview—an open catalog and API for indexing and discovery of MCP servers. The Registry serves as the single source of truth for available MCP servers, supporting both public and private sub-registries that organizations can customize for their specific needs.
Building the MCP Registry has been a true community effort. Any MCP client can consume registry content via the native API or through third-party registry aggregators, making it easier for users to discover and integrate MCP servers into their AI workflows.
## Priority Areas for the Next Release#
With governance and infrastructure foundations in place, we’re focusing on five key protocol improvements identified by our working groups.
### Asynchronous Operations#
Currently, MCP is built around mostly synchronous operations—when you call a tool, everything stops and waits for it to finish. That works great for quick tasks, but what about operations that take minutes or hours?
The Agents Working Group is adding async support, allowing servers to kick off long-running tasks while clients can check back later for results. You can follow the progress in SEP-1391.
### Statelessness and Scalability#
As organizations deploy MCP servers at enterprise scale, we’re seeing new requirements emerge. Current implementations often need to remember things between requests, which makes horizontal scaling across multiple server instances challenging.
While Streamable HTTP provides some stateless support, pain points remain around server startup and session handling. The Transport Working Group is smoothing out these rough edges, making it easier to run MCP servers in production while keeping simple upgrade paths for teams who want more sophisticated stateful features.
### Server Identity#
Today, if you want to know what an MCP server can do, you have to connect to it first. This makes it difficult for clients to browse available servers or for systems like our registry to automatically catalog capabilities.
We’re solving this by letting servers advertise themselves through `.well-known` URLs—an established standard for providing metadata. Think of it as a server’s business card that anyone can read without having to knock on the door first. This will make discovery much more intuitive for every MCP consumer.
### Official Extensions#
As MCP has grown, we’ve noticed patterns emerging for specific industries and use cases—valuable implementations that don’t necessarily belong in the core protocol specification.
Rather than leaving everyone to reinvent the wheel, we’re officially recognizing and documenting the most popular protocol extensions. This curated collection of proven patterns will give developers building for specialized domains like healthcare, finance, or education a solid starting point instead of building every custom integration from scratch.
### SDK Support Standardization#
Choosing an MCP SDK today can be challenging—it’s hard to gauge the level of support or spec compliance you’ll get. Some SDKs are lightning-fast with updates, while others might lag behind feature-wise.
We’re introducing a clear tiering system for SDKs. You’ll know exactly what you’re signing up for before committing to a dependency, based on factors like specification compliance speed, maintenance responsiveness, and feature completeness.
## Call for Contributors#
MCP is only as strong as the community behind it. Whether you’re an individual developer passionate about building SDKs or a company looking to invest in the ecosystem, we need your help in several key areas.
### SDK Maintenance#
 * **TypeScript SDK** - Needs additional maintainers for feature development and bug fixes
 * **Swift SDK** - Requires attention for Apple ecosystem support
 * Other language SDKs welcome continued contributions

### Tooling#
 * **Inspector** - Development and maintenance of debugging tools for MCP server developers
 * **Registry** - Backend API and CLI development; **Go expertise would be particularly welcome**

## Input from Client Developers#
We talk a lot about MCP servers, but clients are equally important—they’re the bridge connecting users to the entire MCP ecosystem. If you’re building an MCP client, you’re seeing the protocol from a unique angle, and we need that perspective embedded in the protocol design.
Your real-world experience with implementation challenges, performance bottlenecks, and user needs directly shapes where the protocol should go next. Whether it’s feedback on existing capabilities or ideas for streamlining the developer experience, we want to hear from you.
Join us in the `#client-implementors` working group channel in the MCP Discord.
## Looking Ahead#
With governance structures and working groups in place, we’re better positioned to tackle major protocol improvements efficiently while ensuring everyone has a voice in the process. The foundational work we’ve done this summer gives us a solid base to build from.
The improvements coming in November—async operations, better scalability, server discovery, and standardized extensions—will help MCP become a stronger backbone for production AI integrations. But we can’t do it alone.
MCP’s strength has always been that it’s an **open protocol built by the community, for the community**. We’re excited to keep building it together.
Thank you for your continued support, and we look forward to sharing more soon.
 * Mcp
 * Protocol
 * Roadmap
 * Community

Next » 
Introducing the MCP Registry© 2025 mcp blog · Powered by Hugo & PaperMod[](http://blog.modelcontextprotocol.io/posts/2025-09-26-mcp-next-version-update/#top "Go to Top \(Alt + G\)")


---

# mcp blog

## URL
http://blog.modelcontextprotocol.io/page/2

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.139507

## Content
mcp blog")
 * Documentation 
 * GitHub 

## Building to Last: A New Governance Model for MCP
Since its open source release in November of 2024, the Model Context Protocol project has grown faster than we could have ever imagined. That’s a wonderful problem to have, but with growth come growing pains. Our existing processes, which worked well for a small team, have started to show their limits. Today, we’re taking a big step to ensure MCP can continue to grow and thrive. We’re introducing a formal governance model designed to bring clarity to the development process while preserving the collaborative, open source spirit that has made MCP successful. ...
July 31, 2025 · 4 min · David Soria Parra (Lead Maintainer)[](http://blog.modelcontextprotocol.io/posts/2025-07-31-governance-for-mcp/)
## The Model Context Protocol Blog
Welcome to the official Model Context Protocol (MCP) blog! This is where we’ll share the latest updates, tutorials, best practices, and insights about MCP. About MCP The Model Context Protocol is an open standard that enables seamless integration between AI assistants and external data sources and tools. It provides a universal way for AI models to interact with local services, APIs, and data stores. Get Involved We’re excited to build this ecosystem together with you. Here’s how you can participate: ...
July 2, 2025 · 1 min · The MCP project[](http://blog.modelcontextprotocol.io/posts/welcome-to-mcp-blog/)« Prev © 2025 mcp blog · Powered by Hugo & PaperMod[](http://blog.modelcontextprotocol.io/page/2/#top "Go to Top \(Alt + G\)")


---

# Introducing the MCP Registry | mcp blog

## URL
http://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.139606

## Content
mcp blog")
 * Documentation 
 * GitHub 

Home » Posts
# Introducing the MCP Registry
September 8, 2025 · 4 min · David Soria Parra (Lead Maintainer), Adam Jones (Registry Maintainer), Tadas Antanavicius (Registry Maintainer), Toby Padilla (Registry Maintainer), Theodora Chu (MCP PM at Anthropic)
Today, we’re launching the Model Context Protocol (MCP) Registry—an open catalog and API for publicly available MCP servers to improve discoverability and implementation. By standardizing how servers are distributed and discovered, we’re expanding their reach while making it easier for clients to get connected.
The MCP Registry is now available in preview. To get started:
 * **Add your server** by following our guide on Adding Servers to the MCP Registry (for server maintainers)
 * **Access server data** by following our guide on Accessing MCP Registry Data (for client maintainers)

# Single source of truth for MCP servers#
In March 2025, we shared that we wanted to build a central registry for the MCP ecosystem. Today we are announcing that we’ve launched <https://registry.modelcontextprotocol.io> as the official MCP Registry. As part of the MCP project, the MCP Registry, as well as a parent OpenAPI specification, are open source—allowing everyone to build a compatible sub-registry.
Our goal is to standardize how servers are distributed and discovered, providing a primary source of truth that sub-registries can build upon. In turn, this will expand server reach and help clients find servers more easily across the MCP ecosystem.
## Public and private sub-registries#
In building a central registry, it was important to us not to take away from existing registries that the community and companies have built. The MCP Registry serves as a primary source of truth for publicly available MCP servers, and organizations can choose to create sub-registries based on custom criteria. For example:
**Public subregistries** like opinionated “MCP marketplaces” associated with each MCP client are free to augment and enhance data they ingest from the upstream MCP Registry. Every MCP end-user persona will have different needs, and it is up to the MCP client marketplaces to properly serve their end-users in opinionated ways.
**Private subregistries** will exist within enterprises that have strict privacy and security requirements, but the MCP Registry gives these enterprises a single upstream data source they can build upon. At a minimum, we aim to share API schemas with these private implementations so that associated SDKs and tooling can be shared across the ecosystem.
In both cases, the MCP Registry is the starting point – it’s the centralized location where MCP server maintainers publish and maintain their self-reported information for these downstream consumers to massage and deliver to their end-users.
## Community-driven mechanism for moderation#
The MCP Registry is an official MCP project maintained by the registry working group and permissively licensed. Community members can submit issues to flag servers that violate the MCP moderation guidelines—such as those containing spam, malicious code, or impersonating legitimate services. Registry maintainers can then denylist these entries and retroactively remove them from public access.
# Getting started#
To get started:
 * **Add your server** by following our guide on Adding Servers to the MCP Registry (for server maintainers)
 * **Access server data** by following our guide on Accessing MCP Registry Data (for client maintainers)

This preview of the MCP Registry is meant to help us improve the user experience before general availability and does not provide data durability guarantees or other warranties. We advise MCP adopters to watch development closely as breaking changes may occur before the registry is made generally available.
As we continue to develop the registry, we encourage feedback and contributions on the modelcontextprotocol/registry GitHub repository: Discussion, Issues, and Pull Requests are all welcome.
# Thanks to the MCP community#
The MCP Registry has been a collaborative effort from the beginning and we are incredibly grateful for the enthusiasm and support from the broader developer community.
In February 2025, it began as a grassroots project when MCP creators David Soria Parra and Justin Spahr-Summers asked the PulseMCP and Goose teams to help build a centralized community registry. Registry Maintainer Tadas Antanavicius from PulseMCP spearheaded the initial effort in collaboration with Alex Hancock from Block. They were soon joined by Registry Maintainer Toby Padilla, Head of MCP at GitHub, and more recently, Adam Jones from Anthropic joined as Registry Maintainer to drive the project towards the launch today. The initial announcement of the MCP Registry’s development lists 16 contributing individuals from at least 9 different companies.
Many others made crucial contributions to bring this project to life: Radoslav Dimitrov from Stacklok, Avinash Sridhar from GitHub, Connor Peet from VS Code, Joel Verhagen from NuGet, Preeti Dewani from Last9, Avish Porwal from Microsoft, Jonathan Hefner, and many Anthropic and GitHub employees that provided code reviews and development support. We are also grateful to everyone on the Registry’s contributors log and those who participated in discussions and issues.
We deeply appreciate everyone investing in this foundational open source infrastructure. Together, we’re helping developers and organizations worldwide to build more reliable, context-aware AI applications. On behalf of the MCP community, thank you.
 * Announcement
 * Community

« Prev 
Update on the Next MCP Protocol Release Next » 
Announcing the Official PHP SDK for MCP© 2025 mcp blog · Powered by Hugo & PaperMod[](http://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/#top "Go to Top \(Alt + G\)")


---

# SEP Guidelines - Model Context Protocol

## URL
https://modelcontextprotocol.io/community/sep-guidelines

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.139762

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Governance
SEP Guidelines
DocumentationSpecificationCommunityAbout MCP
 * Contributor Communication

##### Governance
 * Governance and Stewardship
 * SEP Guidelines
 * Working and Interest Groups
 * Antitrust Policy

##### Roadmap
 * Roadmap

##### Examples
 * Example Clients
 * Example Servers

On this page
 * What is a SEP?
 * What qualifies a SEP?
 * SEP Types
 * Submitting a SEP
 * SEP Workflow
 * SEP Format
 * SEP States
 * SEP Review & Resolution
 * Reporting SEP Bugs, or Submitting SEP Updates
 * Transferring SEP Ownership
 * Copyright

Governance
# SEP Guidelines
Copy page
Specification Enhancement Proposal (SEP) guidelines for proposing changes to the Model Context Protocol
Copy page
## 
​
What is a SEP?
SEP stands for Specification Enhancement Proposal. A SEP is a design document providing information to the MCP community, or describing a new feature for the Model Context Protocol or its processes or environment. The SEP should provide a concise technical specification of the feature and a rationale for the feature. We intend SEPs to be the primary mechanisms for proposing major new features, for collecting community input on an issue, and for documenting the design decisions that have gone into MCP. The SEP author is responsible for building consensus within the community and documenting dissenting opinions. Because the SEPs are maintained as text files in a versioned repository (GitHub Issues), their revision history is the historical record of the feature proposal.
## 
​
What qualifies a SEP?
The goal is to reserve the SEP process for changes that are substantial enough to require broad community discussion, a formal design document, and a historical record of the decision-making process. A regular GitHub issue or pull request is often more appropriate for smaller, more direct changes. Consider proposing a SEP if your change involves any of the following:
 * **A New Feature or Protocol Change** : Any change that adds, modifies, or removes features in the Model Context Protocol. This includes: 
 * Adding new API endpoints or methods.
 * Changing the syntax or semantics of existing data structures or messages.
 * Introducing a new standard for interoperability between different MCP-compatible tools.
 * Significant changes to how the specification itself is defined, presented, or validated.
 * **A Breaking Change** : Any change that is not backwards-compatible.
 * **A Change to Governance or Process** : Any proposal that alters the project’s decision-making, contribution guidelines (like this document itself).
 * **A Complex or Controversial Topic** : If a change is likely to have multiple valid solutions or generate significant debate, the SEP process provides the necessary framework to explore alternatives, document the rationale, and build community consensus before implementation begins.

## 
​
SEP Types
There are three kinds of SEP:
 1. **Standards Track** SEP describes a new feature or implementation for the Model Context Protocol. It may also describe an interoperability standard that will be supported outside the core protocol specification.
 2. **Informational** SEP describes a Model Context Protocol design issue, or provides general guidelines or information to the MCP community, but does not propose a new feature. Informational SEPs do not necessarily represent an MCP community consensus or recommendation.
 3. **Process** SEP describes a process surrounding MCP, or proposes a change to (or an event in) a process. Process SEPs are like Standards Track SEPs but apply to areas other than the MCP protocol itself.

## 
​
Submitting a SEP
The SEP process begins with a new idea for the Model Context Protocol. It is highly recommended that a single SEP contain a single key proposal or new idea. Small enhancements or patches often don’t need a SEP and can be injected into the MCP development workflow with a pull request to the MCP repo. The more focused the SEP, the more successful it tends to be. Each SEP must have an **SEP author** — someone who writes the SEP using the style and format described below, shepherds the discussions in the appropriate forums, and attempts to build community consensus around the idea. The SEP author should first attempt to ascertain whether the idea is SEP-able. Posting to the MCP community forums (Discord, GitHub Discussions) is the best way to go about this.
### 
​
SEP Workflow
SEPs should be submitted as a GitHub Issue in the specification repository. The standard SEP workflow is:
 1. You, the SEP author, create a well-formatted GitHub Issue with the `SEP` and `proposal` tags. The SEP number is the same as the GitHub Issue number, the two can be used interchangably.
 2. Find a Core Maintainer or Maintainer to sponsor your proposal. Core Maintainers and Maintainers will regularly go over the list of open proposals to determine which proposals to sponsor. You can tag relevant maintainers from the maintainer list in your proposal.
 3. Once a sponsor is found, the GitHub Issue is assigned to the sponsor. The sponsor will add the `draft` tag, ensure the SEP number is in the title, and assign a milestone.
 4. The sponsor will informally review the proposal and may request changes based on community feedback. When ready for formal review, the sponsor will add the `in-review` tag.
 5. After the `in-review` tag is added, the SEP enters formal review by the Core Maintainers team. The SEP may be accepted, rejected, or returned for revision.
 6. If the SEP has not found a sponsor within three months, Core Maintainers may close the SEP as `dormant`.

### 
​
SEP Format
Each SEP should have the following parts:
 1. **Preamble** — A short descriptive title, the names and contact info for each author, the current status.
 2. **Abstract** — A short (~200 word) description of the technical issue being addressed.
 3. **Motivation** — The motivation should clearly explain why the existing protocol specification is inadequate to address the problem that the SEP solves. The motivation is critical for SEPs that want to change the Model Context Protocol. SEP submissions without sufficient motivation may be rejected outright.
 4. **Specification** — The technical specification should describe the syntax and semantics of any new protocol feature. The specification should be detailed enough to allow competing, interoperable implementations. A PR with the changes to the specification should be provided.
 5. **Rationale** — The rationale explains why particular design decisions were made. It should describe alternate designs that were considered and related work. The rationale should provide evidence of consensus within the community and discuss important objections or concerns raised during discussion.
 6. **Backward Compatibility** — All SEPs that introduce backward incompatibilities must include a section describing these incompatibilities and their severity. The SEP must explain how the author proposes to deal with these incompatibilities.
 7. **Reference Implementation** — The reference implementation must be completed before any SEP is given status “Final”, but it need not be completed before the SEP is accepted. While there is merit to the approach of reaching consensus on the specification and rationale before writing code, the principle of “rough consensus and running code” is still useful when it comes to resolving many discussions of protocol details.
 8. **Security Implications** — If there are security concerns in relation to the SEP, those concerns should be explicitly written out to make sure reviewers of the SEP are aware of them.

### 
​
SEP States
SEPs can be one one of the following states
 * `proposal`: SEP proposal without a sponsor.
 * `draft`: SEP proposal with a sponsor.
 * `in-review`: SEP proposal ready for review.
 * `accepted`: SEP accepted by Core Maintainers, but still requires final wording and reference implementation.
 * `rejected`: SEP rejected by Core Maintainers.
 * `withdrawn`: SEP withdrawn.
 * `final`: SEP finalized.
 * `superseded`: SEP has been replaced by a newer SEP.
 * `dormant`: SEP that has not found sponsors and was subsequently closed.

### 
​
SEP Review & Resolution
SEPs are reviewed by the MCP Core Maintainers team on a bi-weekly basis. For a SEP to be accepted it must meet certain minimum criteria:
 * A prototype implementation demonstrating the proposal
 * Clear benefit to the MCP ecosystem
 * Community support and consensus

Once a SEP has been accepted, the reference implementation must be completed. When the reference implementation is complete and incorporated into the main source code repository, the status will be changed to “Final”. A SEP can also be “Rejected” or “Withdrawn”. A SEP that is “Withdrawn” may be re-submitted at a later date.
## 
​
Reporting SEP Bugs, or Submitting SEP Updates
How you report a bug, or submit a SEP update depends on several factors, such as the maturity of the SEP, the preferences of the SEP author, and the nature of your comments. For SEPs not yet reaching `final` state, it’s probably best to send your comments and changes directly to the SEP author. Once SEP is finalized, you may want to submit corrections as a GitHub comment on the issue or pull request to the reference implementation.
## 
​
Transferring SEP Ownership
It occasionally becomes necessary to transfer ownership of SEPs to a new SEP author. In general, we’d like to retain the original author as a co-author of the transferred SEP, but that’s really up to the original author. A good reason to transfer ownership is because the original author no longer has the time or interest in updating it or following through with the SEP process, or has fallen off the face of the ‘net (i.e. is unreachable or not responding to email). A bad reason to transfer ownership is because you don’t agree with the direction of the SEP. We try to build consensus around a SEP, but if that’s not possible, you can always submit a competing SEP.
## 
​
Copyright
This document is placed in the public domain or under the CC0-1.0-Universal license, whichever is more permissive.
Was this page helpful?
YesNo
Governance and StewardshipWorking and Interest Groups
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Antitrust Policy - Model Context Protocol

## URL
https://modelcontextprotocol.io/community/antitrust

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.139868

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Governance
Antitrust Policy
DocumentationSpecificationCommunityAbout MCP
 * Contributor Communication

##### Governance
 * Governance and Stewardship
 * SEP Guidelines
 * Working and Interest Groups
 * Antitrust Policy

##### Roadmap
 * Roadmap

##### Examples
 * Example Clients
 * Example Servers

On this page
 * Introduction
 * Participation
 * Conduct of Meetings
 * Requirements/Standard Setting
 * Contact Information

Governance
# Antitrust Policy
Copy page
MCP Project Antitrust Policy for participants and contributors
Copy page
**Effective: September 29, 2025**
## 
​
Introduction
The goal of the Model Context Protocol open source project (the “Project”) is to develop a universal standard for model-to-world interactions, including enabling LLMs and agents to seamlessly connect with and utilize external data sources and tools. The purpose of this Antitrust Policy (the “Policy”) is to avoid antitrust risks in carrying out this pro-competitive mission. Participants in and contributors to the Project (collectively, “participants”) will use their best reasonable efforts to comply in all respects with all applicable state and federal antitrust and trade regulation laws, and applicable antitrust/competition laws of other countries (collectively, the “Antitrust Laws”). The goal of Antitrust Laws is to encourage vigorous competition. Nothing in this Policy prohibits or limits the ability of participants to make, sell or use any product, or otherwise to compete in the marketplace. This Policy provides general guidance on compliance with Antitrust Law. Participants should contact their respective legal counsel to address specific questions. This Policy is conservative and is intended to promote compliance with the Antitrust Laws, not to create duties or obligations beyond what the Antitrust Laws actually require. In the event of any inconsistency between this Policy and the Antitrust Laws, the Antitrust Laws preempt and control.
## 
​
Participation
Technical participation in the Project shall be open to all, subject only to compliance with the provisions of the Project’s charter and other governance documents.
## 
​
Conduct of Meetings
At meetings among actual or potential competitors, there is a risk that participants in those meetings may improperly disclose or discuss information in violation of the Antitrust Laws or otherwise act in an anti-competitive manner. To avoid this risk, participants must adhere to the following policies when participating in Project-related or sponsored meetings, conference calls, or other forums (collectively, “Project Meetings”). Participants must not, in fact or appearance, discuss or exchange information regarding:
 * An individual company’s current or projected prices, price changes, price differentials, markups, discounts, allowances, terms and conditions of sale, including credit terms, etc., or data that bear on prices, including profits, margins or cost.
 * Industry-wide pricing policies, price levels, price changes, differentials, or the like.
 * Actual or projected changes in industry production, capacity or inventories.
 * Matters relating to bids or intentions to bid for particular products, procedures for responding to bid invitations or specific contractual arrangements.
 * Plans of individual companies concerning the design, characteristics, production, distribution, marketing or introduction dates of particular products, including proposed territories or customers.
 * Matters relating to actual or potential individual suppliers that might have the effect of excluding them from any market or of influencing the business conduct of firms toward such suppliers.
 * Matters relating to actual or potential customers that might have the effect of influencing the business conduct of firms toward such customers.
 * Individual company current or projected cost of procurement, development or manufacture of any product.
 * Individual company market shares for any product or for all products.
 * Confidential or otherwise sensitive business plans or strategy.

In connection with all Project Meetings, participants must do the following:
 * Adhere to prepared agendas.
 * Insist that meeting minutes be prepared and distributed to all participants, and that meeting minutes accurately reflect the matters that transpired.
 * Consult with their respective counsel on all antitrust questions related to Project Meetings.
 * Protest against any discussions that appear to violate these policies or the Antitrust Laws, leave any meeting in which such discussions continue, and either insist that such protest be noted in the minutes.

## 
​
Requirements/Standard Setting
The Project may establish standards, technical requirements and/or specifications for use (collectively, “requirements”). Participants shall not enter into agreements that prohibit or restrict any participant from establishing or adopting any other requirements. Participants shall not undertake any efforts, directly or indirectly, to prevent any firm from manufacturing, selling, or supplying any product not conforming to a requirement. The Project shall not promote standardization of commercial terms, such as terms for license and sale.
## 
​
Contact Information
To contact the Project regarding matters addressed by this Antitrust Policy, please send an email to antitrust@modelcontextprotocol.io, and reference “Antitrust Policy” in the subject line.
Was this page helpful?
YesNo
Working and Interest GroupsRoadmap
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Evolving OAuth Client Registration in the Model Context Protocol | mcp blog

## URL
http://blog.modelcontextprotocol.io/posts/client_registration

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.140083

## Content
mcp blog")
 * Documentation 
 * GitHub 

Home » Posts
# Evolving OAuth Client Registration in the Model Context Protocol
August 22, 2025 · 10 min · Paul Carleton (Core Maintainer)
The Model Context Protocol (MCP) has adopted OAuth 2.1 as the foundation for its authorization framework. A key part of the authorization flow that MCP is particularly reliant on is **client registration**.
This is especially important in a world where clients and servers don’t have a pre-existing relationship - we can’t assume that we will always know which MCP clients will connect to which MCP servers. This design highlights two challenges that need to be addressed:
 * Operational issues with managing client IDs via Dynamic Client Registration (DCR)
 * Preventing client impersonation

If you’re already familiar with OAuth and the current state of client registration in MCP, skip to Two Distinct Challenges in MCP Client Registration.
## Background on OAuth#
A protected MCP server that implements OAuth 2.1 should allow a user to grant a client access to itself and prevent attempts to trick the user into granting access to a client they didn’t intend to use via phishing.
The authorization flow can be best described by looking at this sequence diagram:
```
Resource ServerAuthorization ServerUserClientResource ServerAuthorization ServerUserClient1. Redirect to authorization serverNavigate to auth URL2. Display consent screenApprove access3. Redirect with authorization code4. Exchange code for access tokenAccess token (saved)5. Request with access tokenProtected resource
```

This flow requires a few steps to be performed to acquire an access token:
 1. The client directs the user to an authorization UI provided by the authorization server
 2. The authorization server displays a consent screen to the user
 3. User approves client access and the authorization server redirects the user back to the client with an access code
 4. Client exchanges the access code for a set of tokens, which are cached locally
 5. Client uses the access token to access the MCP server

To be able to initiate this flow, however, the authorization server first needs some basic information about the client that is kicking off the authorization process:
 1. **Client name** : Human readable text to display in the consent screen to help the user decide whether they want to grant access.
 2. **Redirect URL** : The destination to send the authorization code back to if the user consents.

In order to prevent a malicious client from tricking a user into granting access they didn’t intend to grant, the authorization server must be able to trust the client information it has.
For example, a malicious client could claim to be `Claude Desktop` on the consent screen while actually being owned by someone not affiliated with Claude Desktop developers. Seeing the client information on the consent screen, users might grant access thinking they’re authorizing the legitimate Claude Desktop, not realizing that some malicious client now has access to their account.
## Improving Client Registration in MCP#
For MCP users, a common pattern is to connect to an MCP server by using its URL directly in a MCP client.
This goes against the typical OAuth authorization pattern because the user is selecting the resource server to connect to rather than the client developer. This problem is compounded by the fact that there is an unbounded number of authorization servers that a MCP server may use, meaning that clients need to be able to complete the authorization flow regardless of the provider used.
Some client developers have implemented pre-registration with a select few authorization servers. In this scenario, the client doesn’t need to rely on DCR when it detects an authorization server it knows. However, this is a solution that doesn’t scale given the breadth of the MCP ecosystem - it’s impossible to have every client be registered with every authorization server there is. To mitigate this challenge, we set out to outline some of the goals that we wanted to achieve with improving the client registration experience:
 1. **Clients** : Client developers don’t need to implement pre-registration and distribute a client ID for each authorization server MCP servers might be using.
 2. **Users** : Users don’t need to go through a pre-registration process themselves and manually specify a client ID for every MCP server they connect to.
 3. **Authorization servers** :

 * **Trust in Metadata** : Authorization servers have a way to trust the metadata they associate with a client, such as name and redirect URL.
 * **Single Client ID per App** : Authorization servers can have a single client ID per client for governance and management purposes
 * **Selective Allow/Deny** : Authorization servers can selectively allow or deny clients based on their policies.
 * **Database Management** : Authorization servers do not need to handle an unbounded database or expiration flows for every new client registration.

Currently, none of our existing client registration approaches satisfy all of these requirements. Pre-registration requires too much effort in a highly variable setting (unbounded number of clients connecting to unbounded number of servers), while DCR reduces effort but creates operational issues that a lot of the authorization servers are not ready to tackle yet.
## Two Distinct Challenges in MCP Client Registration#
After extensive discussion with MCP server implementers, we’ve identified that a few competing solutions to the registration problem were addressing two distinct issues:
 1. **Operational limitations** of Dynamic Client Registration in open environments
 2. **Client identity and impersonation** risks across different deployment scenarios

## **Challenge 1: Operational Limitations of Dynamic Client Registration**#
### **The DCR Model Mismatch**#
The DCR design takes the pre-registration pattern available in modern OAuth-based authorization servers and makes it available via an API. In fully open environments like MCP, DCR really puts the spotlight on a few operational challenges that an open registration endpoint introduces:
**For authorization servers:**
 * **Unbounded database growth** : Every time a user connects a client to an MCP server, a new registration is created with the authorization server unless the client already has one. Registrations are also not portable, so using Claude Desktop on your Windows machine, and then jumping to Claude Desktop on macOS will create two distinct client registrations.
 * **Client expiry “black hole”** : There’s no way to tell a client that its ID is invalid without creating an open redirect vulnerability. Clients have to implement their own heuristics for client ID management.
 * **Per-instance confusion** : Each client instance typically gets its own client ID even when using the same application, but on different machines or across different users. From an auditing perspective, an authorization server administrator may see hundreds (if not thousands) of records for the same application without any rhyme or reason.
 * **Denial-of-Service vulnerability** : An unauthenticated `/register` endpoint writes to a database within the authorization server, meaning that tenant admins now need to worry about rate limiting or policy controls (e.g., hosts allowed to register clients).

**For clients:**
 * **Extra overhead** : Managing registration state and another secret beyond access/refresh tokens
 * **No validity checking** : Can’t verify if a client ID is still valid
 * **Unclear lifecycle** : No guidance on when to re-register or update credentials

### **Solution: Client ID Metadata Documents (CIMD)**#
Client ID Metadata Documents (CIMD), described in OAuth Client ID Metadata Document and implemented by Bluesky, elegantly sidestep these operational issues.
Instead of a registration step, clients use an HTTPS metadata URL as their client ID directly. The server fetches the metadata from the URL at authorization time:
```
MetadataURLAuthServerClientMetadataURLAuthServerClientAuthorization request (client_id=https://app.com/oauth.json)GET https://app.com/oauth.json{name: "App", redirect_uris: [...]}Show consent screen & continue flow
```

This addresses all the operational issues:
 * **No unbounded database growth** : Servers fetch metadata on-demand (can cache for performance)
 * **No expiry management** : The URL is the ID - it doesn’t expire
 * **Natural per-app model** : One URL per application, not per user
 * **No registration endpoint** : No unauthenticated write operations

The cost? Clients need to host a metadata document at an HTTPS URL. For web applications, this is trivial. For desktop applications, this typically means hosting on their backend infrastructure.
## **Challenge 2: Client Identity and Impersonation**#
The second challenge is orthogonal to the DCR vs. CIMD debate - it’s about trusting that a client is who it claims to be. This problem will exist regardless of how the registration process is implemented.
For web-based clients, trust is more straightforward, as we have an HTTPS domain that’s tied to a certificate authority. For desktop clients, if the client can’t offload its authorization to existing backend infrastructure, there is difficulty trusting the client is legitimate and unmodified.
### The Trust Spectrum#
We can map impersonation scenarios on two axes: attacker cost and mitigation complexity.
!Mitigation Cost vs Attack Cost
**Low attacker cost/Low mitigation complexity: Domain-based attacks**
 * **Attack** : Register malicious callback URI and claim to be `Claude Desktop`
 * **Cost** : Trick user into clicking a link and consenting
 * **Mitigation** :
 * Restrict trusted domains/URLs
 * Show warnings for unknown domains
 * Works with both DCR and CIMD

**Medium attacker cost/Medium mitigation complexity:`localhost` impersonation**
 * **Attack** : Run malicious app on `localhost:8080`, impersonate legitimate client
 * **Cost** : Trick user into running a malicious application (plus consenting for that app to have data access)
 * **Problem** : Desktop apps can’t hold secrets, hard to prove identity

**High attacker cost/High mitigation complexity: Platform-attested applications**
 * **Attack** : Get malicious client signed by a trusted authority
 * **Cost** : Extremely high - requires compromising certification vendor processes
 * **Mitigation** : platform system-level attestation (future work)

### **Solution: Software Statements for Desktop Applications**#
To broadly solve the client impersonation for the middle tier as well as to prevent `localhost` impersonation we need signed software statements. Implementing this would require:
 1. Client hosts a JSON Web Key Set (JWKS) on their backend
 2. Client authenticates the user through their own flow
 3. The client-owned backend service issues a short-lived, signed JWT attesting to the client’s identity
 4. Client includes this JWT in the OAuth flow
 5. Authorization server verifies the JWT against the trusted JWKS

This dramatically raises the bar for client impersonation, as an attacker would need to:
 * Compromise the client’s backend infrastructure, or
 * Successfully impersonate the client’s authentication flow

Crucially, **software statements work with both DCR and CIMD**. They’re not a competing solution - they’re a complementary security layer.
### **Future: Platform-Level Attestation**#
The strongest protection would be platform-level attestation, e.g. having macOS, Windows, or Android attest that a piece of software is legitimate.
Having OS-level attestation would make client impersonation unreasonably expensive. While the exact way this ties into a software statement is yet to be prototyped, the general direction is threading platform-level application identity validation through to the OAuth flow.
## **The Complementary Path Forward**#
While we’re looking at all available options, it’s important to note that we’re not choosing between solutions. We’re exploring complementary approaches for distinct problems:
**For operational issues** : We are looking at adding CIMD support in favor of DCR
 * Keep DCR for backward compatibility
 * Recommend CIMD for new implementations
 * Both achieve the same authorization goal

**For trust issues** : Layering software statements on top
 * Optional enhancement for both DCR and CIMD
 * Required only when `localhost` impersonation is a concern
 * Authorization servers choose their required trust level

## **Security Considerations**#
Both CIMD and software statements require authorization servers to make outbound HTTPS requests, potentially to untrusted domains. Implementations must:
 * Prevent SSRF attacks by blocking internal network access
 * Implement timeouts and size limits
 * Consider caching strategies for performance
 * Validate response formats strictly

If we adopt these approaches, we’ll need good best practices and SDK support to help avoid vulnerabilities and provide a easy path for implementors.
## **Next Steps**#
Discussions for these approaches are happening in the Specification Enhancement Proposals (SEP):
 * SEP-991: Client ID Metadata Documents
 * SEP-1032: Software Statements with DCR

Get involved: Join the conversation in Discord (the #auth-wg-client-registration channel) or comment on the SEPs directly.
A big thank to the following folks for help with this blog post: Den Delimarsky, Aaron Parecki, Geoff Goodman, Andrew Block, Pieter Kasselman, Abhishek Hingnikar, and Bobby Tiernay.
 * Security
 * Authorization

« Prev 
Announcing the Official PHP SDK for MCP Next » 
MCP Prompts: Building Workflow Automation© 2025 mcp blog · Powered by Hugo & PaperMod[](http://blog.modelcontextprotocol.io/posts/client_registration/#top "Go to Top \(Alt + G\)")


---

# Build an MCP server - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/develop/build-server

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.140383

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Develop with MCP
Build an MCP server
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * What we’ll be building
 * Core MCP Concepts
 * Prerequisite knowledge
 * Logging in MCP Servers
 * Best Practices
 * Quick Examples
 * System requirements
 * Set up your environment
 * Building your server
 * Importing packages and setting up the instance
 * Helper functions
 * Implementing tool execution
 * Running the server
 * Testing your server with Claude for Desktop
 * What’s happening under the hood
 * Troubleshooting
 * Next steps

Develop with MCP
# Build an MCP server
Copy page
Get started building your own server to use in Claude for Desktop and other clients.
Copy page
In this tutorial, we’ll build a simple MCP weather server and connect it to a host, Claude for Desktop.
### 
​
What we’ll be building
We’ll build a server that exposes two tools: `get_alerts` and `get_forecast`. Then we’ll connect the server to an MCP host (in this case, Claude for Desktop):

Servers can connect to any client. We’ve chosen Claude for Desktop here for simplicity, but we also have guides on building your own client as well as a list of other clients here.
### 
​
Core MCP Concepts
MCP servers can provide three main types of capabilities:
 1. **Resources** : File-like data that can be read by clients (like API responses or file contents)
 2. **Tools** : Functions that can be called by the LLM (with user approval)
 3. **Prompts** : Pre-written templates that help users accomplish specific tasks

This tutorial will primarily focus on tools.
 * Python
 * Node
 * Java
 * Kotlin
 * C#

Let’s get started with building our weather server! You can find the complete code for what we’ll be building here.
### 
​
Prerequisite knowledge
This quickstart assumes you have familiarity with:
 * Python
 * LLMs like Claude

### 
​
Logging in MCP Servers
When implementing MCP servers, be careful about how you handle logging:**For STDIO-based servers:** Never write to standard output (stdout). This includes:
 * `print()` statements in Python
 * `console.log()` in JavaScript
 * `fmt.Println()` in Go
 * Similar stdout functions in other languages

Writing to stdout will corrupt the JSON-RPC messages and break your server.**For HTTP-based servers:** Standard output logging is fine since it doesn’t interfere with HTTP responses.
### 
​
Best Practices
 1. Use a logging library that writes to stderr or files.
 2. Tool names should follow the format specified here.

### 
​
Quick Examples
Copy
```
# ❌ Bad (STDIO)
print("Processing request")
# ✅ Good (STDIO)
import logging
logging.info("Processing request")

```

### 
​
System requirements
 * Python 3.10 or higher installed.
 * You must use the Python MCP SDK 1.2.0 or higher.

### 
​
Set up your environment
First, let’s install `uv` and set up our Python project and environment:
macOS/Linux
Windows
Copy
```
curl -LsSf https://astral.sh/uv/install.sh | sh

```

Make sure to restart your terminal afterwards to ensure that the `uv` command gets picked up.Now, let’s create and set up our project:
macOS/Linux
Windows
Copy
```
# Create a new directory for our project
uv init weather
cd weather
# Create virtual environment and activate it
uv venv
source .venv/bin/activate
# Install dependencies
uv add "mcp[cli]" httpx
# Create our server file
touch weather.py

```

Now let’s dive into building your server.
## 
​
Building your server
### 
​
Importing packages and setting up the instance
Add these to the top of your `weather.py`:
Copy
```
from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP
# Initialize FastMCP server
mcp = FastMCP("weather")
# Constants
NWS_API_BASE = "https://api.weather.gov"
USER_AGENT = "weather-app/1.0"

```

The FastMCP class uses Python type hints and docstrings to automatically generate tool definitions, making it easy to create and maintain MCP tools.
### 
​
Helper functions
Next, let’s add our helper functions for querying and formatting the data from the National Weather Service API:
Copy
```
async def make_nws_request(url: str) -> dict[str, Any] | None:
    """Make a request to the NWS API with proper error handling."""
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json"
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None
def format_alert(feature: dict) -> str:
    """Format an alert feature into a readable string."""
    props = feature["properties"]
    return f"""
Event: {props.get('event', 'Unknown')}
Area: {props.get('areaDesc', 'Unknown')}
Severity: {props.get('severity', 'Unknown')}
Description: {props.get('description', 'No description available')}
Instructions: {props.get('instruction', 'No specific instructions provided')}
"""

```

### 
​
Implementing tool execution
The tool execution handler is responsible for actually executing the logic of each tool. Let’s add it:
Copy
```
@mcp.tool()
async def get_alerts(state: str) -> str:
    """Get weather alerts for a US state.
    Args:
        state: Two-letter US state code (e.g. CA, NY)
    """
    url = f"{NWS_API_BASE}/alerts/active/area/{state}"
    data = await make_nws_request(url)
    if not data or "features" not in data:
        return "Unable to fetch alerts or no alerts found."
    if not data["features"]:
        return "No active alerts for this state."
    alerts = [format_alert(feature) for feature in data["features"]]
    return "\n---\n".join(alerts)
@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """Get weather forecast for a location.
    Args:
        latitude: Latitude of the location
        longitude: Longitude of the location
    """
    # First get the forecast grid endpoint
    points_url = f"{NWS_API_BASE}/points/{latitude},{longitude}"
    points_data = await make_nws_request(points_url)
    if not points_data:
        return "Unable to fetch forecast data for this location."
    # Get the forecast URL from the points response
    forecast_url = points_data["properties"]["forecast"]
    forecast_data = await make_nws_request(forecast_url)
    if not forecast_data:
        return "Unable to fetch detailed forecast."
    # Format the periods into a readable forecast
    periods = forecast_data["properties"]["periods"]
    forecasts = []
    for period in periods[:5]:  # Only show next 5 periods
        forecast = f"""
{period['name']}:
Temperature: {period['temperature']}°{period['temperatureUnit']}
Wind: {period['windSpeed']} {period['windDirection']}
Forecast: {period['detailedForecast']}
"""
        forecasts.append(forecast)
    return "\n---\n".join(forecasts)

```

### 
​
Running the server
Finally, let’s initialize and run the server:
Copy
```
def main():
    # Initialize and run the server
    mcp.run(transport='stdio')
if __name__ == "__main__":
    main()

```

Your server is complete! Run `uv run weather.py` to start the MCP server, which will listen for messages from MCP hosts.Let’s now test your server from an existing MCP host, Claude for Desktop.
## 
​
Testing your server with Claude for Desktop
Claude for Desktop is not yet available on Linux. Linux users can proceed to the Building a client tutorial to build an MCP client that connects to the server we just built.
First, make sure you have Claude for Desktop installed. You can install the latest version here. If you already have Claude for Desktop, **make sure it’s updated to the latest version.** We’ll need to configure Claude for Desktop for whichever MCP servers you want to use. To do this, open your Claude for Desktop App configuration at `~/Library/Application Support/Claude/claude_desktop_config.json` in a text editor. Make sure to create the file if it doesn’t exist.For example, if you have VS Code installed:
macOS/Linux
Windows
Copy
```
code ~/Library/Application\ Support/Claude/claude_desktop_config.json

```

You’ll then add your servers in the `mcpServers` key. The MCP UI elements will only show up in Claude for Desktop if at least one server is properly configured.In this case, we’ll add our single weather server like so:
macOS/Linux
Windows
Copy
```
{
  "mcpServers": {
    "weather": {
      "command": "uv",
      "args": [
        "--directory",
        "/ABSOLUTE/PATH/TO/PARENT/FOLDER/weather",
        "run",
        "weather.py"
      ]
    }
  }
}

```

You may need to put the full path to the `uv` executable in the `command` field. You can get this by running `which uv` on macOS/Linux or `where uv` on Windows.
Make sure you pass in the absolute path to your server. You can get this by running `pwd` on macOS/Linux or `cd` on Windows Command Prompt. On Windows, remember to use double backslashes (`\\`) or forward slashes (`/`) in the JSON path.
This tells Claude for Desktop:
 1. There’s an MCP server named “weather”
 2. To launch it by running `uv --directory /ABSOLUTE/PATH/TO/PARENT/FOLDER/weather run weather.py`

Save the file, and restart **Claude for Desktop**.
### 
​
Test with commands
Let’s make sure Claude for Desktop is picking up the two tools we’ve exposed in our `weather` server. You can do this by looking for the “Search and tools” icon:

After clicking on the slider icon, you should see two tools listed:

If your server isn’t being picked up by Claude for Desktop, proceed to the Troubleshooting section for debugging tips. If the tool settings icon has shown up, you can now test your server by running the following commands in Claude for Desktop:
 * What’s the weather in Sacramento?
 * What are the active weather alerts in Texas?

Since this is the US National Weather service, the queries will only work for US locations.
## 
​
What’s happening under the hood
When you ask a question:
 1. The client sends your question to Claude
 2. Claude analyzes the available tools and decides which one(s) to use
 3. The client executes the chosen tool(s) through the MCP server
 4. The results are sent back to Claude
 5. Claude formulates a natural language response
 6. The response is displayed to you!

## 
​
Troubleshooting
Claude for Desktop Integration Issues
**Getting logs from Claude for Desktop** Claude.app logging related to MCP is written to log files in `~/Library/Logs/Claude`:
 * `mcp.log` will contain general logging about MCP connections and connection failures.
 * Files named `mcp-server-SERVERNAME.log` will contain error (stderr) logging from the named server.

You can run the following command to list recent logs and follow along with any new ones:
Copy
```
# Check Claude's logs for errors
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log

```

**Server not showing up in Claude**
 1. Check your `claude_desktop_config.json` file syntax
 2. Make sure the path to your project is absolute and not relative
 3. Restart Claude for Desktop completely

To properly restart Claude for Desktop, you must fully quit the application:
 * **Windows** : Right-click the Claude icon in the system tray (which may be hidden in the “hidden icons” menu) and select “Quit” or “Exit”.
 * **macOS** : Use Cmd+Q or select “Quit Claude” from the menu bar.

Simply closing the window does not fully quit the application, and your MCP server configuration changes will not take effect.
**Tool calls failing silently** If Claude attempts to use the tools but they fail:
 1. Check Claude’s logs for errors
 2. Verify your server builds and runs without errors
 3. Try restarting Claude for Desktop

**None of this is working. What do I do?** Please refer to our debugging guide for better debugging tools and more detailed guidance.
Weather API Issues
**Error: Failed to retrieve grid point data** This usually means either:
 1. The coordinates are outside the US
 2. The NWS API is having issues
 3. You’re being rate limited

Fix:
 * Verify you’re using US coordinates
 * Add a small delay between requests
 * Check the NWS API status page

**Error: No active alerts for [STATE]** This isn’t an error - it just means there are no current weather alerts for that state. Try a different state or check during severe weather.
For more advanced troubleshooting, check out our guide on Debugging MCP
## 
​
Next steps
## Building a client Learn how to build your own MCP client that can connect to your server ## Example servers Check out our gallery of official MCP servers and implementations ## Debugging Guide Learn how to effectively debug MCP servers and integrations ## Building MCP with LLMs Learn how to use LLMs like Claude to speed up your MCP development 
Was this page helpful?
YesNo
Connect to remote MCP ServersBuild an MCP client
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.



---

# Build an MCP client - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/develop/build-client

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.140663

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Develop with MCP
Build an MCP client
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * System Requirements
 * Setting Up Your Environment
 * Setting Up Your API Key
 * Creating the Client
 * Basic Client Structure
 * Server Connection Management
 * Query Processing Logic
 * Interactive Chat Interface
 * Main Entry Point
 * Key Components Explained
 * 1. Client Initialization
 * 2. Server Connection
 * 3. Query Processing
 * 4. Interactive Interface
 * 5. Resource Management
 * Common Customization Points
 * Running the Client
 * How It Works
 * Best practices
 * Troubleshooting
 * Server Path Issues
 * Response Timing
 * Common Error Messages
 * Next steps

Develop with MCP
# Build an MCP client
Copy page
Get started building your own client that can integrate with all MCP servers.
Copy page
In this tutorial, you’ll learn how to build an LLM-powered chatbot client that connects to MCP servers. Before you begin, it helps to have gone through our Build an MCP Server tutorial so you can understand how clients and servers communicate.
 * Python
 * Node
 * Java
 * Kotlin
 * C#

You can find the complete code for this tutorial here.
## 
​
System Requirements
Before starting, ensure your system meets these requirements:
 * Mac or Windows computer
 * Latest Python version installed
 * Latest version of `uv` installed

## 
​
Setting Up Your Environment
First, create a new Python project with `uv`:
macOS/Linux
Windows
Copy
```
# Create project directory
uv init mcp-client
cd mcp-client
# Create virtual environment
uv venv
# Activate virtual environment
source .venv/bin/activate
# Install required packages
uv add mcp anthropic python-dotenv
# Remove boilerplate files
rm main.py
# Create our main file
touch client.py

```

## 
​
Setting Up Your API Key
You’ll need an Anthropic API key from the Anthropic Console.Create a `.env` file to store it:
Copy
```
echo "ANTHROPIC_API_KEY=<your key here>" > .env

```

Add `.env` to your `.gitignore`:
Copy
```
echo ".env" >> .gitignore

```

Make sure you keep your `ANTHROPIC_API_KEY` secure!
## 
​
Creating the Client
### 
​
Basic Client Structure
First, let’s set up our imports and create the basic client class:
Copy
```
import asyncio
from typing import Optional
from contextlib import AsyncExitStack
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from anthropic import Anthropic
from dotenv import load_dotenv
load_dotenv()  # load environment variables from .env
class MCPClient:
    def __init__(self):
        # Initialize session and client objects
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self.anthropic = Anthropic()
    # methods will go here

```

### 
​
Server Connection Management
Next, we’ll implement the method to connect to an MCP server:
Copy
```
async def connect_to_server(self, server_script_path: str):
    """Connect to an MCP server
    Args:
        server_script_path: Path to the server script (.py or .js)
    """
    is_python = server_script_path.endswith('.py')
    is_js = server_script_path.endswith('.js')
    if not (is_python or is_js):
        raise ValueError("Server script must be a .py or .js file")
    command = "python" if is_python else "node"
    server_params = StdioServerParameters(
        command=command,
        args=[server_script_path],
        env=None
    )
    stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server_params))
    self.stdio, self.write = stdio_transport
    self.session = await self.exit_stack.enter_async_context(ClientSession(self.stdio, self.write))
    await self.session.initialize()
    # List available tools
    response = await self.session.list_tools()
    tools = response.tools
    print("\nConnected to server with tools:", [tool.name for tool in tools])

```

### 
​
Query Processing Logic
Now let’s add the core functionality for processing queries and handling tool calls:
Copy
```
async def process_query(self, query: str) -> str:
    """Process a query using Claude and available tools"""
    messages = [
        {
            "role": "user",
            "content": query
        }
    ]
    response = await self.session.list_tools()
    available_tools = [{
        "name": tool.name,
        "description": tool.description,
        "input_schema": tool.inputSchema
    } for tool in response.tools]
    # Initial Claude API call
    response = self.anthropic.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1000,
        messages=messages,
        tools=available_tools
    )
    # Process response and handle tool calls
    final_text = []
    assistant_message_content = []
    for content in response.content:
        if content.type == 'text':
            final_text.append(content.text)
            assistant_message_content.append(content)
        elif content.type == 'tool_use':
            tool_name = content.name
            tool_args = content.input
            # Execute tool call
            result = await self.session.call_tool(tool_name, tool_args)
            final_text.append(f"[Calling tool {tool_name} with args {tool_args}]")
            assistant_message_content.append(content)
            messages.append({
                "role": "assistant",
                "content": assistant_message_content
            })
            messages.append({
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": content.id,
                        "content": result.content
                    }
                ]
            })
            # Get next response from Claude
            response = self.anthropic.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=messages,
                tools=available_tools
            )
            final_text.append(response.content[0].text)
    return "\n".join(final_text)

```

### 
​
Interactive Chat Interface
Now we’ll add the chat loop and cleanup functionality:
Copy
```
async def chat_loop(self):
    """Run an interactive chat loop"""
    print("\nMCP Client Started!")
    print("Type your queries or 'quit' to exit.")
    while True:
        try:
            query = input("\nQuery: ").strip()
            if query.lower() == 'quit':
                break
            response = await self.process_query(query)
            print("\n" + response)
        except Exception as e:
            print(f"\nError: {str(e)}")
async def cleanup(self):
    """Clean up resources"""
    await self.exit_stack.aclose()

```

### 
​
Main Entry Point
Finally, we’ll add the main execution logic:
Copy
```
async def main():
    if len(sys.argv) < 2:
        print("Usage: python client.py <path_to_server_script>")
        sys.exit(1)
    client = MCPClient()
    try:
        await client.connect_to_server(sys.argv[1])
        await client.chat_loop()
    finally:
        await client.cleanup()
if __name__ == "__main__":
    import sys
    asyncio.run(main())

```

You can find the complete `client.py` file here.
## 
​
Key Components Explained
### 
​
1. Client Initialization
 * The `MCPClient` class initializes with session management and API clients
 * Uses `AsyncExitStack` for proper resource management
 * Configures the Anthropic client for Claude interactions

### 
​
2. Server Connection
 * Supports both Python and Node.js servers
 * Validates server script type
 * Sets up proper communication channels
 * Initializes the session and lists available tools

### 
​
3. Query Processing
 * Maintains conversation context
 * Handles Claude’s responses and tool calls
 * Manages the message flow between Claude and tools
 * Combines results into a coherent response

### 
​
4. Interactive Interface
 * Provides a simple command-line interface
 * Handles user input and displays responses
 * Includes basic error handling
 * Allows graceful exit

### 
​
5. Resource Management
 * Proper cleanup of resources
 * Error handling for connection issues
 * Graceful shutdown procedures

## 
​
Common Customization Points
 1. **Tool Handling**
 * Modify `process_query()` to handle specific tool types
 * Add custom error handling for tool calls
 * Implement tool-specific response formatting
 2. **Response Processing**
 * Customize how tool results are formatted
 * Add response filtering or transformation
 * Implement custom logging
 3. **User Interface**
 * Add a GUI or web interface
 * Implement rich console output
 * Add command history or auto-completion

## 
​
Running the Client
To run your client with any MCP server:
Copy
```
uv run client.py path/to/server.py # python server
uv run client.py path/to/build/index.js # node server

```

If you’re continuing the weather tutorial from the server quickstart, your command might look something like this: `python client.py .../quickstart-resources/weather-server-python/weather.py`
The client will:
 1. Connect to the specified server
 2. List available tools
 3. Start an interactive chat session where you can: 
 * Enter queries
 * See tool executions
 * Get responses from Claude

Here’s an example of what it should look like if connected to the weather server from the server quickstart:

## 
​
How It Works
When you submit a query:
 1. The client gets the list of available tools from the server
 2. Your query is sent to Claude along with tool descriptions
 3. Claude decides which tools (if any) to use
 4. The client executes any requested tool calls through the server
 5. Results are sent back to Claude
 6. Claude provides a natural language response
 7. The response is displayed to you

## 
​
Best practices
 1. **Error Handling**
 * Always wrap tool calls in try-catch blocks
 * Provide meaningful error messages
 * Gracefully handle connection issues
 2. **Resource Management**
 * Use `AsyncExitStack` for proper cleanup
 * Close connections when done
 * Handle server disconnections
 3. **Security**
 * Store API keys securely in `.env`
 * Validate server responses
 * Be cautious with tool permissions
 4. **Tool Names**
 * Tool names can be validated according to the format specified here
 * If a tool name conforms to the specified format, it should not fail validation by an MCP client

## 
​
Troubleshooting
### 
​
Server Path Issues
 * Double-check the path to your server script is correct
 * Use the absolute path if the relative path isn’t working
 * For Windows users, make sure to use forward slashes (/) or escaped backslashes (\\) in the path
 * Verify the server file has the correct extension (.py for Python or .js for Node.js)

Example of correct path usage:
Copy
```
# Relative path
uv run client.py ./server/weather.py
# Absolute path
uv run client.py /Users/username/projects/mcp-server/weather.py
# Windows path (either format works)
uv run client.py C:/projects/mcp-server/weather.py
uv run client.py C:\\projects\\mcp-server\\weather.py

```

### 
​
Response Timing
 * The first response might take up to 30 seconds to return
 * This is normal and happens while: 
 * The server initializes
 * Claude processes the query
 * Tools are being executed
 * Subsequent responses are typically faster
 * Don’t interrupt the process during this initial waiting period

### 
​
Common Error Messages
If you see:
 * `FileNotFoundError`: Check your server path
 * `Connection refused`: Ensure the server is running and the path is correct
 * `Tool execution failed`: Verify the tool’s required environment variables are set
 * `Timeout error`: Consider increasing the timeout in your client configuration

## 
​
Next steps
## Example servers Check out our gallery of official MCP servers and implementations ## Example clients View the list of clients that support MCP integrations 
Was this page helpful?
YesNo
Build an MCP serverSDKs
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.



---

# What is the Model Context Protocol (MCP)? - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.140742

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Get started
What is the Model Context Protocol (MCP)?
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * What can MCP enable?
 * Why does MCP matter?
 * Start Building
 * Learn more

Get started
# What is the Model Context Protocol (MCP)?
Copy page
Copy page
MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems. Using MCP, AI applications like Claude or ChatGPT can connect to data sources (e.g. local files, databases), tools (e.g. search engines, calculators) and workflows (e.g. specialized prompts)—enabling them to access key information and perform tasks. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems.

## 
​
What can MCP enable?
 * Agents can access your Google Calendar and Notion, acting as a more personalized AI assistant.
 * Claude Code can generate an entire web app using a Figma design.
 * Enterprise chatbots can connect to multiple databases across an organization, empowering users to analyze data using chat.
 * AI models can create 3D designs on Blender and print them out using a 3D printer.

## 
​
Why does MCP matter?
Depending on where you sit in the ecosystem, MCP can have a range of benefits.
 * **Developers** : MCP reduces development time and complexity when building, or integrating with, an AI application or agent.
 * **AI applications or agents** : MCP provides access to an ecosystem of data sources, tools and apps which will enhance capabilities and improve the end-user experience.
 * **End-users** : MCP results in more capable AI applications or agents which can access your data and take actions on your behalf when necessary.

## 
​
Start Building
## Build servers Create MCP servers to expose your data and tools ## Build clients Develop applications that connect to MCP servers 
## 
​
Learn more
## Understand concepts Learn the core concepts and architecture of MCP 
Was this page helpful?
YesNo
Architecture
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.



---

# Working and Interest Groups - Model Context Protocol

## URL
https://modelcontextprotocol.io/community/working-interest-groups

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.140884

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Governance
Working and Interest Groups
DocumentationSpecificationCommunityAbout MCP
 * Contributor Communication

##### Governance
 * Governance and Stewardship
 * SEP Guidelines
 * Working and Interest Groups
 * Antitrust Policy

##### Roadmap
 * Roadmap

##### Examples
 * Example Clients
 * Example Servers

On this page
 * Purpose
 * Mechanisms
 * Meeting Calendar
 * Interest Groups (IGs)
 * Working Groups (WG)
 * WG/IG Facilitators
 * FAQ
 * How do I get involved contributing to MCP?
 * Where can I find a list of all current WGs and IGs?

Governance
# Working and Interest Groups
Copy page
Learn about the two forms of collaborative groups within the Model Context Protocol’s governance structure - Working Groups and Interest Groups.
Copy page
Within the MCP contributor community we maintain two types of collaboration formats - **Interest** and **Working** groups. **Interest Groups** are responsible for identifying and articulating problems that MCP should address, primarily by facilitating open discussions within the community. In contrast, **Working Groups** focus on developing concrete solutions by collaboratively producing deliverables, such as SEPs or community-owned implementations of the specification. While input from Interest Groups can help justify the formation of a Working Group, it is not a strict requirement. Similarly, contributions from either Interest Groups or Working Groups are encouraged, but not mandatory, when submitting SEPs or other community proposals. We strongly encourage all contributors interested in working on a specific SEP to first collaborate within an Interest Group. This collaborative process helps ensure that the proposed SEP aligns with community needs and is the right direction for the protocol. Long-term projects in the MCP ecosystem, such as SDKs, Inspector, or Registry are maintained by dedicated Working Groups.
## 
​
Purpose
These groups exist to:
 * **Facilitate high-signal spaces for focused discussions** - contributors who opt into notifications, expertise sharing, and regular meetings can engage with topics that are highly relevant to them, enabling meaningful contributions and opportunities to learn from others.
 * **Establish clear expectations and leadership roles** - guide collaborative efforts and ensure steady progress toward concrete deliverables that advance MCP evolution and adoption.

## 
​
Mechanisms
## 
​
Meeting Calendar
All Interest Group and Working Group meetings are published on the public MCP community calendar at meet.modelcontextprotocol.io. Facilitators are responsible for posting their meeting schedules to this calendar in advance to ensure discoverability and enable broader community participation.
### 
​
Interest Groups (IGs)
**Goal:** Facilitate discussion and knowledge-sharing among MCP contributors who share interests in a specific MCP sub-topic or context. The primary focus is on identifying and gathering problems that may be worth addressing through SEPs or other community artifacts, while encouraging open exploration of protocol issues and opportunities. **Expectations** :
 * Regular conversations in the Interest Group Discord channel
 * **AND/OR** a recurring live meeting regularly attended by Interest Group members
 * Meeting dates and times published in advance on the MCP community calendar when applicable, and tagged with their primary topic and interest group Discord channel name (e.g. `auth-ig`)
 * Notes publicly shared after meetings, as a GitHub issue (example) and/or public Google Doc

**Examples** :
 * Security in MCP
 * Auth in MCP
 * Using MCP in enterprise settings
 * Tooling and practices surrounding hosting MCP servers
 * Tooling and practices surrounding implementing MCP clients

**Lifecycle** :
 * Creation begins by filling out a template in the #wg-ig-group-creation Discord channel
 * A community moderator will review and call for a vote in the (private) #community-moderators Discord channel. Majority positive vote by members over a 72h period approves creation of the group. 
 * The creation of the group can be reversed at any time (e.g., after new information surfaces). Core and lead maintainers can veto.
 * Facilitator(s) and Maintainer(s) responsible for organizing IG into meeting expectations 
 * Facilitator is an informal role responsible for shepherding or speaking for a group
 * Maintainer is an official representative from the MCP steering group. A maintainer is not required for every group, but can help advocate for specific changes or initiatives.
 * IG is retired only when community moderators or Core or Lead Maintainers determine it’s no longer active and/or needed 
 * Successful IGs do not have a time limit or expiration date - as long as they are active and maintained, they will remain available

**Creation Template** :
 * Facilitator(s)
 * Maintainer(s) (optional)
 * IGs with potentially similar goals/discussions
 * How this IG differentiates itself from the related IGs
 * First topic you to discuss within the IG

Participation in an Interest Group (IG) is not required to start a Working Group (WG) or to create a SEP. However, building consensus within IGs can be valuable when justifying the formation of a WG. Likewise, referencing support from IGs or WGs can strengthen a SEP and its chances of success.
### 
​
Working Groups (WG)
**Goal:** Facilitate collaboration within the MCP community on a SEP, a themed series of SEPs, or an otherwise officially endorsed project. **Expectations** :
 * Meaningful progress towards at least one SEP or spec-related implementation **OR** hold maintenance responsibilities for a project (e.g., Inspector, Registry, SDKs)
 * Facilitators are responsible for keeping track of progress and communicating status when appropriate
 * Meeting dates and times published in advance on the MCP community calendar when applicable, and tagged with their primary topic and working group Discord channel name (e.g. `agents-wg`)
 * Notes publicly shared after meetings, as a GitHub issue (example) and/or public Google Doc

**Examples** :
 * Registry
 * Inspector
 * Tool Filtering
 * Server Identity

**Lifecycle** :
 * Creation begins by filling out a template in #wg-ig-group-creation Discord channel
 * A community moderator will review and call for a vote in the (private) #community-moderators Discord channel. Majority positive vote by members over a 72h period approves creation of the group. 
 * The creation of the group can be reversed at any time (e.g., after new information surfaces). Core and lead maintainers can veto.
 * Facilitator(s) and Maintainer(s) responsible for organizing WG into meeting expectations 
 * Facilitator is an informal role responsible for shepherding or speaking for a group
 * Maintainer is an official representative from the MCP steering group. A maintainer is not required for every group, but can help advocate for specific changes or initiatives
 * WG is retired when either: 
 * Community moderators or Core and Lead Maintainers decide it is no longer active and/or needed
 * The WG no longer has an active Issue/PR for a month or more, or has completed all Issues/PRs it intended to pursue.

**Creation Template** :
 * Facilitator(s)
 * Maintainer(s) (optional)
 * Explanation of interest/use cases, ideally originating from an IG discussion; however that is not a requirement
 * First Issue/PR/SEP that the WG will work on

## 
​
WG/IG Facilitators
A **Facilitator** role in a WG or IG does _not_ result in a maintainership role across the MCP organization. It is an informal role into which anyone can self-nominate. A Facilitator is responsible for helping shepherd discussions and collaboration within an Interest or Working Group. Lead and Core Maintainers reserve the right to modify the list of Facilitators and Maintainers for any WG/IG at any time.
## 
​
FAQ
### 
​
How do I get involved contributing to MCP?
These IG and WG abstractions help provide an elegant on-ramp:
 1. Join the Discord and follow conversations in IGs relevant to you. Attend live calls. Participate.
 2. Offer to facilitate calls. Contribute your use cases in SEP proposals and other work.
 3. When you’re comfortable contributing to deliverables, jump in to contribute to WG work.
 4. Active and valuable contributors will be nominated by WG maintainers as new maintainers.

### 
​
Where can I find a list of all current WGs and IGs?
On the MCP Contributor Discord there is a section of channels for each Working and Interest Group.
Was this page helpful?
YesNo
SEP GuidelinesAntitrust Policy
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# MCP Inspector - Model Context Protocol

## URL
https://modelcontextprotocol.io/docs/tools/inspector

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.140997

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Developer tools
MCP Inspector
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * Getting started
 * Installation and basic usage
 * Inspecting servers from NPM or PyPi
 * Inspecting locally developed servers
 * Feature overview
 * Server connection pane
 * Resources tab
 * Prompts tab
 * Tools tab
 * Notifications pane
 * Best practices
 * Development workflow
 * Next steps

Developer tools
# MCP Inspector
Copy page
In-depth guide to using the MCP Inspector for testing and debugging Model Context Protocol servers
Copy page
The MCP Inspector is an interactive developer tool for testing and debugging MCP servers. While the Debugging Guide covers the Inspector as part of the overall debugging toolkit, this document provides a detailed exploration of the Inspector’s features and capabilities.
## 
​
Getting started
### 
​
Installation and basic usage
The Inspector runs directly through `npx` without requiring installation:
Copy
```
npx @modelcontextprotocol/inspector <command>

```

Copy
```
npx @modelcontextprotocol/inspector <command> <arg1> <arg2>

```

#### 
​
Inspecting servers from NPM or PyPi
A common way to start server packages from NPM or PyPi.
 * NPM package
 * PyPi package

Copy
```
npx -y @modelcontextprotocol/inspector npx <package-name> <args>
# For example
npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem /Users/username/Desktop

```

#### 
​
Inspecting locally developed servers
To inspect servers locally developed or downloaded as a repository, the most common way is:
 * TypeScript
 * Python

Copy
```
npx @modelcontextprotocol/inspector node path/to/server/index.js args...

```

Please carefully read any attached README for the most accurate instructions.
## 
​
Feature overview

The MCP Inspector interface
The Inspector provides several features for interacting with your MCP server:
### 
​
Server connection pane
 * Allows selecting the transport for connecting to the server
 * For local servers, supports customizing the command-line arguments and environment

### 
​
Resources tab
 * Lists all available resources
 * Shows resource metadata (MIME types, descriptions)
 * Allows resource content inspection
 * Supports subscription testing

### 
​
Prompts tab
 * Displays available prompt templates
 * Shows prompt arguments and descriptions
 * Enables prompt testing with custom arguments
 * Previews generated messages

### 
​
Tools tab
 * Lists available tools
 * Shows tool schemas and descriptions
 * Enables tool testing with custom inputs
 * Displays tool execution results

### 
​
Notifications pane
 * Presents all logs recorded from the server
 * Shows notifications received from the server

## 
​
Best practices
### 
​
Development workflow
 1. Start Development
 * Launch Inspector with your server
 * Verify basic connectivity
 * Check capability negotiation
 2. Iterative testing
 * Make server changes
 * Rebuild the server
 * Reconnect the Inspector
 * Test affected features
 * Monitor messages
 3. Test edge cases
 * Invalid inputs
 * Missing prompt arguments
 * Concurrent operations
 * Verify error handling and error responses

## 
​
Next steps
## Inspector Repository Check out the MCP Inspector source code ## Debugging Guide Learn about broader debugging strategies 
Was this page helpful?
YesNo
Understanding Authorization in MCP
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.



---

# Specification - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-03-26

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141097

## Content
Skip to main content
Model Context Protocol home page
Version 2025-03-26
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Specification
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Utilities

##### Client Features
 * Roots
 * Sampling

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

On this page
 * Overview
 * Key Details
 * Base Protocol
 * Features
 * Additional Utilities
 * Security and Trust & Safety
 * Key Principles
 * Implementation Guidelines
 * Learn More

# Specification
Copy page
Copy page
Model Context Protocol (MCP) is an open protocol that enables seamless integration between LLM applications and external data sources and tools. Whether you’re building an AI-powered IDE, enhancing a chat interface, or creating custom AI workflows, MCP provides a standardized way to connect LLMs with the context they need. This specification defines the authoritative protocol requirements, based on the TypeScript schema in schema.ts. For implementation guides and examples, visit modelcontextprotocol.io. The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “NOT RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.
## 
​
Overview
MCP provides a standardized way for applications to:
 * Share contextual information with language models
 * Expose tools and capabilities to AI systems
 * Build composable integrations and workflows

The protocol uses JSON-RPC 2.0 messages to establish communication between:
 * **Hosts** : LLM applications that initiate connections
 * **Clients** : Connectors within the host application
 * **Servers** : Services that provide context and capabilities

MCP takes some inspiration from the Language Server Protocol, which standardizes how to add support for programming languages across a whole ecosystem of development tools. In a similar way, MCP standardizes how to integrate additional context and tools into the ecosystem of AI applications.
## 
​
Key Details
### 
​
Base Protocol
 * JSON-RPC message format
 * Stateful connections
 * Server and client capability negotiation

### 
​
Features
Servers offer any of the following features to clients:
 * **Resources** : Context and data, for the user or the AI model to use
 * **Prompts** : Templated messages and workflows for users
 * **Tools** : Functions for the AI model to execute

Clients may offer the following feature to servers:
 * **Sampling** : Server-initiated agentic behaviors and recursive LLM interactions

### 
​
Additional Utilities
 * Configuration
 * Progress tracking
 * Cancellation
 * Error reporting
 * Logging

## 
​
Security and Trust & Safety
The Model Context Protocol enables powerful capabilities through arbitrary data access and code execution paths. With this power comes important security and trust considerations that all implementors must carefully address.
### 
​
Key Principles
 1. **User Consent and Control**
 * Users must explicitly consent to and understand all data access and operations
 * Users must retain control over what data is shared and what actions are taken
 * Implementors should provide clear UIs for reviewing and authorizing activities
 2. **Data Privacy**
 * Hosts must obtain explicit user consent before exposing user data to servers
 * Hosts must not transmit resource data elsewhere without user consent
 * User data should be protected with appropriate access controls
 3. **Tool Safety**
 * Tools represent arbitrary code execution and must be treated with appropriate caution. 
 * In particular, descriptions of tool behavior such as annotations should be considered untrusted, unless obtained from a trusted server.
 * Hosts must obtain explicit user consent before invoking any tool
 * Users should understand what each tool does before authorizing its use
 4. **LLM Sampling Controls**
 * Users must explicitly approve any LLM sampling requests
 * Users should control: 
 * Whether sampling occurs at all
 * The actual prompt that will be sent
 * What results the server can see
 * The protocol intentionally limits server visibility into prompts

### 
​
Implementation Guidelines
While MCP itself cannot enforce these security principles at the protocol level, implementors **SHOULD** :
 1. Build robust consent and authorization flows into their applications
 2. Provide clear documentation of security implications
 3. Implement appropriate access controls and data protections
 4. Follow security best practices in their integrations
 5. Consider privacy implications in their feature designs

## 
​
Learn More
Explore the detailed specification for each protocol component:
## Architecture## Base Protocol## Server Features## Client Features## Contributing
Was this page helpful?
YesNo
Key Changes
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Architecture - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/architecture/index

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141201

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Architecture
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Core Components
 * Host
 * Clients
 * Servers
 * Design Principles
 * Capability Negotiation

# Architecture
Copy page
Copy page
The Model Context Protocol (MCP) follows a client-host-server architecture where each host can run multiple client instances. This architecture enables users to integrate AI capabilities across applications while maintaining clear security boundaries and isolating concerns. Built on JSON-RPC, MCP provides a stateful session protocol focused on context exchange and sampling coordination between clients and servers.
## 
​
Core Components
### 
​
Host
The host process acts as the container and coordinator:
 * Creates and manages multiple client instances
 * Controls client connection permissions and lifecycle
 * Enforces security policies and consent requirements
 * Handles user authorization decisions
 * Coordinates AI/LLM integration and sampling
 * Manages context aggregation across clients

### 
​
Clients
Each client is created by the host and maintains an isolated server connection:
 * Establishes one stateful session per server
 * Handles protocol negotiation and capability exchange
 * Routes protocol messages bidirectionally
 * Manages subscriptions and notifications
 * Maintains security boundaries between servers

A host application creates and manages multiple clients, with each client having a 1:1 relationship with a particular server.
### 
​
Servers
Servers provide specialized context and capabilities:
 * Expose resources, tools and prompts via MCP primitives
 * Operate independently with focused responsibilities
 * Request sampling through client interfaces
 * Must respect security constraints
 * Can be local processes or remote services

## 
​
Design Principles
MCP is built on several key design principles that inform its architecture and implementation:
 1. **Servers should be extremely easy to build**
 * Host applications handle complex orchestration responsibilities
 * Servers focus on specific, well-defined capabilities
 * Simple interfaces minimize implementation overhead
 * Clear separation enables maintainable code
 2. **Servers should be highly composable**
 * Each server provides focused functionality in isolation
 * Multiple servers can be combined seamlessly
 * Shared protocol enables interoperability
 * Modular design supports extensibility
 3. **Servers should not be able to read the whole conversation, nor “see into” other servers**
 * Servers receive only necessary contextual information
 * Full conversation history stays with the host
 * Each server connection maintains isolation
 * Cross-server interactions are controlled by the host
 * Host process enforces security boundaries
 4. **Features can be added to servers and clients progressively**
 * Core protocol provides minimal required functionality
 * Additional capabilities can be negotiated as needed
 * Servers and clients evolve independently
 * Protocol designed for future extensibility
 * Backwards compatibility is maintained

## 
​
Capability Negotiation
The Model Context Protocol uses a capability-based negotiation system where clients and servers explicitly declare their supported features during initialization. Capabilities determine which protocol features and primitives are available during a session.
 * Servers declare capabilities like resource subscriptions, tool support, and prompt templates
 * Clients declare capabilities like sampling support and notification handling
 * Both parties must respect declared capabilities throughout the session
 * Additional capabilities can be negotiated through extensions to the protocol

Each capability unlocks specific protocol features for use during the session. For example:
 * Implemented server features must be advertised in the server’s capabilities
 * Emitting resource subscription notifications requires the server to declare subscription support
 * Tool invocation requires the server to declare tool capabilities
 * Sampling requires the client to declare support in its capabilities

This capability negotiation ensures clients and servers have a clear understanding of supported functionality while maintaining protocol extensibility.
Was this page helpful?
YesNo
Key ChangesOverview
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Example Servers - Model Context Protocol

## URL
https://modelcontextprotocol.io/examples

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141314

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Examples
Example Servers
DocumentationSpecificationCommunityAbout MCP
 * Contributor Communication

##### Governance
 * Governance and Stewardship
 * SEP Guidelines
 * Working and Interest Groups
 * Antitrust Policy

##### Roadmap
 * Roadmap

##### Examples
 * Example Clients
 * Example Servers

On this page
 * Reference implementations
 * Current reference servers
 * Archived servers (historical reference)
 * Data and file systems
 * Development tools
 * Web and browser automation
 * Productivity and communication
 * AI and specialized tools
 * Official integrations
 * Community implementations
 * Getting started
 * Using reference servers
 * Configuring with Claude
 * Additional resources

Examples
# Example Servers
Copy page
A list of example servers and implementations
Copy page
This page showcases various Model Context Protocol (MCP) servers that demonstrate the protocol’s capabilities and versatility. These servers enable Large Language Models (LLMs) to securely access tools and data sources.
## 
​
Reference implementations
These official reference servers demonstrate core MCP features and SDK usage:
### 
​
Current reference servers
 * **Everything** - Reference / test server with prompts, resources, and tools
 * **Fetch** - Web content fetching and conversion for efficient LLM usage
 * **Filesystem** - Secure file operations with configurable access controls
 * **Git** - Tools to read, search, and manipulate Git repositories
 * **Memory** - Knowledge graph-based persistent memory system
 * **Sequential Thinking** - Dynamic and reflective problem-solving through thought sequences
 * **Time** - Time and timezone conversion capabilities

### 
​
Archived servers (historical reference)
⚠️ **Note** : The following servers have been moved to the servers-archived repository and are no longer actively maintained. They are provided for historical reference only.
#### 
​
Data and file systems
 * **PostgreSQL** - Read-only database access with schema inspection capabilities
 * **SQLite** - Database interaction and business intelligence features
 * **Google Drive** - File access and search capabilities for Google Drive

#### 
​
Development tools
 * **Git** - Tools to read, search, and manipulate Git repositories
 * **GitHub** - Repository management, file operations, and GitHub API integration
 * **GitLab** - GitLab API integration enabling project management
 * **Sentry** - Retrieving and analyzing issues from Sentry.io

#### 
​
Web and browser automation
 * **Brave Search** - Web and local search using Brave’s Search API
 * **Puppeteer** - Browser automation and web scraping capabilities

#### 
​
Productivity and communication
 * **Slack** - Channel management and messaging capabilities
 * **Google Maps** - Location services, directions, and place details

#### 
​
AI and specialized tools
 * **EverArt** - AI image generation using various models
 * **AWS KB Retrieval** - Retrieval from AWS Knowledge Base using Bedrock Agent Runtime

## 
​
Official integrations
Visit the MCP Servers Repository (Official Integrations section) for a list of MCP servers maintained by companies for their platforms.
## 
​
Community implementations
Visit the MCP Servers Repository (Community section) for a list of MCP servers maintained by community members.
## 
​
Getting started
### 
​
Using reference servers
TypeScript-based servers can be used directly with `npx`:
Copy
```
npx -y @modelcontextprotocol/server-memory

```

Python-based servers can be used with `uvx` (recommended) or `pip`:
Copy
```
# Using uvx
uvx mcp-server-git
# Using pip
pip install mcp-server-git
python -m mcp_server_git

```

### 
​
Configuring with Claude
To use an MCP server with Claude, add it to your configuration:
Copy
```
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/files"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}

```

## 
​
Additional resources
Visit the MCP Servers Repository (Resources section) for a collection of other resources and projects related to MCP. Visit our GitHub Discussions to engage with the MCP community.
Was this page helpful?
YesNo
Example Clients
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Overview - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/basic/index

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141435

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Base Protocol
Overview
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Messages
 * Requests
 * Responses
 * Notifications
 * Auth
 * Schema
 * General fields
 * _meta

Base Protocol
# Overview
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol consists of several key components that work together:
 * **Base Protocol** : Core JSON-RPC message types
 * **Lifecycle Management** : Connection initialization, capability negotiation, and session control
 * **Authorization** : Authentication and authorization framework for HTTP-based transports
 * **Server Features** : Resources, prompts, and tools exposed by servers
 * **Client Features** : Sampling and root directory lists provided by clients
 * **Utilities** : Cross-cutting concerns like logging and argument completion

All implementations **MUST** support the base protocol and lifecycle management components. Other components **MAY** be implemented based on the specific needs of the application. These protocol layers establish clear separation of concerns while enabling rich interactions between clients and servers. The modular design allows implementations to support exactly the features they need.
## 
​
Messages
All messages between MCP clients and servers **MUST** follow the JSON-RPC 2.0 specification. The protocol defines these types of messages:
### 
​
Requests
Requests are sent from the client to the server or vice versa, to initiate an operation.
Copy
```
{
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    [key: string]: unknown;
  };
}

```

 * Requests **MUST** include a string or integer ID.
 * Unlike base JSON-RPC, the ID **MUST NOT** be `null`.
 * The request ID **MUST NOT** have been previously used by the requestor within the same session.

### 
​
Responses
Responses are sent in reply to requests, containing the result or error of the operation.
Copy
```
{
  jsonrpc: "2.0";
  id: string | number;
  result?: {
    [key: string]: unknown;
  }
  error?: {
    code: number;
    message: string;
    data?: unknown;
  }
}

```

 * Responses **MUST** include the same ID as the request they correspond to.
 * **Responses** are further sub-categorized as either **successful results** or **errors**. Either a `result` or an `error` **MUST** be set. A response **MUST NOT** set both.
 * Results **MAY** follow any JSON object structure, while errors **MUST** include an error code and message at minimum.
 * Error codes **MUST** be integers.

### 
​
Notifications
Notifications are sent from the client to the server or vice versa, as a one-way message. The receiver **MUST NOT** send a response.
Copy
```
{
  jsonrpc: "2.0";
  method: string;
  params?: {
    [key: string]: unknown;
  };
}

```

 * Notifications **MUST NOT** include an ID.

## 
​
Auth
MCP provides an Authorization framework for use with HTTP. Implementations using an HTTP-based transport **SHOULD** conform to this specification, whereas implementations using STDIO transport **SHOULD NOT** follow this specification, and instead retrieve credentials from the environment. Additionally, clients and servers **MAY** negotiate their own custom authentication and authorization strategies. For further discussions and contributions to the evolution of MCP’s auth mechanisms, join us in GitHub Discussions to help shape the future of the protocol!
## 
​
Schema
The full specification of the protocol is defined as a TypeScript schema. This is the source of truth for all protocol messages and structures. There is also a JSON Schema, which is automatically generated from the TypeScript source of truth, for use with various automated tooling.
### 
​
General fields
#### 
​
`_meta`
The `_meta` property/parameter is reserved by MCP to allow clients and servers to attach additional metadata to their interactions. Certain key names are reserved by MCP for protocol-level metadata, as specified below; implementations MUST NOT make assumptions about values at these keys. Additionally, definitions in the schema may reserve particular names for purpose-specific metadata, as declared in those definitions. **Key name format:** valid `_meta` key names have two segments: an optional **prefix** , and a **name**. **Prefix:**
 * If specified, MUST be a series of labels separated by dots (`.`), followed by a slash (`/`). 
 * Labels MUST start with a letter and end with a letter or digit; interior characters can be letters, digits, or hyphens (`-`).
 * Any prefix beginning with zero or more valid labels, followed by `modelcontextprotocol` or `mcp`, followed by any valid label, is **reserved** for MCP use. 
 * For example: `modelcontextprotocol.io/`, `mcp.dev/`, `api.modelcontextprotocol.org/`, and `tools.mcp.com/` are all reserved.

**Name:**
 * Unless empty, MUST begin and end with an alphanumeric character (`[a-z0-9A-Z]`).
 * MAY contain hyphens (`-`), underscores (`_`), dots (`.`), and alphanumerics in between.

Was this page helpful?
YesNo
ArchitectureLifecycle
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Transports - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2024-11-05/basic/transports

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141511

## Content
Skip to main content
Model Context Protocol home page
Version 2024-11-05
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Base Protocol
Transports
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Messages
 * Transports
 * Utilities

##### Client Features
 * Roots
 * Sampling

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

On this page
 * stdio
 * HTTP with SSE
 * Security Warning
 * Custom Transports

Base Protocol
# Transports
Copy page
Copy page
**Protocol Revision** : 2024-11-05
MCP currently defines two standard transport mechanisms for client-server communication:
 1. stdio, communication over standard in and standard out
 2. HTTP with Server-Sent Events (SSE)

Clients **SHOULD** support stdio whenever possible. It is also possible for clients and servers to implement custom transports in a pluggable fashion.
## 
​
stdio
In the **stdio** transport:
 * The client launches the MCP server as a subprocess.
 * The server receives JSON-RPC messages on its standard input (`stdin`) and writes responses to its standard output (`stdout`).
 * Messages are delimited by newlines, and **MUST NOT** contain embedded newlines.
 * The server **MAY** write UTF-8 strings to its standard error (`stderr`) for logging purposes. Clients **MAY** capture, forward, or ignore this logging.
 * The server **MUST NOT** write anything to its `stdout` that is not a valid MCP message.
 * The client **MUST NOT** write anything to the server’s `stdin` that is not a valid MCP message.

## 
​
HTTP with SSE
In the **SSE** transport, the server operates as an independent process that can handle multiple client connections.
#### 
​
Security Warning
When implementing HTTP with SSE transport:
 1. Servers **MUST** validate the `Origin` header on all incoming connections to prevent DNS rebinding attacks
 2. When running locally, servers **SHOULD** bind only to localhost (127.0.0.1) rather than all network interfaces (0.0.0.0)
 3. Servers **SHOULD** implement proper authentication for all connections

Without these protections, attackers could use DNS rebinding to interact with local MCP servers from remote websites. The server **MUST** provide two endpoints:
 1. An SSE endpoint, for clients to establish a connection and receive messages from the server
 2. A regular HTTP POST endpoint for clients to send messages to the server

When a client connects, the server **MUST** send an `endpoint` event containing a URI for the client to use for sending messages. All subsequent client messages **MUST** be sent as HTTP POST requests to this endpoint. Server messages are sent as SSE `message` events, with the message content encoded as JSON in the event data.
## 
​
Custom Transports
Clients and servers **MAY** implement additional custom transport mechanisms to suit their specific needs. The protocol is transport-agnostic and can be implemented over any communication channel that supports bidirectional message exchange. Implementers who choose to support custom transports **MUST** ensure they preserve the JSON-RPC message format and lifecycle requirements defined by MCP. Custom transports **SHOULD** document their specific connection establishment and message exchange patterns to aid interoperability.
Was this page helpful?
YesNo
MessagesCancellation
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Cancellation - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/basic/utilities/cancellation

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141593

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Utilities
Cancellation
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities
 * Cancellation
 * Ping
 * Progress

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Cancellation Flow
 * Behavior Requirements
 * Timing Considerations
 * Implementation Notes
 * Error Handling

Utilities
# Cancellation
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) supports optional cancellation of in-progress requests through notification messages. Either side can send a cancellation notification to indicate that a previously-issued request should be terminated.
## 
​
Cancellation Flow
When a party wants to cancel an in-progress request, it sends a `notifications/cancelled` notification containing:
 * The ID of the request to cancel
 * An optional reason string that can be logged or displayed

Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/cancelled",
  "params": {
    "requestId": "123",
    "reason": "User requested cancellation"
  }
}

```

## 
​
Behavior Requirements
 1. Cancellation notifications **MUST** only reference requests that: 
 * Were previously issued in the same direction
 * Are believed to still be in-progress
 2. The `initialize` request **MUST NOT** be cancelled by clients
 3. Receivers of cancellation notifications **SHOULD** : 
 * Stop processing the cancelled request
 * Free associated resources
 * Not send a response for the cancelled request
 4. Receivers **MAY** ignore cancellation notifications if: 
 * The referenced request is unknown
 * Processing has already completed
 * The request cannot be cancelled
 5. The sender of the cancellation notification **SHOULD** ignore any response to the request that arrives afterward

## 
​
Timing Considerations
Due to network latency, cancellation notifications may arrive after request processing has completed, and potentially after a response has already been sent. Both parties **MUST** handle these race conditions gracefully:
## 
​
Implementation Notes
 * Both parties **SHOULD** log cancellation reasons for debugging
 * Application UIs **SHOULD** indicate when cancellation is requested

## 
​
Error Handling
Invalid cancellation notifications **SHOULD** be ignored:
 * Unknown request IDs
 * Already completed requests
 * Malformed notifications

This maintains the “fire and forget” nature of notifications while allowing for race conditions in asynchronous communication.
Was this page helpful?
YesNo
Security Best PracticesPing
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Versioning - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/versioning

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141639

## Content
Skip to main content
Model Context Protocol home page
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
About MCP
Versioning
DocumentationSpecificationCommunityAbout MCP
##### Get started
 * What is MCP?

##### About MCP
 * Architecture
 * Servers
 * Clients
 * Versioning

##### Develop with MCP
 * Connect to local MCP servers
 * Connect to remote MCP Servers
 * Build an MCP server
 * Build an MCP client
 * SDKs
 * Security

##### Developer tools
 * MCP Inspector

On this page
 * Revisions
 * Negotiation

About MCP
# Versioning
Copy page
Copy page
The Model Context Protocol uses string-based version identifiers following the format `YYYY-MM-DD`, to indicate the last date backwards incompatible changes were made.
The protocol version will _not_ be incremented when the protocol is updated, as long as the changes maintain backwards compatibility. This allows for incremental improvements while preserving interoperability.
## 
​
Revisions
Revisions may be marked as:
 * **Draft** : in-progress specifications, not yet ready for consumption.
 * **Current** : the current protocol version, which is ready for use and may continue to receive backwards compatible changes.
 * **Final** : past, complete specifications that will not be changed.

The **current** protocol version is **2025-06-18**.
## 
​
Negotiation
Version negotiation happens during initialization. Clients and servers **MAY** support multiple protocol versions simultaneously, but they **MUST** agree on a single version to use for the session. The protocol provides appropriate error handling if version negotiation fails, allowing clients to gracefully terminate connections when they cannot find a version compatible with the server.
Was this page helpful?
YesNo
ClientsConnect to local MCP servers
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Logging - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/server/utilities/logging

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141740

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Utilities
Logging
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities
 * Completion
 * Logging
 * Pagination

 * Schema Reference

On this page
 * User Interaction Model
 * Capabilities
 * Log Levels
 * Protocol Messages
 * Setting Log Level
 * Log Message Notifications
 * Message Flow
 * Error Handling
 * Implementation Considerations
 * Security

Utilities
# Logging
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) provides a standardized way for servers to send structured log messages to clients. Clients can control logging verbosity by setting minimum log levels, with servers sending notifications containing severity levels, optional logger names, and arbitrary JSON-serializable data.
## 
​
User Interaction Model
Implementations are free to expose logging through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.
## 
​
Capabilities
Servers that emit log message notifications **MUST** declare the `logging` capability:
Copy
```
{
  "capabilities": {
    "logging": {}
  }
}

```

## 
​
Log Levels
The protocol follows the standard syslog severity levels specified in RFC 5424: Level | Description | Example Use Case 
---|---|--- 
debug | Detailed debugging information | Function entry/exit points 
info | General informational messages | Operation progress updates 
notice | Normal but significant events | Configuration changes 
warning | Warning conditions | Deprecated feature usage 
error | Error conditions | Operation failures 
critical | Critical conditions | System component failures 
alert | Action must be taken immediately | Data corruption detected 
emergency | System is unusable | Complete system failure 
## 
​
Protocol Messages
### 
​
Setting Log Level
To configure the minimum log level, clients **MAY** send a `logging/setLevel` request: **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "logging/setLevel",
  "params": {
    "level": "info"
  }
}

```

### 
​
Log Message Notifications
Servers send log messages using `notifications/message` notifications:
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/message",
  "params": {
    "level": "error",
    "logger": "database",
    "data": {
      "error": "Connection failed",
      "details": {
        "host": "localhost",
        "port": 5432
      }
    }
  }
}

```

## 
​
Message Flow
ServerClientServerClientConfigure LoggingServer ActivityLevel ChangeOnly sends error leveland abovelogging/setLevel (info)Empty Resultnotifications/message (info)notifications/message (warning)notifications/message (error)logging/setLevel (error)Empty Result
## 
​
Error Handling
Servers **SHOULD** return standard JSON-RPC errors for common failure cases:
 * Invalid log level: `-32602` (Invalid params)
 * Configuration errors: `-32603` (Internal error)

## 
​
Implementation Considerations
 1. Servers **SHOULD** :
 * Rate limit log messages
 * Include relevant context in data field
 * Use consistent logger names
 * Remove sensitive information
 2. Clients **MAY** :
 * Present log messages in the UI
 * Implement log filtering/search
 * Display severity visually
 * Persist log messages

## 
​
Security
 1. Log messages **MUST NOT** contain:
 * Credentials or secrets
 * Personal identifying information
 * Internal system details that could aid attacks
 2. Implementations **SHOULD** :
 * Rate limit messages
 * Validate all data fields
 * Control log access
 * Monitor for sensitive content

Was this page helpful?
YesNo
CompletionPagination
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Pagination - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/server/utilities/pagination

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141827

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Utilities
Pagination
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities
 * Completion
 * Logging
 * Pagination

 * Schema Reference

On this page
 * Pagination Model
 * Response Format
 * Request Format
 * Pagination Flow
 * Operations Supporting Pagination
 * Implementation Guidelines
 * Error Handling

Utilities
# Pagination
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) supports paginating list operations that may return large result sets. Pagination allows servers to yield results in smaller chunks rather than all at once. Pagination is especially important when connecting to external services over the internet, but also useful for local integrations to avoid performance issues with large data sets.
## 
​
Pagination Model
Pagination in MCP uses an opaque cursor-based approach, instead of numbered pages.
 * The **cursor** is an opaque string token, representing a position in the result set
 * **Page size** is determined by the server, and clients **MUST NOT** assume a fixed page size

## 
​
Response Format
Pagination starts when the server sends a **response** that includes:
 * The current page of results
 * An optional `nextCursor` field if more results exist

Copy
```
{
  "jsonrpc": "2.0",
  "id": "123",
  "result": {
    "resources": [...],
    "nextCursor": "eyJwYWdlIjogM30="
  }
}

```

## 
​
Request Format
After receiving a cursor, the client can _continue_ paginating by issuing a request including that cursor:
Copy
```
{
  "jsonrpc": "2.0",
  "id": "124",
  "method": "resources/list",
  "params": {
    "cursor": "eyJwYWdlIjogMn0="
  }
}

```

## 
​
Pagination Flow
ServerClientServerClientloop[Pagination Loop]List Request (no cursor)Page of results + nextCursorList Request (with cursor)
## 
​
Operations Supporting Pagination
The following MCP operations support pagination:
 * `resources/list` - List available resources
 * `resources/templates/list` - List resource templates
 * `prompts/list` - List available prompts
 * `tools/list` - List available tools

## 
​
Implementation Guidelines
 1. Servers **SHOULD** :
 * Provide stable cursors
 * Handle invalid cursors gracefully
 2. Clients **SHOULD** :
 * Treat a missing `nextCursor` as the end of results
 * Support both paginated and non-paginated flows
 3. Clients **MUST** treat cursors as opaque tokens:
 * Don’t make assumptions about cursor format
 * Don’t attempt to parse or modify cursors
 * Don’t persist cursors across sessions

## 
​
Error Handling
Invalid cursors **SHOULD** result in an error with code -32602 (Invalid params).
Was this page helpful?
YesNo
LoggingSchema Reference
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Roots - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/client

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.141941

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Client Features
Roots
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * User Interaction Model
 * Capabilities
 * Protocol Messages
 * Listing Roots
 * Root List Changes
 * Message Flow
 * Data Types
 * Root
 * Project Directory
 * Multiple Repositories
 * Error Handling
 * Security Considerations
 * Implementation Guidelines

Client Features
# Roots
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) provides a standardized way for clients to expose filesystem “roots” to servers. Roots define the boundaries of where servers can operate within the filesystem, allowing them to understand which directories and files they have access to. Servers can request the list of roots from supporting clients and receive notifications when that list changes.
## 
​
User Interaction Model
Roots in MCP are typically exposed through workspace or project configuration interfaces. For example, implementations could offer a workspace/project picker that allows users to select directories and files the server should have access to. This can be combined with automatic workspace detection from version control systems or project files. However, implementations are free to expose roots through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.
## 
​
Capabilities
Clients that support roots **MUST** declare the `roots` capability during initialization:
Copy
```
{
  "capabilities": {
    "roots": {
      "listChanged": true
    }
  }
}

```

`listChanged` indicates whether the client will emit notifications when the list of roots changes.
## 
​
Protocol Messages
### 
​
Listing Roots
To retrieve roots, servers send a `roots/list` request: **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "roots/list"
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "roots": [
      {
        "uri": "file:///home/user/projects/myproject",
        "name": "My Project"
      }
    ]
  }
}

```

### 
​
Root List Changes
When roots change, clients that support `listChanged` **MUST** send a notification:
Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/roots/list_changed"
}

```

## 
​
Message Flow
ClientServerClientServerDiscoveryChangesroots/listAvailable rootsnotifications/roots/list_changedroots/listUpdated roots
## 
​
Data Types
### 
​
Root
A root definition includes:
 * `uri`: Unique identifier for the root. This **MUST** be a `file://` URI in the current specification.
 * `name`: Optional human-readable name for display purposes.

Example roots for different use cases:
#### 
​
Project Directory
Copy
```
{
  "uri": "file:///home/user/projects/myproject",
  "name": "My Project"
}

```

#### 
​
Multiple Repositories
Copy
```
[
  {
    "uri": "file:///home/user/repos/frontend",
    "name": "Frontend Repository"
  },
  {
    "uri": "file:///home/user/repos/backend",
    "name": "Backend Repository"
  }
]

```

## 
​
Error Handling
Clients **SHOULD** return standard JSON-RPC errors for common failure cases:
 * Client does not support roots: `-32601` (Method not found)
 * Internal errors: `-32603`

Example error:
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Roots not supported",
    "data": {
      "reason": "Client does not have roots capability"
    }
  }
}

```

## 
​
Security Considerations
 1. Clients **MUST** :
 * Only expose roots with appropriate permissions
 * Validate all root URIs to prevent path traversal
 * Implement proper access controls
 * Monitor root accessibility
 2. Servers **SHOULD** :
 * Handle cases where roots become unavailable
 * Respect root boundaries during operations
 * Validate all paths against provided roots

## 
​
Implementation Guidelines
 1. Clients **SHOULD** :
 * Prompt users for consent before exposing roots to servers
 * Provide clear user interfaces for root management
 * Validate root accessibility before exposing
 * Monitor for root changes
 2. Servers **SHOULD** :
 * Check for roots capability before usage
 * Handle root list changes gracefully
 * Respect root boundaries in operations
 * Cache root information appropriately

Was this page helpful?
YesNo
ProgressSampling
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Completion - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/server/utilities/completion

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.142064

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Utilities
Completion
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities
 * Completion
 * Logging
 * Pagination

 * Schema Reference

On this page
 * User Interaction Model
 * Capabilities
 * Protocol Messages
 * Requesting Completions
 * Reference Types
 * Completion Results
 * Message Flow
 * Data Types
 * CompleteRequest
 * CompleteResult
 * Error Handling
 * Implementation Considerations
 * Security

Utilities
# Completion
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) provides a standardized way for servers to offer argument autocompletion suggestions for prompts and resource URIs. This enables rich, IDE-like experiences where users receive contextual suggestions while entering argument values.
## 
​
User Interaction Model
Completion in MCP is designed to support interactive user experiences similar to IDE code completion. For example, applications may show completion suggestions in a dropdown or popup menu as users type, with the ability to filter and select from available options. However, implementations are free to expose completion through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.
## 
​
Capabilities
Servers that support completions **MUST** declare the `completions` capability:
Copy
```
{
  "capabilities": {
    "completions": {}
  }
}

```

## 
​
Protocol Messages
### 
​
Requesting Completions
To get completion suggestions, clients send a `completion/complete` request specifying what is being completed through a reference type: **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "completion/complete",
  "params": {
    "ref": {
      "type": "ref/prompt",
      "name": "code_review"
    },
    "argument": {
      "name": "language",
      "value": "py"
    }
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "completion": {
      "values": ["python", "pytorch", "pyside"],
      "total": 10,
      "hasMore": true
    }
  }
}

```

For prompts or URI templates with multiple arguments, clients should include previous completions in the `context.arguments` object to provide context for subsequent requests. **Request:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "completion/complete",
  "params": {
    "ref": {
      "type": "ref/prompt",
      "name": "code_review"
    },
    "argument": {
      "name": "framework",
      "value": "fla"
    },
    "context": {
      "arguments": {
        "language": "python"
      }
    }
  }
}

```

**Response:**
Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "completion": {
      "values": ["flask"],
      "total": 1,
      "hasMore": false
    }
  }
}

```

### 
​
Reference Types
The protocol supports two types of completion references: Type | Description | Example 
---|---|--- 
`ref/prompt` | References a prompt by name | `{"type": "ref/prompt", "name": "code_review"}` 
`ref/resource` | References a resource URI | `{"type": "ref/resource", "uri": "file:///{path}"}` 
### 
​
Completion Results
Servers return an array of completion values ranked by relevance, with:
 * Maximum 100 items per response
 * Optional total number of available matches
 * Boolean indicating if additional results exist

## 
​
Message Flow
ServerClientServerClientUser types argumentUser continues typingcompletion/completeCompletion suggestionscompletion/completeRefined suggestions
## 
​
Data Types
### 
​
CompleteRequest
 * `ref`: A `PromptReference` or `ResourceReference`
 * `argument`: Object containing: 
 * `name`: Argument name
 * `value`: Current value
 * `context`: Object containing: 
 * `arguments`: A mapping of already-resolved argument names to their values.

### 
​
CompleteResult
 * `completion`: Object containing: 
 * `values`: Array of suggestions (max 100)
 * `total`: Optional total matches
 * `hasMore`: Additional results flag

## 
​
Error Handling
Servers **SHOULD** return standard JSON-RPC errors for common failure cases:
 * Method not found: `-32601` (Capability not supported)
 * Invalid prompt name: `-32602` (Invalid params)
 * Missing required arguments: `-32602` (Invalid params)
 * Internal errors: `-32603` (Internal error)

## 
​
Implementation Considerations
 1. Servers **SHOULD** :
 * Return suggestions sorted by relevance
 * Implement fuzzy matching where appropriate
 * Rate limit completion requests
 * Validate all inputs
 2. Clients **SHOULD** :
 * Debounce rapid completion requests
 * Cache completion results where appropriate
 * Handle missing or partial results gracefully

## 
​
Security
Implementations **MUST** :
 * Validate all completion inputs
 * Implement appropriate rate limiting
 * Control access to sensitive suggestions
 * Prevent completion-based information disclosure

Was this page helpful?
YesNo
ToolsLogging
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Progress - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/basic/utilities/progress

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.142137

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Utilities
Progress
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities
 * Cancellation
 * Ping
 * Progress

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Progress Flow
 * Behavior Requirements
 * Implementation Notes

Utilities
# Progress
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol (MCP) supports optional progress tracking for long-running operations through notification messages. Either side can send progress notifications to provide updates about operation status.
## 
​
Progress Flow
When a party wants to _receive_ progress updates for a request, it includes a `progressToken` in the request metadata.
 * Progress tokens **MUST** be a string or integer value
 * Progress tokens can be chosen by the sender using any means, but **MUST** be unique across all active requests.

Copy
```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "some_method",
  "params": {
    "_meta": {
      "progressToken": "abc123"
    }
  }
}

```

The receiver **MAY** then send progress notifications containing:
 * The original progress token
 * The current progress value so far
 * An optional “total” value
 * An optional “message” value

Copy
```
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "abc123",
    "progress": 50,
    "total": 100,
    "message": "Reticulating splines..."
  }
}

```

 * The `progress` value **MUST** increase with each notification, even if the total is unknown.
 * The `progress` and the `total` values **MAY** be floating point.
 * The `message` field **SHOULD** provide relevant human readable progress information.

## 
​
Behavior Requirements
 1. Progress notifications **MUST** only reference tokens that:
 * Were provided in an active request
 * Are associated with an in-progress operation
 2. Receivers of progress requests **MAY** :
 * Choose not to send any progress notifications
 * Send notifications at whatever frequency they deem appropriate
 * Omit the total value if unknown

ReceiverSenderReceiverSenderRequest with progress tokenProgress updatesOperation completeMethod request with progressTokenProgress notification (0.2/1.0)Progress notification (0.6/1.0)Progress notification (1.0/1.0)Method response
## 
​
Implementation Notes
 * Senders and receivers **SHOULD** track active progress tokens
 * Both parties **SHOULD** implement rate limiting to prevent flooding
 * Progress notifications **MUST** stop after completion

Was this page helpful?
YesNo
PingRoots
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Ping - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/2025-06-18/basic/utilities/ping

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.142210

## Content
Skip to main content
Model Context Protocol home page
Version 2025-06-18 (latest)
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Utilities
Ping
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities
 * Cancellation
 * Ping
 * Progress

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Overview
 * Message Format
 * Behavior Requirements
 * Usage Patterns
 * Implementation Considerations
 * Error Handling

Utilities
# Ping
Copy page
Copy page
**Protocol Revision** : 2025-06-18
The Model Context Protocol includes an optional ping mechanism that allows either party to verify that their counterpart is still responsive and the connection is alive.
## 
​
Overview
The ping functionality is implemented through a simple request/response pattern. Either the client or server can initiate a ping by sending a `ping` request.
## 
​
Message Format
A ping request is a standard JSON-RPC request with no parameters:
Copy
```
{
  "jsonrpc": "2.0",
  "id": "123",
  "method": "ping"
}

```

## 
​
Behavior Requirements
 1. The receiver **MUST** respond promptly with an empty response:

Copy
```
{
  "jsonrpc": "2.0",
  "id": "123",
  "result": {}
}

```

 1. If no response is received within a reasonable timeout period, the sender **MAY** : 
 * Consider the connection stale
 * Terminate the connection
 * Attempt reconnection procedures

## 
​
Usage Patterns
## 
​
Implementation Considerations
 * Implementations **SHOULD** periodically issue pings to detect connection health
 * The frequency of pings **SHOULD** be configurable
 * Timeouts **SHOULD** be appropriate for the network environment
 * Excessive pinging **SHOULD** be avoided to reduce network overhead

## 
​
Error Handling
 * Timeouts **SHOULD** be treated as connection failures
 * Multiple failed pings **MAY** trigger connection reset
 * Implementations **SHOULD** log ping failures for diagnostics

Was this page helpful?
YesNo
CancellationProgress
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---

# Key Changes - Model Context Protocol

## URL
https://modelcontextprotocol.io/specification/draft/changelog

## Metadata
- Depth: 2
- Timestamp: 2025-10-15T18:26:42.142262

## Content
Skip to main content
Model Context Protocol home page
Draft
Search...
⌘K
 * Blog
 * GitHub

Search...
Navigation
Key Changes
DocumentationSpecificationCommunityAbout MCP
 * Specification

 * Key Changes

 * Architecture

##### Base Protocol
 * Overview
 * Lifecycle
 * Transports
 * Authorization
 * Security Best Practices
 * Utilities

##### Client Features
 * Roots
 * Sampling
 * Elicitation

##### Server Features
 * Overview
 * Prompts
 * Resources
 * Tools
 * Utilities

 * Schema Reference

On this page
 * Major changes
 * Minor changes
 * Other schema changes
 * Full changelog

# Key Changes
Copy page
Copy page
This document lists changes made to the Model Context Protocol (MCP) specification since the previous revision, 2025-06-18.
## 
​
Major changes
 1. Enhance authorization server discovery with support for OpenID Connect Discovery 1.0. (PR #797)
 2. Allow servers to expose icons as additional metadata for tools, resources, resource templates, and prompts (SEP-973).
 3. Enhance authorization flows with incremental scope consent via `WWW-Authenticate` (SEP-835)
 4. Provide guidance on tool names (SEP-986)

## 
​
Minor changes
 1. Clarify that servers must respond with HTTP 403 Forbidden for invalid Origin headers in Streamable HTTP transport. (PR #1439)
 2. Updated the Security Best Practices guidance.

## 
​
Other schema changes
## 
​
Full changelog
For a complete list of all changes that have been made since the last protocol revision, see GitHub.
Was this page helpful?
YesNo
SpecificationArchitecture
⌘I
github
Assistant
Responses are generated using AI and may contain mistakes.


---
