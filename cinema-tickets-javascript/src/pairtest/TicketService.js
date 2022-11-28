const TicketTypeRequest = require('./lib/TicketTypeRequest.js')
const InvalidPurchaseException = require('./lib/InvalidPurchaseException.js')
const TicketPaymentService = require('../thirdparty/paymentgateway/TicketPaymentService')
const SeatReservationService = require('../thirdparty/seatbooking/SeatReservationService')

module.exports = class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    let adultCost = 0
    let adultSeatCount = 0
    let childCost = 0
    let childSeatCount = 0
    let infantCount = 0

    for (let i = 0; i < ticketTypeRequests.length; i++) {
      if(ticketTypeRequests[i].getTicketType() == 'ADULT') {
        adultCost += 20*ticketTypeRequests[i].getNoOfTickets()
        adultSeatCount += ticketTypeRequests[i].getNoOfTickets()
      } else if(ticketTypeRequests[i].getTicketType() == 'CHILD') {
        childCost += 10*ticketTypeRequests[i].getNoOfTickets()
        childSeatCount += ticketTypeRequests[i].getNoOfTickets()
      } else if(ticketTypeRequests[i].getTicketType() == 'INFANT') {
        infantCount += ticketTypeRequests[i].getNoOfTickets()
      }
    }

    let totalCost = adultCost + childCost
    let totalSeatCount = adultSeatCount + childSeatCount

    this.#invalidPurchaseCheck(accountId, adultSeatCount, childSeatCount, infantCount)
    this.#sendPayment(accountId, totalCost)
    this.#seatReservtion(accountId, totalSeatCount)

    return `Reserved ${totalSeatCount} seat(s) for £${totalCost}`
  }

#sendPayment(accountId, totalAmount) {
  const payment = new TicketPaymentService()
  payment.makePayment(accountId, totalAmount)
}

#seatReservtion(accountId, seatCount) {
  const seatReserve = new SeatReservationService()
  seatReserve.reserveSeat(accountId, seatCount)
}

#invalidPurchaseCheck(accountId, adultSeatCount, childSeatCount, infantSeatCount){
  const errorChecks = new InvalidPurchaseException()
  errorChecks.makeErrorCheck(accountId, adultSeatCount, childSeatCount, infantSeatCount)
}

}
