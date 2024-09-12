const $check = document.querySelector('#toggle-theme')
const $body = document.querySelector('body')

window.onload = function() {
    const isWhite = JSON.parse(localStorage.getItem('isWhite'))

    if (isWhite && !$body.classList.contains('white'))
    {
        $body.classList.add('white')
    }
}

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