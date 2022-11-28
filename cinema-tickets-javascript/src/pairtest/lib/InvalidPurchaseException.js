module.exports = class InvalidPurchaseException extends Error {
    makeErrorCheck(accountId, adultSeatCount, childSeatCount, infantSeatCount) {
        if(accountId < 0) {
            throw new TypeError('accountId must be an integer greater than 0')
        }

        if(adultSeatCount + childSeatCount > 20) {
            throw new TypeError('cannot purchase more than 20 tickets')
        }

        if(adultSeatCount == 0 && childSeatCount+infantSeatCount > 0) {
            throw new TypeError('cannot purchase child or infant tickets without adult')
        }
        if(adultSeatCount < infantSeatCount) {
            throw new TypeError('infants sit on adults lap, must have equal or more adult tickets')
        }
    }
}
