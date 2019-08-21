import * as vscode from 'vscode';
import Axios from "axios";

export class InstancesDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<Instance | undefined> = new vscode.EventEmitter<Instance | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Instance | undefined> = this._onDidChangeTreeData.event;

	constructor(private context: vscode.ExtensionContext, private instancesKey: string) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Instance): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Instance): Thenable<vscode.TreeItem[]> {

		if (element) {
			return Axios.get(`https://${element.label}/api/v4/merge_requests?scope=created_by_me`, {
				headers: {
					Authorization: `Bearer ${this.context.globalState.get(element.label)}`,
				}
			}).then(response => {
				return response.data.map(
					(mergeRequest :GitlabMergeRequest) => 
						new vscode.TreeItem(`${mergeRequest.upvotes} 👍 - ${mergeRequest.title}`)
				);
			})
		} else {
			const instances = this.context.globalState.get(this.instancesKey, []).map(instance => {
				return new Instance(instance, vscode.TreeItemCollapsibleState.Collapsed)
			})

			if (instances.length !== 0) {
				return Promise.resolve(instances);
			} else {
				return Promise.resolve([new Instance("No data, add an instance")])
			}
		}

	}

}

export class Instance extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		if (command) {
			this.command = command;
		}
	}

}

interface GitlabMergeRequest {
	title: string;
	upvotes: number;
	web_url: string;
}