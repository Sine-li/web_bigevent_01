// 入口函数
$(function () {
    // 1、显示隐藏切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 2、自定义校验规则
    // 从layui中导出form对象
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须是6-16位,且不能输入空格"
        ],
        repwd: function (value) {
            var pwd = $('.reg-box input[name=password]').val();
            if (value !== pwd) {
                return "两次密码输入不一致"
            }
        }
    })

    // 注册功能
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        // 发送Ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    // return alert(res.message);
                    return layer.msg(res.message)
                }
                // alert(res.message)
                // alert()
                layer.msg("注册成功，请登录！");
                // 闪动切换到登录表单
                $('#link_login').click();
                // 重置form表单
                $('#form_reg')[0].reset();

            }
        })
    })
    // 登录功能
    $('#form_login').on('submit',function (e) {
        e.preventDefault();
        $.ajax({
            method :'POST',
            url : '/api/login',
            data : $(this).serialize(),
            success :function (res) {
                if (res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您,登录成功')
                // 保存token到本地
                localStorage.setItem('token',res.token)
                // 跳转
                location.href = '/index.html'
            }
        })
    })

})