import {truncate} from './truncate'
export function generateSidebar(projects){
    const sidenav = document.createElement('div');
    sidenav.id = 'sidenav'
    sidenav.className ='hidden'
    
    let newProject = document.createElement('button')
    newProject.id = 'new-project'
    newProject.innerHTML = '<span>+</span> NEW PROJECT'
    sidenav.appendChild(newProject)
    for(const project of projects){
        let sidebarItem = document.createElement('ul');
        sidebarItem.id=`project-${projects.indexOf(project)}`
        sidebarItem.innerHTML=`${project.getName().toUpperCase()} <span class="expand-dropdown">▶</span>`
        sidebarItem.className='sidenav-project'
        sidebarItem.classList.add('not-expanded')
        for(const todoItem in project.getTodoItems()){
            let item = document.createElement('li')
            item.className = 'sidenav-todo';
            item.id = `${projects.indexOf(project)}${todoItem}`
            item.innerHTML = truncate(project.getTodoItems()[todoItem].title, 20, 17)
            sidebarItem.appendChild(item)
        
    }
        sidenav.appendChild(sidebarItem);
    
}
    return sidenav
}