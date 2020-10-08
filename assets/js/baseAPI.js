// 开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'

// 拦截所有ajax请求
// 处理参数
$.ajaxPrefilter(function (options) {

    // 拼接对应环境的服务器地址
    options.url = baseURL + options.url
    // alert(options)

    // 对需要权限的接口配置头信息
    // 必须以/my/开头才行
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete = function (res) {
        console.log(res);
        // 判断 如果是身份验证失败，跳转回登录页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1、强制删除本地的token
            localStorage.removeItem('token')
            // 2、强制跳转回登录页面
            location.href = '/login.html'
        }
    }
})