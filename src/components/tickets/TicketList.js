import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./tickets.css"

export const TicketList = ({ searchTermState }) => {
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFiltered] = useState([])
    const [emergency, setEmergency] = useState(false)
    const [openOnly, updateOpenOnly] = useState(false)
    const navigate = useNavigate()
//local honey user gets the honey_user string from login.js, which points to the users/email section and gets the id and isStaff objects
    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    useEffect(
        () => {
            const searchedTickets = tickets.filter(ticket => {
                return ticket.description.toLowerCase().startsWith(searchTermState.toLowerCase())
            })
            setFiltered(searchedTickets)
        },
        [ searchTermState ]
    )

    // This is what goes into the json file, goes to service tickets and assigns the value to tickets on line 6. The value is everything in servicetickets
    useEffect(
        () => {
            fetch(`http://localhost:8088/serviceTickets`)
            .then(response => response.json())
            .then((ticketArray) => {
              setTickets(ticketArray)
            })
        },
        [] // When this array is empty, you are observing initial component state
    )


    // This line filters through the tickets, and applies the emergency true tickets to filteredTickets, otherwise just add it to tickets
    useEffect(
        () => {
            if (emergency) {
               const emergencyTickets = tickets.filter(ticket => ticket.emergency === true)
               setFiltered(emergencyTickets)
            }
            else {
                setFiltered(tickets)
            }
        },
        [emergency]
    )

    //If an employee is signed in, the button returns all tickets. If it is a customer, it matches the userId to the users/id and returns only tickets that match
    useEffect(
        () => {
        if (honeyUserObject.staff) {
            // For employees
            setFiltered(tickets)
        }
        else {
            // For customers
            const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
            setFiltered(myTickets)
        }
    },
    [tickets]
    )

//This goes through the tickets array, matches the id to the userId and returns the ticket if the dateCompleted field is empty. If that field has a value it returns the ticket
    useEffect(
        () => {
            if (openOnly) {
            const openTicketArray = tickets.filter(ticket => {
                return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""
            })
            setFiltered(openTicketArray)
        }
        else {
            const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
            setFiltered(myTickets)
        }
    },
    [openOnly]
)

//Below, when the emergency buttons are clicked, it sets the set Emergency state to true and shows only emergency tickets. Or sets it to false and shows all tickets. Or when viewed by a customer, it sets openOnly tickets to true and shows open tickets, false and shows all or you can use the react navigate function to create a ticket
    return <>
    {
        honeyUserObject.staff
        ? <> 
        <button onClick={ () => {setEmergency(true) } } >Emergency Only</button>
        <button onClick={ () => {setEmergency(false) } } >Show All</button>
        </>
        :<>
         <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
         <button onClick={() => updateOpenOnly(true)}>Open Tickets</button>
         <button onClick={() => updateOpenOnly(false)}>All Tickets</button>
        </>
    }
    <h2>List of Tickets</h2>

    <article className="tickets">
        {
          filteredTickets.map(
            (ticket) => {
              return <section className="ticket">
                <header>{ticket.description}</header>
                <footer>Emergency: {ticket.emergency ? "❗" : "No" }</footer>
              </section>
            }
          )
        }
      </article>
    </>
}

