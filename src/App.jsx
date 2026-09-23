import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function searchRepositories(searchQuery = query) {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setRepositories([]);
      setStatus("idle");
      setError("");
      return;
    }

    setStatus("loading");
    setError("");
    setRepositories([]);

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          trimmedQuery
        )}&sort=stars&order=desc&per_page=10`
      );

      if (!response.ok) {
        throw new Error("GitHub could not complete the search.");
      }

      const data = await response.json();

      setRepositories(data.items || []);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStatus("error");
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    searchRepositories();
  }

  return (
    <main className="app">
      <section className="search-container">
        <header className="hero">
          <p className="eyebrow">FEATURE REBUILD</p>

          <h1>GitHub Repository Search</h1>

          <p className="intro">
            Search GitHub repositories and quickly explore their
            essential information.
          </p>
        </header>

        <form className="search-form" onSubmit={handleSearch}>
          <label htmlFor="repository-search">
            Search repositories
          </label>

          <div className="search-row">
            <input
              id="repository-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: react, python, machine learning..."
            />

            <button type="submit">Search</button>
          </div>
        </form>

        <section
          className="results-section"
          aria-labelledby="results-heading"
          aria-busy={status === "loading"}
        >
          <div className="results-header">
            <h2 id="results-heading">Search results</h2>

            {status === "success" && repositories.length > 0 && (
              <span className="result-label">
                {repositories.length} found
              </span>
            )}
          </div>

          {status === "idle" && (
            <p className="empty-state">
              Search for a repository to get started.
            </p>
          )}

          {status === "loading" && (
            <div className="loading-state" role="status">
              <strong>Searching GitHub repositories...</strong>
              <p>Please wait while we fetch the results.</p>
            </div>
          )}

          {status === "error" && (
            <div className="error-state" role="alert">
              <strong>Search failed</strong>

              <p>{error}</p>

              <p>
                Please check your connection and try again.
              </p>

              <button
                className="retry-button"
                type="button"
                onClick={() => searchRepositories()}
              >
                Try again
              </button>
            </div>
          )}

          {status === "success" && repositories.length === 0 && (
            <p className="empty-state">
              No repositories were found for "{query}".
            </p>
          )}

          {status === "success" && repositories.length > 0 && (
            <div className="results-list">
              {repositories.map((repository) => (
                <article
                  className="repository-card"
                  key={repository.id}
                >
                  <div className="repository-top">
                    <span className="repository-type">
                      Repository
                    </span>

                    <span className="repository-language">
                      {repository.language || "Mixed"}
                    </span>
                  </div>

                  <h3>
                    <a
                      href={repository.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {repository.full_name}
                    </a>
                  </h3>

                  <p className="repository-description">
                    {repository.description ||
                      "No description provided."}
                  </p>

                  <div className="repository-meta">
                    <span>
                      ★{" "}
                      {repository.stargazers_count.toLocaleString()}
                    </span>

                    <span>
                      Updated{" "}
                      {new Date(
                        repository.updated_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          A focused rebuild of GitHub's repository search feature.
        </footer>
      </section>
    </main>
  );
}

export default App;