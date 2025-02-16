const priceElement = document.getElementById('price');
const cryptoSelect = document.getElementById('cryptoSelect');
const halvingTimer = document.getElementById('halving-timer');
let chart;

// Inicializa gráfico
function initChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Preço USD',
                data: [],
                borderColor: 'cyan',
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                pointBackgroundColor: 'lime',
            }]
        },
        options: {
            animation: {
                duration: 1000
            },
            scales: {
                x: { display: false },
                y: { beginAtZero: false }
            }
        }
    });
}

// Atualiza gráfico com novo preço
function updateChart(price) {
    const maxPoints = 30;
    const time = new Date().toLocaleTimeString();

    if (chart.data.labels.length >= maxPoints) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(price);
    chart.update();
}

// Atualiza preço da criptomoeda
async function updatePrice() {
    const crypto = cryptoSelect.value;
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`);
    const data = await response.json();
    const price = data[crypto].usd;
    priceElement.innerHTML = `$${price.toLocaleString()}`;
    updateChart(price);
}

// Atualiza contagem para o halving
function updateHalvingCountdown() {
    const halvingDate = new Date("2028-04-20T00:00:00Z");
    const now = new Date();
    const diff = halvingDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    halvingTimer.innerHTML = `${days} dias restantes`;
}

// Parallax 3D no fundo
document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX / window.innerWidth) * 20 - 10;
    const moveY = (e.clientY / window.innerHeight) * 20 - 10;
    document.querySelector(".overlay").style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// Atualizações automáticas
cryptoSelect.addEventListener("change", updatePrice);
setInterval(updatePrice, 10000);
setInterval(updateHalvingCountdown, 60000);

updatePrice();
updateHalvingCountdown();
initChart();
