const $check = document.querySelector('#toggle-theme')
const $body = document.querySelector('body')

$check.addEventListener('change', () => {
    $body.classList.toggle('white')

    if ($body.classList.contains('white'))
    {
        localStorage.setItem('isWhite', JSON.stringify(true))
    }
    else
    {
        localStorage.setItem('isWhite', JSON.stringify(false))
    }
})