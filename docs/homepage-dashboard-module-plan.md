# Homepage Dashboard Module Plan
> Last updated: April 21, 2026

## Goal
Add a compact "stats + activity heatmap" module on the homepage directly below the hero text and above "Featured Posts", inspired by the reference card UI.

## Placement
- Page: `/` (homepage)
- Position: between hero block and Featured Posts section
- Width: same content container as existing homepage sections
- Mobile behavior: single-column card stack with horizontally scrollable heatmap if needed

## Visual Direction
- Match existing site UI language (dark neutral surfaces, subtle borders, rounded corners)
- Avoid introducing a new visual system that feels disconnected from current homepage
- Keep controls minimal:
  - Left: `Overview` tab only in v1 (reserve `Models` for later if needed)
  - Right: `All`, `30d`, `7d` range filters

## Recommended Data Model (v1)
Use post metadata as the source of truth, not external analytics.

Card metrics for range:
- `Posts`: number of published posts in range
- `Words`: total word count across posts in range
- `Active days`: unique dates with at least one post
- `Current streak`: consecutive active days ending today (or last active day)
- `Longest streak`: max consecutive active-day run in range
- `Peak hour`: most common publish hour (fallback `N/A` if missing time granularity)
- `Favorite tag`: most used tag in range
- `Last update`: latest `updatedAt`/`date` in range

Activity grid:
- 7 rows x N columns heatmap for daily activity intensity
- Intensity based on post count or word volume per day
- Range modes:
  - `All`: full dataset window (cap to last 180 days for layout sanity)
  - `30d`: last 30 days
  - `7d`: last 7 days

## Data Requirements
Current schema is close, but v1 quality improves if we standardize:
- `date` required (already required)
- `updatedAt` optional (already added)
- optional future field: `publishedAt` datetime for accurate hour-based metrics

## Implementation Plan
## Phase 1: Data Utility Layer
- Create a server-side utility to:
  - load published posts
  - apply selected range (`all|30d|7d`)
  - compute aggregate metrics
  - return heatmap matrix data
- Output shape should be UI-ready to keep component dumb/simple

## Phase 2: Reusable Dashboard Component
- Build `src/components/HomeDashboard.astro` (or `.tsx` if interaction needs client-side state)
- Props:
  - `defaultRange`
  - precomputed metric groups
  - heatmap cells
- Use semantic labels + tooltips for each metric

## Phase 3: Homepage Integration
- Insert component in `src/pages/index.astro` immediately after hero copy
- Preserve existing Featured Posts/Journal sections unchanged

## Phase 4: Interaction + Polish
- Range toggle behavior:
  - Option A (recommended): server-render all three ranges and toggle client-side
  - Option B: server-only default range (no interaction)
- Add loading-free transitions for range changes
- Add legends for heatmap intensity

## Phase 5: QA
- Check desktop/tablet/mobile layouts
- Validate no CLS issues around hero + dashboard insertion
- Verify dark theme readability and contrast
- Confirm page weight impact stays low

## Acceptance Criteria
- New module appears between hero and Featured Posts
- Metrics update correctly for `All`, `30d`, `7d`
- Heatmap renders without overflow issues on mobile
- Module visually matches existing homepage style
- No regression in existing homepage content sections

## Risks and Mitigations
- Risk: sparse historical data makes heatmap look empty
  - Mitigation: show helpful empty-state text and fallback metric labels
- Risk: inconsistent frontmatter dates
  - Mitigation: normalize dates in utility layer and log invalid entries
- Risk: overbuilding controls not needed yet
  - Mitigation: ship `Overview` only in v1, defer extra tabs

## Decisions Needed Before Build
1. Metric meaning for "Sessions" equivalent:
   - Recommend rename to `Posts` for truthfulness.
2. Heatmap intensity basis:
   - Recommend post count/day for clarity.
3. `All` range cap:
   - Recommend capping render window to last 180 days.
4. Tab scope:
   - Recommend `Overview` only in v1.

## Suggested v1 Scope (Recommended)
- One card module
- 8 metrics
- 3 range filters
- post-based heatmap
- no external analytics integration

This ships fast, matches your current content model, and gives the same high-signal "dashboard" feel as the reference without introducing backend complexity.
