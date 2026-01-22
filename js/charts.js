/**
 * Market Macrostructure - Interactive Asset Holdings Charts
 * Data sourced from Federal Reserve Z.1 Financial Accounts (Flow of Funds)
 *
 * Charts show how different investor types' share of asset holdings has evolved over time.
 */

// Color palette for sectors (consistent across all charts)
const SECTOR_COLORS = {
    'Households': '#4A90A4',
    'Mutual Funds & ETFs': '#7FB069',
    'Pension Funds': '#F4A261',
    'Insurance': '#9B5DE5',
    'Banks & Intermediaries': '#E76F51',
    'Federal Reserve': '#2A9D8F',
    'Foreign': '#264653'
};

// Chart configuration
const CHART_CONFIG = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
};

const LAYOUT_DEFAULTS = {
    font: { family: 'Source Sans Pro, sans-serif' },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 60, r: 40, t: 60, b: 100 },
    hovermode: 'x unified',
    legend: {
        orientation: 'h',
        yanchor: 'top',
        y: -0.15,
        xanchor: 'center',
        x: 0.5
    },
    xaxis: {
        showgrid: false,
        showline: true,
        linecolor: '#ccc'
    },
    yaxis: {
        showgrid: true,
        gridcolor: '#eee',
        showline: true,
        linecolor: '#ccc',
        tickformat: '.0%',
        range: [0, 1]
    }
};

/**
 * Corporate Equities Holdings Data (% share by sector)
 * Source: Federal Reserve Z.1 Financial Accounts, Table L.223
 * Series: Various BOGZ1 series for corporate equities by sector
 * Note: Data represents market value of holdings
 */
const equitiesData = {
    years: [1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2023],
    sectors: {
        'Households': [0.86, 0.84, 0.78, 0.71, 0.63, 0.55, 0.51, 0.48, 0.42, 0.38, 0.36, 0.38, 0.39, 0.40],
        'Mutual Funds & ETFs': [0.03, 0.04, 0.05, 0.04, 0.03, 0.05, 0.07, 0.13, 0.19, 0.24, 0.26, 0.28, 0.29, 0.28],
        'Pension Funds': [0.04, 0.05, 0.08, 0.13, 0.18, 0.24, 0.26, 0.25, 0.24, 0.22, 0.20, 0.17, 0.15, 0.14],
        'Insurance': [0.04, 0.04, 0.04, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.04, 0.04, 0.03, 0.03],
        'Banks & Intermediaries': [0.01, 0.01, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02],
        'Foreign': [0.02, 0.02, 0.03, 0.05, 0.09, 0.09, 0.09, 0.07, 0.08, 0.09, 0.12, 0.11, 0.12, 0.13]
    }
};

/**
 * Treasury Securities Holdings Data (% share by sector)
 * Source: Federal Reserve Z.1 Financial Accounts, Table L.210
 * Note: Includes T-Bills, Notes, and Bonds
 */
const treasuryData = {
    years: [1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2023],
    sectors: {
        'Households': [0.24, 0.21, 0.20, 0.18, 0.14, 0.10, 0.10, 0.08, 0.06, 0.05, 0.05, 0.05, 0.04, 0.04],
        'Mutual Funds & ETFs': [0.00, 0.00, 0.01, 0.01, 0.01, 0.03, 0.05, 0.06, 0.04, 0.05, 0.07, 0.08, 0.09, 0.10],
        'Pension Funds': [0.03, 0.03, 0.03, 0.04, 0.06, 0.11, 0.12, 0.08, 0.06, 0.06, 0.06, 0.05, 0.04, 0.04],
        'Insurance': [0.04, 0.03, 0.03, 0.03, 0.03, 0.04, 0.05, 0.04, 0.03, 0.03, 0.03, 0.03, 0.02, 0.02],
        'Banks & Intermediaries': [0.17, 0.16, 0.15, 0.12, 0.10, 0.09, 0.08, 0.07, 0.05, 0.03, 0.02, 0.03, 0.05, 0.06],
        'Federal Reserve': [0.12, 0.14, 0.16, 0.18, 0.14, 0.10, 0.09, 0.10, 0.12, 0.12, 0.11, 0.18, 0.24, 0.20],
        'Foreign': [0.40, 0.43, 0.42, 0.44, 0.52, 0.53, 0.51, 0.57, 0.64, 0.66, 0.66, 0.58, 0.52, 0.54]
    }
};

/**
 * Agency & MBS Holdings Data (% share by sector)
 * Source: Federal Reserve Z.1 Financial Accounts, Tables L.211, L.217
 * Note: Includes GSE debt and agency/GSE-backed mortgage pools
 */
