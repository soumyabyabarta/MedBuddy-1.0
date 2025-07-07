const reminderList = document.getElementById('reminderList');
const medicineName = document.getElementById('medicineName');
const doseInput = document.getElementById('doseInput');
const hourInput = document.getElementById('hourInput');
const minuteInput = document.getElementById('minuteInput');
const repeatInput = document.getElementById('repeatInput');
const addBtn = document.getElementById('addBtn');

let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

function renderReminders() {
    reminderList.innerHTML = '';
    reminders.forEach((reminder, index) => {
        const li = document.createElement('li');
        li.className = "bg-gray-700 p-3 rounded-lg flex justify-between items-center shadow-lg";
        li.innerHTML = `
            <div>
                <span class="font-semibold">${reminder.name}</span>
                ${reminder.dose ? ` - <span class="italic">${reminder.dose}</span>` : ''}
                <br>
                <span class="text-sm">${reminder.time} (${reminder.repeat})</span>
            </div>
            <div class="flex gap-2">
                <button onclick="editReminder(${index})" class="px-2 py-1 bg-gray-500 text-white rounded">Edit</button>
                <button onclick="deleteReminder(${index})" class="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
        `;
        reminderList.appendChild(li);
    });
}

function addReminder() {
    const name = medicineName.value.trim();
    const dose = doseInput.value.trim();
    let hour = parseInt(hourInput.value);
    let minute = parseInt(minuteInput.value);
    const repeat = repeatInput.value;

    if (name === '' || isNaN(hour) || isNaN(minute)) {
        alert('Please enter medicine name and valid time.');
        return;
    }

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        alert('Please enter a valid time (24-hour format).');
        return;
    }

    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    reminders.push({ name, dose, time, repeat, notifiedToday: false });
    localStorage.setItem('reminders', JSON.stringify(reminders));
    renderReminders();

    medicineName.value = '';
    doseInput.value = '';
    hourInput.value = '';
    minuteInput.value = '';
}

function deleteReminder(index) {
    reminders.splice(index, 1);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    renderReminders();
}

function editReminder(index) {
    const reminder = reminders[index];
    const newName = prompt('Edit Medicine Name:', reminder.name);
    const newDose = prompt('Edit Dose (Optional):', reminder.dose || '');
    const newTime = prompt('Edit Time (HH:MM - 24-hour format):', reminder.time);
    const newRepeat = prompt('Repeat (daily/once):', reminder.repeat);

    if (newName && newTime && (newRepeat === 'daily' || newRepeat === 'once')) {
        reminders[index].name = newName;
        reminders[index].dose = newDose;
        reminders[index].time = newTime;
        reminders[index].repeat = newRepeat;
        reminders[index].notifiedToday = false;
        localStorage.setItem('reminders', JSON.stringify(reminders));
        renderReminders();
    } else {
        alert('Invalid input.');
    }
}

function checkReminders() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM in 24-hour format

    reminders.forEach((reminder, index) => {
        if (reminder.time === currentTime && !reminder.notifiedToday) {
            alert(`💊 Time to take: ${reminder.name}${reminder.dose ? ' - ' + reminder.dose : ''}`);
            if (reminder.repeat === 'once') {
                reminders.splice(index, 1);
            } else {
                reminder.notifiedToday = true;
            }
            localStorage.setItem('reminders', JSON.stringify(reminders));
            renderReminders();
        }
    });

    if (currentTime === '00:00') {
        reminders.forEach(reminder => {
            reminder.notifiedToday = false;
        });
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }
}

addBtn.addEventListener('click', addReminder);
renderReminders();
setInterval(checkReminders, 1000);  // Check every second for precise alerts
