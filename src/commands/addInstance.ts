import * as vscode from "vscode";
import { INSTANCES_KEY } from "../consts/Keys";
import { InstancesDataProvider } from "../InstancesDataProvider";
import { updateInstances } from "../utils/updateInstances";

export const addInstanceHandler = async (
  context: vscode.ExtensionContext,
  instanceDataProvider: InstancesDataProvider
) => {
  const newInstance: string | undefined = await vscode.window.showInputBox({
    placeHolder: "gitlab.com",
    prompt: "Enter the gitlab instance domain"
  });

  // If undefined, it means that the user pressed on Escape. We stop the 
  // execution here.
  if (newInstance === undefined) {
    return;
  }

  // We get the stored instances.
  const instances: Array<string> = context.globalState.get(INSTANCES_KEY, []);

  if (instances.filter(instance => instance === newInstance).length === 0) {
    instances.push(newInstance);
  } else {
    // Display a message box to the user and stop the exexution.
    vscode.window.showWarningMessage('Instance already exists');
    return;
  }

  const instanceToken: string | undefined = await vscode.window.showInputBox({
    placeHolder: 'Private Token',
    prompt: "Enter the gitlab instance private token",
    password: true,
    ignoreFocusOut: true, // Stay open so the user can go in the browser to copy the token.
  });

  // If undefined, it means that the user pressed on Escape. We stop the 
  // execution here.
  if (instanceToken === undefined) {
    return;
  }

  updateInstances(context, instances, instanceDataProvider);
  context.globalState.update(newInstance, instanceToken);

  // Display a message box to the user
  vscode.window.showInformationMessage('Instance added');
};
