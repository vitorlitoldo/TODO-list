const $btnAddTask = document.querySelector('.add-task')
const $closeAddTask = document.querySelector('.title img')
const $newTask = document.querySelector('.new-task')
const $overlay = document.querySelector('.overlay')
const $btnConfirm = document.querySelector('.create-task')
const $taskList = document.querySelector('.task-list')

$btnAddTask.addEventListener('click', () => {
    $overlay.style.display = 'block';
    $newTask.style.display = 'block';
})

$closeAddTask.addEventListener('click', () => {
    $overlay.style.display = 'none';
    $newTask.style.display = 'none';
})

function ConstructDate(date)
{
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const year = date.getFullYear()

    return `${month}/${day}/${year}`
}

$btnConfirm.addEventListener('click', () => {
    const $taskName = document.querySelector('#task-name').value
    const $startDate = document.querySelector('#start-date').value
    const $finalDate = document.querySelector('#final-date').value

    if (!$taskName || !$startDate || !$finalDate)
    {
        alert('Fill in the information correctly!')
    }
    else 
    {
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0);
        const startDate = new Date($startDate)
        const finalDate = new Date($finalDate)

        if (finalDate <= currentDate || startDate > currentDate)
        {
            alert('Incorrect start or end date!')
        }
        else 
        {
            $overlay.style.display = 'none';
            $newTask.style.display = 'none';

            return $taskList.innerHTML += `<ul class="task-item">
                <li class="task-name">${$taskName}</li>
                <li class="task-start">${ConstructDate(startDate)}</li>
                <li class="task-end">${ConstructDate(finalDate)}</li>
                <li class="task-options">
                    <img src="/images/correto.png" alt="completed">
                    <img src="/images/excluir.png" alt="delete">
                </li>
            </ul>`
        }
    }
});