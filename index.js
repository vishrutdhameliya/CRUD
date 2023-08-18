let fild = document.querySelectorAll('.text');
let arr = (JSON.parse(localStorage.getItem('array'))) ? JSON.parse(localStorage.getItem('array')) : [];
let id = (JSON.parse(localStorage.getItem('id'))) ? JSON.parse(localStorage.getItem('id')) : 0;
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
let obj = {};
async function save() {

    let file = document.querySelector('#myfile').files[0]
    obj['file'] = await toBase64(file);

    fild.forEach((x) => {
        obj[x.name] = x.value;
    })

    obj["gender"] = document.querySelector("[name=gender]:checked").value

    let hobbie = []
    let hobby = document.querySelectorAll('.hobby:checked');
    hobby.forEach((x) => {
        hobbie.push(x.value);

    })
    obj["hobbies"] = hobbie.join();

    if (obj.id) {
        let idd = arr.findIndex((x) => x.id === obj.id);
        arr.splice(idd, 1, obj);
    }
    else {
        obj["id"] = ++id;

        arr.push(obj)
    }
    localStorage.setItem('array', JSON.stringify(arr));
    localStorage.setItem('id', JSON.stringify(id));
    obj = {}
    prints();
    document.querySelector("#form").reset()
}
function prints() {
    let str = ""
    arr.map((x) => {
        x.date = (new Date(x.date).toLocaleDateString('en-GB'))
        return str += `
            <tr>
                <td>${x.id}</td>
                <td>${x.fname}</td>
                <td>${x.lname}</td>
                <td>${x.email}</td>
                <td>${x.number}</td>
                <td>${x.date}</td>
                <td>${x.hobbies}</td>
                <td>${x.gender}</td>
                <td>
                <img src="${x.file}" style = "height : 60px; width : 60px" id="img" alt="">
                </td>
                <td>
              <button type="button" class="btn btn-primary" onclick="edit(${x.id})">Edit</button>
              <button type="button" class="btn btn-primary" onclick="delet(${x.id})">Delete</button>                
                </td>
            </tr>
        `
    })
    document.querySelector('#tbody').innerHTML = str;
}
function delet(o) {







    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            arr = arr.filter((x) => x.id != o)
            prints();
            swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            )
        }
    })





}
function edit(z) {
    obj = arr.find((x) => x.id == z)
    Object.keys(obj).map((key) => {

        if (key == "gender") {
            document.querySelector(`[name=gender][value = ${obj[key]}]`).checked = true
        }
        else if (key == "hobbies") {
            obj[key] = obj[key].split(',');
            obj[key].map((x) => {
                document.querySelector(`.hobby[value = ${x}]`).checked = true;
            })
        }
        else {
            fild.forEach((x) => {
                if (x.name == key) {
                    x.value = obj[key];
                }
            })
        }
    })
}
prints();