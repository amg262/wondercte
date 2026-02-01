# User Profile Feature Documentation

## Overview
User profiles display comprehensive test statistics, history, and personal information for each user in the WonderCTE application.

## Features

### 1. Profile Page (`/users/[userId]`)
Each user has a dedicated profile page showing:

- **Basic Information**
  - User name and avatar
  - Join date
  - Global rank and percentile

- **Statistics Dashboard**
  - Best Score (out of 50)
  - Global Rank
  - Average Score
  - Total Tests Taken

- **NFL Player Comparison**
  - Shows which NFL player's Wonderlic score matches the user's best score
  - Displays next higher and lower scores to beat

- **Performance Distribution**
  - Breakdown of scores by category:
    - Excellent: 40-50
    - Good: 30-39
    - Average: 20-29
    - Below Average: <20

- **Test History**
  - Complete list of all tests taken (up to 20 most recent)
  - Each test shows:
    - Score with color coding
    - Number of correct answers
    - Time taken
    - Date and time of completion
    - "Personal Best" badge for highest score

- **Quick Actions**
  - Link to leaderboard
  - "Challenge [user]" button to take a test
  - "My Dashboard" button (when viewing own profile)

### 2. Clickable Usernames

Usernames are now clickable throughout the application:

- **Global Leaderboard** (`/leaderboard`)
  - Click any username to view their profile

- **Group Leaderboards** (`/groups/[groupId]`)
  - Click usernames in leaderboard
  - Click member names in the members list

- **Live Leaderboards**
  - All live-updating leaderboards use the same clickable component

### 3. Server Actions

New server actions in `lib/actions/user-profile.ts`:

#### `getUserProfile(userId: string)`
Fetches complete user profile including:
- Basic user info
- Test statistics
- Test history (last 20 tests)
- NFL player comparison
- Global rank

Returns `UserProfile` object or `null` if user not found.

#### `getUserStats(userId: string)`
Fetches simplified statistics including:
- Best, average, and recent average scores
- Improvement trend
- All scores array

Returns stats object or `null` if no tests taken.

## Implementation Details

### Files Created/Modified

**Created:**
- `lib/actions/user-profile.ts` - Server actions for fetching user data
- `app/(dashboard)/users/[userId]/page.tsx` - User profile page component
- `docs/USER_PROFILES.md` - This documentation

**Modified:**
- `components/leaderboard/leaderboard-table.tsx` - Added clickable links to usernames
- `app/(dashboard)/groups/[groupId]/page.tsx` - Made member list clickable

### Color Coding

Scores are color-coded throughout for quick visual identification:
- 🟢 Green (40-50): Excellent
- 🔵 Blue (30-39): Good
- 🟡 Yellow (20-29): Average
- 🔴 Red (<20): Below Average

### Responsive Design

The profile page is fully responsive with:
- 4-column grid on desktop (stats cards)
- 2-column grid on tablets
- Single column on mobile
- Adaptive spacing and text sizes

### Performance

- Server-side rendering for fast initial load
- Efficient database queries with proper indexing
- Pagination for test history (20 most recent)
- Optimized NFL comparison lookup

## Usage Examples

### Viewing a Profile
```typescript
// Navigate to a user's profile
<Link href={`/users/${userId}`}>View Profile</Link>

// Or programmatically
router.push(`/users/${userId}`);
```

### Fetching Profile Data
```typescript
import { getUserProfile } from "@/lib/actions/user-profile";

const profile = await getUserProfile(userId);
if (!profile) {
  // Handle user not found
  notFound();
}
```

### Checking if Own Profile
```typescript
const session = await auth.api.getSession();
const isOwnProfile = session?.user?.id === userId;
```

## Future Enhancements

Potential additions:
- [ ] User achievements/badges
- [ ] Share profile to social media
- [ ] Compare two users side-by-side
- [ ] Test streak tracking
- [ ] Score progression graph/chart
- [ ] Export test history to CSV
- [ ] Privacy settings (hide profile from public)
- [ ] Custom profile themes
- [ ] Profile statistics widgets for embedding

## Navigation Flow

```
Home → Leaderboard → Click Username → User Profile
Home → Groups → Click Group → Click Username → User Profile
Home → Groups → Click Group → Click Member → User Profile
Dashboard → (future: recent opponents) → User Profile
```

## Security Considerations

- All profile data is public by design (social engagement)
- Email addresses are fetched but not displayed (privacy)
- No sensitive user data is exposed
- Server-side validation for userId parameter
- Proper 404 handling for non-existent users

## Testing Checklist

- [x] Profile loads for existing user
- [x] 404 page shows for non-existent user
- [x] Stats calculate correctly
- [x] NFL comparison shows when applicable
- [x] Test history displays properly
- [x] Usernames are clickable in leaderboards
- [x] Responsive design works on all screen sizes
- [x] No linter errors
- [ ] Performance test with large test history
- [ ] Edge cases (0 tests, 1 test, many tests)
