// Initial Reference Values
let RefTime = document.querySelector(".display-time");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const amPmSelectValue = document.getElementById("amPmSelectValue");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("setAlarm");
let alarmsArray = [];
let alarmMusic = new Audio("./interstellar_piano.mp3");

let initialHour = 0,
  initialMinute = 0,
  alarmIndex = 0;

// Search for value in the object
const searchObject = (parameter, value) => {
  let alarmObject, objIndex, exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Append zeroes to single values
const addZero = (value) => (value < 10 ? "0" + value : value);

// Display Time
function displayTime() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    addZero(date.getHours()),
    addZero(date.getMinutes()),
    addZero(date.getSeconds()),
  ];

  // Convert hours to 12-hour format
  let amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  RefTime.innerHTML = `${hours}:${minutes}:${seconds} ${amPm}`;

  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      let alarmHour = parseInt(alarm.alarmHour);
      let alarmMinute = parseInt(alarm.alarmMinute);

      // Convert alarm hour to 24-hour format if necessary
      if (alarm.amPm === "PM" && alarmHour !== 12) {
        alarmHour += 12;
      } else if (alarm.amPm === "AM" && alarmHour === 12) {
        alarmHour = 0;
      }

      if (
        alarmHour === date.getHours() &&
        alarmMinute === date.getMinutes() &&
        seconds === "00"
      ) {
        alarmMusic.play();
        alarmMusic.loop = true;
      }
    }
  });
}

const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = addZero(inputValue);
  }
  return inputValue;
};

hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});

// Create each alarm section
const createAlarm = (alarmObj) => {
  const { id, alarmHour, alarmMinute, amPm } = alarmObj;

  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute} ${amPm}</span>`;

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);

  // Delete button for each alarm
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);

  activeAlarms.appendChild(alarmDiv);
};

// Set Alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  alarmObj.amPm = amPmSelectValue.value;
  alarmObj.isActive = false;
  console.log(alarmObj);

  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
  hourInput.value = addZero(initialHour);
  minuteInput.value = addZero(initialMinute);
});

// Start Alarm checkbox
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

// Stop Alarm checkbox
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    if (alarmMusic) {
      alarmMusic.pause();
    }
  }
};

// Delete Alarm Button
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};

window.onload = () => {
  setInterval(displayTime);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = addZero(initialHour);
  minuteInput.value = addZero(initialMinute);
};
