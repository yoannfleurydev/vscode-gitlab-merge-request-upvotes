import * as assert from 'assert';
import { before } from 'mocha';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { GitlabMergeRequest } from '../../interfaces/GitLabMergeRequest';
import { mapMergeRequestToTreeItem, mapInstanceToTreeItem } from '../../utils/mappers';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  before(() => {
    vscode.window.showInformationMessage('Start all tests.');
  });

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  test('Merge Request to Tree Item mapper', () => {
    const mergeRequest: GitlabMergeRequest = 
      {
        title: "My Merge Request",
        upvotes: 2,
        web_url: "https://gitlab.com/yoannfleurydev/sample_project"
      };

    const treeItem = new vscode.TreeItem(
      "2 👍 - My Merge Request",
    );

    assert.strictEqual(treeItem.label, mapMergeRequestToTreeItem(mergeRequest).label);
  })

  test('Instance to Tree Item mapper', () => {
    const instance = "gitlab.com";

    const treeItem = new vscode.TreeItem(
      "gitlab.com",
    );

    assert.strictEqual(treeItem.label, mapInstanceToTreeItem(instance).label);
  })
});
