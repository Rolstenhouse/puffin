const { getDefaultConfig } = require("@expo/metro-config");
const resolveFrom = require("resolve-from");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName.startsWith("event-target-shim") &&
    context.originModulePath.includes("@daily-co/react-native-webrtc")
  ) {
    const eventTargetShimPath = resolveFrom(
      context.originModulePath,
      moduleName
    );

    return { filePath: eventTargetShimPath, type: "sourceFile" };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
