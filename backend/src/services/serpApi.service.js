import { getJson } from "serpapi";
import ApiError from "../utils/ApiError.js";

const apiKey = process.env.SERPAPI_API_KEY;

const defaultEngine = process.env.SERPAPI_ENGINE || "google";

if (!apiKey) {
  throw new Error("SERPAPI_API_KEY is not configured");
}

//  Normalize SerpApi results
const normalizeResults = (response) => {
  const organicResults = response.organic_results || [];

  return organicResults.map((result, index) => ({
    id: result.position ?? index + 1,

    title: result.title || "",

    link: result.link || "",

    snippet: result.snippet || "",

    source: result.source || "",

    displayedLink: result.displayed_link || "",

    date: result.date || null,

    position: result.position ?? index + 1,
  }));
};

// Generic web search
const searchWeb = async (query, options = {}) => {
  if (!query || !query.trim()) {
    throw new ApiError(400, "Search query cannot be empty");
  }

  try {
    const response = await getJson({
      engine: options.engine || defaultEngine,

      q: query,

      api_key: apiKey,

      ...(options.location && {
        location: options.location,
      }),

      ...(options.numResults && {
        num: options.numResults,
      }),
    });

    if (response.error) {
      throw new ApiError(502, `SerpApi error: ${response.error}`);
    }

    const results = normalizeResults(response);

    return {
      query,

      engine: options.engine || defaultEngine,

      results,

      resultCount: results.length,

      searchMetadata: response.search_metadata || null,

      raw: response,
    };
  } catch (error) {
    console.error("SerpApi Error:", error.message);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(502, "Failed to communicate with SerpApi", {
      provider: "SerpApi",

      originalError:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};

//  News search
const searchNews = async (query, options = {}) => {
  return searchWeb(query, {
    ...options,
    engine: "google",
    tbm: "nws",
  });
};

//  Academic-style search
//  For MVP we use Google search with
//  academic domains/keywords.
//  Later we can make this smarter.

const searchAcademic = async (query, options = {}) => {
  const academicQuery =
    `${query} ` +
    `(site:pubmed.ncbi.nlm.nih.gov OR ` +
    `site:ncbi.nlm.nih.gov OR ` +
    `site:scholar.google.com)`;

  return searchWeb(academicQuery, {
    ...options,
    engine: "google",
  });
};

// Search supporting evidence
const searchSupporting = async (query, options = {}) => {
  const supportingQuery = `${query} evidence study research`;

  return searchWeb(supportingQuery, options);
};

// Search contradictory evidence
const searchContradictory = async (query, options = {}) => {
  const contradictoryQuery =
    `${query} contrary evidence ` + `limitations criticism contradictory`;

  return searchWeb(contradictoryQuery, options);
};

export default {
  searchWeb,
  searchNews,
  searchAcademic,
  searchSupporting,
  searchContradictory,
};
