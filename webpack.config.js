const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map',
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		})
	],
	module: {
		rules: [
			{
				test: /.css$/,
				use: [
					{ loader: "style-loader" },
					{ 
						loader: "css-loader",
						options: { sourceMap: true }
					}
				]
			}
		]
	},
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
}