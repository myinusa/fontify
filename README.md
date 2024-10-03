
# Fontify Extension for VS Code

## Description

The Fontify extension is designed to allow users to customize the font of their VS Code editor via a simple command interface. This extension allows you to change the font globally or revert it back to the default settings by using context menu commands provided within the extension's commands palette.

## Features

- Change the font family for the entire VS Code environment.
- Revert to the original font settings at any time.
- Command interface accessible through the VS Code command palette.

## Usage

1. Install the Fontify extension from the VS Code marketplace.
2. Open the Command Palette by pressing `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS.
3. Type 'Fontify' and select the appropriate command:
   - **Change Font**: This will prompt you to enter a new font family which will then be applied globally in VS Code.
   - **Disable Font**: This will revert the font back to its original settings as installed by default.

## Configuration

- `fontify.font`: A string setting that holds the current font family being used in VS Code. You can set this value manually or through the extension commands.

## FAQ

**Q: Can I customize the font for only specific parts of the editor (like comments or functions)?**
A: No, the Fontify extension currently focuses on changing the overall font settings across the entire editor and does not support scoped customizations.

**Q: How do I know if my changes have been saved?**
A: After using either command, a notification will appear in VS Code indicating that your requested change has been applied. You may need to restart VS Code for some changes to take effect.

## Resources

- [VS Code Marketplace](https://marketplace.visualstudio.com/vscode) - For downloading and managing extensions.
- [VS Code Documentation](https://code.visualstudio.com/docs) - Official documentation providing detailed information about VS Code features, settings, and more.

## Topics

- `font customization`
- `VS Code extension development`
- `custom commands`

## Considerations

- Changes to the font may require a restart of VS Code for them to take effect.
- The extension interacts directly with the workbench HTML file; therefore, any changes made are permanent until manually altered or reverted.

This README provides a comprehensive guide on how to use and configure the Fontify extension for VS Code, along with some common questions users might have.
