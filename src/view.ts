import {ClassName, Value, View, ViewProps} from '@tweakpane/core';

import type {Thumbnail} from './controller';

interface Config {
	value: Value<Thumbnail>;
	valueOptions: Thumbnail[];
	viewProps: ViewProps;
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const className = ClassName('thumb');

// Custom view class should implement `View` interface
export class PluginView implements View {
	public readonly element: HTMLElement;
	private value_: Value<Thumbnail>;
	private valueOptions_: Thumbnail[];
	private rowEls_: HTMLElement[] = [];

	constructor(doc: Document, config: Config) {
		// Create a root element for the plugin
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		// Bind view props to the element
		config.viewProps.bindClassModifiers(this.element);

		// Receive the bound value from the controller
		this.value_ = config.value;
		this.valueOptions_ = config.valueOptions;
		this.value_.emitter.on('change', this.onValueChange_.bind(this));

		this.element.style.overflowY = 'auto';

		// Apply the initial value
		this.refresh_();

		config.viewProps.handleDispose(() => {
			// Called when the view is disposing
			console.log('TODO: dispose view');
		});
	}

	private refresh_(): void {
		const doc = this.element.ownerDocument;
		const rawValue = this.value_.rawValue;

		while (this.rowEls_.length > 0) {
			const el = this.rowEls_.pop();
			if (el) this.element.removeChild(el);
		}

		for (const thumbnail of this.valueOptions_) {
			const thumbEl = doc.createElement('div');
			thumbEl.classList.add(className('img'));
			thumbEl.style.width = '24px';
			thumbEl.style.height = '24px';
			thumbEl.style.backgroundColor = '#CCC';

			const labelEl = doc.createElement('span');
			labelEl.classList.add(className('lbl'));
			labelEl.textContent =
				rawValue.value === thumbnail.value
					? `${thumbnail.value} (SELECTED)`
					: thumbnail.value;

			const rowEl = doc.createElement('div');
			rowEl.classList.add(className('row'));
			rowEl.style.display = 'flex';
			rowEl.style.flexDirection = 'row';
			rowEl.appendChild(thumbEl);
			rowEl.appendChild(labelEl);

			this.rowEls_.push(rowEl);
			this.element.appendChild(rowEl);
		}
	}

	private onValueChange_() {
		this.refresh_();
	}
}
