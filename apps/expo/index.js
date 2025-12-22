import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Attach global error handlers early so runtime errors are captured in device logs
(function attachGlobalHandlers(){
	try {
		const defaultHandler = global.ErrorUtils?.getGlobalHandler?.();
		global.ErrorUtils?.setGlobalHandler?.((error, isFatal) => {
			console.error("[Global JS Error]", error, "isFatal:", isFatal);
			if (defaultHandler) defaultHandler(error, isFatal);
		});
	} catch (e) {
		console.error("Failed to attach global error handler", e);
	}

	// Capture unhandled promise rejections when possible
	try {
		if (typeof globalThis.addEventListener === "function") {
			globalThis.addEventListener("unhandledrejection", (ev) => {
				console.error("[UnhandledRejection]", ev?.reason);
			});
		}
	} catch (e) {
		console.error("Failed to attach unhandledrejection handler", e);
	}
})();

// Must be exported or Fast Refresh won't update the context
export function App() {
	const ctx = require.context("./app");
	return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
