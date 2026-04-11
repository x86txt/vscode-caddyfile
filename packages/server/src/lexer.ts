import { Position, TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

function getTrimmedLine(document: TextDocument, line: number): string {
	return document
		.getText({
			start: { line, character: 0 },
			end: { line: line + 1, character: 0 },
		})
		.trim();
}

function hasGlobalOptions(document: TextDocument): boolean {
	if (document.lineCount < 2) {
		return false;
	}

	return getTrimmedLine(document, 0) === '{';
}

interface Range {
	start: Position;
	end: Position;
}

export function getGlobalOptionsPosition(document: TextDocument): Range | null {
	if (!hasGlobalOptions(document)) {
		return null;
	}

	// Start at line 1 and work towards the end of the file, we are trying to find the
	// first `}\n` that closes the global options block.
	for (let i = 1; i < document.lineCount; i++) {
		if (getTrimmedLine(document, i) !== '}') {
			continue;
		}

		return {
			start: { line: 0, character: 0 },
			end: { line: i, character: 0 },
		};
	}

	return null;
}

export function isInGlobalOptions(document: TextDocument, params: TextDocumentPositionParams): boolean {
	// Check if the document has a global options block.
	if (!hasGlobalOptions(document)) {
		return false;
	}

	const globalOptions = getGlobalOptionsPosition(document);
	if (globalOptions === null) {
		return false;
	}

	return params.position.line > globalOptions.start.line && params.position.line < globalOptions.end.line;
}
