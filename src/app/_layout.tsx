import { colors } from "@/styles/colors"
import { Stack,  } from "expo-router"
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "./database/initializeDatabase";

export default function Layout() {
  const backgroundColor = colors.gray[950]


  return (
    <SQLiteProvider databaseName="links.db" onInit={initializeDatabase}>
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor }
    }}
    />
    </SQLiteProvider>
  )
}