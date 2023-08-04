import { elementCreation, projectPageRender } from ".";
import Todos from '.';
import { projectStorage } from ".";
import { format ,isPast,isToday, isTomorrow} from "date-fns";



function todosDisplay(projectItem){
    const mainContainer=document.querySelector('.main-container');
    mainContainer.removeChild(document.querySelector('.project-container'))
    document.querySelector('.header').classList.add('active')

    const todosContainer=elementCreation('div','todos-container',mainContainer);
    const todoDisplayContainer=elementCreation('div','todo-display-container',todosContainer)
    const todoHeading=elementCreation('h1','todo-heading',todoDisplayContainer);
    todoHeading.textContent=projectItem.title //Heading 
    const todoAddButton=elementCreation('button','todo-add-btn',todosContainer);
    todoAddButton.textContent='+ Create Task';

    todoAddButton.addEventListener('click',()=>{
        todoPromptCreation(todosContainer,projectItem,todoDisplayContainer,mainContainer)
    })

    document.querySelector('.header').addEventListener('click',()=>{
        mainContainer.removeChild(todosContainer)
        projectPageRender()
    })

    projectItem.todos.forEach(item=>{
        display(todoDisplayContainer,projectItem,item)
        if(item.status==true){
            const checkedItem=document.querySelector(`[data-name='${item.name}']`);
            checkedItem.classList.add('checked');
            checkedItem.querySelector('.check-status').checked=true;
        }
    })
    previewFn(projectItem,todoDisplayContainer);
}

function previewFn(item,todoDisplayContainer){
    if(item.todos.length==0){
        const previewHeading=elementCreation('h3','preview-heading',todoDisplayContainer);
        previewHeading.textContent='Simplicity meets productivity - Add your first todo now!';
    }
}

function todoPromptCreation(todosContainer,projectItem,todoDisplayContainer,mainContainer){
    const promptContainer=elementCreation('div','main-prompt-container',mainContainer)

    const newPrompt=elementCreation('div','prompt-container',promptContainer);
    const promptHeading=elementCreation('h2','prompt-heading',newPrompt)
    promptHeading.textContent=('New To Do');
    

    const formDivRow1=elementCreation('div','form-row',newPrompt)
    const promptNameLable=elementCreation('label','prompt-name-label',formDivRow1);
    promptNameLable.textContent='Task Name :';
    promptNameLable.setAttribute('for','name');
    const promptNameInput=elementCreation('input','prompt-name-input',formDivRow1);
    promptNameInput.setAttribute('id','name');
    promptNameInput.setAttribute('name','name');

    const formDivRow2=elementCreation('div','form-row',newPrompt);
    const promptDueDateLabel=elementCreation('label','prompt-due-date-label',formDivRow2);
    promptDueDateLabel.textContent='Due Date :';
    promptNameLable.setAttribute('for','date');
    const promptDueDateInput=elementCreation('input','prompt-due-date-input',formDivRow2);
    promptDueDateInput.setAttribute('type','date');
    promptDueDateInput.setAttribute('id','date');
    promptDueDateInput.setAttribute('name','date')
    promptDueDateInput.setAttribute('min',format(new Date(),'yyyy-MM-dd'));
    promptDueDateInput.setAttribute('value',format(new Date(),'yyyy-MM-dd'));

    
    const formDivRow3=elementCreation('div','form-row',newPrompt);
    const promptPriorityLabel=elementCreation('label','prompt-priority-label',formDivRow3);
    promptPriorityLabel.textContent='Priority :';
    promptPriorityLabel.setAttribute('for','priority');
    const promptPriorityInput=elementCreation('select','form-row',formDivRow3);
    promptPriorityInput.setAttribute('name','priority');
    const opt1=elementCreation('option','opt1',promptPriorityInput);
    opt1.textContent='Low';
    const opt2=elementCreation('option','opt2',promptPriorityInput);
    opt2.textContent='Medium';
    const opt3=elementCreation('option','opt3',promptPriorityInput);
    opt3.textContent='High';




    const promptAddButton=elementCreation('button','prompt-add-button',newPrompt);
    promptAddButton.textContent='Add';

    const promptCancelButton=elementCreation('button','prompt-cancel-button',newPrompt);
    promptCancelButton.textContent='Cancel';


   
    promptCancelButton.addEventListener('click',()=>{
        mainContainer.removeChild(promptContainer);
    })

    promptAddButton.addEventListener('click',()=>{
        if(promptNameInput.value!=''){
            mainContainer.removeChild(promptContainer);
            // promptDueDateInput.value=promptDueDateInput.value==''?format(new Date(),'yyyy-MM-dd'):promptDueDateInput.value;
            projectItem.todos.push(new Todos(promptNameInput.value,promptDueDateInput.value,promptPriorityInput.value))
            localStorage.setItem('localValue',JSON.stringify(projectStorage.projectsLibrary))
            display(todoDisplayContainer,projectItem,projectItem.todos[projectItem.todos.length-1])
        }
    })
}

