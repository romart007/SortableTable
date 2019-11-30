const table = document.querySelector("table");
const tbody = document.createElement("tbody");
const errorMsg = document.querySelector(".error");
const spinner = document.querySelector(".lds-roller");

var page = 1;

class UI {
    fetchData() {
        const API_URL = "https://api.punkapi.com/v2/beers";
        spinner.removeAttribute('hidden');
        fetch(API_URL + `?page=` + `${page}`)
            .then(response => {
                response
                    .json()
                    .then(beers => {
                        tbody.innerHTML = this.displayBeers(beers);
                        table.appendChild(tbody);
                        errorMsg.setAttribute('hidden', '');
                        spinner.setAttribute('hidden', '');
                        return beers;
                    })
            })
            .catch(error => {
                errorMsg.removeAttribute('hidden');
                errorMsg.textContent = `Sorry, we're unable to display data...`;

            })
            .finally(() => {
                // add success
            });
    }

    displayBeers(beers) {
        return beers
            .map(beer => {
                let newdesc = this.truncate(`${beer.description}`);
                return `<tr>
                <td>${beer.name} <img src="${beer.image_url}"></td>
                <td>${beer.tagline}</td>
                <td>${newdesc}</td>
                <td>${beer.abv}</td>
            </tr>`;
            })
            .join("\n");
    }

    truncate(str, length, ending) {
        if (length == null) {
            length = 80;
        }
        if (ending == null) {
            ending = "...";
        }
        if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
        } else {
            return str;
        }
    }
}

const display = new UI();
display.fetchData();


const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

// do the work...
const tHead = document.querySelector('thead');
tHead.querySelectorAll('th').forEach(th => th.addEventListener('click', ((el) => {
    const table = th.closest('table');
    const tBody = table.querySelector('tbody');
    Array.from(table.querySelectorAll('tbody tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => tBody.appendChild(tr));

    if (el.target.tagName == 'TH') {
        const i = Array.prototype.slice.call(el.target.children)[0];
        console.log(i)
        i.classList.toggle("down");
    }
})));