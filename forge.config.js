import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

export const packagerConfig = {
  asar: true,
};
export const rebuildConfig = {};
export const makers = [
  {
    name: "@electron-forge/maker-squirrel",
    config: {},
  },
  {
    name: "@electron-forge/maker-zip",
    platforms: ["darwin"],
  },
  {
    name: "@electron-forge/maker-deb",
    config: {},
  },
  {
    name: "@electron-forge/maker-rpm",
    config: {},
  },
];
export const plugins = [
  {
    name: "@electron-forge/plugin-vite",
    config: {
      build: [
        {
          entry: "src/main.js",
          config: "vite.main.config.js",
          target: "main",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.js",
        },
      ],
    },
  },
  {
    name: "@electron-forge/plugin-auto-unpack-natives",
    config: {},
  },
  // Fuses are used to enable/disable various Electron functionality
  // at package time, before code signing the application
  new FusesPlugin({
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableCookieEncryption]: true,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
  }),
];

export const publishers = [
  {
    name: "@electron-forge/publisher-github",
    config: {
      draft: false,
      generateReleaseNotes: true,
      repository: {
        owner: "KhalidAlansary",
        name: "Traffic",
      },
    },
  },
];
