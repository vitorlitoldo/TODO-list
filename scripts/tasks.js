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
let currentPage = 1;
const tasksPerPage = 9;

window.onload = function() {
    const isWhite = JSON.parse(localStorage.getItem('isWhite'))
    if (isWhite && !$body.classList.contains('white'))
    {
        $body.classList.add('white')
    }
    
    const localArrTask = JSON.parse(localStorage.getItem('arrTask')) || []
    arrTask.push(...localArrTask)
    
    displayList()
}

class Task
{
    constructor(taskName, startDate, finalDate)
    {
        this.name = taskName
        this.startDate = startDate
        this.finalDate = finalDate
        this.isCompleted = false
        this.isOverdue = isOverdue(finalDate)
        this.isNearDeadline = false
    }
}

function isOverdue(finalDate)
{
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); 
    const taskFinalDate = new Date(finalDate);
    taskFinalDate.setDate(taskFinalDate.getDate() + 1)
    taskFinalDate.setHours(0, 0, 0, 0);
    return taskFinalDate < currentDate;
}

function doYouWantToConfirm(buttonElement, taskName)
{
    const $confirmTitle = document.querySelector('.confirm-title')

    if (buttonElement.classList.contains('correct'))
    {
        openOverlay($divConfirm)
        $confirmTitle.innerHTML = 'Do you really want to put this task as completed?'
        deleteEventListener($confirmThis)
        $confirmThis.addEventListener('click', () => completeTask(taskName))
    }
    else if (buttonElement.classList.contains('delete'))
    {
        openOverlay($divConfirm)
        $confirmTitle.innerHTML = 'Do you really want to delete this task?'
        deleteEventListener($confirmThis)
        $confirmThis.addEventListener('click', () => deleteTask(taskName))
    }
}

function displayPageNumbers(filteredArray)
{
    const totalPages = Math.ceil(filteredArray.length / tasksPerPage)
    const $numberPage = document.querySelector('.number-page')

    if (totalPages > 1)
    {
        $numberPage.innerHTML = `
        <button class="btn-previous" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span>${currentPage} of ${totalPages}</span>
        <button class="btn-next" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `
    }
    else
    {
        $numberPage.innerHTML = ''
    }

    const $btnPrevious = document.querySelector('.btn-previous')
    const $btnNext = document.querySelector('.btn-next')

    if ($btnPrevious)
    {
        $btnPrevious.addEventListener('click', () => {
            if (currentPage > 1)
            {
                currentPage--
                displayList()
            }
        })
    }

    if ($btnNext)
        {
            $btnNext.addEventListener('click', () => {
                if (currentPage < totalPages)
                {
                    currentPage++
                    displayList()
                }
            })
        }
}

function deleteEventListener(button)
{
    button.removeEventListener('click', completeTask)
    button.removeEventListener('click', deleteTask)
}

function completeTask(taskName)
{
    const taskToComplete = arrTask.find(item => item.name === taskName)

    if (taskToComplete)
    {
        taskToComplete.isCompleted = true
        localStorage.setItem('arrTask', JSON.stringify(arrTask))
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

        localStorage.setItem('arrTask', JSON.stringify(arrTask))

        displayList()
        closeOverlay($divConfirm)
    }
}

function displayList()
{
    const $filterTask = document.querySelector('#filter-list').value
    let filteredArray = arrTask

    if ($filterTask === 'not-finished')
    {
        filteredArray = arrTask.filter(item => !item.isCompleted)
    }
    else if ($filterTask === 'finished')
    {
        filteredArray = arrTask.filter(item => item.isCompleted)
    }

    filteredArray.forEach(item => item.isOverdue = isOverdue(item.finalDate))

    const startIndex = (currentPage - 1) * tasksPerPage
    const paginatedTasks = filteredArray.slice(startIndex, startIndex + tasksPerPage)

    $taskList.innerHTML = paginatedTasks.map(item => `
    <ul class="task-item ${item.isCompleted ? 'completed' : ''} ${item.isOverdue && !item.isCompleted ? 'overdue' : ''}">
        <li class="task-name">${item.name}</li>
        <li class="task-start">${ConstructDate(new Date(item.startDate))}</li>
        <li class="task-end">${ConstructDate(new Date(item.finalDate))}</li>
        <li class="task-options">
            <img src="/images/correto.png" alt="completed" class="correct">
            <img src="/images/excluir.png" alt="delete" class="delete">
        </li>
    </ul>`).join('')

    const $correctButtons = document.querySelectorAll('.correct')
    const $deleteButtons = document.querySelectorAll('.delete')

    $correctButtons.forEach(button => {
        const taskName = button.closest('.task-item').querySelector('.task-name').textContent
        button.addEventListener('click', () => doYouWantToConfirm(button, taskName))
    })

    $deleteButtons.forEach(button => {
        const taskName = button.closest('.task-item').querySelector('.task-name').textContent
        button.addEventListener('click', () => doYouWantToConfirm(button, taskName))
    })

    updateTaskProgress()
    displayPageNumbers(filteredArray)
}

function updateTaskProgress()
{
    const $taskProgress = document.querySelector('.progress-bar div')
    const totalTasks = arrTask.length
    let percentage

    if (totalTasks === 0)
    {
        percentage = 0
    }
    else 
    {
        const completedTasks = arrTask.filter(item => item.isCompleted).length
        percentage = (completedTasks / totalTasks) * 100
    }

    $taskProgress.style.width = `${percentage}%`
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
$filterList.addEventListener('change', () => {
    currentPage = 1
    displayList()
})

function ConstructDate(date)
{
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() + 1 < 10 ? `0${date.getDate() + 1}` : date.getDate() + 1
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
            const taskAlreadyExist = arrTask.some(item => item.name === task.name)

            if (taskAlreadyExist)
            {
                alert('A task with this name already exists. Please choose a different name.')
            }
            else if ($taskName.length > 41)
            {
                alert('The task name cannot be more than 41 characters.')
            }
            else 
            {
                arrTask.push(task)

                localStorage.setItem('arrTask', JSON.stringify(arrTask))

                displayList()
                closeOverlay($newTask)

                $taskNameInput.value = ''
                $startDateInput.value = ''
                $finalDateInput.value = ''
            }
        }
    }
});