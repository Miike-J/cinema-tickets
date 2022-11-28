const TicketTypeRequest = require("../src/pairtest/lib/TicketTypeRequest")
const TicketService = require("../src/pairtest/TicketService")

describe('TicketService functionality', () => {
    test('can purchase 1 adult ticket', () => {
        const ticketRequest = new TicketService()
    
        expect(ticketRequest.purchaseTickets(10, new TicketTypeRequest('ADULT', 1))).toEqual(`Reserved 1 seat(s) for £20`)
    })
    test('can purchase 1 adult and 1 child ticket', () => {
        const ticketRequest = new TicketService()

        expect(ticketRequest.purchaseTickets(10, new TicketTypeRequest('ADULT', 1), new TicketTypeRequest('CHILD', 1))).toEqual('Reserved 2 seat(s) for £30')
    })
    test('can purchase 1 adult, 1 child and 1 infant ticket', () => {
        const ticketRequest = new TicketService()
        
        expect(ticketRequest.purchaseTickets(10, new TicketTypeRequest('ADULT', 1), new TicketTypeRequest('CHILD', 1), new TicketTypeRequest('INFANT', 1))).toEqual('Reserved 2 seat(s) for £30')
    })
    test('can purchase multiple tickets of each type', () => {
        const ticketRequest = new TicketService()
        
        expect(ticketRequest.purchaseTickets(10, new TicketTypeRequest('ADULT', 2), new TicketTypeRequest('CHILD', 2), new TicketTypeRequest('INFANT', 1))).toEqual('Reserved 4 seat(s) for £60')
    })
})

describe('TicketService invalid purchase checks', () => {
    test('if id isnt and integer throws error', () => {
        const ticketRequest = new TicketService()
    
        expect(() => {
            (ticketRequest.purchaseTickets('10', new TicketTypeRequest('ADULT', 1)))
        }).toThrow('accountId must be an integer')
    })
    test('if id less than 0 throws error', () => {
        const ticketRequest = new TicketService()
    
        expect(() => {
            (ticketRequest.purchaseTickets(-10, new TicketTypeRequest('ADULT', 1)))
        }).toThrow('accountId must be an integer greater than 0')
    })
    test('ticket type not ADULT, CHILD or INFANT throws error', () => {
        const ticketRequest = new TicketService()
    
        expect(() => {
            (ticketRequest.purchaseTickets(10, new TicketTypeRequest('DOG', 1)))
        }).toThrow('type must be ADULT, CHILD, or INFANT')
    })
    test('order of more than 20 tickets throws error', () => {
        const ticketRequest = new TicketService()

        expect(() => {
            (ticketRequest.purchaseTickets(10, new TicketTypeRequest('ADULT', 21)))
        }).toThrow('cannot purchase more than 20 tickets')
        expect(() => {
            (ticketRequest.purchaseTickets(10, new TicketTypeRequest('ADULT', 15), new TicketTypeRequest('CHILD', 6)))
        }).toThrow('cannot purchase more than 20 tickets')
    })
    test('order of child or infant tickets without adult ticket throws error', () => {
        const ticketRequest = new TicketService()
        
        expect(() => {
            (ticketRequest.purchaseTickets(10, new TicketTypeRequest('CHILD', 1)))
        }).toThrow('cannot purchase child or infant tickets without adult')
        expect(() => {
            (ticketRequest.purchaseTickets(10, new TicketTypeRequest('INFANT', 1)))
        }).toThrow('cannot purchase child or infant tickets without adult')
        expect(() => {
            (ticketRequest.purchaseTickets(10, new TicketTypeRequest('CHILD', 2), new TicketTypeRequest('INFANT', 3)))
        }).toThrow('cannot purchase child or infant tickets without adult')
    })
    test('more infants than adults throws error as infants must sit on adults lap' , () => {
        const ticketRequest = new TicketService()
    
        expect(() => {
            (ticketRequest.purchaseTickets(10, new TicketTypeRequest('ADULT', 1), new TicketTypeRequest('INFANT', 2)))
        }).toThrow('infants sit on adults lap, must have equal or more adult tickets')
    })
})