import serpApiService from "../services/serpApi.service.js";
import { successResponse } from "../utils/ApiResponse.js";

//  POST /api/search/web
export const searchWeb = async (req, res) => {
  const { query, location } = req.body;

  const result = await serpApiService.searchWeb(query, {
    location,
  });
  console.log("Search Web Result:", result);

  return successResponse({
    res,

    message: "Search completed successfully",

    data: {
      query: result.query,
      engine: result.engine,
      resultCount: result.resultCount,
      results: result.results,
    },
  });
};

//  POST /api/search/news
export const searchNews = async (req, res) => {
  const { query } = req.body;

  const result = await serpApiService.searchNews(query);

  return successResponse({
    res,

    message: "New search completed successfully",

    data: {
      query: result.query,
      resultCount: result.resultCount,
      results: result.results,
    },
  });
};

//  POST /api/search/academic
export const searchAcademic = async (req, res) => {
  const { query } = req.body;

  const result = await serpApiService.searchAcademic(query);

  return successResponse({
    res,

    message: "Academic search completed successfully",

    data: {
      query: result.query,
      resultCount: result.resultCount,
      results: result.results,
    },
  });
};

//  POST /api/search/supporting
export const searchSupporting = async (req, res) => {
  const { query } = req.body;

  const result = await serpApiService.searchSupporting(query);

  return successResponse({
    res,

    message: "Supporting evidence search completed",

    data: {
      query: result.query,
      resultCount: result.resultCount,
      results: result.results,
    },
  });
};

//  POST /api/search/contradictory
export const searchContradictory = async (req, res) => {
  const { query } = req.body;

  const result = await serpApiService.searchContradictory(query);

  return successResponse({
    res,

    message: "Contradictory evidence search completed",

    data: {
      query: result.query,
      resultCount: result.resultCount,
      results: result.results,
    },
  });
};
