const $check = document.querySelector('#toggle-theme')

$check.addEventListener('change', () => {
    document.body.classList.toggle('white')
})