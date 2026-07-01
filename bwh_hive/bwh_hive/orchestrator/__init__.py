# Copyright (c) 2026, BWH Studios and contributors
# For license information, please see license.txt

"""v2 agent orchestration (specs/v2/02-phase-1-hive-orchestration.md).

This package owns the agent lifecycle on the Hive side:

- `benchspace.BenchSpaceClient` — thin REST client to BenchSpace (provision/manage boxes).
- `service` — the core: boot-env assembly, provisioning, the `agent_status` state
  machine (`set_agent_status`), control-plane dispatch, and (stub) deprovision.
- `hooks` — doc-event glue that turns "assign the Agent user" into a provision and
  "unassign" into a teardown.

Box callbacks (`bwh_hive.bwh_hive.agent_api`) and human/desk actions both route status
changes through `service.set_agent_status` so transitions stay centralized and valid.
"""
