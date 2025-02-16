const priceElement = document.getElementById('price');
const cryptoSelect = document.getElementById('cryptoSelect');
const halvingTimer = document.getElementById('halving-timer');
let chart;

// Inicializa o gráfico de velas
function initChart() {
    const ctx = document.getElementById('candlestickChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: 'Preço em USD',
                data: [],
                borderColor: 'cyan',
                borderWidth: 1,
                color: {
                    up: 'green',
                    down: 'red',
                    unchanged: 'gray'
                }
            }]
        },
        options: {
            scales: {
                x: {
                    type: '36
