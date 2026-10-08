---
name: update-template-version
description: Prepare a Digital Garden template-update branch by reverting dependency and Node version downgrades, reapplying repository-root customization patches, and committing and reporting each step separately.
---

# Update the template version

Use this workflow when updating this garden to a new upstream template version. Work on the template-update branch; preserve customizations without copying obsolete template code over new features.

## 1. Identify the update branch and baseline

- Inspect repository instructions, Git status, staged changes, and remotes before changing files. Preserve unrelated user changes and staging; never reset, discard, or include them in your commits.
- Find local and remote branches named `update-template-to-v[Version Number]-[Hash]`. Prefer the branch or PR specified by the user. If several candidates remain, inspect their open PRs, versions, and commits; ask only when the intended update is ambiguous.
- Fetch the selected branch and its PR base branch, then check out the update branch. Attach the PR to the current chat when supported.
- Record the template version, update head, and latest base-branch head. Compare against the latest base branch, not only the merge base: package updates may have landed after the template-update branch was created.
- Read the update diff and template/plugin authoring guidance relevant to moved or replaced functionality. Branch identification and other read-only steps need no commit.

## 2. Revert version downgrades

- Compare package manifests and lockfiles against the latest base branch. Check dependency ranges, actual locked versions, nested dependencies, overrides/resolutions, the Node engine, and Node versions in CI and other runtime configuration.
- Restore versions reduced by the template update, including newer base-branch package fixes missing from the update branch. Restore removed overrides that enforced those versions.
- Preserve unrelated template changes, new dependencies, and version upgrades. Do not replace whole manifests or lockfiles blindly. Reuse the baseline lockfile only when its dependency graph still matches the updated manifest; otherwise update the affected lock entries with the existing package manager.
- Confirm the manifest and lockfile agree. Restoring newer package majors may also require adapting imports or API calls in updated template code; check runtime compatibility rather than assuming version restoration alone is sufficient.
- Commit version restoration separately. If necessary compatibility edits are substantial, commit them as a separate coherent step and explain their connection to the restored packages. If no downgrade exists, report that result without an empty commit.

## 3. Discover and apply customization patches

- Discover all `.patch` files directly in the repository root at execution time. Do not hardcode patch filenames or recursively pick up generated copies.
- Read each patch and its introductory comments to identify its purpose, original template version, scope, and dependencies on other patches. Apply prerequisites first; use stable filename order when patches are independent.
- Review every hunk, including hunks touching functionality moved into plugins. A successful textual application does not prove that the intended fix still covers every active code path.
- Try each patch atomically with `git apply --check` followed by `git apply`. Do not use reject mode to leave partial edits. Inspect every failed hunk, not just the first error.

### Classify patch failures

Handle hunks individually when a patch has a mixture of applicable, redundant, and conflicting changes:

- **Already fully applied:** verify the intended behavior and additions are present, rather than relying only on reverse-application checks. Ignore the redundant patch or hunk and report it; make no empty commit.
- **Minor context change:** when behavior and target remain equivalent but surrounding lines, formatting, line endings, or line numbers changed, update the patch context and apply it. Preserve the original intent and unrelated new template behavior. Validate the revised patch against the pre-change baseline, then verify its resulting behavior.
- **Major change:** when the target was removed, moved to a different extension point, changed API, or rewritten, inspect the updated baseline and replacement implementation. Determine whether the original fix is already implemented, replaced by an equivalent mechanism, only partly covered, or still needed. Report concrete files, hunks, behavior, and evidence. Do not force old code into the new architecture or perform a major redesign without user direction.
- **Malformed patch or missing prerequisite:** report the exact cause. Repair clearly mechanical patch-format errors when intent is unambiguous; otherwise leave the patch unresolved and continue independent work.

For partial applicability, apply only understood, necessary hunks after preparing a coherent revised patch. Report which hunks were skipped and why. Keep patch descriptions accurate; retain historical initial-version notes and add adaptation notes when useful.

Commit each successfully applied patch separately. Include modifications to that patch file in the same commit as its source changes. Do not combine unrelated patches or commit a failed/partial attempt as a finished fix. A baseline-equivalent patch requires no source commit; commit any deliberate patch-file maintenance separately.

## 4. Verify the result

- Run focused checks for changed behavior and the relevant source test suite. Exclude cached or generated test copies when selecting tests.
- Verify an Eleventy build and dev startup when runtime/configuration changes warrant it. Watch for heap/GC crashes, module-export mismatches, plugin warnings, and favicon write failures. Increasing the heap is not a substitute for fixing a blocking loader or import.
- Check installed package versions before claiming compatibility with restored versions. If the installed dependency tree differs from the lockfile, synchronize it with the existing package manager before runtime validation or explicitly report the validation limitation.
- Stop verification watchers/servers you started. Keep generated output and temporary files out of commits.
- Run a final diff/status check. Commit any additional necessary fix as its own coherent step; preserve unrelated user work. Do not push, merge, or publish unless requested.

## 5. Report results

Report success, failure, or a justified skip for branch selection, version restoration, every discovered patch, and verification. Include:

- Selected branch/PR, template version, and comparison baseline.
- Restored manifest and locked versions, Node versions, and overrides; distinguish actual downgrades from lower ranges with unchanged locked versions.
- Applied patches, context repairs, already-applied fixes, and findings for major conflicts or baseline-equivalent implementations.
- Commit hashes and a brief purpose for each commit.
- Checks run, outcomes, remaining conflicts, and any unverified runtime behavior.

Do not report the update as fully successful while required patches or verification remain unresolved.
