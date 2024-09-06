const $btnAddTask = document.querySelector('.add-task')
const $closeAddTask = document.querySelector('.title img')
const $newTask = document.querySelector('.new-task')
const $overlay = document.querySelector('.overlay')
const $btnConfirm = document.querySelector('.create-task')
const $taskList = document.querySelector('.task-list')
const $divConfirm = document.querySelector('.confirm')
const $confirmThis = document.querySelector('.confirm-btn')
const $cancelThis = document.querySelector('.cancel-btn')
const $filterList = document.querySelector('#filter-list')

const arrTask = [];

class Task
{
    constructor(taskName, startDate, finalDate)
    {
        this.name = taskName
        this.startDate = startDate
        this.finalDate = finalDate
        this.isCompleted = false
        this.isOverdue = false
        this.isNearDeadline = false
    }
}

function doYouWantToConfirm(buttonElement, taskName)
{
    const $confirmTitle = document.querySelector('.confirm-title')

    if (buttonElement.classList.contains('correct'))
    {
        openOverlay($divConfirm)
        $confirmTitle.innerHTML = 'Do you really want to put this task as completed?'
        $confirmThis.removeEventListener('click', handleConfirmClick)
        $confirmThis.addEventListener('click', () => completeTask(taskName))
    }
    else if (buttonElement.classList.contains('delete'))
    {
        openOverlay($divConfirm)
        $confirmTitle.innerHTML = 'Do you really want to delete this task?'
        $confirmThis.removeEventListener('click', handleConfirmClick)
        $confirmThis.addEventListener('click', () => deleteTask(taskName))
    }
}

function completeTask(taskName)
{
    const task = arrTask.find(item => item.name === taskName)

    if (task) 
    {
        task.isCompleted = true
        displayList()
        closeOverlay($divConfirm)
    }
}

function deleteTask(taskName)
{
    const index = arrTask.findIndex(item => item.name === taskName)

    if (index !== -1)
    {
        arrTask.splice(index, 1)
        displayList()
        closeOverlay($divConfirm)
    }
}

function displayList()
{
    const $filterTask = document.querySelector('#filter-list').value

    if ($filterTask === 'all')
    {
        $taskList.innerHTML = arrTask.map(item => `<ul class="task-item">
            <li class="task-name">${item.name}</li>
            <li class="task-start">${ConstructDate(item.startDate)}</li>
            <li class="task-end">${ConstructDate(item.finalDate)}</li>
            <li class="task-options">
                <img src="/images/correto.png" alt="completed" class="correct">
                <img src="/images/excluir.png" alt="delete" class="delete">
            </li>
        </ul>`).join('')
    }
    else if ($filterTask === 'not-finished')
    {
        $taskList.innerHTML = arrTask.filter(item => !item.isCompleted).map(item => `<ul class="task-item">
            <li class="task-name">${item.name}</li>
            <li class="task-start">${ConstructDate(item.startDate)}</li>
            <li class="task-end">${ConstructDate(item.finalDate)}</li>
            <li class="task-options">
                <img src="/images/correto.png" alt="completed" class="correct">
                <img src="/images/excluir.png" alt="delete" class="delete">
            </li>
        </ul>`).join('')
    }
    else if ($filterTask === 'finished')
    {
        $taskList.innerHTML = arrTask.filter(item => item.isCompleted).map(item => `<ul class="task-item">
            <li class="task-name">${item.name}</li>
            <li class="task-start">${ConstructDate(item.startDate)}</li>
            <li class="task-end">${ConstructDate(item.finalDate)}</li>
            <li class="task-options">
                <img src="/images/correto.png" alt="completed" class="correct">
                <img src="/images/excluir.png" alt="delete" class="delete">
            </li>
        </ul>`).join('')
    }
    const $correct = document.querySelector('.correct')
    const $delete = document.querySelector('.delete')

    $correct.addEventListener('click', () => doYouWantToConfirm($correct, arrTask.name))
    $delete.addEventListener('click', () => doYouWantToConfirm($delete, arrTask.name))
}

function openOverlay(element)
{
    $overlay.style.display = 'block';
    element.style.display = 'block';
}

function closeOverlay(element)
{
    $overlay.style.display = 'none';
    element.style.display = 'none';
}

$btnAddTask.addEventListener('click', () => openOverlay($newTask))
$closeAddTask.addEventListener('click', () => closeOverlay($newTask))
$cancelThis.addEventListener('click', () => closeOverlay($divConfirm))
$filterList.addEventListener('change', () => { displayList() })

function ConstructDate(date)
{
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const year = date.getFullYear()

    return `${month}/${day}/${year}`
}

$btnConfirm.addEventListener('click', () => {
    const $taskNameInput = document.querySelector('#task-name')
    const $startDateInput = document.querySelector('#start-date')
    const $finalDateInput = document.querySelector('#final-date')

    const $taskName = $taskNameInput.value
    const $startDate = $startDateInput.value
    const $finalDate = $finalDateInput.value

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

        if (finalDate <= currentDate || startDate >= finalDate)
        {
            alert('Incorrect start or end date!')
        }
        else 
        {
            const task = new Task($taskName, startDate, finalDate)
            arrTask.push(task)

            displayList()
            closeOverlay($newTask)

            $taskNameInput.value = ''
            $startDateInput.value = ''
            $finalDateInput.value = ''
        }
    }
});