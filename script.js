const priceElement = document.getElementById('price');
const cryptoSelect = document.getElementById('cryptoSelect');
const halvingTimer = document.getElementById('halving-timer');
let chart;

// Inicializa gráfico de velas
function initChart() {
    const ctx = document.getElementById('candlestickChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: 'Preço USD',
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
                    type: 'time',
                    time: { unit: 'minute' },
                    display: false
                },
                y: { beginAtZero: false }
            }
        }
    });
}

// Função para buscar dados do preço
async function fetchCryptoData() {
    const crypto = cryptoSelect.value;
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=1&interval=minute`);
    const data = await response.json();
    
    const prices = data.prices.map(p => ({
        t: p[0],
        o: p[1] * 0.98, // Open
        h: p[1] * 1.02, // High
        l: p[1] * 0.96, // Low
        c: p[1] // Close
    }));

    updateChart(prices);
    priceElement.innerHTML = `$${prices[prices.length - 1].c.toFixed(2)}`;
}

// Atualiza gráfico com novos dados
function updateChart(data) {
    chart.data.datasets[0].data = data;
    chart.update();
}

// Atualiza contagem regressiva para o halving do Bitcoin
function updateHalvingCountdown() {
    const halvingDate = new Date("2028-04-20T00:00:00Z");
    const now = new Date();
    const diff = halvingDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    halvingTimer.innerHTML = `${days} dias restantes`;
}

// Muda a cor do fundo conforme a criptomoeda escolhida
function changeBackgroundColor() {
    const crypto = cryptoSelect.value;
    document.body.className = crypto;
}

// Efeito Parallax no fundo
document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX / window.innerWidth) * 20 - 10;
    const moveY = (e.clientY / window.innerHeight) * 20 - 10;
    document.querySelector(".overlay").style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// Atualizações automáticas
cryptoSelect.addEventListener("change", fetchCryptoData);
setInterval(fetchCryptoData, 30000);
setInterval(updateHalvingCountdown, 60000);

fetchCryptoData();
updateHalvingCountdown();
initChart();
