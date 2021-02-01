const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	plugins: [
        new CleanWebpackPlugin(),
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
	}
}