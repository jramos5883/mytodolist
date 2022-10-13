//comment
//creates and targets ul proj list in HTML
const listsContainer = document.querySelector('[data-proj-list]');
//creating variables for new projects
const newProjForm = document.querySelector('[data-new-proj-form]');
const newProjInput = document.querySelector('[data-new-proj-input]');

let lists = [];

//When submitting a form, expect that an event listener needs to be made.
newProjForm.addEventListener('submit', e => {
    //prevents the page from refreshing, negates default browser settings
    e.preventDefault();
    const projName = newProjInput.value;                    
    if (projName == null || projName === '') return
    const list = createProj(projName);
    newProjInput.value = null;
    lists.push(list);
    render();
})

//creates unique id for proj in proj list
function createProj(name) {
    return { id: Date.now().toString(), name: name, tasks: [] };
}

//Display Proj List
function render() {
    clearElement(listsContainer);
    lists.forEach(list => {                                 //forEach loop through lists array
        const listElement = document.createElement('li');   //create li element
        listElement.dataset.listId = list.id;               //gives each objects a unique id
        listElement.classList.add("proj-name");             //add class to li element
        listElement.innerText = list.name;                  //add proj name to to li element (lists.name)
        listsContainer.appendChild(listElement);            //append to listsContainer
    })
}

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();