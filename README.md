# RecoverAI

## AI-Assisted Payment Recovery & Decision System

RecoverAI is a full-stack AI-assisted payment recovery system designed to analyze failed transactions and determine the safest recovery action.

Instead of blindly retrying failed payments, RecoverAI evaluates transaction data, customer behavior, recovery history, risk signals, deterministic scoring, and AI recommendations before applying a policy decision.

The system is built around one core principle:

> **AI recommends. Policy decides. Every decision is auditable.**

---

## How It Works

```text
Failed Payment
      |
      v
Customer Context
      |
      v
Recovery Score
      |
      v
Baseline Decision
      |
      +----------------+
      |                |
      v                v
  AI Decision      Comparison
      |                |
      +-------+--------+
              |
              v
       Policy Validation
              |
       +------+------+ 
       |      |      |
       v      v      v
    APPROVE REVIEW BLOCK
       |      |      |
       v      v      v
     RETRY  HUMAN   STOP
             REVIEW



     ## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| AI | Local AI / LLM |
| API | REST |
| Styling | CSS |
| Package Manager | npm |
| Version Control | Git, GitHub |



## Overview

RecoverAI is a full-stack AI-assisted payment recovery system designed to analyze failed transactions and determine the safest recovery action.

Instead of blindly retrying failed payments, RecoverAI evaluates transaction data, customer behavior, recovery history, risk signals, deterministic scoring, and AI recommendations before applying a policy decision.

The system is built around one core principle:

> **AI recommends. Policy decides. Every decision is auditable.**


