import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const paste = () =>
    vscode.commands.executeCommand("editor.action.clipboardPasteAction");

  const disposable = vscode.commands.registerCommand(
    "class-to-classname.replaceOnPaste",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        return paste();
      }

      const currentDocument = activeEditor.document;
      const currentDocumentFileName = currentDocument.fileName;
      const currentLanguageId = currentDocument.languageId;

      const isJsxOrTsxFile = /\.(t|j)sx$/.test(currentDocumentFileName);
      const isReactLanguageMode = [
        "javascriptreact",
        "typescriptreact",
      ].includes(currentLanguageId);

      if (!isJsxOrTsxFile && !isReactLanguageMode) {
        return paste();
      }

      const clipboardContents = await vscode.env.clipboard.readText();
      const replacedContents = clipboardContents.replace(
        /(\s)class=('|")/g,
        "$1className=$2"
      );

      await vscode.env.clipboard.writeText(replacedContents);
      return paste();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
