import * as fs from "node:fs";
import path from "node:path";
import * as vscode from "vscode";
import {
  CHANGE_FONT_COMMAND,
  DISABLE_FONT_COMMAND,
  INSIDERS_WORKBENCH_RELATIVE_PATH,
  RESOURCES_APP,
  VS_WORKBENCH_RELATIVE_PATH,
} from "./constants";

/**
 * Activates the extension.
 * @param context - The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(CHANGE_FONT_COMMAND, () =>
      setFont(context)
    ),
    vscode.commands.registerCommand(DISABLE_FONT_COMMAND, unsetFont)
  );
}

/**
 * Deactivates the extension.
 */
// export function deactivate() {}

/**
 * Determines if VS Code or VS Code Insiders is running.
 * @returns 'vscode' if VS Code is running, 'vscode-insiders' if VS Code Insiders is running, or undefined if neither.
 */
function getVSCodeVariant(): "vscode" | "vscode-insiders" | undefined {
  const execPath = process.execPath.toLowerCase();
  console.log("Executing path:", execPath);

  if (execPath.includes("insiders")) {
    return "vscode-insiders";
  }
  return "vscode";
}

/**
 * Gets the path to the workbench HTML file.
 * @returns The path to the workbench HTML file.
 */
function getWorkbenchPath(): string {
  try {
    const vscodeVariant = getVSCodeVariant();

    if (process.env.VSCODE_WSL_EXT_LOCATION) {
      const VSCODE_CWD = process.env.VSCODE_CWD;
      const partialPath = VSCODE_CWD + RESOURCES_APP;
      if (vscodeVariant === "vscode-insiders") {
        // console.log("VSCODE_WSL_EXT_LOCATION:", process.env.VSCODE_WSL_EXT_LOCATION);
        return path.join(partialPath, INSIDERS_WORKBENCH_RELATIVE_PATH);
      }
      return path.join(partialPath, VS_WORKBENCH_RELATIVE_PATH);
    }

    // eslint-disable-next-line unicorn/prefer-module
    const basePath = path.dirname(require.main?.filename ?? "");

    // console.log(require);
    // console.log(process.env);

    // Check if basePath is empty or undefined
    if (!basePath) {
      throw new Error("Base path is undefined or empty.");
    }

    return path.join(basePath, VS_WORKBENCH_RELATIVE_PATH);
  } catch (error) {
    console.error("Error getting the workbench path:", error);
    throw new Error("Could not determine the workbench path.");
  }
}

/**
 * Reads the workbench HTML file.
 * @returns The content of the workbench HTML file.
 */
function getWorkbenchHtml(): string {
  const workbenchPath = getWorkbenchPath();
  return fs.readFileSync(workbenchPath, "utf8");
}

/**
 * Generates the style markup for the font.
 * @returns The style markup for the font.
 */
function getStyleMarkup(): string {
  const font = getFont();
  return `<style>
    .mac, .windows, .linux {font-family: "${font}" !important;}
  </style>`;
}

/**
 * Sets the font in the workbench HTML file.
 * @param context - The extension context.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function setFont(context: vscode.ExtensionContext) {
  const font = getFont();

  if (!font) {
    await unsetFont();
    return;
  }

  const html = getWorkbenchHtml();
  const styleMarkup = getStyleMarkup();

  if (!html.includes(styleMarkup)) {
    const _html = html.replace("</head>", styleMarkup + "</head>");
    saveWorkbenchHtml(_html);
    await promptRestart();
  }
}

/**
 * Unsets the font in the workbench HTML file.
 */
async function unsetFont() {
  const html = getWorkbenchHtml();
  const styleMarkup = getStyleMarkup();

  if (html.includes(styleMarkup)) {
    const _html = html.replace(styleMarkup, "");
    saveWorkbenchHtml(_html);
    await promptRestart();
  }
}

/**
 * Saves the modified workbench HTML file.
 * @param html - The modified HTML content.
 */
function saveWorkbenchHtml(html: string) {
  const workbenchPath = getWorkbenchPath();
  fs.writeFileSync(workbenchPath, html);
}

/**
 * Gets the configured font from the workspace settings.
 * @returns The configured font.
 */
function getFont(): string | undefined {
  return vscode.workspace.getConfiguration().get("fontify.font");
}

/**
 * Prompts the user to restart VS Code to apply changes.
 */
async function promptRestart() {
  const config = vscode.workspace.getConfiguration();
  const titleBarStyle = config.inspect("window.titleBarStyle");

  if (titleBarStyle) {
    const currentStyle = config.get("window.titleBarStyle");
    const _style = currentStyle === "native" ? "custom" : "native";

    await config.update(
      "window.titleBarStyle",
      _style,
      vscode.ConfigurationTarget.Global
    );
    await config.update(
      "window.titleBarStyle",
      titleBarStyle.globalValue,
      vscode.ConfigurationTarget.Global
    );
  }
}
