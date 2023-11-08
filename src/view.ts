import {ClassName, Value, View, ViewProps} from '@tweakpane/core';

import {Thumbnail} from './controller.js';

const CHECKER_IMG_SRC = '__checker_img_src__';

interface Config {
	value: Value<Thumbnail | null>;
	valueOptions: Thumbnail[];
	viewProps: ViewProps;
}

const className = ClassName('thumb');

// Custom view class should implement `View` interface
export class PluginView implements View {
	public readonly element: HTMLElement;
	private doc_: Document;
	private value_: Value<Thumbnail | null>;
	private valueOptions_: Thumbnail[];
	private overlayEl_: HTMLElement;
	private selectEl_: HTMLElement;
	private selectThumbEl_: HTMLElement;
	private selectLabelEl_: HTMLElement;
	private optionEls_: HTMLElement[] = [];

	constructor(doc: Document, config: Config) {
		this.onSelect_ = this.onSelect_.bind(this);
		this.open_ = this.open_.bind(this);
		this.close_ = this.close_.bind(this);

		// DOM.

		this.doc_ = doc;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		this.selectEl_ = document.createElement('div');
		this.selectEl_.classList.add(className('sopt'));
		this.element.appendChild(this.selectEl_);

		this.selectThumbEl_ = document.createElement('div');
		this.selectThumbEl_.classList.add(className('sthmb'));
		this.selectEl_.appendChild(this.selectThumbEl_);

		this.selectLabelEl_ = document.createElement('span');
		this.selectLabelEl_.classList.add(className('slbl'));
		this.selectEl_.appendChild(this.selectLabelEl_);

		this.overlayEl_ = doc.createElement('div');
		this.overlayEl_.classList.add(className('ovl'));
		this.element.appendChild(this.overlayEl_);

		// Events.

		this.selectEl_.addEventListener('click', this.open_);

		config.viewProps.bindClassModifiers(this.element);

		this.value_ = config.value;
		this.value_.emitter.on('change', this.onValueChange_.bind(this));
		this.valueOptions_ = config.valueOptions;

		this.init_();
		this.refresh_();

		config.viewProps.handleDispose(() => {
			this.selectEl_.removeEventListener('click', this.open_);
			this.doc_.removeEventListener('click', this.close_);

			let rowEl;
			while ((rowEl = this.optionEls_.pop())) {
				rowEl.removeEventListener('click', this.onSelect_);
				this.overlayEl_.removeChild(rowEl);
			}
		});
	}

	private init_(): void {
		const doc = this.element.ownerDocument;

		const createOptionEl = (thumbnail: Thumbnail | null) => {
			const thumbEl = doc.createElement('div');
			thumbEl.classList.add(className('thmb'));
			thumbEl.style.backgroundImage = thumbnail
				? `url(${thumbnail.src})`
				: `url(${CHECKER_IMG_SRC})`;

			const labelEl = doc.createElement('span');
			labelEl.classList.add(className('lbl'));
			labelEl.textContent = thumbnail ? thumbnail.text : 'None';

			const optionEl = doc.createElement('div');
			optionEl.classList.add(className('opt'));
			optionEl.appendChild(thumbEl);
			optionEl.appendChild(labelEl);
			optionEl.setAttribute('data-value', thumbnail ? thumbnail.value : '');
			optionEl.addEventListener('click', this.onSelect_);

			this.optionEls_.push(optionEl);
			this.overlayEl_.appendChild(optionEl);
		};

		createOptionEl(null);
		for (const thumbnail of this.valueOptions_) {
			createOptionEl(thumbnail);
		}
	}

	/** Updates UI state after a value change. */
	private refresh_(): void {
		const active = this.value_.rawValue;

		if (active) {
			this.selectThumbEl_.style.backgroundImage = `url(${active.src})`;
			this.selectLabelEl_.textContent = active.text;
		} else {
			this.selectThumbEl_.style.backgroundImage = `url(${CHECKER_IMG_SRC})`;
			this.selectLabelEl_.textContent = '';
		}

		const activeValue = active ? active.value : '';
		for (const optionEl of this.optionEls_) {
			if (optionEl.getAttribute('data-value') === activeValue) {
				optionEl.setAttribute('aria-selected', 'true');
			} else {
				optionEl.removeAttribute('aria-selected');
			}
		}
	}

	/** Opens the overlay. */
	private open_(event: MouseEvent) {
		this.element.classList.add(className('-active'));
		this.doc_.addEventListener('click', this.close_);
		event.stopPropagation();
	}

	/** Closes the overlay. */
	private close_() {
		this.element.classList.remove(className('-active'));
		this.doc_.removeEventListener('click', this.close_);
	}

	/** Selects the thumbnail element clicked. */
	private onSelect_(event: MouseEvent) {
		const optionEl = this.findOptionEl_(event.target as HTMLElement);
		const value = optionEl.getAttribute('data-value');
		const thumbnail = this.valueOptions_.find(
			(option) => option.value === value,
		);
		this.value_.setRawValue(thumbnail || null);
	}

	/** Given a click event somewhere in an option, finds the nearest option element. */
	private findOptionEl_(el: HTMLElement | null): HTMLElement {
		while (el && !el.hasAttribute('data-value')) {
			el = el.parentElement;
		}
		if (!el) throw new Error('Invalid DOM scope');
		return el;
	}

	/** Change handler. */
	private onValueChange_() {
		this.refresh_();
	}
}
