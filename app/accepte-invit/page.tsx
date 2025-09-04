import { useParams } from "next/navigation"

export default function AccepteInvitPage() {
    const { id } = useParams()
    return (
        <div>
            <h1>AccepteInvitPage</h1>
            <p>id: {id}</p>
        </div>
    )
}