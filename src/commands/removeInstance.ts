import * as vscode from "vscode";
import { INSTANCES_KEY } from "../consts/Keys";
import { updateInstances } from "../utils/updateInstances";
import { InstancesDataProvider } from "../InstancesDataProvider";
import { InstanceTreeItem } from "../impl/TreeItem/InstanceTreeItem";

export  const removeInstanceHandler = async (
  context: vscode.ExtensionContext,
  instanceDataProvider: InstancesDataProvider,
  instanceToRemoveArg?: InstanceTreeItem
): Promise<void> => {
  // Get the stored instances.
  const instances: Array<string> = context.globalState.get(INSTANCES_KEY, []);

  const instanceToRemove: string | undefined = await (async () => {
    if (instanceToRemoveArg && instances.includes(instanceToRemoveArg.label)) {
      return instanceToRemoveArg.label;
    }

    return await vscode.window.showQuickPick(instances, {
      placeHolder: 'Select the instance to remove'
    });
  })();

  // If undefined, it means that the user pressed on Escape. We stop the
  // execution here.
  if (instanceToRemove === undefined || instances.length === 0) {
    return;
  }

  // Remove the selected instance from the instances list.
  const newInstances = instances.filter(instance => instance !== instanceToRemove);

  // Update the global state
  updateInstances(context, newInstances, instanceDataProvider);
  
  // Remove the private token for this instance
  context.globalState.update(instanceToRemove, undefined);

  // Display a message box to the user
  vscode.window.showInformationMessage(`Instance ${instanceToRemove} removed`);
};
