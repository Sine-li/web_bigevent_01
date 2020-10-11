$(function () {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 1、定义查询参数
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (dtstr) {
        var dt = new Date(dtstr);
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //  补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initArtList()
    initCate()
    // 2、初始化文章列表
    function initArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // if (res.status !== 0) {
                //     return layer.msg(res.message)
                // }
                // layer.msg(res.message)
                // console.log(res.data);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 渲染分页
                renderPage(res.total);
            }
        })
    }

    // 3、初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 我们写的结构需要layui重新渲染一下，
                form.render();
            }
        })
    }

    // 4、筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        q.state = state;
        q.cate_id = cate_id;
        initArtList();
    })

    // 5、分页功能
    function renderPage(num) {
        // alert(num)

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: num, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, //默认显示第几页

            // 分页模块设置，显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],  // 每页显示多少条数据的选择器

            // 触发jump  1: 点击分页会被调用 2、调用renderPage()函数也会被调用，会导致死循环
            jump: function (obj, first) {
                // obj 所在参数所在的对象，first 是否是第一次初始化分页
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                if (!first) {
                    initArtList();
                }
            }
        });
    }

    // 6、删除
    $('tbody').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    if ($('.btn-delete').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    initArtList();

                }
            })
            layer.close(index);
        });
    })
})
