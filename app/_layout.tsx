import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";



export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Create QueryClient once
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>

          <Stack.Screen
            name="splashscreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