function display(todoDisplayContainer,projectItem,item){
    if(document.querySelector('.preview-heading')!=undefined)todoDisplayContainer.removeChild(document.querySelector('.preview-heading'))

    const todoItem=elementCreation('div','todo-item',todoDisplayContainer);
    todoItem.dataset.name=item.name;

    const todoCheck=elementCreation('input','check-status',todoItem)
    todoCheck.setAttribute('type','checkbox')


    const todoItemHeading=elementCreation('h3','todo-item-heading',todoItem);
    todoItemHeading.textContent=item.name;

    const todoPriority=elementCreation('p','todo-priority',todoItem);
    todoPriority.textContent=item.priority
    priorityCheck(item,todoPriority)

    const todoDueDate=elementCreation('h5','todo-due-date',todoItem)
    dueDateCheck(item,todoDueDate,todoItem,todoCheck)

    todoChecking(todoCheck,todoItem,item,todoDueDate)
    
    todoRemovable(todoItem,todoDisplayContainer,projectItem)
}
function priorityCheck(item,todoPriority){
    if(item.priority=='Low')todoPriority.classList.add('low')
    if(item.priority=='Medium')todoPriority.classList.add('medium')
    if(item.priority=='High')todoPriority.classList.add('high')
}

function dueDateCheck(item,todoDueDate,todoItem,todoCheck){
    if(isToday(new Date(item.date))&&(item.status==false)){
        todoDueDate.textContent='Today';
    }else if(isTomorrow(new Date(item.date))&&(item.status==false)){
        todoDueDate.textContent='Tomorrow';
    }else if((isPast(new Date(item.date)))&&(item.status==false)){
        todoDueDate.textContent="Failed";
        todoItem.classList.add('past');
        todoCheck.disabled=true;
    }else if(item.status=true){
        todoDueDate.textContent='Done'
    }
    else{
        todoDueDate.textContent=`${item.date}`
    }
}
function todoChecking(todoCheck,todoItem,item,todoDueDate){
    todoCheck.addEventListener('click',()=>{
        if(todoCheck.checked==true){
            todoItem.classList.add('checked')
            todoDueDate.textContent='Done'
            item.status=true;
            localStorage.setItem('localValue',JSON.stringify(projectStorage.projectsLibrary))
        }else{
            todoItem.classList.remove('checked')
            item.status=false;
            dueDateCheck(item,todoDueDate,todoItem,todoCheck)
            localStorage.setItem('localValue',JSON.stringify(projectStorage.projectsLibrary))
        }
    })
}
function todoRemovable(todoItem,todoDisplayContainer,projectItem){
    const todoItemRemoveBtn=elementCreation('button','todo-item-remove-btn',todoItem);
    todoItemRemoveBtn.addEventListener('click',(e)=>{
        todoDisplayContainer.removeChild(e.target.parentNode)
        projectItem.todos.forEach(item=>{
            if(e.target.parentNode.dataset.name==item.name){
                projectItem.todos.splice(projectItem.todos.indexOf(item),1);
                localStorage.setItem('localValue',JSON.stringify(projectStorage.projectsLibrary))
            }
            
        })
        previewFn(projectItem,todoDisplayContainer);
    })
}

export {todosDisplay}