import { create } from "zustand";
import { API_URL } from "../constants/api";

export const useJobsStore = create((set, get) => ({
  jobs: [],
  jobDetails: null,
  savedJobs: [],
  appliedJobs: [],
  isLoading: false,
  error: null,

  // Fetch all jobs
  fetchJobs: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/mobile/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch jobs");

      set({ jobs: data.jobs || data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Get job details by ID
  getJobDetails: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/mobile/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch job details");

      set({ jobDetails: data, isLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Apply to a job
  applyToJob: async (jobId, applicationData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/mobile/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to apply to job");

      // Add to applied jobs list
      const currentApplied = get().appliedJobs;
      if (!currentApplied.includes(jobId)) {
        set({ appliedJobs: [...currentApplied, jobId] });
      }

      set({ isLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  // Check if user has applied to a job
  checkIfApplied: async (jobId, token) => {
    try {
      const response = await fetch(`${API_URL}/api/mobile/jobs/${jobId}/check-application`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) return false;

      return data.hasApplied || false;
    } catch (error) {
      console.log("Error checking application status", error);
      return false;
    }
  },

  // Save/unsave a job (bookmark)
  toggleSaveJob: async (jobId, token) => {
    try {
      const savedJobs = get().savedJobs;
      const isSaved = savedJobs.includes(jobId);

      const response = await fetch(`${API_URL}/api/mobile/jobs/${jobId}/save`, {
        method: isSaved ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to toggle save job");

      // Update local state
      if (isSaved) {
        set({ savedJobs: savedJobs.filter((id) => id !== jobId) });
      } else {
        set({ savedJobs: [...savedJobs, jobId] });
      }

      return { success: true, isSaved: !isSaved };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check if job is saved
  isJobSaved: (jobId) => {
    return get().savedJobs.includes(jobId);
  },

  // Clear job details
  clearJobDetails: () => set({ jobDetails: null }),
}));
