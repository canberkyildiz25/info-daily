---
title: "What Is Apple's New Foundation Models? A Guide to On-Device and Cloud AI"
excerpt: "Apple's Foundation Models power on-device and cloud AI across every Apple product. Discover how they work and why they matter for your privacy."
date: "2026-06-12"
author: "Alex Rivera"
coverImage: "https://picsum.photos/seed/656/800/450"
tags: ["Apple Foundation Models", "Apple Intelligence", "on-device AI", "cloud AI", "Apple AI privacy"]
---

Apple has never been the loudest voice in the AI room, but it might be the most deliberate. With the rollout and ongoing evolution of **Apple Foundation Models (AFM)**, the company has quietly built one of the most ambitious AI infrastructures in consumer tech — one that runs directly on your iPhone, iPad, and Mac while extending seamlessly into the cloud when needed. If you've used Siri's dramatically improved conversational abilities, seen intelligent summaries in Mail, or watched Image Playground generate custom visuals, you've already interacted with these models. Here's everything you need to know about what they are, how they work, and why Apple's approach stands apart.

## What Exactly Are Apple Foundation Models?

Apple Foundation Models refer to a family of large language models (LLMs) and diffusion models purpose-built by Apple to power **Apple Intelligence**, the company's AI platform introduced at WWDC 2024 and significantly expanded through 2025 and into 2026. Unlike a single monolithic model, AFM is actually a collection of models optimized for different tasks and deployment environments.

There are two primary tiers:

- **AFM-on-device**: A compact model (roughly 3 billion parameters) designed to run entirely on Apple silicon — no internet connection required.
- **AFM-on-server (Private Cloud Compute)**: A larger, more capable model hosted on Apple's own servers, activated only when a task exceeds the on-device model's capabilities.

Apple also employs specialized adapters — small, task-specific neural network layers that sit on top of the base model. These adapters allow a single foundation model to handle summarization, rewriting, code generation, image understanding, and more without needing entirely separate models for each function. According to Apple's own technical research published in 2024, this adapter-based architecture reduces memory overhead by up to **50%** compared to running dedicated fine-tuned models for each task.

## How On-Device AI Works With Apple Silicon

The on-device component is where Apple's hardware-software integration truly shines. The AFM-on-device model runs on the **Neural Engine** built into Apple's A-series and M-series chips. Starting with the A17 Pro and M1 (and now extending to the A19 and M5 in 2026 devices), these chips dedicate specific transistors to machine learning inference.

### What happens when you use on-device AI:

1. **Your request stays local.** When you ask Siri to summarize an email or suggest a reply, the on-device model processes the text without sending it to any server.
2. **Adapters load dynamically.** The system loads the relevant task adapter (e.g., summarization, tone adjustment) into memory on the fly, keeping the base model lightweight.
3. **Responses generate in real time.** Thanks to aggressive quantization and optimization techniques like grouped-query attention, the 3B parameter model delivers responses in milliseconds.

### Practical examples of on-device AFM in action:

- **Smart Reply in Messages and Mail** — contextually aware suggestions generated without cloud connectivity
- **Writing Tools** — rewriting, proofreading, and tone-shifting text across any app with a text field
- **Notification summaries** — condensing lengthy notification stacks into concise, readable briefs
- **Visual Intelligence** — identifying objects, text, and scenes through the camera in real time
- **On-device Siri processing** — handling routine commands, follow-up questions, and personal context queries locally

The beauty of this system is that it works in airplane mode. No Wi-Fi, no cellular — the AI still functions for most everyday tasks.

## Private Cloud Compute: When On-Device Isn't Enough

Some tasks genuinely require more computational muscle. Generating complex images, processing lengthy documents, or handling multi-step reasoning chains can overwhelm a 3-billion-parameter model. That's where **Private Cloud Compute (PCC)** comes in.

PCC is Apple's custom cloud AI infrastructure, and it's architecturally unlike anything offered by competitors. Here's what makes it different:

- **No persistent data storage.** Your data is processed and immediately discarded. Apple's servers don't retain prompts, responses, or any personal information after the task completes.
- **Cryptographic verification.** Every PCC node runs software that can be independently audited by security researchers. Apple publishes the measurements of every production build, meaning third parties can verify that the server code matches what Apple claims.
- **End-to-end encryption.** Data in transit between your device and PCC servers is encrypted, and even Apple engineers cannot access it during processing.
- **No privileged access.** The system is designed so that no one — not even Apple — can bypass privacy protections, even with physical access to the server hardware.

Apple effectively treats cloud AI with the same zero-trust philosophy it applies to iMessage encryption. In a 2025 security audit conducted by independent researchers, PCC was described as "the most advanced privacy architecture deployed in commercial cloud AI to date."

## How Apple's Approach Differs From Competitors

It's worth understanding where Apple sits in the broader AI landscape, because the differences are significant.

| Feature | Apple (AFM) | Google (Gemini) | OpenAI (ChatGPT) |
|---|---|---|---|
| On-device processing | Yes, primary | Limited | No |
| Cloud data retention | None | Yes (varies) | Yes (unless opted out) |
| Open model weights | No | Partially (Gemma) | No |
| Hardware optimization | Deep (Apple Silicon) | Moderate (Tensor chips) | None (cloud-only) |
| Third-party model integration | Yes (ChatGPT, others) | No | N/A |

Apple's willingness to integrate third-party models like ChatGPT as an optional layer — while keeping its own models as the default — gives users flexibility without compromising the baseline privacy experience.

## What This Means for You in 2026

As of mid-2026, Apple Foundation Models power an increasingly broad range of features across iOS 19, iPadOS 19, and macOS Tahoe. Here's how to make the most of them:

### Tips for getting the best experience:

- **Keep your device updated.** Apple frequently ships adapter updates and model improvements through regular software updates — not just major OS releases.
- **Use Writing Tools everywhere.** Most people only use them in Notes or Mail, but they work in any text field system-wide, including third-party apps.
- **Trust notification summaries.** They've improved significantly since launch. If you're still ignoring them, give them another look — they now handle group chats and threaded emails with impressive accuracy.
- **Check your Siri & Apple Intelligence settings.** Under *Settings > Apple Intelligence & Siri*, you can control whether cloud processing is enabled, manage third-party model access, and review which apps can use AI features.
- **Don't overlook Visual Intelligence.** Point your camera at a restaurant, a plant, a product, or a sign in a foreign language. The on-device model handles recognition and context instantly.

## The Bigger Picture

Apple's Foundation Models represent a philosophical stance as much as a technical achievement. While much of the AI industry has raced toward ever-larger cloud models with opaque data practices, Apple has bet that **privacy and performance aren't mutually exclusive**. The on-device-first approach means your most personal data — your messages, your photos, your writing — never has to leave your hardware for AI to be useful.

Is Apple's AI the most powerful available? Not always. GPT-5 and Gemini Ultra can handle more complex generative tasks. But for the vast majority of daily interactions — quick replies, summaries, search, image understanding, writing assistance — Apple's system is fast, private, and deeply integrated in ways no competitor can match.

That's not just a feature. In 2026, it's a competitive advantage.
