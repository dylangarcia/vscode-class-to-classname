import * as assert from "assert";

import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  const clipboardContents = '<div class="space-y-2"></div>';
  const expectedClipboardContents = '<div className="space-y-2"></div>';

  [".tsx", ".jsx"].forEach((extension) => {
    test(`replaces class with className in ${extension} files on paste`, async () => {
      const uri = vscode.Uri.parse(`untitled:test${extension}`);
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document, { preview: false });
      await vscode.env.clipboard.writeText(clipboardContents);
      await vscode.commands.executeCommand("class-to-classname.replaceOnPaste");

      const text = await vscode.env.clipboard.readText();
      assert.strictEqual(text, expectedClipboardContents);

      const content = document.getText();
      assert.strictEqual(content, expectedClipboardContents);
    });
  });

  ["typescriptreact", "javascriptreact"].forEach((language) => {
    test(`replaces class with className in ${language} files on paste`, async () => {
      const uri = vscode.Uri.parse(`untitled:test`);
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document, { preview: false });
      await vscode.languages.setTextDocumentLanguage(document, language);
      await vscode.env.clipboard.writeText(clipboardContents);
      await vscode.commands.executeCommand("class-to-classname.replaceOnPaste");

      const text = await vscode.env.clipboard.readText();
      assert.strictEqual(text, expectedClipboardContents);
    });
  });
});
