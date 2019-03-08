let app = {
    timeList: [],
    init: function () {
        app.addListener();
        cordova.plugins.notification.local.getAll(notes => {
            console.log(notes);
            app.timeList = notes;
            if (app.newContener != {}) {
                app.timeList.push(app.newContener);
                app.newContener = {};

                app.sortList();
                app.homePage();

                let n = app.timeList.findIndex(item => item.id == app.newId);

                document.querySelector(`#contentList>div:nth-child(${n+1})`).focus();
                document.querySelector(`#contentList>div:nth-child(${n+1})`).classList.add('focus');
                setTimeout(() => {
                    document.querySelector(`#contentList>div:nth-child(${n+1})`).classList.remove('focus');
                }, 5000);

                app.newId = 0;
            } else {
                app.sortList();
                app.homePage();
            };
        });
    },
    sortList: function () {
        let newArry = app.timeList.filter(item => {
            let time = new Date(item.data);
            time.setHours(time.getHours() + 8);
            time = Date.parse(time);
            let now = Date.now();
            if (time > now) {
                return true;
            } else {
                return false;
            }
        });
        app.timeList = newArry;
        app.timeList.sort((a, b) => {
            let timeA = Date.parse(new Date(a.data));
            let timeB = Date.parse(new Date(b.data));
            if (timeA > timeB) {
                return 1;
            } else if (timeA == timeB) {
                return 0;
            } else {
                return -1;
            }
        });
    },
    addListener: function () {
        //test

        document.querySelector('#logo').addEventListener('click', () => {
            cordova.plugins.notification.local.cancelAll(function () {
                alert("done");
            }, this);
        });
        document.getElementById('addButton').addEventListener('click', app.addDate);
        document.getElementById('backButton').addEventListener('click', app.backHome);
        document.getElementById('saveButton').addEventListener('click', app.addNew);
        cordova.plugins.notification.local.on("click", app.afterClick);
        cordova.plugins.notification.local.on("triggered", function (notification) {
            //function runs when the notification pops up

        });
    },
    newContener: {},
    newId: 0,
    afterClick: function (notification, s) {
        if (app.newId != 0) {
            return;
        }
        let newId = Date.now();
        app.newId = newId;
        if (notification.text != `Do not forget your special day today!`) {
            app.testNumber = app.testNumber + 1;

            let time = new Date(notification.data);
            time.setHours(time.getHours() + 8 + 5);
            let newObj = {
                id: newId,
                title: notification.title,
                text: `Do not forget your special day today!`,
                at: time,
                data: notification.data
            };
            cordova.plugins.notification.local.schedule(newObj);
            app.newContener = newObj;

            console.log(s);

            if (s == 'foreground') {
                console.log('hh')

                let a = app.timeList.findIndex(item => item.id == notification.id);
                app.timeList.splice(a,1);

                app.timeList.push(newObj);
                app.sortList();
                app.homePage();

                let n = app.timeList.findIndex(item => item.id == app.newId);

                document.querySelector(`#contentList>div:nth-child(${n+1})`).focus();
                document.querySelector(`#contentList>div:nth-child(${n+1})`).classList.add('focus');
                setTimeout(() => {
                    document.querySelector(`#contentList>div:nth-child(${n+1})`).classList.remove('focus');
                }, 5000);
            }
        }
    },
    addDate: function () {
        document.getElementById('home').classList.toggle('hide');
        document.getElementById('add').classList.toggle('delete');
        document.getElementById('addButton').classList.toggle('vis');
        document.getElementById('backButton').classList.toggle('vis');
        document.getElementById('newTitle').value = '';
        document.getElementById('newDate').value = '';
    },
    backHome: function () {
        document.getElementById('home').classList.toggle('hide');
        document.getElementById('add').classList.toggle('delete');
        document.getElementById('addButton').classList.toggle('vis');
        document.getElementById('backButton').classList.toggle('vis');

        cordova.plugins.notification.local.getAll(notes => {
            console.log('all: ');
            console.log(notes);
        });

        cordova.plugins.notification.local.getScheduled(notes => {
            console.log('Scheduled: ');
            console.log(notes);
        });

        cordova.plugins.notification.local.getTriggered(notes => {
            console.log('Triggered: ');
            console.log(notes);
        });

        console.log('app.list:');
        console.log(app.timeList);
    },
    homePage: function () {
        console.log(app.timeList);
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

        let newDate = new Date(note.data);
        newDate.setHours(newDate.getHours() + 8 + 5); //There was an eight-hour difference after the time object was saved.

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

        listCard.setAttribute('data-id', note.id);
        deleteIcon.setAttribute('data-id', note.id);
        deleteIcon.addEventListener('click', app.deleteDate);

        yearSpan.textContent = note.data;
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

        newDate = luxon.DateTime.fromISO(newDate).minus({
            days: 7
        }).toISODate();
        console.log(newDate);

        newDate = new Date(newDate);
        newDate.setHours(newDate.getHours() + 8 + 5);
        console.log(newDate);

        let newObj = {
            id: Date.now(),
            title: newTitle,
            text: `Do not forget your special day on ${document.getElementById('newDate').value}!`,
            at: newDate,
            data: document.getElementById('newDate').value
        }

        cordova.plugins.notification.local.schedule(newObj);
        app.timeList.push(newObj);
        app.sortList();

        app.backHome();
        app.homePage();
    },
    deleteConfirm: function () {
        navigator.notification.confirm(
            'Do you want to elete the date?', // message
            app.onConfirm, // callback to invoke with index of button pressed
            'Confirmation', // title
            ['Confirm', 'Cancel'] // buttonLabels
        );
    },
    deleteId: null,
    deleteDate: function (ev) {
        app.deleteId = ev.currentTarget.getAttribute('data-id');
        app.deleteConfirm();
    },
    onConfirm: function (index) {
        if (index == 1) {
            cordova.plugins.notification.local.cancel(app.deleteId, function () {
                let n = app.timeList.findIndex(item => item.id == app.deleteId);
                app.timeList.splice(n, 1);
                document.querySelector(`#contentList>div:nth-child(${n+1})`).classList.add('delete');
                setTimeout(() => {
                    document.querySelector("#contentList").removeChild(document.querySelector("#contentList").childNodes[n]);
                    if (app.timeList.length == 0) {
                        document.querySelector('.noDate').classList.remove('hidden');
                    };
                }, 500);
            });
        } else {
            return;
        }
    }
}

if ("cordova" in window) {
    document.addEventListener("deviceready", app.init);
} else {
    document.addEventListener("DOMContentLoaded", app.init);
}