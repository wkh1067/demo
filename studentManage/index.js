//appkey: 'h1067_1585574683417'  '_huangge_1588576755495'
const appkey = '_huangge_1588576755495';
let menuList = document.getElementsByClassName('menu')[0];
const studentAddSubmitBtn = document.getElementById('student-add-submit');
const add = document.getElementById('student-add-form');
const edit = document.getElementById('student-edit-form');
let studentList = menuList.getElementsByTagName('dd')[0];
const tBody = document.getElementById('tbody');
let close = document.getElementsByClassName('close')[0];
let modal = document.getElementsByClassName('modal')[0];
const studentEditBtn = document.getElementById('student-edit-submit');
let turnPage = document.getElementsByClassName('turn-page')[0];
const nextPage = document.getElementById('next-btn');
const prevPage = document.getElementById('prev-btn');
let tableData;
var nowPage = 1,
    pageSize = 15,
    allPage;
(function init() { //初始化
    getTableData();
    bindEvent();
})();

function bindEvent() { // 绑定事件
    menuList.onclick = e => {
        if (e.target.tagName == 'DD') {
            changeDisplay(e.target);
            let content = e.target.getAttribute('data-id');
            const showContent = document.getElementById(content);
            changeDisplay(showContent);
        }
    }
    studentAddSubmitBtn.onclick = e => {
        e.preventDefault();
        let data = getFormData(add);
        if (data) {
            transferData('/api/student/addStudent', data, function() {
                add.reset();
                getTableData();
                studentList.click();
                console.log('a');

                alert('新增学生成功');
            })
        }
    }
    close.onclick = () => {
        modal.classList.remove('active');
    }
    tBody.onclick = e => {
        if (e.target.classList.contains('edit')) {
            modal.classList.add('active');
            let index = e.target.dataset.index;
            renderForm(tableData[index]);
        } else if (e.target.classList.contains('del')) {
            let isDel = confirm('确认删除?');
            if (isDel) {
                let index = e.target.dataset.index;
                transferData('/api/student/delBySno', {
                    sNo: tableData[index].sNo,
                }, function() {
                    alert('已删除成功');
                    getTableData();
                })
            }
        }
    }
    modal.onclick = function(e) {
        if (e.target == this) {
            this.classList.remove('active');
        }
    }
    studentEditBtn.onclick = e => {
        let data = getFormData(edit);
        if (data) {
            transferData('/api/student/updateStudent', data, function() {
                add.reset();
                close.onclick();
                alert('修改学生成功');
                getTableData();
            })
        }
        e.preventDefault();
    }
    nextPage.onclick = () => {
        if (allPage > nowPage) {
            nowPage++;
            getTableData();
        }
    }
    prevPage.onclick = () => {
        if (nowPage > 1) {
            nowPage--;
            getTableData();
        }
    }
}

function getSiblings(node) { // 获取兄弟节点
    const paren = node.parentNode;
    const children = paren.children;
    let result = [];
    for (let i = 0; i < children.length; i++) {
        if (children[i] == node) {
            continue;
        }
        result.push(children[i]);
    }
    return result;
}

function changeDisplay(node) { // 显示切换
    const siblingsMenu = getSiblings(node);
    for (let i = 0; i < siblingsMenu.length; i++) {
        siblingsMenu[i].classList.remove('active');
    }
    node.classList.add('active');
}

function saveData(url, param) { // 向后端存储数据
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object') {
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}

function getFormData(form) { // 获取表单数据
    let name = form.name.value;
    let sex = form.sex.value;
    let sNo = form.sNo.value;
    let birth = form.birth.value;
    let email = form.email.value;
    let phone = form.phone.value;
    let address = form.address.value;
    if (name && sNo && phone && birth && address && email) {
        if (!/^\d{4,16}$/.test(sNo)) {
            alert('学号应该为4-16位的数字');
            return false;
        }
        if (!/^(19|20)\d{2}$/.test(birth)) {
            alert('出生年份应该在1900-2099年');
            return false;
        }
        if (!/^\d{11}$/.test(phone)) {
            alert('手机号应为11位数字');
            return false;
        }
        if (!/^\w+@\w+\.com$/.test(email)) {
            alert('邮箱格式不正确');
            return false;
        }
        return {
            sNo: sNo,
            name: name,
            email: email,
            sex: sex,
            birth: birth,
            address: address,
            phone: phone
        }
    }
    alert('信息填写不完全');
    return false;
}

function transferData(url, data, success) { //数据交互
    data.appkey = appkey;
    let result = saveData('http://open.duyiedu.com' + url, data);
    if (result.status == 'success') {
        success(result.data);
    } else {
        alert(result.msg)
    }
}

function getTableData() { // 获取学生列表数据
    transferData('/api/student/findByPage', {
        page: nowPage,
        size: pageSize
    }, function(data) {
        allPage = Math.ceil(data.cont / pageSize);
        renderTable(data.findByPage);
        tableData = data.findByPage;
    })
}

function renderTable(data) { // 渲染表格数据
    let str = '';
    data.forEach((item, index) => {
        str +=
            `<tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>  
        <td>${item.sex == 0 ? '男' : '女'}</td>  
        <td>${item.email}</td>  
        <td>${(new Date().getFullYear() - item.birth)}</td>  
        <td>${item.phone}</td>  
        <td>${item.address}</td>
        <td>
            <button class="edit btn" data-index=${index}>编辑</button>
            <button class="del btn" data-index=${index}>删除</button>
        </td>
        </tr>`
    });
    tBody.innerHTML = str;
    if (allPage > nowPage) {
        nextPage.style.display = 'inline-block';
    } else {
        nextPage.style.display = 'none';
    }
    if (nowPage > 1) {
        prevPage.style.display = 'inline-block';
    } else {
        prevPage.style.display = 'none';
    }

}

function renderForm(data) { // 表单回填
    for (const prop in data) {
        if (edit[prop]) {
            edit[prop].value = data[prop];
        }
    }
}