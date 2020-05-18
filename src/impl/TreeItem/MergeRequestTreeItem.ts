import * as vscode from "vscode";

export class MergeRequestTreeItem extends vscode.TreeItem {
  constructor(
    readonly label: string,
    readonly collapsibleState = vscode.TreeItemCollapsibleState.None,
    command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.command = command;
  }
}
