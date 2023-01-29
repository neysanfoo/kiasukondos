import Tabs from "../components/Tabs"

function Dashboard() {
    return(
        <div className="container mt-4">
            <div className="row">
                <div className="col-3">
                    <h1>Dashboard</h1>
                </div>
                <div className="col-9">
                    <Tabs />
                </div>

           
            </div>
        </div>

    )
}

export default Dashboard