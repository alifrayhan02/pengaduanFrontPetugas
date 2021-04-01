import React from "react"
import { Link } from "react-router-dom"
class Navbar extends React.Component {
    Logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("petugas")
        window.location = "/login"
    }

    render() {
        return (
            <div className="navbar navbar-expand-lg bg-dark navbar-dark"  style={{paddingRight: "100px",paddingLeft: "100px"}}>
                <a className="navbar-brand" >
                    Website Aduan Masyarakat
                </a>

                {/* show and hide menu */}
                <button className="navbar-toggler" data-toggle="collapse"
                    data-target="#menu">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* menu */}
                <div id="menu" className="navbar-collapse collpase">
                    <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                            <Link to="/validation" className="nav-link">
                                Validation
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Pengaduan
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/tanggapan" className="nav-link">
                                Tanggapan
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/laporan" className="nav-link">
                                Laporan
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/petugas" className="nav-link">
                                Petugas
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/masyarakat" className="nav-link">
                                Masyarakat
                            </Link>
                        </li>
                    </ul>
                    <form class="form-inline my-2 my-lg-0">
                        <button class="btn btn-outline-danger my-2 my-sm-0 btn-sm" type="submit">
                            <Link className="nav-link active text-white" onClick={() => this.Logout()}>
                                Logout
                            </Link>
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}
export default Navbar;