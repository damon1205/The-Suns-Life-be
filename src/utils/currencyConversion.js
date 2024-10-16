
function currencyConversion(payCurrency = "GBP", payAmount = 0, payCurrencyRate = 1) {
	let convertedAmt = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: payCurrency || "GBP",
        minimumFractionDigits: 0
    }).format(Number(payAmount * payCurrencyRate).toFixed(2) || 0)
    let amt = convertedAmt.match(/[\d\.\,]+/g)

    let withSpace= convertedAmt.replace(amt, ` ${amt}`)

    return withSpace
}

function currencySymbol(payCurrency = "GBP") {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: payCurrency || "GBP",
		minimumFractionDigits: 0
	});

	// Extract the currency symbol by formatting zero and removing the "0"
	const formattedCurrency = formatter.format(0).replace(/\d/g, '').trim();
	return formattedCurrency;
}

module.exports = {
	currencyConversion,
	currencySymbol
}