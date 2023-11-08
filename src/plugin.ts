import {
	BaseInputParams,
	BindingTarget,
	CompositeConstraint,
	createPlugin,
	InputBindingPlugin,
	parseRecord,
} from '@tweakpane/core';

import {PluginController, Thumbnail} from './controller.js';

interface PluginInputParams extends BaseInputParams {
	view: 'thumbnail-list';
	options: Thumbnail[];
}

/**
 * Thumbnail List Plugin
 *
 * `InputBindingPlugin<In, Ex, P>` means...
 * - The plugin receives the bound value as `Ex`,
 * - converts `Ex` into `In` and holds it
 * - P is the type of the parsed parameters
 */
export const TweakpaneThumbnailListPlugin: InputBindingPlugin<
	Thumbnail | null,
	string,
	PluginInputParams
> = createPlugin({
	id: 'thumbnail-list',
	type: 'input',

	accept(exValue: unknown, params: Record<string, unknown>) {
		if (typeof exValue !== 'string') return null;

		const result = parseRecord<PluginInputParams>(params, (p) => ({
			view: p.required.constant('thumbnail-list'),
			options: p.required.array(
				p.required.object({
					text: p.required.string,
					value: p.required.string,
					src: p.required.string,
					data: p.optional.custom((d) => d),
				}),
			),
		}));

		if (!result) return null;

		return {
			initialValue: exValue,
			params: result,
		};
	},

	binding: {
		/** Converts an external unknown value into the internal value. */
		reader(_args) {
			return (exValue: unknown): Thumbnail | null => {
				return (
					_args.params.options.find((option) => option.value === exValue) ||
					null
				);
			};
		},

		/** Creates a value constraint from the user input. */
		constraint(_args) {
			return new CompositeConstraint([]);
		},

		/**
		 * Use `target.write()` to write the primitive value to the target,
		 * or `target.writeProperty()` to write a property of the target.
		 */
		writer(_args) {
			return (target: BindingTarget, inValue) => {
				target.write(inValue);
			};
		},
	},

	controller(args) {
		return new PluginController(args.document, {
			value: args.value,
			valueOptions: args.params.options,
			viewProps: args.viewProps,
		});
	},
});
