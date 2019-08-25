import * as vscode from "vscode";
import { InstancesDataProvider } from "../InstancesDataProvider";
import { INSTANCES_KEY } from "../consts/Keys";

export const updateInstances = (context: vscode.ExtensionContext, instances: Array<string>, instanceDataProvider?: InstancesDataProvider) => {
	context.globalState.update(INSTANCES_KEY, instances);

	if (instanceDataProvider) {
		instanceDataProvider.refresh();
	}
}