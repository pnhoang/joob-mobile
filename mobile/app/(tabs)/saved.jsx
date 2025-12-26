import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/home.styles";

export default function Saved() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Jobs</Text>
        <Text style={styles.headerSubtitle}>Your bookmarked opportunities</Text>
      </View>
      <View style={styles.emptyContainer}>
        <Ionicons name="bookmark-outline" size={60} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>No saved jobs yet</Text>
        <Text style={styles.emptySubtext}>Bookmark jobs you're interested in!</Text>
      </View>
    </View>
  );
}
