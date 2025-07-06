# Leo's candidate assessment

Thanks for taking the time to review my assessment!

## PR/Branching strategy

The branches all branch off of each other to keep the PRs small while still being able to progressively benefit from previous changes and prevent merge conflicts. **The PRs should be reviewed in chronological order**. In the real world, I would deploy frequently along the way.

The PRs are as follows

- [PR#1](https://github.com/leovolving/sea/pull/1) - initial db setup
- [PR#2](https://github.com/leovolving/sea/pull/2) - fixing glaring bugs and anti-patterns
- [PR#3](https://github.com/leovolving/sea/pull/3) - general UX improvements
- [PR#4](https://github.com/leovolving/sea/pull/4) - performance improvements

## If I had more time

Each PR has an "If I had more time" section, explaining what I would do if I had more time/in a production-ready environment. **Please review all PRs before scrutinizing this section in any particular PR.** This section is only reserved for tasks that didn’t make it to future PRs

## Testing

Tests were omitted for the sake of time. Ideally, these are the tests I would have liked to write:

- Unit tests for all util/helper functions
- Snapshot tests to verify the state of the DOM for any particular component (important for identifying breaking changes in a Design System component library)
- A basic E2E test to verify that the page can perform a search without crashing (I find it's good to set the groundwork for E2E testing now so that we are ready when it's time to build more complex UIs)
- Tests against a mock db to verify that the drizzle queries work as expected

## Follow ups

If you have any questions, feel free to email me at leo@leoyockey.com
