// 入口函数 
$(function () {
    // 导出form
    var form = layui.form
    // 自定义验证规则
    form.verify({
        pwd :[
            /^[\S]{6,16}$/,
            '密码必须是6-16位，且不能出现空格'
        ],
        samePwd :function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd :function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }

    })

    // 修改密码
    $('.layui-form').on('submit',function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发送POST请求
        $.ajax({
            method :'POST',
            url : '/my/updatepwd',
            data : $(this).serialize(),
            success :function (res) {
                // 判断请求成功
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                // 更新密码成功后，重置form表单，用纯DOM操作
                $('.layui-form')[0].reset();
            }
        })
    })
})