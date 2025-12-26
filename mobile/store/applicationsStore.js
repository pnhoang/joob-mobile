import { create } from "zustand";
import { API_URL } from "../constants/api";

export const useApplicationsStore = create((set, get) => ({
  applications: [],
  isLoading: false,
  error: null,
  selectedApplication: null,
  filter: "ALL",

  fetchApplications: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/mobile/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "Server returned non-JSON response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch applications");
      }

      set({ applications: data.applications || data, isLoading: false });
      return { success: true, data: data.applications || data };
    } catch (error) {
      console.log("Error fetching applications", error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  getApplicationDetails: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/mobile/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "Server returned non-JSON response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch application details");
      }

      set({ selectedApplication: data.application || data, isLoading: false });
      return { success: true, data: data.application || data };
    } catch (error) {
      console.log("Error fetching application details", error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  filterByStatus: (status) => {
    set({ filter: status });
  },

  getFilteredApplications: () => {
    const { applications, filter } = get();
    if (filter === "ALL") return applications;
    return applications.filter((app) => app.status === filter);
  },

  clearError: () => set({ error: null }),

  clearSelectedApplication: () => set({ selectedApplication: null }),
}));
