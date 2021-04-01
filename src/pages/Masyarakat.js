import React from "react"
import Navbar from "../components/Navbar"
import NavbarPTG from "../components/NavbarPTG"
// import CustomerList from "../components/CustomerList";
import { base_url } from "../config.js";
import $ from "jquery"
import axios from "axios"


export default class Masyarakat extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            action: "",
            masyarakats: [],
            nik: "",
            name: "",
            username: "",
            password: "",
            telp: "",
            fillPassword: true,
            fillNik: true
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
    }

    getMasyarakat = () => {
        let url = base_url + "/masyarakat"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ masyarakats: response.data })
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status) {
                        window.alert(error.response.data.message)
                        this.props.history.push("/login")
                    }
                } else {
                    console.log(error);
                }
            })
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    componentDidMount() {
        this.getMasyarakat()
        this.initPetugas()
    }

    Add = () => {
        $("#modal_masyarakat").modal("show")
        this.setState({
            action: "insert",
            nik: "",
            name: "",
            username: "",
            password: "",
            telp: "",
            fillPassword: true,
            fillNik: true,
        })
    }

    Edit = selectedItem => {
        $("#modal_masyarakat").modal("show")
        this.setState({
            action: "update",
            nik: selectedItem.nik,
            name: selectedItem.name,
            username: selectedItem.username,
            password: "",
            telp: selectedItem.telp,
            fillPassword: false,
            fillNik: false,
        })
    }

    saveMasyarakat = event => {
        event.preventDefault()
        $("#modal_masyarakat").modal("hide")
        let form = {
            nik: this.state.nik,
            name: this.state.name,
            username: this.state.username,
            telp: this.state.telp
        }

        if (this.state.fillNik) {
            form.nik = this.state.nik
        }

        if (this.state.fillPassword) {
            form.password = this.state.password
        }

        let url = base_url + "/masyarakat"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getMasyarakat()
                })
                .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getMasyarakat()
                })
                .catch(error => console.log(error))
        }
    }

    dropMasyarakat = selectedItem => {
        if (window.confirm("are you sure will delete this item?")) {
            let url = base_url + "/masyarakat/" + selectedItem.nik
            axios.delete(url, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getMasyarakat()
                })
                .catch(error => console.log(error))
        }
    }

    initPetugas = () => {
        if (localStorage.getItem("petugas") !== null) {
            let petugas = JSON.parse(localStorage.getItem("petugas"))
            this.setState({
                petugasLevel: petugas.level
            })
        }
    }

    render() {
        return (
        <div>
            {this.state.petugasLevel === "Admin" ? (
                    <div>
                        <Navbar />
                        <div className="container">
                            <h3 className="text-bold text-info mt-3">List Masyarakat</h3>
                            <button className="btn btn-success mt-1 mb-3" onClick={() => this.Add()}>
                                Tambah Masyarakat
                    </button>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>NIK</th>
                                        <th>Nama</th>
                                        <th>Username</th>
                                        <th>Telp</th>
                                        <th>Option</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.masyarakats.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.nik}</td>
                                            <td>{item.name}</td>
                                            <td>{item.username}</td>
                                            <td>{item.telp}</td>
                                            <td>
                                                <button className="btn btn-sm btn-info m-1"
                                                    onClick={() => this.Edit(item)}>
                                                    Edit
                                        </button>

                                                <button className="btn btn-sm btn-danger m-1"
                                                    onClick={() => this.dropMasyarakat(item)}>
                                                    Hapus
                                        </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* modal masyarakat  */}
                            <div className="modal fade" id="modal_masyarakat">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header bg-info text-white">
                                            <h4>Form Masyarakat</h4>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={ev => this.saveMasyarakat(ev)}>
                                        Nama
                                        <input type="text" className="form-control mb-1"
                                                    value={this.state.name}
                                                    onChange={ev => this.setState({ name: ev.target.value })}
                                                    required
                                                />

                                        Username
                                        <input type="text" className="form-control mb-1"
                                                    value={this.state.username}
                                                    onChange={ev => this.setState({ username: ev.target.value })}
                                                    required
                                                />

                                                {this.state.action === "update" && this.state.fillPassword === false ? (
                                                    <button className="btn btn-sm btn-secondary mb-1 btn-block"
                                                        onClick={() => this.setState({ fillPassword: true })}>
                                                        Change Password
                                                    </button>
                                                ) : (
                                                    <div>
                                                        Password
                                                        <input type="password" className="form-control mb-1"
                                                            value={this.state.password}
                                                            onChange={ev => this.setState({ password: ev.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                )}

                                        Telp
                                        <input type="number" className="form-control mb-1"
                                                    value={this.state.telp}
                                                    onChange={ev => this.setState({ telp: ev.target.value })}
                                                    required
                                                />

                                                <button type="submit" className="btn btn-block btn-success">
                                                    Simpan
                                        </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <NavbarPTG />
                        <div className="container">
                            <div className="alert alert-danger my-5">
                                <b>PERHATIKAN !</b> Anda tidak bisa mengakses laman ini.
                        </div>
                        </div>
                    </div>
                )
            }
            </div>
        )
        
    }

}