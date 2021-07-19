// To regenerate __checker_img_src__...

console.time('genCanvas');
const CHECKER_IMG_SRC = (() => {
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = 64;

	const ctx = canvas.getContext('2d');
	const blocks = 4;
	const w = canvas.width / blocks;
	const h = canvas.height / blocks;

	ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
	for (let i = 0; i < blocks; ++i) {
		for (let j = 0, col = blocks / 2; j < col; ++j) {
			ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
		}
	}
	ctx.fill();

	return canvas.toDataURL();
})();
console.timeEnd('genCanvas');
