const path = require('path') //引入path
const fs = require('fs')
const lessToJs = require('less-vars-to-js')
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './ant-default-vars.less'), 'utf8'))

module.exports = {
    entry: {   //入口文件
       app: ['./static/src/App.jsx'], //入口文件 格式：  name：'filepath'

    },
    optimization: {    //分割文件的选项（分割出公共代码common， 依赖包vendor）
        splitChunks: {
            cacheGroups: {
                vendor: {  //分割依赖包，譬如： react， react-dom
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',  //输出文件的name  
                    priority: 10,
                    enforce:true
                }
            }
        }
    },
    output: {
        path: path.resolve(__dirname, 'static'), //输出文件的路径（必须使用path拼接出绝对路径）
        filename: '[name].bundle.js'  //输出文件的名称的格式
    },
    module:{
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader', //babel-loader来使用preset-react对jsx语法进行转义
                    options:{                 //使用 preset-env来转义es6
                        presets: ['@babel/preset-react', '@babel/preset-env']
                    }
                }
              
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "less-loader",
                        options: {
                            modifyVars: themeVariables
                        }
                    }
                ]
            }
          
        ]
    },
    plugins: [],
    devtool: 'source-map',
    devServer: { // 使用webpack-dev-server做客户端热启动并对服务端api做代理
        port:8000, //webpack-dev-server的端口号
        contentBase: path.join(__dirname, 'static'), // server将要执行的文件路径
        proxy:{
            '/api/*': { //凡是以/api/开头的接口都会映射到代理目标接口：‘http://localhost:3000/api/xxxx’
                target: 'http://localhost:3000'
            }
        },
        historyApiFallback: true,
    }
}