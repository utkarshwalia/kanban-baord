let draggedCard = null;  // Abhi kaunsa card drag ho raha hai — uska reference store karne ke liye variable
let rightClickedCard = null;
document.addEventListener("DOMContentLoaded",loadTasksFromLocalStorage());  // Jab page load hota hai → localStorage se tasks ko wapas page pe load karna
function addtask(columnid) {  // Jab "Add Task" button dabayenge — ye function chalega
    const input = document.getElementById(`${columnid}-input`);  // Column ke input box ko select kar rahe hain
    const taskText = input.value.trim();  // User ke likhe hue text ko le rahe hain (trim space hata ke)
    const taskDate = new Date().toLocaleString();

    if (taskText === "") {  // Agar user ne kuch nahi likha (blank task)
        return;  // To kuch bhi mat karo, function yahin khatam
    }

    const taskElement = createTaskElement(taskText , taskDate);  // Naya task card bana rahe hain (div)

    document.getElementById(`${columnid}-tasks`).append(taskElement);  // Naye card ko column ke andar daal rahe hain
    saveTaskToLocalStorage(columnid , taskText , taskDate)
    input.value = "";  // Input box ko blank kar do (taaki next task likh sake)
}

function createTaskElement(taskText,taskDate) {  // Naya task card banane wala function
    const taskElement = document.createElement('div');  // Ek naya blank div bana diya
    taskElement.innerHTML = `<span>${taskText}</span><br><small class="time">${taskDate}</small>`
    taskElement.classList.add("card");  // Styling ke liye "card" class add kar di
    taskElement.draggable = true;  // Is div ko draggable bana diya (mouse se move ho sake)
    taskElement.addEventListener("dragstart", dragstart);  // Jab drag start hoga — dragstart() chalega
    taskElement.addEventListener("dragend", dragend);  // Jab drag end hoga — dragend() chalega          
    taskElement.addEventListener("contextmenu", function(event){ // Right click karne pe ye event chalega
        event.preventDefault();// Browser ka default right-click menu ko disable kar diya
        rightClickedCard = this  // Jo card pe right click hua — usko store kar liya (taaki edit/delete mein use ho)
        showContextMenu(event.pageX,event.pageY)  // Custom context menu ko mouse ke point pe dikha do
    })
    return taskElement;  // Bana hua card return kar diya (taaki addtask() mein append kar sake)
}

function dragstart() {  // Jab user card ko drag karna start karta hai
    this.classList.add("dragging");  // "dragging" class add kar di (CSS se visual feedback ke liye)
    draggedCard = this;  // Jo card drag ho raha hai — uska reference draggedCard variable mein save kar diya
}

function dragend() {  // Jab user card ko drop kar deta hai (drag end hota hai)
    this.classList.remove("dragging");  // "dragging" class hata di — card normal ho gaya
    updateLocalStorage();
}

const columns = document.querySelectorAll(".tasks");  // Saare column ke tasks containers ko select kiya (jaha cards dalte hain)

columns.forEach((column) => {  // Har column ke upar loop laga rahe hain
    column.addEventListener("dragover", dragOver);  // Har column pe "dragover" event listener laga diya
});

function dragOver(event) {  // Jab card kisi column ke upar aata hai (mouse se)
    event.preventDefault();  // Browser ka default action (drop ko block karna) ko prevent kar diya
    this.appendChild(draggedCard);  // Current column ke andar draggedCard ko daal diya (drop kar diya)
}
const contextmenu = document.querySelector(".context-menu")  // Custom context menu ko select kar rahe hain
function  showContextMenu(x,y){  // Mouse ke X (left) aur Y (top) position ko input le rahe hain
    contextmenu.style.left = `${x}px`;  // Menu ko mouse ke X position pe horizontally shift kar do
    contextmenu.style.top = `${y}px`;  // Menu ko mouse ke Y position pe vertically shift kar do
    contextmenu.style.display ="Block" ;  // Menu ko visible kar do (pehle hidden tha)
}

document.addEventListener("click", ()=>{ // Jab user kahin bhi screen pe click kare
    contextmenu.style.display = "none";  // To context menu ko hide kar do
})

function editTask() {  // Jab Edit Task option pe click hoga
    if (rightClickedCard !== null) {  // Agar pehle kisi card pe right click hua tha
        const newTaskText = prompt("Edit task - ", rightClickedCard.textContent);  // User se new task text le rahe hain
        if (newTaskText !== "") {  // Agar user ne blank nahi diya
            rightClickedCard.textContent = newTaskText;  // Card ka text update kar do
            updateLocalStorage();
        }
    }
}

function Deletetask() {  // Jab Delete Task option pe click hoga
    if (rightClickedCard !== null) {  // Agar pehle kisi card pe right click hua tha
        rightClickedCard.remove();  // Us card ko delete kar do
        updateLocalStorage();
    }
}



function saveTaskToLocalStorage(columnid, taskText, taskDate) {
    const tasks = JSON.parse(localStorage.getItem(columnid)) || [];  
    // Pehle column ka purana data uthate hain (agar hai to), warna empty array
    tasks.push({ text: taskText, date: taskDate });  
    // Naya task object array me add karte hain
    localStorage.setItem(columnid, JSON.stringify(tasks));  
    // Array ko string me convert karke localStorage me save karte hain
}


 function loadTasksFromLocalStorage() {
    ["todo", "doing", "done"].forEach((columnid) => {  
        // Teeno columns pe loop chala rahe hain
        const tasks = JSON.parse(localStorage.getItem(columnid)) || [];  
        // Column ka data uthake array me convert karte hain
        tasks.forEach(({ text, date }) => {  
            // Har task ke liye loop chala ke
            const taskElement = createTaskElement(text, date);  
            // Naya card create karte hain
            document.getElementById(`${columnid}-tasks`).appendChild(taskElement);  
            // Aur usko column ke andar append kar dete hain
        });
    });
}


function updateLocalStorage() {
    ["todo", "doing", "done"].forEach((columnid) => {  
        // Teeno columns pe loop chala rahe hain
        const tasks = [];  
        // Naya empty array banate hain column ke tasks ke liye
        document.querySelectorAll(`#${columnid}-tasks .card`).forEach((card) => {  
            // Har card ke liye loop chala ke
            const taskText = card.querySelector("span").textContent;  
            // Card ka text uthate hain
            const taskdate = card.querySelector("small").textContent;  
            // Card ka date uthate hain
            tasks.push({ text: taskText, date: taskdate });  
            // Dono ko ek object bana ke array me push karte hain
        });
        localStorage.setItem(columnid, JSON.stringify(tasks));  
        // Array ko string me convert karke localStorage me save karte hain
    });
}
