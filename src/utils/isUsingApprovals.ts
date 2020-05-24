import * as vscode from 'vscode';

export function isUsingApprovals(): boolean {
  return vscode.workspace.getConfiguration("gitlab-merge-request-upvotes").get("upvotes.type") === "approvals";
}
