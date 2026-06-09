import { useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import type WebViewType from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

/* URL de la maquette déployée. On pointe direct sur /feed pour éviter
   la landing + le formulaire d'accès — l'app sert à montrer la
   maquette en lui-même, pas le funnel d'inscription. */
const DEMO_URL = "https://edome-demo.vercel.app/feed";

export default function App() {
  const webRef = useRef<WebViewType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    webRef.current?.reload();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container} edges={["top"]}>
        {error ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorTitle}>Maquette inaccessible</Text>
            <Text style={styles.errorBody}>{error}</Text>
            <Text style={styles.errorHint}>
              Vérifie ta connexion ou que edome-demo.vercel.app est en ligne.
            </Text>
            <TouchableOpacity style={styles.retry} onPress={handleRetry}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.webviewWrap}>
            <WebView
              ref={webRef}
              source={{ uri: DEMO_URL }}
              style={styles.webview}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={(e) =>
                setError(e.nativeEvent.description || "Erreur réseau")
              }
              onHttpError={(e) => {
                const code = e.nativeEvent.statusCode;
                if (code >= 500) setError(`HTTP ${code}`);
              }}
              startInLoadingState={false}
              allowsBackForwardNavigationGestures
              decelerationRate="normal"
              pullToRefreshEnabled
              originWhitelist={["https://*", "http://localhost*"]}
              applicationNameForUserAgent={`EDomeDemo/${Platform.OS}`}
              setSupportMultipleWindows={false}
              javaScriptEnabled
              domStorageEnabled
              thirdPartyCookiesEnabled
              sharedCookiesEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
            />
            {loading && (
              <View style={styles.loader} pointerEvents="none">
                <ActivityIndicator size="large" color="#1e9df1" />
                <Text style={styles.loaderText}>Chargement de la maquette…</Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  webviewWrap: {
    flex: 1,
    backgroundColor: "#000000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    gap: 12,
  },
  loaderText: {
    color: "#71767b",
    fontSize: 13,
  },
  errorWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#000000",
  },
  errorTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorBody: {
    color: "#e7e9ea",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  errorHint: {
    color: "#71767b",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 28,
  },
  retry: {
    backgroundColor: "#1e9df1",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});
