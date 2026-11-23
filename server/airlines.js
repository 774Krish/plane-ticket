// Airline name -> official website URL (used for "Book on airline site" links).
// Falls back to the flight's Google Flights URL when no match.

const AIRLINE_URLS = {
  'vueling': 'https://www.vueling.com',
  'tap air portugal': 'https://www.flytap.com',
  'tap portugal': 'https://www.flytap.com',
  'easyjet': 'https://www.easyjet.com',
  'ryanair': 'https://www.ryanair.com',
  'british airways': 'https://www.britishairways.com',
  'air france': 'https://www.airfrance.com',
  'klm': 'https://www.klm.com',
  'klm royal dutch airlines': 'https://www.klm.com',
  'lufthansa': 'https://www.lufthansa.com',
  'emirates': 'https://www.emirates.com',
  'qatar airways': 'https://www.qatarairways.com',
  'turkish airlines': 'https://www.turkishairlines.com',
  'etihad airways': 'https://www.etihad.com',
  'etihad': 'https://www.etihad.com',
  'singapore airlines': 'https://www.singaporeair.com',
  'cathay pacific': 'https://www.cathaypacific.com',
  'delta air lines': 'https://www.delta.com',
  'delta': 'https://www.delta.com',
  'american airlines': 'https://www.aa.com',
  'united airlines': 'https://www.united.com',
  'jetblue': 'https://www.jetblue.com',
  'alaska airlines': 'https://www.alaskaair.com',
  'southwest airlines': 'https://www.southwest.com',
  'air canada': 'https://www.aircanada.com',
  'aer lingus': 'https://www.aerlingus.com',
  'iberia': 'https://www.iberia.com',
  'ita airways': 'https://www.ita-airways.com',
  'swiss': 'https://www.swiss.com',
  'swiss international air lines': 'https://www.swiss.com',
  'austrian airlines': 'https://www.austrian.com',
  'brussels airlines': 'https://www.brusselsairlines.com',
  'sas': 'https://www.flysas.com',
  'scandinavian airlines': 'https://www.flysas.com',
  'norwegian': 'https://www.norwegian.com',
  'norwegian air shuttle': 'https://www.norwegian.com',
  'finnair': 'https://www.finnair.com',
  'lot polish airlines': 'https://www.lot.com',
  'aegean airlines': 'https://en.aegeanair.com',
  'wizz air': 'https://wizzair.com',
  'pegasus airlines': 'https://www.flypgs.com',
  'indigo': 'https://www.goindigo.in',
  'air india': 'https://www.airindia.com',
  'ana': 'https://www.ana.co.jp',
  'all nippon airways': 'https://www.ana.co.jp',
  'japan airlines': 'https://www.jal.co.jp',
  'korean air': 'https://www.koreanair.com',
  'asiana airlines': 'https://flyasiana.com',
  'qantas': 'https://www.qantas.com',
  'virgin atlantic': 'https://www.virginatlantic.com',
  'virgin australia': 'https://www.virginaustralia.com',
  'air new zealand': 'https://www.airnewzealand.com',
  'latam airlines': 'https://www.latamairlines.com',
  'avianca': 'https://www.avianca.com',
  'copa airlines': 'https://www.copaair.com',
  'aeromexico': 'https://aeromexico.com',
  'air europa': 'https://www.aireuropa.com',
  'eurowings': 'https://www.eurowings.com',
  'transavia': 'https://www.transavia.com',
  'flydubai': 'https://www.flydubai.com',
  'air arabia': 'https://www.airarabia.com',
  'scoot': 'https://www.flyscoot.com',
  'airasia': 'https://www.airasia.com',
  'jetstar': 'https://www.jetstar.com',
  'frontier airlines': 'https://www.flyfrontier.com',
  'spirit airlines': 'https://www.spirit.com',
  'westjet': 'https://www.westjet.com',
  'allegiant air': 'https://www.allegiantair.com',
  'hawaiian airlines': 'https://www.hawaiianairlines.com',
  'jet2': 'https://www.jet2.com',
  'tui': 'https://www.tui.co.uk',
}

export function airlineUrl(name) {
  const key = String(name || '').trim().toLowerCase()
  return AIRLINE_URLS[key] || null
}

// Deep links pre-filled with the route + dates, for airlines that expose a
// stable URL format. Returns null when no known deep-link format exists.
export function airlineDeepLink(name, { origin, destination, departDate, returnDate }) {
  const key = String(name || '').trim().toLowerCase()

  if (key === 'ryanair') {
    const params = new URLSearchParams({
      adults: '1',
      teens: '0',
      children: '0',
      infants: '0',
      dateOut: departDate || '',
      dateIn: returnDate || '',
      isConnectedFlight: 'false',
      isReturn: returnDate ? 'true' : 'false',
      discount: '0',
      promoCode: '',
      originIata: origin,
      destinationIata: destination,
    })
    return `https://www.ryanair.com/gb/en/trip/flights/select?${params.toString()}`
  }

  if (key === 'wizz air') {
    let url = `https://wizzair.com/en-gb/booking/select-flight/${origin}/${destination}/${departDate}`
    if (returnDate) url += `/${returnDate}`
    return url
  }

  return null
}
