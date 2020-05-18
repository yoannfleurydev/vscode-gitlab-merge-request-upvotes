// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { InstancesDataProvider } from './InstancesDataProvider';
import { INSTANCES_KEY } from './consts/Keys';
import { openWebUrlHandler } from './commands/openWebUrl';
import { ADD_INSTANCE, REMOVE_INSTANCE, REFRESH_INSTANCES, OPEN_WEB_URL } from './consts/Commands';
import { refreshInstancesHandler } from './commands/refreshInstances';
import { addInstanceHandler } from './commands/addInstance';
import { removeInstanceHandler } from './commands/removeInstance';
import { InstanceTreeItem } from './impl/TreeItem/InstanceTreeItem';

function registerCommand(
  context: vscode.ExtensionContext,
  name: string,
  handler: (...args: any[]) => void,
  thisArgs?: any
): void {
  const disposable = vscode.commands.registerCommand(name, handler, thisArgs);
  context.subscriptions.push(disposable);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  const instanceDataProvider = new InstancesDataProvider(context, INSTANCES_KEY);
  vscode.window.registerTreeDataProvider('instancesTreeView', instanceDataProvider);

  registerCommand(
    context,
    ADD_INSTANCE,
    () => addInstanceHandler(context, instanceDataProvider)
  );
  registerCommand(
    context,
    REMOVE_INSTANCE,
    (instanceToRemove: InstanceTreeItem) => 
      removeInstanceHandler(context, instanceDataProvider, instanceToRemove)
  );
  registerCommand(
    context,
    REFRESH_INSTANCES,
    () => refreshInstancesHandler(instanceDataProvider)
  );
  registerCommand(
    context,
    OPEN_WEB_URL,
    openWebUrlHandler
  );

  const isAutomaticRefreshEnabled: boolean | undefined = vscode.workspace
    .getConfiguration("gitlabMergeRequestUpvotes")
    .get<boolean>("enableRefresh");

  // If false or undefined, we do not want to activate the automatic refresh.
  if (isAutomaticRefreshEnabled) {
    // Refresh the tree view every X sec.
    const seconds: number = vscode.workspace
      .getConfiguration("gitlabMergeRequestUpvotes")
      .get<number>("refreshInterval") || 30;

    setInterval(() => refreshInstancesHandler(instanceDataProvider), seconds * 1000);
  }
}

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void {}
