import axios from "axios";

const MATCHING_BASE_URL = "http://localhost:8000";

export const matchingApi = axios.create({
  baseURL: MATCHING_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const matchingApiMultipart = axios.create({
  baseURL: MATCHING_BASE_URL,
});

// ── Parsing ──
export const parseResume = (file, token) => {
  const formData = new FormData();
  formData.append("file", file);
  return matchingApiMultipart.post("/api/parsing/parse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const getParsedResume = (id) =>
  matchingApi.get(`/api/parsing/${id}`);

export const getUserResumes = (userId) =>
  matchingApi.get(`/api/parsing/user/${userId}`);

export const activateResume = (id, token) =>
  matchingApi.patch(`/api/parsing/${id}/activate`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ── Jobs ──
export const getJobs = (params = {}) =>
  matchingApi.get("/api/jobs", { params });

export const getJobById = (id) =>
  matchingApi.get(`/api/jobs/${id}`);

export const getCompanies = () =>
  matchingApi.get("/api/jobs/companies");

// ── Matching ──
export const recommendMatches = (resumeId) =>
  matchingApi.post("/api/matches/recommend", { cv_id: resumeId });

export const directMatch = (jobId, resumeId, token) =>
  matchingApi.post("/api/matches", { cv_id: resumeId, job_id: String(jobId) }, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

// ── Notifications ──
export const getNotifications = (userId) =>
  matchingApi.get("/api/notifications", { params: { user_id: userId } });

export const getUnreadCount = (userId) =>
  matchingApi.get("/api/notifications/unread-count", { params: { user_id: userId } });

// ── Interview ──
export const startInterview = (payload) =>
  matchingApi.post("/api/interview/start", payload);

export const submitAnswer = (sessionId, payload) =>
  matchingApi.post(`/api/interview/${sessionId}/answer`, payload);

export const getInterviewFeedback = (sessionId) =>
  matchingApi.get(`/api/interview/${sessionId}/feedback`);
