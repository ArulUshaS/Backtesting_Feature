document.getElementById('startBacktest').addEventListener('click', startBacktest);

let initialBalance = 1000;
let currentBalance = initialBalance;
let totalTrades = 0;
let profitLoss = 0;
let priceData = [];
let chart;

function generateRandomData() {
    priceData = [];
    let price = 100;  // starting price
    for (let i = 0; i < 100; i++) {
        price += (Math.random() - 0.5) * 2;  // random fluctuation
        price = Math.max(price, 1);  // prevent price from going negative
        priceData.push(price.toFixed(2));
    }
}

function startBacktest() {
    generateRandomData();
    simulateTradingStrategy();
}

function simulateTradingStrategy() {
    currentBalance = initialBalance;
    totalTrades = 0;
    profitLoss = 0;

    for (let i = 1; i < priceData.length; i++) {
        let prevPrice = parseFloat(priceData[i - 1]);
        let currentPrice = parseFloat(priceData[i]);

        if (currentPrice > prevPrice) {
            // Buy (simple strategy: buy when the price goes up)
            currentBalance -= prevPrice;  // spend money to buy at the previous price
            profitLoss -= prevPrice;
            totalTrades++;
        } else if (currentPrice < prevPrice) {
            // Sell (simple strategy: sell when the price goes down)
            currentBalance += prevPrice;  // sell at the previous price
            profitLoss += prevPrice;
            totalTrades++;
        }
    }

    // Update performance stats
    updateStats();
    plotChart();
}

function updateStats() {
    document.getElementById('profitLoss').textContent = `Profit/Loss: $${profitLoss.toFixed(2)}`;
    document.getElementById('totalTrades').textContent = `Total Trades: ${totalTrades}`;
    document.getElementById('finalBalance').textContent = `Final Balance: $${currentBalance.toFixed(2)}`;
}

function plotChart() {
    if (chart) chart.destroy();  // Destroy previous chart if it exists

    const ctx = document.getElementById('priceChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: priceData.length }, (_, i) => i + 1),
            datasets: [{
                label: 'Price',
                data: priceData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { 
                    title: { display: true, text: 'Time' } 
                },
                y: { 
                    title: { display: true, text: 'Price' },
                    min: Math.min(...priceData) - 5, 
                    max: Math.max(...priceData) + 5
                }
            }
        }
    });
}
