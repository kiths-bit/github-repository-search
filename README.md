# GitHub Repository Search

A focused React rebuild of GitHub's repository search experience.

The application allows a user to search GitHub repositories, view the most relevant results sorted by stars, and open individual repositories on GitHub.

## Features

- Search GitHub repositories by keyword
- Displays up to 10 repository results
- Results are sorted by star count in descending order
- Displays repository name, description, primary language, stars, and last updated date
- Links each result directly to the repository on GitHub
- Clear initial, loading, success, empty-result, and error states
- Retry action when a search request fails
- Responsive layout for narrow screens
- Visible keyboard focus states for interactive elements
- Uses semantic HTML and accessible status/error messaging

## Architecture

This is a client-side React application built with Vite.

The application keeps the search query, repository results, request status, and error message in React state. When the user submits a search, the application sends a request directly from the browser to the GitHub REST API.

The basic data flow is:

```text
User enters search query
        ↓
React search form
        ↓
searchRepositories()
        ↓
GitHub REST API
        ↓
Response converted to JSON
        ↓
React state updated
        ↓
Loading / Error / Empty / Results UI
        ↓
Repository cards
        ↓
GitHub repository links
```

### API request

Repository searches use the GitHub REST API:

```text
https://api.github.com/search/repositories
```

The request includes:

- The user's search query
- `sort=stars`
- `order=desc`
- `per_page=10`

The application URL-encodes the user's search text before adding it to the request.

### State management

The application uses React's `useState` hook rather than introducing a separate state-management library.

The main state values are:

- `query` — the current search input
- `repositories` — the returned repository list
- `status` — the current request/UI state
- `error` — the error message shown when a request fails

The `status` value controls which result state is rendered:

```text
idle
loading
success
error
```

A successful request with zero repositories is treated as a separate empty-results state.

## Project Structure

```text
github-repository-search/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

### Important files

| File | Purpose |
|---|---|
| `src/App.jsx` | Main application component, search logic, API request, state management, and result rendering |
| `src/App.css` | Main application layout, responsive styles, result cards, and UI states |
| `src/index.css` | Global styles and document-level layout rules |
| `src/main.jsx` | React entry point that mounts the application |
| `public/` | Static public assets |
| `package.json` | Project dependencies and npm scripts |
| `vite.config.js` | Vite configuration |
| `.oxlintrc.json` | Oxlint configuration |

## Design and Architecture Decisions

### React state instead of a state-management library

The application has a small amount of local state and a single main interaction flow. React's built-in `useState` is therefore sufficient.

Adding Redux, Zustand, or another state-management library would introduce additional complexity without solving a problem this application currently has.

### Direct GitHub API request

The application calls the public GitHub REST API directly from the browser.

This keeps the project small and avoids introducing a backend server solely to proxy the search request.

The trade-off is that the application is subject to the availability and rate limits of the GitHub API.

### Limited result count

The request asks GitHub for 10 repositories:

```text
per_page=10
```

This keeps the result page focused and avoids implementing pagination or infinite scrolling for a feature that only requires a focused repository search experience.

### Explicit request states

The UI uses explicit request states instead of showing the same screen for every condition.

This makes the following situations visually and textually distinguishable:

- Before a search
- While a request is loading
- When a request succeeds
- When no repositories match
- When the request fails

### Responsive layout

The layout has a breakpoint at `520px`.

On narrower screens:

- The search input and button stack vertically
- The search button becomes full width
- Result headers stack vertically
- Repository metadata stacks vertically

The document also uses a minimum body width of `320px` and prevents horizontal overflow.

### Accessibility decisions

The application uses semantic HTML elements including:

- `main`
- `header`
- `form`
- `label`
- `section`
- `article`
- `footer`

The search input is associated with its label using `htmlFor` and `id`.

Loading feedback uses:

```html
role="status"
```

Error feedback uses:

```html
role="alert"
```

The results section uses `aria-busy` while a search request is in progress.

Interactive elements also have visible `:focus-visible` outlines so keyboard users can identify the currently focused element.

## Prerequisites

The project requires:

- Node.js `24.15.0`
- npm `11.12.1`
- Git

Check your installed versions:

```bash
node --version
npm --version
git --version
```

The expected Node.js and npm versions used to develop this project are:

```text
Node.js v24.15.0
npm 11.12.1
```

## Installation

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/kiths-bit/github-repository-search.git
```

Then enter the project directory:

```bash
cd github-repository-search
```

### 2. Install dependencies

Run:

```bash
npm install
```

This installs the dependencies defined in `package.json` using the committed `package-lock.json`.

You do not need to manually install React, Vite, or Oxlint.

## Environment Variables

This project does **not** require environment variables.

There is no `.env` file to create and no API key or GitHub token is required for the application to start.

The application uses the public GitHub REST API directly from the browser.

## Running the Development Server

Start the development server with:

```bash
npm run dev
```

Vite will print a local URL in the terminal, normally:

```text
http://localhost:5173/
```

Open that URL in a browser.

## Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production build |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs Oxlint |

## How to Use the Application

1. Open the application in a browser.
2. Locate the **Search repositories** input.
3. Enter a search term such as:
   - `react`
   - `python`
   - `machine learning`
4. Press **Search** or submit the form.
5. While the request is running, the loading state is displayed.
6. When the request succeeds, repository results are displayed.
7. Each result shows:
   - Repository name
   - Description
   - Language
   - Star count
   - Last updated date
8. Select a repository name to open the repository's GitHub page in a new browser tab.

## How to Check the UI States

### Initial state

Open the application without submitting a search.

The results area should say:

```text
Search for a repository to get started.
```

### Loading state

Enter a search term and submit the form.

The application displays:

```text
Searching GitHub repositories...
```

while waiting for the GitHub API response.

### Successful results

Search for a common term such as:

```text
react
```

The application should display repository cards returned by GitHub.

### No-results state

Search for a term that produces no matching repositories.

The application displays:

```text
No repositories were found for "<query>".
```

### Error state

If the GitHub API request fails, the application displays an error message and a **Try again** button.

The retry button repeats the search using the current query.

## Building for Production

Create a production build with:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

Vite will provide a local preview URL in the terminal.

## Linting

Run Oxlint with:

```bash
npm run lint
```

The project uses Oxlint for static analysis.

## Known Limitations

This project is intentionally focused on the repository-search experience.

It does **not** currently provide:

- User authentication
- GitHub account sign-in
- Repository creation or editing
- Repository starring or un-starring
- Pagination or infinite scrolling
- Advanced GitHub search filters
- Search history
- Persistent saved searches
- A backend server
- A database
- A GitHub API token configuration

The application depends on the GitHub REST API. If GitHub is unavailable, the browser is offline, or the API rejects the request, the application cannot retrieve search results.

The application also does not implement its own caching layer, so repeated searches are sent to the GitHub API rather than being served from an application-managed cache.

## Technology Stack

- React `19.2.8`
- React DOM `19.2.8`
- Vite `8.3.0`
- JavaScript
- npm
- Oxlint `1.81.0`
- GitHub REST API

## Development Notes

The project uses ES modules and the standard Vite React development workflow.

Dependencies are locked through `package-lock.json` so that another developer can install the same dependency tree with:

```bash
npm install
```