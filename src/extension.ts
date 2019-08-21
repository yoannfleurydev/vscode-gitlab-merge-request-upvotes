// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { InstancesDataProvider } from './InstancesDataProvider';

const INSTANCES_KEY = "yoannfleurydev-gitlab-merge-request-upvotes-instances";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const instanceDataProvider = new InstancesDataProvider(context, INSTANCES_KEY);
	vscode.window.registerTreeDataProvider('instancesTreeView', instanceDataProvider);

	const addInstanceHandler = async () => {
		const newInstance: string | undefined = await vscode.window.showInputBox({
			placeHolder: 'gitlab.com',
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
			prompt: "Enter the gitlab instance private token"
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
	}

	const removeInstanceHandler = async () => {
		// We get the stored instances.
		const instances: Array<string> = context.globalState.get(INSTANCES_KEY, []);

		const instanceToRemove: string | undefined = await vscode.window.showQuickPick(instances);

		// If undefined, it means that the user pressed on Escape. We stop the 
		// execution here.
		if (instanceToRemove === undefined || instances.length === 0) {
			return;
		}

		// Remove the selected instance from the instances list.
		const newInstances = instances.filter(instance => instance !== instanceToRemove);

		// Update the global state
		updateInstances(context, newInstances, instanceDataProvider);

		// Display a message box to the user
		vscode.window.showInformationMessage(`Instance ${instanceToRemove} removed`);
	}

	const refreshInstancesHandler = async () => {
		instanceDataProvider.refresh();
	}

	registerCommand(context, 'extension.addInstance', addInstanceHandler);
	registerCommand(context, 'extension.removeInstance', removeInstanceHandler);
	registerCommand(context, 'extension.refreshEntry', refreshInstancesHandler);
}

function updateInstances(context: vscode.ExtensionContext, instances: Array<string>, instanceDataProvider?: InstancesDataProvider) {
	context.globalState.update(INSTANCES_KEY, instances);

	if (instanceDataProvider) {
		instanceDataProvider.refresh();
	}
}

function registerCommand(
	context: vscode.ExtensionContext,
	name: string,
	handler: (...args: any[]) => void,
	thisArgs?: any
) {
	let disposable = vscode.commands.registerCommand(name, handler, thisArgs);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
