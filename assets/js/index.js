$(function () {
    // 1、调用获取用户信息的函数
    getUseInfo();
    // 2、退出功能
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 框架提供的询问框
        // 带标题和问号的
        layer.confirm('是否确定退出登录', { icon: 3, title: '提示' }, function (index) {
            // 1、删除本地存储中的token
            localStorage.removeItem('token')
            // 2、跳转到登录页面
            location.href = '/login.html'
            // 询问框自己提供的关闭询问框的功能
            layer.close(index);
        });
    })
})

// 封装获取用户信息的函数，因为在别的函数里边也要用，所以封装在入口函数外边
function getUseInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 配置请求头信息
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功，渲染用户头像信息
            renderAvatar(res.data)
        },
        // complete: function (res) {
        //     console.log(res);
        //     // 判断 如果是身份验证失败，跳转回登录页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 1、强制删除本地的token
        //         localStorage.removeItem('token')
        //         // 2、强制跳转回登录页面
        //         location.href = '/login.html'
        //     }
        // }

    })
}


// 封装用户头像渲染函数
function renderAvatar(user) {
    // 用户名（昵称优先）
    var name = user.nickname || user.username
    $('.welcome').html('欢迎  ' + name);
    // 用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avater').hide();
    } else {
        $('.layui-nav-img').hide()
        $('.text-avater').show().html(name[0].toUpperCase());

    }
}