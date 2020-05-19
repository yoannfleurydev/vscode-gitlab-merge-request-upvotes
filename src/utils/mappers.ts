import * as vscode from "vscode";
import { OPEN_WEB_URL } from "../consts/Commands";
import { GitlabMergeRequest } from "../interfaces/GitLabMergeRequest";
import { MergeRequestTreeItem } from "../impl/TreeItem/MergeRequestTreeItem";
import { InstanceTreeItem } from "../impl/TreeItem/InstanceTreeItem";

/**
* Map the GitLab Merge Request to a Tree Item so the GUI can show it to the
* user.
* @param mergeRequest An object that match the GitlabMergeRequest interface.
*/
export const mapMergeRequestToTreeItem = (mergeRequest: GitlabMergeRequest) => (
 new MergeRequestTreeItem(
   `${mergeRequest.upvotes} 👍 - ${mergeRequest.title}`,
   vscode.TreeItemCollapsibleState.None,
   {
     command: OPEN_WEB_URL,
     title: "Open Web URL",
     arguments: [mergeRequest.web_url]
   }
 )
);

/**
 * Map the GitLab instance name to a TreeItem so the GUI can show it to the
 * user.
 * @param instance The instance name to map.
 */
export const mapInstanceToTreeItem = (instance: string) => (
  new InstanceTreeItem(instance, vscode.TreeItemCollapsibleState.Collapsed)
);
