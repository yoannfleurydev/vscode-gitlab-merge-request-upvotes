import * as vscode from 'vscode';
import Axios from "axios";
import { ADD_INSTANCE, OPEN_WEB_URL } from './consts/Commands';

export class InstancesDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<InstanceTreeItem | undefined> = new vscode.EventEmitter<InstanceTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<InstanceTreeItem | undefined> = this._onDidChangeTreeData.event;

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

  getChildren(element?: InstanceTreeItem): Thenable<vscode.TreeItem[]> {

    if (element) {
      return Axios.get(`https://${element.label}/api/v4/merge_requests?scope=created_by_me&state=opened`, {
        headers: {
          Authorization: `Bearer ${this.context.globalState.get(element.label)}`,
        }
      }).then(response => {
        return response.data.map(
          (mergeRequest: GitlabMergeRequest) =>  new MergeRequestTreeItem(
              `${mergeRequest.upvotes} 👍 - ${mergeRequest.title}`,
              vscode.TreeItemCollapsibleState.None,
              {
                command: OPEN_WEB_URL,
                title: "Open Web URL",
                arguments: [mergeRequest.web_url]
              }
            )
        );
      })
    } else {
      const instances = this.context.globalState.get(this.instancesKey, []).map(instance => {
        return new InstanceTreeItem(instance, vscode.TreeItemCollapsibleState.Collapsed)
      })

      if (instances.length !== 0) {
        return Promise.resolve(instances);
      } else {

        // If there is no data, return a tree item that allow the user to add an instance.
        const noDataTreeItem = new vscode.TreeItem("No data available, click to add an instance");
        noDataTreeItem.command = {
          command: ADD_INSTANCE,
          title: "Add a GitLab instance",
        }

        return Promise.resolve([noDataTreeItem])
      }
    }
  }
}

export class InstanceTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
  ) {
    super(label, collapsibleState);
  }
}

export class MergeRequestTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
    command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.command = command;
  }
}

interface GitlabMergeRequest {
  title: string;
  upvotes: number;
  web_url: string;
}