import { useEffect, useState } from "react"

export const CustomerList = () => {
    const [customers, setCustomers] = useState([])

    useEffect(
        () => {
                fetch(`http://localhost:8088/customers?_expand=user`)
                .then(response => response.json())
                .then((customerArray) => {
                    setCustomers(customerArray)
                })
        },
        []
    )

    return <article className="employees">
    {
        customers.map
        ((customer) => {
            return <section className="customer" key={`customer--${customer.id}`}>
                <div>Name: {customer.user.fullName}</div>
                <div>Email: {customer.user.email}</div>
                <div>Address: {customer.address}</div>
                <div>Phone: {customer.phoneNumber}</div>
            </section>
        })
    }
    </article>
}