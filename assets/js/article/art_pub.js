$(function () {
    var form = layui.form
    var layer = layui.layer
    // 调用函数 
    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 1、封装函数 获取文章类别列表的信息

    //  1.1 渲染筛选的下拉列表
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4、点击按钮，选择文件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 5、监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 6、设置状态
    var state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 7、添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建一个FormData对象
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state);

        // 放入图片
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // console.log(...fd);
                publishArticle(fd)
            })
    })
    // 发起 ajax 数据请求
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('发布成功，正在跳转')
                // location.href = '/article/art_list.html'
                // 优化跳转
                setTimeout(function () {
                    
                    window.parent.document.querySelector('#art_list').click()
                },1000)
            }
        })
    }

})