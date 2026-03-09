---
name: cairo-auditor
description: Security auditing for Cairo smart contracts.
repo: keep-starknet-strange/starknet-skills
---

# Cairo Auditor Skill

Enable AI agents to identify vulnerabilities and security patterns in Cairo / Starknet contracts.

## Knowledge Base
- **217 Normalized Findings**: Security audit findings from 24 production projects.
- **7 Security Modules**: Organized by vulnerability types.
- **Audit Checklist**: Standardized list of security checks for every contract.

## Capabilities
- **Vulnerability Detection**: Identify reentrancy, integer overflow (legacy), and logic bugs.
- **Regression Testing**: Patterns for testing against known exploits.
- **Fix Generation**: Suggest security-hardened patterns (e.g., OZ account checks).
- **Optimization Path**: Post-test pass to reduce gas usage without compromising safety.

## References
- Sourced from audits of leading Starknet protocols.
- Integrated with `starknet-agentic` for automated security checks in build pipelines.
