# Using Changesets with npm Publishing

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing.

## Workflow

1. **Add a Changeset**
   - Run `pnpm run changeset:add` to create a new changeset. Follow the prompts to describe your changes and select the version bump (patch, minor, major).
   - Commit the generated markdown file in `.changeset/`.

2. **Version Packages**
   - Run `pnpm run changeset:version` to update package versions and changelogs based on the changesets.
   - Commit the updated files.

3. **Publish to npm**
   - Run `pnpm run changeset:publish` to publish the package(s) to npm. Make sure you are authenticated with npm (`npm login`).

## Example
```sh
pnpm run changeset:add
# Commit the changeset
pnpm run changeset:version
# Commit the version bump
pnpm run changeset:publish
```

## Notes

## Using Changesets in a GitHub PR Flow

1. When you make changes that require a version bump or changelog entry, run `pnpm run changeset:add` and follow the prompts.
2. Commit the generated changeset file (in `.changeset/`) along with your code changes.
3. Push your branch and open a pull request (PR) on GitHub.
4. Reviewers can see the changeset summary in the PR and understand the intended version bump and changelog.
5. After the PR is approved and merged to the main branch:
   - Run `pnpm run changeset:version` to update package versions and changelogs.
   - Commit and push these changes (or open a new PR for the version bump if required by your workflow).
   - **Only run `pnpm run changeset:publish` after the version bump is committed to the main branch.** This ensures you are publishing the latest code from the main branch, not from a feature branch or unmerged PR.
   - Make sure you are authenticated with npm (`npm login`) before publishing.

### Tips
- Always include a changeset in PRs that modify published code.
- The changeset file helps reviewers understand the impact of your changes.
- For automated workflows, consider using [changesets/action](https://github.com/changesets/action) to automate versioning and publishing after PRs are merged.
