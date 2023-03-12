// 編輯按鈕
window.onload = function () {
    const editBtns = document.querySelectorAll('.templatemo-blue-button');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const articleId = btn.dataset.id;
            window.location.href = '/edit_article/' + articleId;
        });
    });
};

// 隱藏文章
function hide(element) {
    element.style.display = 'none';
}

