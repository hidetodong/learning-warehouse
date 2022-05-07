const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ESLintWebpackPlugin  = require('eslint-webpack-plugin')

module.exports = (env,argv) => {
    return (
        {
            mode: 'development', // 如果在此设置了mode，就会设置process.env.NODE_ENV
            entry: "./src/index.js",
            output: {
                path: path.resolve('dist'),
                filename: 'main.js'
            },
            resolve:{
                alias:{
                    '@':path.resolve('src')
                }
            },
            devServer:{
                static:path.resolve(__dirname,'public'),
                port:8080,
                open:true,
                onBeforeSetupMiddleware({ app }){
                    app.get('/api/users',(req,res)=>{
                        res.json({
                            success:true,
                            data:[
                                {
                                    id:'1'
                                }
                            ]
                        })
                    })
                }
                // proxy:{
                //     "/api":{
                //         target:"http://localhost:3000",
                //         pathRewrite:{
                //             "^/api":""
                //         }
                //     }
                // }
            },
            module: {
                rules: [
                    {
                        test:/\.js$/,
                        use:[
                            {
                                loader:'babel-loader',
                                options:{
                                    presets:["@babel/preset-env","@babel/preset-react"],
                                    plugins:[
                                        [
                                            "@babel/plugin-proposal-decorators",
                                            { legacy:true }
                                        ],
                                        [
                                            "@babel/plugin-proposal-class-properties",
                                            { loose:true }
                                        ]
                                    ]
                                },
                            }
                        ]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            'style-loader',
                            {
                                loader:'css-loader',
                                options:{
                                    url:true,
                                    import:true,
                                    modules:true
                                }
                            },
                            path.resolve(__dirname,'loaders/logger1.js')
                        ]
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            'style-loader',
                            'css-loader',
                            'sass-loader'
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            'style-loader',
                            'css-loader',
                            'less-loader'
                        ]
                    },
                    {
                        test:/\.png$/,
                        type:'asset/resource',// webpack新功能 取代file-loader
                    },
                    {
                        test:/\.ico$/,
                        type:'asset/inline',// webpack5新功能 取代url-loader 把文件内容变成base64
                    },
                    {
                        test:/\.txt$/,
                        type:'asset/source',//  webpack5新功能 取代raw-loader 读取文件原始内容
                    },
                    {
                        test:/\.jpg$/,
                        type:'asset',
                        parser:{ // 文件大于4K 生成一个新文件 并返回文件路径 小于4K的返回base64
                            dataUrlCondition:{
                                maxSize:4 * 1024
                            }
                        }
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: './src/index.html',
                    filename: 'index.html'
                }),
                new webpack.DefinePlugin({
                    // 重复设置
                    'process.env.NODE_ENV2':JSON.stringify(process.env.NODE_ENV)
                }),
                new ESLintWebpackPlugin({ fix:true })
            ]
        }
    )
}