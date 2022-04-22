const addButton = document.querySelector('#addButton');
const addPanel = document.querySelector('#addPanel');
const delButton = document.querySelector('#delButton');
const newSaveButton = document.querySelector('#newSaveButton');
const editSaveButton = document.querySelector('#editSaveButton');
const editCancelButton = document.querySelector('#editCancelButton');
const newCancelButton = document.querySelector('#newCancelButton');
const host = 'http://localhost:8000/api/';


var getEmployees = () => {
    let endpoint = 'employees';
    let url = host + endpoint;
    $.ajax({
        url: url
    })
    .done((res) => {
        console.log(res);
        renderEmployees(res);
    });
}

var renderEmployees = (employees) => {
    $('#employeeTable').text('');
    $.each(employees, (index, value) => {
        let tr = $('<tr></tr>');
        $('<td></td>').text(value.id).appendTo(tr);
        $('<td></td>').text(value.name).appendTo(tr);
        $('<td></td>').text(value.city).appendTo(tr);
        $('<td></td>').text(value.salary).appendTo(tr);
        
        let tdDel =  $('<td></td>').appendTo(tr);
        let delButton = $('<button>Törlés</button>').appendTo(tdDel);
        delButton.on('click', () => delEmployee(value.id));

        let tdEdit = $('<td></td>').appendTo(tr);
        let updateButton = $('<button>Szerkesztés</button>').appendTo(tdEdit);
        updateButton.on('click', () => editEmployee(value));

        $('#employeeTable').append(tr);
    });
}

addButton.addEventListener('click', () => {
    showAddPanel();
});

var showAddPanel = () => {    
    $('#addPanel').fadeIn(400);
};

newSaveButton.addEventListener('click', () => {
    saveNewPanel();
});

var saveNewPanel = () => {
    let employee = {
        name: $('#newName').val(),
        city: $('#newCity').val(),
        salary: $('#newSalary').val()
    } 
    $('#newName').val('');
    $('#newCity').val('');
    $('#newSalary').val('');
    addEmployee(employee);
    $('#addPanel').fadeOut(400);
};

var addEmployee = (employee) => {
    let endpoint = 'employees';
    let url = host + endpoint;
    let authDataJson = localStorage.getItem('authData');

    if (authDataJson === null) {
        alert('Nem vagy bejelentkezve!')
        return;
    }    

    let authData = JSON.parse(authDataJson);
    let token = authData.token;

    $.ajax({
        type: 'post',
        url: url,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: employee
    })
    .done((res) => {
        console.log(res);
        getEmployees();
    });
};

var delEmployee = (id) => {
    deleteEmployee(id);
};

var deleteEmployee = (id) => {
    let endpoint = 'employees' + '/' + id;
    let url = host + endpoint;
    let authDataJson = localStorage.getItem('authData');

    if (authDataJson === null) {
        alert('Nem vagy bejelentkezve!')
        return;
    }    
    
    let authData = JSON.parse(authDataJson);
    let token = authData.token;

    $.ajax({
        type: 'delete',
        url: url,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .done((res) => {
        console.log(res);
        getEmployees();
    });
};

var editEmployee = (employee) => {
    $('#editPanel').fadeIn(400);
    $('#editedId').val(employee.id);
    $('#editedName').val(employee.name);
    $('#editedCity').val(employee.city);
    $('#editedSalary').val(employee.salary);
}

editSaveButton.addEventListener('click', () => {
    let employee = {     
        id: $('#editedId').val(),   
        name: $('#editedName').val(),
        city: $('#editedCity').val(),
        salary: $('#editedSalary').val()
    }
    updateEmployee(employee);
    $('#editPanel').fadeOut(400);
});

var updateEmployee = (employee) => {
    let endpoint = 'employees' + '/' + employee.id;
    let url = host + endpoint;
    let authDataJson = localStorage.getItem('authData');

    if (authDataJson === null) {
        alert('Nem vagy bejelentkezve!')
        return;
    }

    let authData = JSON.parse(authDataJson);
    let token = authData.token;



    $.ajax({
        type: 'put',
        url: url,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: employee
    })
    .done((res) => {
        console.log(res);
        getEmployees();
    });
}

editCancelButton.addEventListener('click', () => {
    $('#editPanel').fadeOut(400);
});

newCancelButton.addEventListener('click', () => {
    $('#addPanel').fadeOut(400);
});

getEmployees();