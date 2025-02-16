const priceElement = document.getElementById('price');
const cryptoSelect = document.getElementById('cryptoSelect');
const halvingTimer = document.getElementById('halving-timer');
const music = document.getElementById('bg-music');
const toggleMusicBtn = document.getElementById('toggleMusic');
const alertInput = document.getElementById('alertPrice');
const setAlertBtn = document.getElementById('setAlert');

let alertPrice = null;
let chart;

// Ativa/Desativa música
toggleMusicBtn.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        toggleMusicBtn.innerText = "🔇 Música";
    } else {
        music.pause();
        toggleMusicBtn.innerText = "🎵 Música";
    }
});

// Define alerta de preço
setAlertBtn.addEventListener("click", () => {
    alertPrice = parseFloat(alertInput.value);
    alert(`Alerta configurado para $${alertPrice}`);
});

// Atualiza preço da criptomoeda
async function updatePrice() {
    const crypto = cryptoSelect.value;
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`);
    const data = await response.json();
    const price = data[crypto].usd;
    priceElement.innerHTML = `$${price.toLocaleString()}`;

    // Toca alerta se atingir o valor definido
    if (alertPrice !== null && price >= alertPrice) {
        alert(`🚨 O preço de ${crypto} atingiu $${price}!`);
        new Audio('alert.mp3').play();
        alertPrice = null; // Reseta alerta após ativação
    }

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

// Inicializa gráfico
function initChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Preço',
                data: [],
                borderColor: 'cyan',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                x: { display: false },
                y: { beginAtZero: false }
            }
        }
    });
}

// Atualiza gráfico com novo preço
function updateChart(price) {
    const maxPoints = 20;
    const time = new Date().toLocaleTimeString();
    
    if (chart.data.labels.length >= maxPoints) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(price);
    chart.update();
}

// Parallax 3D no fundo
document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX / window.innerWidth) * 20 - 10;
    const moveY = (e.clientY / window.innerHeight) * 20 - 10;
    document.querySelector(".overlay").style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// Inicia funções
cryptoSelect.addEventListener("change", updatePrice);
setInterval(updatePrice, 10000);
setInterval(updateHalvingCountdown, 60000);

updatePrice();
updateHalvingCountdown();
initChart();
