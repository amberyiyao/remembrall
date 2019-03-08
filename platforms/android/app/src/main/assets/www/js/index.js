let app = {
    timeList: [{
            id: 1,
            title: "Something To Do!",
            date: "2019-02-10"
        },
        {
            id: 2,
            title: "Something!",
            date: "2019-03-30"
        },
        {
            id: 3,
            title: "Something To Do!",
            date: "2019-02-04"
        },
        {
            id: 4,
            title: "Something To Do!",
            date: "2019-04-30"
        },
        {
            id: 5,
            title: "Something To Do!",
            date: "2019-08-30"
        }
    ],
    init: function () {
        if (localStorage.getItem('timeList')) {
            // app.timeList = JSON.parse(localStorage.getItem('timeList'));
            app.homePage();
        } else {
            document.querySelector('.noDate').classList.remove('hidden');
        }
        app.addListener();
    },
    addListener: function () {
        document.getElementById('addButton').addEventListener('click', app.addDate);
        document.getElementById('backButton').addEventListener('click', app.backHome);
        document.getElementById('saveButton').addEventListener('click', app.addNew);
    },
    addDate: function () {
        app.backHome();

        document.getElementById('newTitle').value = '';
        document.getElementById('newDate').value = '';
    },
    backHome: function () {
        document.getElementById('home').classList.toggle('hide');
        document.getElementById('add').classList.toggle('delete');
        document.getElementById('addButton').classList.toggle('hidden');
        document.getElementById('backButton').classList.toggle('hidden');
    },
    homePage: function () {

        document.querySelector('.noDate').classList.add('hidden');

        let content = document.getElementById('contentList');
        content.innerHTML = "";

        if (app.timeList.length == 0) {
            document.querySelector('.noDate').classList.remove('hidden');
            return;
        }

        let documentFragment = new DocumentFragment();

        app.timeList.forEach((note) => {
            documentFragment.appendChild(app.addList(note));
        });

        content.appendChild(documentFragment);

    },
    addList: function (note) {

        let listCard = document.createElement('div');
        let time = document.createElement('div');
        let day = document.createElement('p');
        let month = document.createElement('p');
        let content = document.createElement('div');
        let title = document.createElement('p');
        let year = document.createElement('p');
        let icon1 = document.createElement('i');
        let deleteIcon = document.createElement('i');
        let yearSpan = document.createElement('span');

        let newDate = new Date(note.date); 
        // newDate.setHours(newDate.getHours() + 8); //There was an eight-hour difference after the time object was saved.
        let monthString = newDate.toDateString().split(' ')[1].toUpperCase(); //https://blog.csdn.net/joyce_lcy/article/details/85697437
        let dayNumber = newDate.toDateString().split(' ')[2];

        listCard.className = "listCard";
        time.className = "time";
        day.className = "day";
        month.className = "month";
        content.className = 'content';
        title.className = 'title';
        year.className = 'year';
        icon1.className = "far fa-calendar-alt";
        deleteIcon.className = "far fa-trash-alt";

        deleteIcon.setAttribute('data-id', note.id);
        deleteIcon.addEventListener('click', app.deleteDate);

        yearSpan.textContent = note.date;
        day.textContent = dayNumber;
        month.textContent = monthString;
        title.textContent = note.title;

        time.appendChild(day);
        time.appendChild(month);
        year.appendChild(icon1);
        year.appendChild(yearSpan);
        content.appendChild(title);
        content.appendChild(year);
        listCard.appendChild(time);
        listCard.appendChild(content);
        listCard.appendChild(deleteIcon);

        let documentFragment = new DocumentFragment();
        documentFragment.appendChild(listCard);

        return documentFragment;
    },
    addNew: function () {
        let newTitle = document.getElementById('newTitle').value;
        let newDate = document.getElementById('newDate').value;

        if (!newTitle) {
            alert('You have to enter the title!');
            document.getElementById('newTitle').focus();
            return;
        }
        if (!newDate) {
            alert('You have to enter the date!');
            document.getElementById('newDate').focus();
            return;
        }

        let Id = Date.now();
        let newTime = {
            id: Id,
            title: newTitle,
            date: newDate,
        };
        app.timeList.unshift(newTime);

        newDate = new Date(newDate);

        localStorage.setItem('timeList', JSON.stringify(app.timeList));

        app.backHome();
        app.homePage();

        // newDate.setDate(newDate.getDate() - 7);

        // cordova.plugins.notification.local.schedule({
        // id: Id,
        // title: newTitle,
        // text: 'This special day is 7 days away!',
        // // at: newDate,
        // foreground: true
        // });
    },
    deleteDate: function (ev) {
        let deleteId = ev.currentTarget.getAttribute('data-id');

        // cordova.plugins.notification.local.cancel(deleteId, function () {
        let n = app.timeList.findIndex(item => item.id == deleteId);
        document.querySelector(`#contentList>div:nth-child(${n+1})`).classList.add('delete');
        setTimeout(() => {
            document.querySelector("#contentList").removeChild(document.querySelector("#contentList").childNodes[n]);
            app.timeList.splice(n, 1);
            localStorage.setItem('timeList', JSON.stringify(app.timeList));
          
            if (app.timeList.length == 0) {
                app.homePage();
            }
        }, 500);
          // });

    }
}

if ("cordova" in window) {
    document.addEventListener("deviceready", app.init);
} else {
    document.addEventListener("DOMContentLoaded", app.init);
}
