//In this project I tried to maximise the single responsibility principle,
// but still there are lot of room to improve.
// Created on 4 aug 2023 // Update on 4 aug 2023
/***************************************************************************/

import './asset and styles/style.css'
import { todosDisplay } from './todos';

const projectStorage=(function(){
    let projectsLibrary=(localStorage.length==0)?[
        new Project('My Task','Add Quick Tasks')   
    ]:JSON.parse(localStorage.getItem('localValue'));

    localStorage.setItem('localValue',JSON.stringify(projectsLibrary))
    function Project(title,description){
        this.title=title;
        this.description=description;
        this.todos=[]
    }
    function Todos(name,date,priority){
        this.name=name;
        this.status=false;
        this.date=date;
        this.priority=priority
    }
    return{
        projectsLibrary,
        Project,
        Todos
    }
})();

projectPageRender();

function projectPageRender(){
    document.querySelector('.header').classList.remove('active')

    const mainContainer=document.querySelector('.main-container');
    const projectContainer=elementCreation('div','project-container',mainContainer)
    const displayContainer=elementCreation('div','display-container',projectContainer)

    const addProjectButton=elementCreation('button','add-project-btn',projectContainer)
    // addProjectButton.textContent='+';

    addProjectButton.addEventListener('click',()=>{
        projectPromptCreation(displayContainer,mainContainer)
    })

    projectStorage.projectsLibrary.forEach(item=>{
        display(displayContainer,item)
    })
}

function display(displayContainer,item){
    const projectItem=elementCreation('div','project-item',displayContainer);
    projectItem.dataset.title=item.title;
    const projectItemHeading=elementCreation('h2','project-item-heading',projectItem);
    projectItemHeading.textContent=item.title

    const taskCount=elementCreation('p','task-count',projectItem);
    taskCount.textContent=`${item.todos.length} : Tasks`

    const projectItemDescription=elementCreation('p','project-element-description',projectItem)
    projectItemDescription.textContent=item.description
    
    

    if(item.title!='My Task'){
        projectItemRemovable(projectItem,displayContainer)
    }

    projectItemClickable()
}

function projectItemRemovable(projectItem,displayContainer){
    const projectRemoveButton=elementCreation('button','project-remove-btn',projectItem);
    // projectRemoveButton.textContent='Delete'
    projectRemoveButton.addEventListener('click',(e)=>{
        if(confirm(`You wish to delete ${e.target.parentNode.dataset.title} ?`)){
            displayContainer.removeChild(e.target.parentNode)
            projectStorage.projectsLibrary.forEach(item=>{
                if(e.target.parentNode.dataset.title==item.title){
                    projectStorage.projectsLibrary.splice(projectStorage.projectsLibrary.indexOf(item),1) 
                    localStorage.setItem('localValue',JSON.stringify(projectStorage.projectsLibrary))
                }
            })
        }
    })
}

function projectItemClickable(){
    const projectItems=document.querySelectorAll('.project-item')
    projectItems.forEach(item=>{
        item.addEventListener('click',(e)=>{
            projectStorage.projectsLibrary.forEach(project=>{
                if((e.target.dataset.title==project.title||e.target.parentNode.dataset.title==project.title)&&(e.target.type!=='submit')){
                    todosDisplay(project)
                }
            })
        })
    })  
}



function projectPromptCreation(displayContainer,mainContainer){

    const promptContainer=elementCreation('div','main-prompt-container',mainContainer)

    const newPrompt=elementCreation('div','prompt-container',promptContainer);
    const promptHeading=elementCreation('h2','prompt-heading',newPrompt)
    promptHeading.textContent=('New Project');
    
    const formDivRow1=elementCreation('div','form-row',newPrompt)
    const promptTitleLable=elementCreation('label','prompt-title-lable',formDivRow1);
    promptTitleLable.textContent='Project title :';
    promptTitleLable.setAttribute('for','title');
    const promptTitleInput=elementCreation('input','prompt-title-input',formDivRow1);
    promptTitleInput.setAttribute('id','title');
    promptTitleInput.setAttribute('name','title');

    const formDivRow2=elementCreation('div','form-row',newPrompt)
    const promptDescriptionLable=elementCreation('label','prompt-description-lable',formDivRow2);
    promptDescriptionLable.textContent='Description :';
    promptDescriptionLable.setAttribute('for','description');
    const promptDescriptionInput=elementCreation('textarea','prompt-description-input',formDivRow2);
    promptDescriptionInput.setAttribute('id','description');
    promptDescriptionInput.setAttribute('name','description')

    const promptAddButton=elementCreation('button','prompt-add-button',newPrompt);
    promptAddButton.textContent='Add';

    const promptCancelButton=elementCreation('button','prompt-cancel-button',newPrompt);
    promptCancelButton.textContent='Cancel'

    promptCancelButton.addEventListener('click',()=>{
        mainContainer.removeChild(promptContainer)
        projectContainer.classList.remove('negative-pointer-events')
    })

    promptAddButton.addEventListener('click',()=>{
        if(promptTitleInput.value!=''){
            mainContainer.removeChild(promptContainer)
            promptDescriptionInput.value=promptDescriptionInput.value==''?'No Description Added':promptDescriptionInput.value
            projectStorage.projectsLibrary.push(new projectStorage.Project(promptTitleInput.value,promptDescriptionInput.value));
            localStorage.setItem('localValue',JSON.stringify(projectStorage.projectsLibrary))
            display(displayContainer,projectStorage.projectsLibrary[projectStorage.projectsLibrary.length-1]);
            promptTitleInput.value='';
            promptDescriptionInput.value='';
        }
    })
}

function elementCreation(type,classtitle,parent){
    const element=document.createElement(type);
    element.classList.add(classtitle);
    parent.appendChild(element)

    return element 
}



export {elementCreation,projectStorage}
export default projectStorage.Todos

export{projectPageRender}