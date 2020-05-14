import './style.css';
import './hamburgers.css';
import { format } from 'date-fns'

let contentContainer = document.getElementById('content');

import TodoItem from './todoItem'
import TodoProject from './todoProject'

import { generateBody, generateTaskTemplate, generateFullTaskTemplate } from './body'
import { generateHeader } from './header'
import { generateSidebar } from './sidebar'
import { generateModal } from './newItemModal'
import { truncate } from './truncate'

let dropdown_arrows = document.getElementsByClassName('expand-dropdown');

let angle = 0;
let projects = [TodoProject('Default Project')];
for(let i=0; i<25; i++){
    projects.push(TodoProject('Default Project'))
}
let current_project = projects[0]
current_project.addTodoItem(TodoItem(0, 'Hello', new Date(), 'asap', 2))
let header = generateHeader(current_project);
let sidenav = generateSidebar(projects);

contentContainer.appendChild(generateModal())
contentContainer.appendChild(header);
contentContainer.appendChild(sidenav);
contentContainer.appendChild(generateBody(projects[0]))


function plusClick(){
    if(angle % 45 == 0){
        document.getElementById('modal-form').reset()
        document.querySelector('.priority-option#priority-1').classList.remove('darken')
        document.querySelector('.priority-option#priority-2').classList.add('darken')
        document.querySelector('.priority-option#priority-3').classList.add('darken')
        document.getElementsByTagName('select')[0].selectedIndex = '0'
    }
    angle += 45
    document.getElementById('plus-div').style.transform = `rotate(${angle}deg)`
    document.getElementById('edit').classList.add('hidden')
    document.getElementById('modal-header-edit').classList.add('hidden')
    document.getElementById('submit').classList.remove('hidden')
    document.getElementById('modal-header-new').classList.remove('hidden')
    document.getElementById('modal').classList.toggle('hidden')
}

document.getElementById('plus-div').addEventListener('click', () => {
    plusClick()
})

for (const arrow of dropdown_arrows) {
    arrow.addEventListener('click', () => {
        arrow.parentNode.classList.toggle('not-expanded')
        arrow.style.cssText == 'transform: rotate(90deg);' ? arrow.style.transform = 'rotate(0deg)' : arrow.style.transform = 'rotate(90deg)'
    })
}

document.getElementById('description').addEventListener('focus', ()=>{
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
})

document.body.addEventListener('click', (e) => {
    //expanded/close sidebar, toggle hamburger animation
    if (e.target.id == 'hamburger-icon' || e.target.classList.contains('bar')) {
        document.getElementById('sidenav').classList.toggle('hidden')
        let bars = document.getElementsByClassName('bar');
        for (const bar of bars) {
            bar.classList.toggle('change')
        }

        // minimize expanded dropdowns once sidebar is closed
        if (sidenav.classList.contains('hidden')) {
            for (const project of document.getElementsByClassName('sidenav-project')) {
                if (!project.classList.contains('not-expanded')) {
                    project.classList.add('not-expanded')
                    project.childNodes[1].style.transform = 'rotate(0deg)'
                }
            }
        }
    }
    //expand and collapse todo items on click
    if (e.target.classList.contains('todo-main') || e.target.classList.contains('todo-title') || e.target.classList.contains('todo-date') || e.target.classList.contains('todo-secondary')) {
        e.target.closest('.todo-item').classList.toggle('collapsed')
    }
    if (e.target.classList.contains('todo-item')) {
        e.target.classList.toggle('collapsed')
    }

    //mark task as completed
    if(e.target.classList.contains('todo-completed')){
        e.target.parentNode.parentNode.parentNode.classList.toggle('completed')
        current_project.getTodoItems()[e.target.parentNode.parentNode.parentNode.id].completed = !current_project.getTodoItems()[e.target.parentNode.parentNode.parentNode.id].completed
    }

    //edit task functionality
    if(e.target.classList.contains('edit-button')){
        let task_to_edit = current_project.getTodoItems()[e.target.classList[1]]
        angle += 45
        document.getElementById('plus-div').style.transform = `rotate(${angle}deg)`

        document.getElementById('edit').classList.remove('hidden')
        document.getElementById('submit').classList.add('hidden')
        document.getElementById('modal-header-edit').classList.remove('hidden')
        document.getElementById('modal-header-new').classList.add('hidden')
        let modalform = document.getElementById('modal-form')
        modalform.querySelector('.title').value = task_to_edit.title
        modalform.querySelector('#description').value = task_to_edit.description
        modalform.querySelector('.duedate').value = format(task_to_edit.due_date, 'yyyy-MM-dd')
        modalform.querySelector(`#priority-${task_to_edit.priority}`).click()
        document.getElementById('modal').classList.toggle('hidden')

        document.getElementById('edit').onclick = function(){
            task_to_edit.title = modalform.querySelector('.title').value
            task_to_edit.description = modalform.querySelector('#description').value
            let splittedDate = modalform.querySelector('.duedate').value.split('-')
            let date = new Date()
            date.setFullYear(splittedDate[0])
            date.setMonth(splittedDate[1]-1)
            date.setDate(splittedDate[2])
            task_to_edit.due_date = date
            task_to_edit.priority = Number(modalform.querySelector('.hidden-priority').value)
            console.log(task_to_edit)
            let updatedTask = generateTaskTemplate(task_to_edit)
            let todoItem = document.getElementById(task_to_edit.id)
            todoItem.textContent = ''
            todoItem.appendChild(updatedTask[0])
            todoItem.appendChild(updatedTask[1])

            plusClick()
        };
        
        
        
    }
    
});

