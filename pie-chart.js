"use strict";

//////////////////////////
// CHART.JS VARIABLES: //
////////////////////////

const chartContext = document.getElementById("budgetary-pie");
var chartData = {
    datasets: [{
        label: '',
        data: [20, 15, 10, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1],
        backgroundColor: [
            '#9c90c5BF',
            '#578f9c80',
            '#ca852980',
            '#2ebdbc80',
            '#f6c41480',
            '#18479b80',
            '#b8409780',
            '#5b455cB3',
            '#4da9b980',
            '#21aa3480',
            '#f6c41480',
            '#d0121280'
        ],
        hoverBackgroundColor: [
            '#9c90c5',
            '#578f9c',
            '#ca8529',
            '#2ebdbc',
            '#f6c414',
            '#18479b',
            '#b84097',
            '#5b455c',
            '#4da9b9',
            '#21aa34',
            '#f6c414',
            '#d01212'
        ],
        borderWidth: 1,
        borderAlign: 'outer',
        borderColor: '#e6e6e6'
    }],
    labels: [
        'TV',
        'SEO',
        'Pay for Performance',
        'Google PPC',
        'Radio',
        'Facebook',
        'Instagram',
        'TV Production',
        'Website',
        'Nextdoor',
        'Social Media',
        'Yelp'
    ]
};
var options = {
    legend: {
        display: false
    },
    animation: {
        animateScale: true
    },
    tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                var label = data.labels[tooltipItem.index] || '';
                if (label) {
                    label += ": " + data.datasets[0].data[tooltipItem.index].toFixed(1) + "%";
                }
                return label;
            }
        }
    }
};
var budgetaryPie = new Chart(chartContext, {
    type: 'pie',
    data: chartData,
    options: options
});

/////////////////////////////////////
var sliders = document.getElementsByClassName('slider-container');
var lockButtons = document.getElementsByClassName("unlock");
////////////////////////////////////

function revalueSliders(isDisabled, sliderValues, currentSlider) {
    let tempValues = sliderValues;
    let nonZeroSliders = 0;
    for (let val in tempValues) {
        (tempValues[val] > 0 && isDisabled[val] == false) ? nonZeroSliders++ : '';
    }
    if ((tempValues[currentSlider] <= 0 && nonZeroSliders >= 1)) {
        return;
    }
    let subtractFromEach = (tempValues.reduce((a, b) => a + b, 0) - 100) / (nonZeroSliders - 1);

    for (let value in tempValues) {
        if (isDisabled[value] == false && (value != currentSlider && tempValues[value] > 0)) {
            tempValues[value] -= subtractFromEach;
        } else if (isDisabled[value] == false && value != currentSlider) {
            tempValues[value] = 0;
        }
    }
    if (tempValues.reduce((a, b) => a + b, 0) != 100 && sliderValues[currentSlider] > 0) {
        while (tempValues.reduce((a, b) => a + b, 0) > 100) {
            sliderValues[currentSlider]--;
        }
        return sliderValues;
    }
    return tempValues;
}

function updateSliderValues(sliderValues) {
    for (let slider in sliders) {
        if (parseInt(slider) < sliders.length) {
            let newValue = (sliderValues[slider] > 0) ? sliderValues[slider] : 0;
            sliders[slider].children[0].value = newValue;
            sliders[slider].children[1].innerText = Math.floor(newValue).toString().substring(0, 3) + "%";
        }
    }
}

function getDisabledInputsList() {
    let disabledList = [];
    for (let index in sliders) {
        disabledList.push((index < sliders.length && sliders[index].children[0].getAttribute("disabled")) ? true : false);
    }
    return disabledList;
}

function updateChartData(value, currentSlider) {
    let sliderValues = budgetaryPie.data.datasets[0].data;
    let tempValues = sliderValues;
    let isDisabled = getDisabledInputsList();
    let num = 0;
    let numLocked = 1;
    for (let val in sliderValues) {
        (sliderValues[val] >= 1) ? num++ : '';
        (isDisabled[val] == true) ? numLocked++ : '';
    }
    if (num <= numLocked && isDisabled.indexOf(true) != -1 && sliderValues[currentSlider] > 0) {
        for (let i = 0; i < sliders.length; i++) {
            sliders[i].children[0].value = tempValues[i];
        }
        return;
    }
    sliderValues[currentSlider] = parseInt(value);
    sliderValues = revalueSliders(isDisabled, tempValues, currentSlider);
    updateSliderValues(tempValues);
    budgetaryPie.update();
}

const lockIcon = `
    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M224 420c-11 0-20-9-20-20v-64c0-11 9-20 20-20s20 9 20 20v64c0 11-9 20-20 20zm224-148v192c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48h16v-64C64 71.6 136-.3 224.5 0 312.9.3 384 73.1 384 161.5V224h16c26.5 0 48 21.5 48 48zM96 224h256v-64c0-70.6-57.4-128-128-128S96 89.4 96 160v64zm320 240V272c0-8.8-7.2-16-16-16H48c-8.8 0-16 7.2-16 16v192c0 8.8 7.2 16 16 16h352c8.8 0 16-7.2 16-16z" class=""></path>
    </svg>
`;
const unlockIcon = `
    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path fill="currentColor" d="M227 417c-11 0-20-9-20-20v-64c0-11 9-20 20-20s20 9 20 20v64c0 11-9 20-20 20zM480.5 0C392-.3 320 71.6 320 160v64H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48h-48v-62.6c0-70.7 56.7-129 127.3-129.4C550.2 31.6 608 89.2 608 160v84c0 6.6 5.4 12 12 12h8c6.6 0 12-5.4 12-12v-82.5C640 73.1 568.9.3 480.5 0zM400 256c8.8 0 16 7.2 16 16v192c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h352z" class=""></path>
    </svg>
`;

function toggleLock(btn) {
    btn.classList.toggle("lock");
    if (btn.classList.contains("lock")) {
        btn.innerHTML = lockIcon;
        btn.parentElement.children[0].setAttribute("disabled", "disabled");
    } else {
        btn.innerHTML = unlockIcon;
        btn.parentElement.children[0].removeAttribute("disabled");
    }
}

////////////////////////
// ONLOAD FUNCTIONS: //
//////////////////////

(function() {
    for (let input in sliders) {
        if (parseInt(input) < sliders.length) {
            sliders[input].children[0].addEventListener("input", function() {
                updateChartData(this.value, input);
            });
        }
    };
    for (let lock in lockButtons) {
        if (parseInt(lock) < lockButtons.length) {
            lockButtons[lock].addEventListener("click", function() {
                toggleLock(this);
            })
        }
    };
    updateSliderValues(budgetaryPie.data.datasets[0].data);
})();