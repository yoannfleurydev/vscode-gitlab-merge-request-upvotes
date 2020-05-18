import * as vscode from 'vscode';
import axios from "axios";
import { ADD_INSTANCE } from './consts/Commands';
import { mapMergeRequestToTreeItem, mapInstanceToTreeItem } from './utils/mappers';
import { InstanceTreeItem } from './impl/TreeItem/InstanceTreeItem';

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

  async getChildren(element?: InstanceTreeItem): Promise<vscode.TreeItem[]> {
    // If there is an element, we are inside and instance, so we fetch the
    // opened Merge Request to get the different data.
    if (element) {
      const response = await axios.get(
        `https://${element.label}/api/v4/merge_requests?scope=created_by_me&state=opened`,
        {
          headers: {
            'Private-Token': this.context.globalState.get(element.label),
          }
        }
      );

      // If no Merge Request is available, show a TreeItem with an explanation.
      if (response.data.length === 0) {
        return [
          new vscode.TreeItem(
            'No merge request available for this instance',
            vscode.TreeItemCollapsibleState.None)
        ];
      }

      return response.data.map(mapMergeRequestToTreeItem);
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