//Modal priority buttons functionality
for (const priority of document.getElementsByClassName('priority-option')) {
    priority.addEventListener('click', (e) => {
        if (e.target.id == 'priority-1') {
            e.target.classList.remove('darken')
            e.target.parentNode.childNodes[5].classList.add('darken')
            e.target.parentNode.childNodes[7].classList.add('darken')
            e.target.parentNode.parentNode.getElementsByTagName('select')[0].selectedIndex = '0'
        }
        if (e.target.id == 'priority-2') {
            e.target.parentNode.childNodes[3].classList.remove('darken')
            e.target.classList.remove('darken')
            e.target.parentNode.childNodes[7].classList.add('darken')
            e.target.parentNode.parentNode.getElementsByTagName('select')[0].selectedIndex = '1'
        }
        if (e.target.id == 'priority-3') {
            e.target.parentNode.childNodes[3].classList.remove('darken')
            e.target.parentNode.childNodes[5].classList.remove('darken')
            e.target.classList.remove('darken')
            e.target.parentNode.parentNode.getElementsByTagName('select')[0].selectedIndex = '2'
        }
    })
}

// Modal Form event listener
document.getElementById('modal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let splittedDate = e.target[2].value.split('-')
    let date = new Date()
    date.setFullYear(splittedDate[0])
    date.setMonth(splittedDate[1]-1)
    date.setDate(splittedDate[2])
    let newItem = TodoItem(current_project.getCounter(), e.target[0].value, date, e.target[1].value, e.target[3].value)
    current_project.addTodoItem(newItem)

    //update sidebar with new item
    let item = document.createElement('li')
    item.className = 'sidenav-todo';
    item.innerHTML = truncate(newItem.title, 20, 17)
    document.getElementById(`project-${projects.indexOf(current_project)}`).appendChild(item)

    document.getElementById('todo-list').appendChild(generateFullTaskTemplate(newItem, generateTaskTemplate(newItem)))
    e.target.reset()

    //reset priority buttons default selection
    document.querySelector('.priority-option#priority-1').classList.remove('darken')
    document.querySelector('.priority-option#priority-2').classList.add('darken')
    document.querySelector('.priority-option#priority-3').classList.add('darken')
    document.getElementsByTagName('select')[0].selectedIndex = '0'

    angle += 45
    document.getElementById('plus-div').style.transform = `rotate(${angle}deg)`
    document.getElementById('modal').classList.toggle('hidden')
});