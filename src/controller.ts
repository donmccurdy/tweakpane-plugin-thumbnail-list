import {Controller, Value, ViewProps} from '@tweakpane/core';

import {PluginView} from './view.js';

interface Config {
	value: Value<Thumbnail | null>;
	valueOptions: Thumbnail[];
	viewProps: ViewProps;
}

export interface Thumbnail {
	text: string;
	value: string;
	src: string;
	data?: unknown;
}

/** Thumbnail List Controller */
export class PluginController implements Controller<PluginView> {
	public readonly value: Value<Thumbnail | null>;
	public readonly view: PluginView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;
		this.viewProps.handleDispose(() => {
			//
		});

		this.view = new PluginView(doc, {
			value: this.value,
			valueOptions: config.valueOptions,
			viewProps: this.viewProps,
		});
	}
}
