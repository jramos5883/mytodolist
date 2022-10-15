//comment
//creates and targets ul proj list in HTML
const listsContainer = document.querySelector('[data-proj-list]');

//creating variables for new projects
const newProjForm = document.querySelector('[data-new-proj-form]');
const newProjInput = document.querySelector('[data-new-proj-input]');

//setting up delete proj button
const deleteProjBtn = document.querySelector('[data-delete-proj]');

//task template stored in variable, can be used by javascript
const taskTemplate = document.getElementById('task-template');

//creating local storage for site, uses storage to remember selected list
const LOCAL_STORAGE_KEY = 'tasks.myProjects';
const LOCAL_STORAGE_PROJ_ID = 'tasks.selectedListId';
let myProjects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

//creating variable for selected proj id

let selectedListId = localStorage.getItem(LOCAL_STORAGE_PROJ_ID);
//Creating variables to give task side functionality
const taskDisplayContainer = document.querySelector('[data-task-display-container]');
const projTitle = document.querySelector('[data-proj-title]');
const taskCount = document.querySelector('[data-task-count]');
const taskContainer = document.querySelector('[data-tasks]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasksBtn = document.querySelector('[data-clear-tasks]');

//Need event listener to interact with DOM created elements, used to target selected list
//if element ('li') is clicked, it is selected
listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
})

//used to target checkbox and refresh task counter
taskContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedProj = myProjects.find(list => list.id === selectedListId);
        const selectedTask = selectedProj.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedProj);
    }
})

//When submitting a form, expect that an event listener needs to be made.
newProjForm.addEventListener('submit', e => {
    //prevents the page from refreshing, negates default browser settings
    e.preventDefault();
    const projName = newProjInput.value;                    
    if (projName == null || projName === '') return;
    const proj = createProj(projName);
    newProjInput.value = null;
    myProjects.push(proj);
    saveAndRender();
})

//adds task to task list and refreshes page
newTaskForm.addEventListener('submit', e => {
    //prevents the page from refreshing, negates default browser settings
    e.preventDefault();
    const taskName = newTaskInput.value;                    
    if (taskName == null || taskName === '') return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedProj = myProjects.find(list => list.id === selectedListId);
    selectedProj.tasks.push(task);
    saveAndRender();
})

//clears completed tasks on click
clearCompleteTasksBtn.addEventListener('click', e => {
    const selectedProj = myProjects.find(proj => proj.id ===selectedListId);
    selectedProj.tasks = selectedProj.tasks.filter(task => !task.complete);
    saveAndRender();
})

//removes project from myProjects and saves/renders
deleteProjBtn.addEventListener('click', e => {
    myProjects = myProjects.filter(proj => proj.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
})

//creates unique id for proj in proj list and task in task list
function createProj(name) {
    return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false };
}

//uses key to access storage, JSON saves data as a string, also saves li element id
function save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(myProjects));
    localStorage.setItem(LOCAL_STORAGE_PROJ_ID, selectedListId);
}

//Display Proj List
function render() {
    clearElement(listsContainer);
    renderProj();

    const selectedProj = myProjects.find(proj => proj.id === selectedListId);
    //if no proj is selected, task window disappears
    if (selectedListId == null) {
        taskDisplayContainer.style.display = 'none';
    } else {
        taskDisplayContainer.style.display = '';
        //link to proj title in html, displays proj title on task side
        projTitle.innerText = selectedProj.name;
        renderTaskCount(selectedProj);
        clearElement(taskContainer);
        renderTasks(selectedProj);
    }
}

//uses template to create tasks
function renderTasks(selectedProj) {
    selectedProj.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        taskContainer.appendChild(taskElement);
    })
}

//displays tasks remaining
function renderTaskCount(selectedProj) {
    const incompleteTaskCount = selectedProj.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    taskCount.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderProj() {
    myProjects.forEach(proj => {                            //forEach loop through lists array
        const listElement = document.createElement('li');   //create li element
        listElement.dataset.listId = proj.id;               //gives each objects a unique id
        listElement.classList.add("proj-name");             //add class to li element
        listElement.innerText = proj.name;                  //add proj name to to li element (myProjects.name)
        if (proj.id === selectedListId) {                   //used to save and determine which list is active
            listElement.classList.add('active-proj')
        }          
        listsContainer.appendChild(listElement);            //append to listsContainer
    })
}

function saveAndRender() {
    save();
    render();
}

//clears elements in HTML that are being used has placeholders for coding
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();