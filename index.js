var postcss = require('postcss');

function getSelLength(node) {
	if (node.type === 'rule') {
		return node.selectors.length;
	}
	if (node.type === 'atrule') {
		return 1 + node.nodes.reduce(function(memo, n) {
			return memo + getSelLength(n);
		}, 0);
	}
	return 0; // comment
}

module.exports = postcss.plugin('postcss-chunk', function (opts) {
	opts = opts || {};
	var size = opts.size || 4000;

	return function(css, result) {
		var plugins = result.processor.plugins;
		var chunks = [];
		var count, chunk;

		function nextChunk() {
			count = 0;
			chunk = postcss.root();
			chunks.push(chunk);
		}

		if (plugins[plugins.length - 1].postcssPlugin !== 'postcss-chunk') {
			throw new Error('postcss-chunk must be the last processor plugin');
		}

		css.nodes.forEach(function(n) {
			var selCount = getSelLength(n);
			if (!chunk || count + selCount > size) {
				nextChunk();
			}
			chunk.nodes.push(n);
			count += selCount;
		});

		result.chunks = chunks.map(function(c) {
			return c.toResult();
		});
	};
});
	
