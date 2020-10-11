$(function () {
    // 自定义校验规则
    var form = layui.form
    form.verify({
        // 校验用户昵称
        nickname : function (value) {
            if (value.length > 6 ) {
                return "昵称长度为1-6位字符"
            }
        }
    })

    // 初始化用户信息
    initUserInfo();
    // 初始化用户信息封装，后边还要用
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            // GET 请求 method 可以省略
            // method : 'GET',
            url : '/my/userinfo',
            success :function (res) {
                if (res.status !== 0){
                    return layer.msg(res.message)
                }
                // console.log(res);
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 重置表单
    $('#btnReset').on('click',function (e) {
        e.preventDefault();
        initUserInfo();
    })
    $('.layui-form').on('submit',function (e) {
        // 阻止表单的默认提交
        e.preventDefault();
        $.ajax({
            method :'POST',
            url :'/my/userinfo',
            data : $(this).serialize(),
            success : function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 调用全局的获取用户信息的函数
                window.parent.getUseInfo();
                window.parent.getUseInfo();
            }
        })
    })
})