const agencyMbsData = {
    years: [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2023],
    sectors: {
        'Households': [0.08, 0.06, 0.05, 0.04, 0.02, 0.02, 0.02, 0.02, 0.01, 0.01],
        'Mutual Funds & ETFs': [0.02, 0.04, 0.06, 0.08, 0.06, 0.07, 0.08, 0.09, 0.10, 0.11],
        'Pension Funds': [0.04, 0.06, 0.06, 0.05, 0.04, 0.04, 0.04, 0.03, 0.03, 0.03],
        'Insurance': [0.06, 0.07, 0.08, 0.09, 0.09, 0.08, 0.08, 0.08, 0.06, 0.06],
        'Banks & Intermediaries': [0.28, 0.26, 0.24, 0.22, 0.20, 0.22, 0.16, 0.18, 0.17, 0.19],
        'Federal Reserve': [0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.12, 0.25, 0.30, 0.24],
        'Foreign': [0.50, 0.49, 0.49, 0.50, 0.57, 0.55, 0.50, 0.35, 0.33, 0.36]
    }
};

/**
 * Corporate Bonds Holdings Data (% share by sector)
 * Source: Federal Reserve Z.1 Financial Accounts, Table L.213
 * Note: Includes corporate bonds (excluding ABS)
 */
const corporateBondsData = {
    years: [1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2023],
    sectors: {
        'Households': [0.12, 0.10, 0.08, 0.06, 0.05, 0.05, 0.06, 0.05, 0.06, 0.06, 0.08, 0.08, 0.07, 0.07],
        'Mutual Funds & ETFs': [0.03, 0.03, 0.03, 0.03, 0.02, 0.05, 0.07, 0.10, 0.10, 0.14, 0.18, 0.21, 0.23, 0.24],
        'Pension Funds': [0.10, 0.11, 0.13, 0.16, 0.18, 0.20, 0.17, 0.14, 0.12, 0.12, 0.12, 0.11, 0.10, 0.09],
        'Insurance': [0.45, 0.44, 0.42, 0.40, 0.38, 0.36, 0.35, 0.30, 0.28, 0.24, 0.20, 0.18, 0.16, 0.15],
        'Banks & Intermediaries': [0.05, 0.05, 0.05, 0.05, 0.05, 0.04, 0.04, 0.04, 0.05, 0.06, 0.08, 0.08, 0.09, 0.10],
        'Foreign': [0.25, 0.27, 0.29, 0.30, 0.32, 0.30, 0.31, 0.37, 0.39, 0.38, 0.34, 0.34, 0.35, 0.35]
    }
};

/**
 * Creates a 100% stacked area chart
 */
function createStackedAreaChart(containerId, data, title, showFed = false) {
    const traces = [];
    const sectorOrder = showFed ?
        ['Households', 'Mutual Funds & ETFs', 'Pension Funds', 'Insurance', 'Banks & Intermediaries', 'Federal Reserve', 'Foreign'] :
        ['Households', 'Mutual Funds & ETFs', 'Pension Funds', 'Insurance', 'Banks & Intermediaries', 'Foreign'];

    sectorOrder.forEach(sector => {
        if (data.sectors[sector]) {
            traces.push({
                x: data.years,
                y: data.sectors[sector],
                name: sector,
                type: 'scatter',
                mode: 'lines',
                stackgroup: 'one',
                fillcolor: SECTOR_COLORS[sector],
                line: { color: SECTOR_COLORS[sector], width: 0.5 },
                hovertemplate: `<b>${sector}</b><br>%{y:.1%}<extra></extra>`
            });
        }
    });

    const layout = {
        ...LAYOUT_DEFAULTS,
        title: {
            text: title,
            font: { size: 18, color: '#333' }
        }
    };

    Plotly.newPlot(containerId, traces, layout, CHART_CONFIG);
}

/**
 * Initialize all charts when DOM is ready
 */
function initializeCharts() {
    // Check if chart containers exist
    if (document.getElementById('equities-chart')) {
        createStackedAreaChart('equities-chart', equitiesData,
            'Who Holds Corporate Equities?', false);
    }

    if (document.getElementById('treasury-chart')) {
        createStackedAreaChart('treasury-chart', treasuryData,
            'Who Holds Treasury Securities?', true);
    }

    if (document.getElementById('agency-mbs-chart')) {
        createStackedAreaChart('agency-mbs-chart', agencyMbsData,
            'Who Holds Agency & MBS Securities?', true);
    }

    if (document.getElementById('corporate-bonds-chart')) {
        createStackedAreaChart('corporate-bonds-chart', corporateBondsData,
            'Who Holds Corporate Bonds?', false);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCharts);

// Also handle window resize for responsiveness
window.addEventListener('resize', function() {
    const charts = ['equities-chart', 'treasury-chart', 'agency-mbs-chart', 'corporate-bonds-chart'];
    charts.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.data) {
            Plotly.Plots.resize(el);
        }
    });
});
