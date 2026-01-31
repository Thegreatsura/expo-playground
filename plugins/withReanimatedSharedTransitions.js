const { withGradleProperties, withXcodeProject } = require('@expo/config-plugins');

const withReanimatedSharedTransitions = (config) => {
  // Android: Add gradle property
  config = withGradleProperties(config, (config) => {
    config.modResults.push({
      type: 'property',
      key: 'reanimated.enableSharedElementTransitions',
      value: 'true',
    });
    return config;
  });

  // iOS: Add preprocessor macro
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();

    for (const key in configurations) {
      if (typeof configurations[key].buildSettings !== 'undefined') {
        const buildSettings = configurations[key].buildSettings;

        // Add the preprocessor definition
        if (buildSettings.GCC_PREPROCESSOR_DEFINITIONS) {
          if (Array.isArray(buildSettings.GCC_PREPROCESSOR_DEFINITIONS)) {
            if (!buildSettings.GCC_PREPROCESSOR_DEFINITIONS.includes('"ENABLE_SHARED_ELEMENT_TRANSITIONS=1"')) {
              buildSettings.GCC_PREPROCESSOR_DEFINITIONS.push('"ENABLE_SHARED_ELEMENT_TRANSITIONS=1"');
            }
          }
        } else {
          buildSettings.GCC_PREPROCESSOR_DEFINITIONS = [
            '"$(inherited)"',
            '"ENABLE_SHARED_ELEMENT_TRANSITIONS=1"',
          ];
        }
      }
    }

    return config;
  });

  return config;
};

module.exports = withReanimatedSharedTransitions;
