$(function () {
    // 调用函数 
    initArtCateList()
    // 1、封装函数 获取文章类别列表的信息
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        })
    }

    // 2、显示添加文章分类列表
    var layer = layui.layer;
    $('#btnAdd').on('click', function () {
        // 利用框架代码，显示提交添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });

    })

    // 3、添加文章分类（事件代理）
    var indexAdd = null
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 1、提示成功
                layer.msg("恭喜您，文章分类添加成功！")
                // 2、重新获取文章分类
                initArtCateList()
                // 3、关闭弹出层
                layer.close(indexAdd)


            }
        })
    })
    var form = layui.form
    // 4、修改 - 展示菜单
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 利用框架代码，显示提交添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        // 获取到Id，发送ajax 获取数据 ，渲染到页面
        var Id = $(this).attr('data-Id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })

    })

    // 5、修改 - 提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 更新成功，要重新渲染数据
                initArtCateList();
                layer.msg(res.message)
                layer.close(indexEdit)
            }
        })
    })

    // 6、删除
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取ID
        var id = $(this).attr('data-Id')
        // 弹出询问框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 提示 关闭对话框，刷新页面
                    // layer.msg(res.message)

                    // 刷新页面
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })
})