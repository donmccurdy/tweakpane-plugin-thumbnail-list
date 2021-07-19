import Alias from '@rollup/plugin-alias';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import Replace from '@rollup/plugin-replace';
import Typescript from '@rollup/plugin-typescript';
import Autoprefixer from 'autoprefixer';
import NodeSass from 'node-sass';
import Postcss from 'postcss';
import Cleanup from 'rollup-plugin-cleanup';
import {terser as Terser} from 'rollup-plugin-terser';

import Package from './package.json';

async function compileCss() {
	const css = NodeSass.renderSync({
		file: 'src/sass/plugin.scss',
		outputStyle: 'compressed',
	}).css.toString();

	const result = await Postcss([Autoprefixer]).process(css, {
		from: undefined,
	});
	return result.css.replace(/'/g, "\\'").trim();
}

function getPlugins(css, shouldMinify) {
	const plugins = [
		// Use ES6 source files to avoid CommonJS transpiling
		Alias({
			entries: [
				{
					find: '@tweakpane/core',
					replacement: './node_modules/@tweakpane/core/dist/es6/index.js',
				},
			],
		}),
		Typescript({
			tsconfig: 'src/tsconfig.json',
		}),
		nodeResolve(),
		Replace({
			__css__: css,
			__checker_img_src__:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA4klEQVR4Xu2awQ3EQAjEbjun9Ohq8ANZOP8JZDBstOL94DMzQ16xrX8k+b92+wNo/AyIAOgARXBbXwtAABqC2wjT+LVALQAdoAhu62sBCECnwDbCNH4tcL4FKEJ2/bN/AM0/A6iDdn0E2CtI848A6qBdHwH2CtL8I4A6aNdHgL2CNP8IoA7a9d0Inb8RygDoQDOgHaGWpNoSI2Nke4b0H0Cq155gi5JtirYfsD3FafxOgfOnAEXIru9KzF5Bmn8EUAft+giwV5DmHwHUQbs+AuwVpPlHAHXQro8AewVp/ucJ+AAX4sBQqPDC3AAAAABJRU5ErkJggg==',
			preventAssignment: false,
		}),
	];
	if (shouldMinify) {
		plugins.push(Terser());
	}
	return [
		...plugins,
		// https://github.com/microsoft/tslib/issues/47
		Cleanup({
			comments: 'none',
		}),
	];
}

function getDistName(packageName) {
	// `@tweakpane/plugin-foobar` -> `tweakpane-plugin-foobar`
	// `tweakpane-plugin-foobar`  -> `tweakpane-plugin-foobar`
	return packageName
		.split(/[@/-]/)
		.reduce((comps, comp) => (comp !== '' ? [...comps, comp] : comps), [])
		.join('-');
}

function getUmdName(packageName) {
	// `@tweakpane/plugin-foobar` -> `TweakpaneFoobarPlugin`
	// `tweakpane-plugin-foobar`  -> `TweakpaneFoobarPlugin`
	return (
		packageName
			.split(/[@/-]/)
			.map((comp) =>
				comp !== 'plugin' ? comp.charAt(0).toUpperCase() + comp.slice(1) : '',
			)
			.join('') + 'Plugin'
	);
}

export default async () => {
	const production = process.env.BUILD === 'production';
	const postfix = production ? '.min' : '';

	const distName = getDistName(Package.name);
	const css = await compileCss();
	return {
		input: 'src/index.ts',
		external: ['tweakpane'],
		output: {
			file: `dist/${distName}${postfix}.js`,
			format: 'umd',
			globals: {
				tweakpane: 'Tweakpane',
			},
			name: getUmdName(Package.name),
		},
		plugins: getPlugins(css, production),

		// Suppress `Circular dependency` warning
		onwarn(warning, rollupWarn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') {
				return;
			}
			rollupWarn(warning);
		},
	};
};
