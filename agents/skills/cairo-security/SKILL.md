---
name: cairo-security
description: Security patterns and audit checklists for Cairo contracts.
repo: keep-starknet-strange/starknet-agentic
---

# Cairo Security Skill

Focused security patterns and audit checklists for Cairo production contracts.

## Key Checklists
- **Contract Structure**: Layout, imports, and interface safety.
- **Storage Safety**: Preventing overlaps and ensuring state integrity.
- **Access Control**: Validating callers and owner roles.
- **Math & Units**: Handling precision and overflow/underflow (post-2.0).
- **L1/L2 Messages**: Safe bridging and callback security.

## Best Practices
- **OpenZeppelin v3 Patterns**: Standard libraries for secure contracts.
- **Session Key Safety**: Limiting delegated power to specific contracts/tools.
- **Static Analysis**: Integrating with `cairo-auditor` for deep checks.

## Benchmarks
- Validated against the top 24 Starknet audit reports.
- Used in `starknet-agentic` test suites for security regressions.
