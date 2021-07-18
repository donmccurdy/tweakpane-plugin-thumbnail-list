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
		this.onSelect_ = this.onSelect_.bind(this);

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

		this.init_();
		this.refresh_();

		config.viewProps.handleDispose(() => {
			let rowEl;
			while ((rowEl = this.rowEls_.pop())) {
				rowEl.removeEventListener('click', this.onSelect_);
				this.element.removeChild(rowEl);
			}
		});
	}

	private init_(): void {
		const doc = this.element.ownerDocument;
		for (const thumbnail of this.valueOptions_) {
			const thumbEl = doc.createElement('div');
			thumbEl.classList.add(className('img'));
			thumbEl.style.backgroundImage = `url(${thumbnail.src})`;

			const labelEl = doc.createElement('span');
			labelEl.classList.add(className('lbl'));
			labelEl.textContent = thumbnail.value;

			const rowEl = doc.createElement('div');
			rowEl.classList.add(className('row'));
			rowEl.appendChild(thumbEl);
			rowEl.appendChild(labelEl);
			rowEl.setAttribute('data-value', thumbnail.value);
			rowEl.addEventListener('click', this.onSelect_);

			this.rowEls_.push(rowEl);
			this.element.appendChild(rowEl);
		}
	}

	private refresh_(): void {
		const value = this.value_.rawValue.value;
		for (const rowEl of this.rowEls_) {
			if (rowEl.getAttribute('data-value') === value) {
				rowEl.setAttribute('data-selected', '');
			} else {
				rowEl.removeAttribute('data-selected');
			}
		}
	}

	private onSelect_(event: MouseEvent) {
		const rowEl = this.findRow_(event.target as HTMLElement);
		const value = rowEl.getAttribute('data-value');
		const thumbnail = this.valueOptions_.find(
			(option) => option.value === value,
		);
		if (!thumbnail) return;
		this.value_.setRawValue(thumbnail);
	}

	private findRow_(el: HTMLElement | null): HTMLElement {
		while (el && !el.hasAttribute('data-value')) {
			el = el.parentElement;
		}
		if (!el) throw new Error('Invalid DOM scope');
		return el;
	}

	private onValueChange_() {
		this.refresh_();
	}
}
