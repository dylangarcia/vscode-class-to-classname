import * as assert from "assert";

import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  const clipboardContents = '<div class="space-y-2"></div>';
  const expectedClipboardContents = '<div className="space-y-2"></div>';

  [".tsx", ".jsx"].forEach((extension) => {
    test(`replaces class= with className= in ${extension} files on paste`, async () => {
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
    test(`replaces class= with className= in ${language} files on paste`, async () => {
      const uri = vscode.Uri.parse(`untitled:test-${language}`);
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document, { preview: false });
      await vscode.languages.setTextDocumentLanguage(document, language);
      await vscode.env.clipboard.writeText(clipboardContents);
      await vscode.commands.executeCommand("class-to-classname.replaceOnPaste");

      const text = await vscode.env.clipboard.readText();
      assert.strictEqual(text, expectedClipboardContents);

      const content = document.getText();
      assert.strictEqual(content, expectedClipboardContents);
    });
  });

  [
    '<div myclass="space-y-2"></div>',
    "<div myclass='space-y-2'></div>",
    'let myclass="foo";',
    '<div className="space-y-2"></div>',
  ].forEach((input) => {
    test(`does not modify: ${input}`, async () => {
      const id = Math.floor(Math.random() * 100000);
      const uri = vscode.Uri.parse(`untitled:test-${id}.jsx`);
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document, { preview: false });
      await vscode.env.clipboard.writeText(input);
      await vscode.commands.executeCommand("class-to-classname.replaceOnPaste");

      const text = await vscode.env.clipboard.readText();
      assert.strictEqual(text, input);

      const content = document.getText();
      assert.strictEqual(content, input);
    });
  });
});
