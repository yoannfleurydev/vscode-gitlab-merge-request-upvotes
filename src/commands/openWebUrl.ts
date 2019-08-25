import * as vscode from 'vscode';

export const openWebUrlHandler = async (args: string) => 
  vscode.env.openExternal(vscode.Uri.parse(args));
