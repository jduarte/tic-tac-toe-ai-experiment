# 1. Main Concepts

## AI IDEs

AI IDEs are code editors or development environments enhanced with AI-powered features like code completion, explanation, debugging, and project refactoring.

Examples:
	•	Cursor: AI-native code editor built for AI-first development workflows.
	•	Windsurf: A Claude-based AI IDE focused on collaborative, secure, AI-assisted coding.
	•	Claude Code: Anthropic’s AI-powered code environment for safe and interpretable code assistance.


The greatest benefits of AI IDEs are its agentic capabilities. In practice this means that the IDE can be used to write code, debug code, refactor code, write tests, perform terminal commands, etc.

## AI Models

Large, trained systems that can process text, code, and data to perform reasoning, code generation, explanation, etc.

Examples:
	•	Claude 4 Opus: High-capacity, reasoning-focused AI from Anthropic.
	•	Claude 4 Sonnet: Mid-range model optimized for speed and cost.
	•	OpenAI Models (GPT-4o, GPT-4 Turbo, etc.): Used models for code generation and task automation.

## MCP ( Model Context Protocol )

Standard, client‑server protocol that enables LLM-powered apps to securely discover and connect to external data sources and tools, using a unified interface—think of it as the “USB‑C port for AI”

Examples:
* Github MCP
* JIRA MCP
* Bugsnag MCP

After configured we can say things like: "review my github PRs and list all of them that touched the X feature"

## A2A (Agent-to-Agent Protocol)

A2A is a protocol that allows agents to communicate with each other, enabling them to share information, collaborate on tasks, and leverage each other's capabilities.

Haven't tested it yet myself but it's very promising. Basically we can have dedicated agents for a specific part of the task/workflow and have them communicate with each other.

# 2. Let's make something:

## 2.1. Let's create a flappy

We don't know Java that well, so we need to use an AI IDE to help us

So let's

```sh
# .cursor/rules/

You are a senior software engineer.
You are given a task to create a new project.
You are given a list of tools and data sources that you can use to complete the task.
You are given a list of rules that you must follow to complete the task.```
```
