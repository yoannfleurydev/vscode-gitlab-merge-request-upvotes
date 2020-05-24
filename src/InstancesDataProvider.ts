import * as vscode from 'vscode';
import axios from "axios";
import { ADD_INSTANCE } from './consts/Commands';
import { mapMergeRequestToTreeItem, mapInstanceToTreeItem } from './utils/mappers';
import { InstanceTreeItem } from './impl/TreeItem/InstanceTreeItem';
import { isUsingApprovals } from './utils/isUsingApprovals';
import { GitlabMergeRequest } from './interfaces/GitLabMergeRequest';

export class InstancesDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<InstanceTreeItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private instancesKey: string
  ) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: InstanceTreeItem): vscode.TreeItem {
    return element;
  }

  private getAxiosConfig(host: string) {
    return {
      headers: {
        'Private-Token': this.context.globalState.get(host),
      }
    };
  }

  async getApprovals(host: string, projectId: number, mergeRequestIid: number): Promise<number> {
    const endpoint = `https://${host}/api/v4/projects/${projectId}/merge_requests/${mergeRequestIid}/approvals`

    const { data: { approvals_required, approvals_left } } = await axios.get(endpoint, this.getAxiosConfig(host));

    return approvals_required - approvals_left;
  }

  async getChildren(element?: InstanceTreeItem): Promise<vscode.TreeItem[]> {
    // If there is an element, we are inside and instance, so we fetch the
    // opened Merge Request to get the different data.
    if (element) {
      const host = element.label;
      const endpoint = `https://${host}/api/v4/merge_requests?scope=created_by_me&state=opened`;

      const { data: mergeRequests } = await axios.get(
        endpoint, this.getAxiosConfig(host),
      );

      // If no Merge Request is available, show a TreeItem with an explanation.
      if (mergeRequests.length === 0) {
        return [
          new vscode.TreeItem(
            'No merge request available for this instance',
            vscode.TreeItemCollapsibleState.None)
        ];
      }

      if (isUsingApprovals()) {
        const mergeRequestWithApprovals: Array<Promise<GitlabMergeRequest>> = mergeRequests.map(async (mergeRequest: GitlabMergeRequest) => {
          const approvals = await this.getApprovals(host, mergeRequest.project_id, mergeRequest.iid);
          mergeRequest.upvotes = approvals;
          return mergeRequest;
        });

        const mergeRequestValues = await Promise.all(mergeRequestWithApprovals);

        return mergeRequestValues.map(mapMergeRequestToTreeItem);
      }

      return mergeRequests.map(mapMergeRequestToTreeItem);
    } else {
      const instances = this.context.globalState
        .get(this.instancesKey, [])
        .map(mapInstanceToTreeItem);

      if (instances.length !== 0) {
        return instances;
      }

      // If there is no data, return a tree item that allow the user to add an instance.
      const noDataTreeItem = new vscode.TreeItem("Add a GitLab instance");
      noDataTreeItem.command = {
        command: ADD_INSTANCE,
        title: "Add a GitLab instance",
      };

      return [noDataTreeItem];
    }
  }
}
