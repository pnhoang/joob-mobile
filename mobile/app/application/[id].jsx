import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useApplicationsStore } from "../../store/applicationsStore";
import { formatPublishDate, formatRelativeTime } from "../../lib/utils";
import Loader from "../../components/Loader";
import styles from "../../assets/styles/applicationDetail.styles";
import COLORS from "../../constants/colors";

const STATUS_CONFIG = {
  PENDING: { color: "#f4b400", label: "Pending", icon: "time-outline" },
  REVIEWED: { color: "#1976D2", label: "Reviewed", icon: "eye-outline" },
  SHORTLISTED: { color: "#4CAF50", label: "Shortlisted", icon: "checkmark-circle-outline" },
  REJECTED: { color: "#DC3545", label: "Rejected", icon: "close-circle-outline" },
  INTERVIEW_SCHEDULED: { color: "#9C27B0", label: "Interview Scheduled", icon: "calendar-outline" },
  HIRED: { color: "#2E7D32", label: "Hired", icon: "trophy-outline" },
};

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const { getApplicationDetails, selectedApplication, isLoading, clearSelectedApplication } =
    useApplicationsStore();

  useEffect(() => {
    loadApplicationDetails();
    return () => clearSelectedApplication();
  }, [id]);

  const loadApplicationDetails = async () => {
    await getApplicationDetails(id, token);
  };

  const handleOpenDocument = async (url) => {
    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    }
  };

  if (isLoading || !selectedApplication) return <Loader />;

  const application = selectedApplication;
  const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.PENDING;
  const job = application.Job || {};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Details</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <View style={[styles.statusBadgeLarge, { backgroundColor: statusConfig.color }]}>
          <Ionicons name={statusConfig.icon} size={32} color="#fff" />
          <Text style={styles.statusTextLarge}>{statusConfig.label}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Information</Text>
          <View style={styles.card}>
            <Text style={styles.jobTitle}>{job.jobTitle || application.jobTitle || "Job Title"}</Text>
            <Text style={styles.companyName}>
              {job.Company?.name || application.company || "Company Name"}
            </Text>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>{job.location || application.location || "Remote"}</Text>
            </View>

            {job.pay && (
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.infoText}>{job.pay}</Text>
              </View>
            )}

            {job.employmentType && (
              <View style={styles.infoRow}>
                <Ionicons name="briefcase-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.infoText}>{job.employmentType}</Text>
              </View>
            )}

            {job.id && (
              <TouchableOpacity
                style={styles.viewJobButton}
                onPress={() => router.push(`/job/${job.id}`)}
              >
                <Text style={styles.viewJobButtonText}>View Full Job Details</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Timeline</Text>
          <View style={styles.card}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Applied</Text>
                <Text style={styles.timelineDate}>{formatPublishDate(application.createdAt)}</Text>
                <Text style={styles.timelineRelative}>{formatRelativeTime(application.createdAt)}</Text>
              </View>
            </View>

            {application.updatedAt && application.updatedAt !== application.createdAt && (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: statusConfig.color }]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Status Updated</Text>
                  <Text style={styles.timelineDate}>{formatPublishDate(application.updatedAt)}</Text>
                  <Text style={styles.timelineRelative}>{formatRelativeTime(application.updatedAt)}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {(application.cvUrl || application.coverLetterUrl) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Submitted Documents</Text>
            <View style={styles.card}>
              {application.cvUrl && (
                <TouchableOpacity
                  style={styles.documentButton}
                  onPress={() => handleOpenDocument(application.cvUrl)}
                >
                  <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>Resume / CV</Text>
                    <Text style={styles.documentSubtitle}>Tap to view</Text>
                  </View>
                  <Ionicons name="open-outline" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}

              {application.coverLetterUrl && (
                <TouchableOpacity
                  style={[styles.documentButton, application.cvUrl && { marginTop: 12 }]}
                  onPress={() => handleOpenDocument(application.coverLetterUrl)}
                >
                  <Ionicons name="document-outline" size={24} color={COLORS.primary} />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>Cover Letter</Text>
                    <Text style={styles.documentSubtitle}>Tap to view</Text>
                  </View>
                  <Ionicons name="open-outline" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {application.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.card}>
              <Text style={styles.notesText}>{application.notes}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
