function Init() {
    UpdateMembersTable();

    setInterval(() => {
        UpdateMembersTable();
    }, 15000);
}

function UpdateMembersTable() {
    GetJson('data/members.json', (err, data) => {
        var memberbody = document.getElementById('memberbody');
        while (memberbody.firstChild) {
            memberbody.removeChild(memberbody.firstChild);
        }
        console.log(data);
        var key;
        var tr, email, fname, lname, gender, birthday;
        if (!err) {
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    tr = document.createElement('tr');
                    email = document.createElement('td');
                    fname = document.createElement('td');
                    lname = document.createElement('td');
                    gender = document.createElement('td');
                    birthday = document.createElement('td');
                    email.textContent = key;
                    fname.textContent = data[key].fname;
                    lname.textContent = data[key].lname;
                    gender.textContent = data[key].gender;
                    birthday.textContent = data[key].birthday;
                    tr.appendChild(fname);
                    tr.appendChild(lname);
                    tr.appendChild(email);
                    tr.appendChild(gender);
                    tr.appendChild(birthday);
                    memberbody.appendChild(tr);
                }
            }
        }
    });
}

function GetJson(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // successfully received data!
            callback(null, JSON.parse(xhr.response));
        }
        else if (xhr.readyState == 4) {
            callback('error: ' + xhr.status, null);
        }
    };
    xhr.open('GET', url, true);
    xhr.setRequestHeader('cache-control', 'no-cache');
    xhr.setRequestHeader('cache-control', 'max-age=0');
    xhr.setRequestHeader('pragma', 'no-cache');
    xhr.send();
}
