import { exec } from 'child_process';
import * as vscode from 'vscode';

let cancelled = false;
let failures = 0;

export function activate(context: vscode.ExtensionContext) {
	console.log('extension now active!', context.extensionUri.toString());

	const check = async () => {
		if (cancelled) {return;}
		const wf = vscode.workspace.workspaceFolders;
		if (wf === undefined || wf.length === 0) {
			setTimeout(check, 2000);
			return;
		}
		const tokens = new vscode.CancellationTokenSource();
		const token = tokens.token;
		const t = setTimeout(() => tokens.cancel(), 3000);
		let res = 0;
		try {
			res = (await vscode.workspace.findFiles('**/*', null, 10, token)).length;
		} catch (e) {
			console.log('ping failure', e);
		}
		clearTimeout(t);
		tokens.dispose();

		if (res === 0) {
			failures += 1;
			console.log('ping failure', failures);
			vscode.window.showWarningMessage('ping failure');
			if (failures > 2) {
				vscode.commands.executeCommand('workbench.action.reloadWindow');
				return; // will be restarted in the new session
			}
		} else {
			failures = 0;
		}

		setTimeout(check, 2000);
	};
	check();
}

export function deactivate() {
	console.log('stopping');
	cancelled = true;
}
