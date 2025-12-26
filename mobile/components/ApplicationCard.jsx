import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { formatRelativeTime } from "../lib/utils";
import styles from "../assets/styles/applications.styles";

const STATUS_CONFIG = {
  PENDING: { color: "#f4b400", label: "Pending", icon: "time-outline" },
  REVIEWED: { color: "#1976D2", label: "Reviewed", icon: "eye-outline" },
  SHORTLISTED: { color: "#4CAF50", label: "Shortlisted", icon: "checkmark-circle-outline" },
  REJECTED: { color: "#DC3545", label: "Rejected", icon: "close-circle-outline" },
  INTERVIEW_SCHEDULED: { color: "#9C27B0", label: "Interview", icon: "calendar-outline" },
  HIRED: { color: "#2E7D32", label: "Hired", icon: "trophy-outline" },
};

export default function ApplicationCard({ application }) {
  const router = useRouter();
  const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.PENDING;

  const handlePress = () => {
    router.push(`/application/${application.id}`);
  };

  return (
    <TouchableOpacity style={styles.applicationCard} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {application.Job?.jobTitle || application.jobTitle || "Job Title"}
          </Text>
          <Text style={styles.companyName} numberOfLines={1}>
            {application.Job?.Company?.name || application.company || "Company Name"}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
          <Ionicons name={statusConfig.icon} size={14} color="#fff" />
          <Text style={styles.statusText}>{statusConfig.label}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#688f68" />
          <Text style={styles.detailText}>
            {application.Job?.location || application.location || "Remote"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#688f68" />
          <Text style={styles.detailText}>Applied {formatRelativeTime(application.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Ionicons name="chevron-forward-outline" size={20} color="#4CAF50" />
      </View>
    </TouchableOpacity>
  );
}
