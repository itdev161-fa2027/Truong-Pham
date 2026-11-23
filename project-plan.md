
# Final Project Plan - Blog Application Enhancement

## Student Information

- Course: Web Programming 1 (ITDEV-161-800)
- Project: My Blog
- Selected Path: Path B - Two Medium Enhancements

## Milestone 1: Plan

Path: B

## Selected Enhancements

### Enhancement 1: Markdown Support

**Description:**

I will add Markdown support to my blog application so users can format their posts with headings, bold text, italic text, lists, links, and code blocks. Users will also be able to preview their formatted posts before saving them.

**Back-End Changes:**

No back-end changes are required. Markdown content will be stored as plain text in the existing `body` field of the Post model.

**Front-End Changes:**

- Update `PostDetail.jsx` to display formatted Markdown content.
- Update `PostForm.jsx` to add a Markdown preview.
- Update `PostCard.jsx` to display a readable preview without Markdown symbols.
- Add CSS styling for headings, lists, links, and code blocks.

**Packages:**

- `react-markdown` - Render Markdown content in React.
- `remark-gfm` - Support GitHub-flavored Markdown, including tables.
- `remove-markdown` - Remove Markdown symbols from post card previews.

**Testing Plan:**

1. Create a post with headings, bold text, italic text, and links. Verify that the formatting displays correctly.
2. Create a post with ordered and unordered lists. Verify that both list types display correctly.
3. Create a post with a code block. Verify that the code appears in a monospace font.
4. Enter Markdown in the post form and verify that the preview matches the published post.
5. Enter HTML containing a script tag and verify that the script does not execute.
6. Verify that post cards display readable previews without Markdown formatting symbols.


### Enhancement 2: Search

**Description:**

I will add a search feature to my blog application so users can find posts by entering keywords. The search will check both post titles and body content. Search results will update automatically after the user stops typing for a short time.

**Back-End Changes:**

- Update the existing `GET /api/posts` route in `server.js` to accept a search query parameter.
- Use MongoDB `$regex` with `$or` to search both the `title` and `body` fields.
- Make the search case-insensitive.
- Escape special regular expression characters such as `.` and `*` before searching.
- Return all posts when the search parameter is empty or missing.

**Front-End Changes:**

- Add a search input and a Clear button to `Home.jsx`.
- Use React state to store the search text.
- Implement debouncing with `useEffect` and `setTimeout` to avoid sending a request after every keystroke.
- Update the `getPosts()` function in `client/src/services/api.js` to send the search text as a query parameter.
- Display a message when no posts match the search.
- Keep the search bar visible while results are loading.

**Packages:**

No additional packages are required. I will use React hooks, Axios, Express, and MongoDB, which are already part of the application.

**Testing Plan:**

1. Search for a word in a post title and verify that the correct post appears.
2. Search for a word in the post body and verify that the correct post appears.
3. Search using uppercase and lowercase letters and verify that the results are the same.
4. Type a search term and verify that results update after a short delay.
5. Search for `*` and verify that the application does not produce an error.
6. Search for `.` and verify that only posts containing a period appear.
7. Click the Clear button and verify that all posts appear again.
8. Search for a word that does not exist and verify that a "No posts found" message appears.


### Task List

1. Create the final project plan and set up the final-project branch - Week 1
2. Install react-markdown, remark-gfm, and remove-markdown - Week 2
3. Update PostDetail.jsx to render Markdown content - Week 2
4. Update PostForm.jsx to add a Markdown preview - Week 2
5. Update PostCard.jsx to display clean text previews - Week 2
6. Add CSS styling for Markdown elements and test Markdown support - Week 2
7. Update GET /api/posts in server.js to support searching by title and body - Week 3
8. Add case-insensitive searching and escape special regex characters - Week 3
9. Update getPosts() in api.js to send the search query - Week 3
10. Add a search input, Clear button, and debouncing to Home.jsx - Week 3
11. Test Search and update the Milestone 2 progress section - Week 3
12. Test both enhancements and verify existing blog features still work - Week 4
13. Update project-plan.md with final test results and AI usage - Week 4
14. Update README.md with new features and setup instructions - Week 4
15. Record a 1-3 minute demonstration video - Week 4
16. Commit final changes, create a pull request, and merge into main - Week 4


### Questions or Risks

One challenge may be making sure Markdown formatting displays correctly in both the preview and the published post. I will test different Markdown elements and compare the results.

Another challenge may be implementing the search feature without sending too many requests to the server. I plan to use debouncing to reduce unnecessary API calls.

I also need to make sure special characters such as * and . do not cause errors in MongoDB searches. I will test these cases and escape special regex characters.

I will check that all existing features, including registration, login, and post CRUD operations, continue to work after adding the new enhancements.


## AI Usage

**Tools:** ChatGPT

**What I used them for:**

- Helped me understand the final project requirements and compare the available enhancements.
- Helped me organize the project plan and break the work into smaller tasks.
- Helped me identify possible technical challenges and create testing plans.

**How I checked the result:**

- Compared the project plan with the Final Project instructions and enhancement options.
- Reviewed the planned changes to make sure they match the structure of my existing blog application.
- Checked that both enhancements include the required back-end changes, front-end changes, packages, and testing plans.
