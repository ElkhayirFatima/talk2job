import axios from "axios";

const INTERVIEW_BASE_URL = "http://localhost:8001";

export const interviewApi = axios.create({
  baseURL: INTERVIEW_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Interview Session ──

export const startInterviewSession = ({ resume_text, job_title, resume_id, user_id, job_id }) =>
  interviewApi.post("/interview/start", null, {
    params: { resume_text, job_title, resume_id, user_id, job_id },
  });

export const submitAudioAnswer = (interviewId, audioBlob) => {
  const formData = new FormData();
  formData.append("interview_id", interviewId);
  formData.append("audio_file", audioBlob, "recording.wav");
  return interviewApi.post("/interview/next", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ── CRUD ──

export const getAllInterviews = () =>
  interviewApi.get("/interviews/");

export const getInterview = (interviewId) =>
  interviewApi.get(`/interviews/${interviewId}`);

export const getInterviewMessages = (interviewId) =>
  interviewApi.get(`/messages/interview/${interviewId}`);

export const getInterviewFeedbacks = (interviewId) =>
  interviewApi.get(`/feedbacks/interview/${interviewId}`);
