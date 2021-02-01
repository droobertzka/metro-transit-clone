const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map',
	devServer: {
		host: 'localhost',
		hot: true,
		proxy: {
			'/nextripv2': {
				target: 'https://svc.metrotransit.org',
				secure: false,
				changeOrigin: true
			}
		}
	}
})
