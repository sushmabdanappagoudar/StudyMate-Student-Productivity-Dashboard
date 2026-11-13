const $ = (id) => document.getElementById(id);
const today = new Date();
$('today').textContent = today.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
$('greeting').textContent = today.getHours()<12 ? 'Good morning. Start small.' : today.getHours()<17 ? 'Keep your momentum going.' : 'A little progress still counts.';

let tasks = JSON.parse(localStorage.getItem('studymate-tasks') || '[]');
let sessions = Number(localStorage.getItem('studymate-sessions') || 0);
function saveTasks(){localStorage.setItem('studymate-tasks',JSON.stringify(tasks));renderTasks();}
function renderTasks(){
  $('taskList').innerHTML='';
  $('emptyState').style.display=tasks.length?'none':'block';
  tasks.forEach((task,index)=>{
    const row=document.createElement('div');row.className='task'+(task.done?' done':'');
    const check=document.createElement('input');check.type='checkbox';check.checked=task.done;check.setAttribute('aria-label','Mark task complete');check.addEventListener('change',()=>{tasks[index].done=check.checked;saveTasks();});
    const name=document.createElement('span');name.className='task-name';name.textContent=task.name;
    const priority=document.createElement('span');priority.className='priority '+task.priority;priority.textContent=task.priority;
    const del=document.createElement('button');del.className='delete';del.textContent='×';del.setAttribute('aria-label','Delete task');del.addEventListener('click',()=>{tasks.splice(index,1);saveTasks();});
    row.append(check,name,priority,del);$('taskList').append(row);
  });
  $('completedCount').textContent=tasks.filter(t=>t.done).length;
  $('remainingCount').textContent=tasks.filter(t=>!t.done).length;
  $('sessionCount').textContent=sessions;
}
$('taskForm').addEventListener('submit',e=>{e.preventDefault();const name=$('taskInput').value.trim();if(!name)return;tasks.push({name,priority:$('priority').value,done:false});$('taskInput').value='';saveTasks();});
renderTasks();

let seconds=25*60, interval=null;
function showTime(){$('timer').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');}
$('startBtn').addEventListener('click',()=>{
 if(interval){clearInterval(interval);interval=null;$('startBtn').textContent='Resume';$('timerStatus').textContent='Paused. Resume when ready.';return;}
 $('startBtn').textContent='Pause';$('timerStatus').textContent='Focus mode is on.';
 interval=setInterval(()=>{seconds--;showTime();if(seconds<=0){clearInterval(interval);interval=null;sessions++;localStorage.setItem('studymate-sessions',sessions);renderTasks();$('startBtn').textContent='Start';$('timerStatus').textContent='Session complete. Take a short break!';}},1000);
});
$('resetBtn').addEventListener('click',()=>{clearInterval(interval);interval=null;seconds=1500;showTime();$('startBtn').textContent='Start';$('timerStatus').textContent='Timer reset.';});
showTime();

$('notes').value=localStorage.getItem('studymate-notes')||'';
$('notes').addEventListener('input',()=>{localStorage.setItem('studymate-notes',$('notes').value);$('saveStatus').textContent='Saved just now';});
$('clearNotes').addEventListener('click',()=>{if(confirm('Clear your saved notes?')){$('notes').value='';localStorage.removeItem('studymate-notes');$('saveStatus').textContent='Notes cleared.';}});
const tips=['Use active recall: close your notes and explain the concept from memory.','Study in short focused blocks and take small breaks between them.','At the end of each session, write down the one thing you understood best.','Keep your phone away during a focus session to reduce distractions.','Start with the most important task instead of the easiest one.'];
$('newTip').addEventListener('click',()=>{$('tip').textContent=tips[Math.floor(Math.random()*tips.length)];});
