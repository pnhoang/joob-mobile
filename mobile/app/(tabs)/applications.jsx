import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { useApplicationsStore } from "../../store/applicationsStore";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ApplicationCard from "../../components/ApplicationCard";
import Loader from "../../components/Loader";
import styles from "../../assets/styles/applications.styles";
import COLORS from "../../constants/colors";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FILTER_OPTIONS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "REVIEWED", label: "Reviewed" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview" },
  { key: "REJECTED", label: "Rejected" },
  { key: "HIRED", label: "Hired" },
];

export default function Applications() {
  const { token } = useAuthStore();
  const { fetchApplications, getFilteredApplications, filter, filterByStatus, isLoading } =
    useApplicationsStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    await fetchApplications(token);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    await sleep(800);
    setRefreshing(false);
  };

  const handleFilterPress = (filterKey) => {
    filterByStatus(filterKey);
  };

  const filteredApplications = getFilteredApplications();

  const renderItem = ({ item }) => <ApplicationCard application={item} />;

  if (isLoading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Text style={styles.headerSubtitle}>Track your job applications</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContentContainer}
      >
        {FILTER_OPTIONS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.filterButton, filter === item.key && styles.filterButtonActive]}
            onPress={() => handleFilterPress(item.key)}
          >
            <Text
              style={[styles.filterButtonText, filter === item.key && styles.filterButtonTextActive]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredApplications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No applications yet</Text>
            <Text style={styles.emptySubtext}>
              {filter === "ALL"
                ? "Start applying to jobs to see them here!"
                : `No ${filter.toLowerCase()} applications found`}
            </Text>
          </View>
        }
      />
    </View>
  );
}
