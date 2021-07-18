import {
	BaseInputParams,
	BindingTarget,
	CompositeConstraint,
	InputBindingPlugin,
	ParamsParsers,
	parseParams,
} from '@tweakpane/core';

import {PluginController, Thumbnail} from './controller';

interface PluginInputParams extends BaseInputParams {
	options: Thumbnail[];
	maxWidth?: number;
	maxHeight?: number;
	view: 'thumbnail-list';
}

// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
//
// `InputBindingPlugin<In, Ex, P>` means...
// - The plugin receives the bound value as `Ex`,
// - converts `Ex` into `In` and holds it
// - P is the type of the parsed parameters
//
export const TweakpaneThumbnailListPlugin: InputBindingPlugin<
	Thumbnail,
	string,
	PluginInputParams
> = {
	id: 'thumbnail-list',
	type: 'input',
	css: '__css__',

	accept(exValue: unknown, params: Record<string, unknown>) {
		if (typeof exValue !== 'string') return null;

		const p = ParamsParsers;
		// const thumbnailParser = parseParams<Thumbnail>()
		const result = parseParams<PluginInputParams>(params, {
			view: p.required.constant('thumbnail-list'),
			options: p.required.array(
				p.required.object({
					value: p.required.string,
					src: p.required.string,
				}),
			),
			maxHeight: p.optional.number,
			maxWidth: p.optional.number,
		});
		if (!result) return null;

		// Return a typed value and params to accept the user input
		return {
			initialValue: exValue,
			params: result,
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown): Thumbnail => {
				// Convert an external unknown value into the internal value
				return (
					_args.params.options.find((option) => option.value === exValue) ||
					_args.params.options[0]
				);
			};
		},

		constraint(_args) {
			// Create a value constraint from the user input
			// const constraints: Constraint<Thumbnail>[] = [];
			// You can reuse existing functions of the default plugins
			// const cr = createRangeConstraint(args.params);
			// if (cr) {
			// 	constraints.push(cr);
			// }
			// const cs = createStepConstraint(args.params);
			// if (cs) {
			// 	constraints.push(cs);
			// }
			// Use `CompositeConstraint` to combine multiple constraints
			return new CompositeConstraint([]);
		},

		writer(_args) {
			return (target: BindingTarget, inValue) => {
				// Use `target.write()` to write the primitive value to the target,
				// or `target.writeProperty()` to write a property of the target
				target.write(inValue);
			};
		},
	},

	controller(args) {
		// Create a controller for the plugin
		return new PluginController(args.document, {
			value: args.value,
			valueOptions: args.params.options,
			viewProps: args.viewProps,
		});
	},
};
