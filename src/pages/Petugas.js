import React from "react"
import Navbar from "../components/Navbar"
import NavbarPTG from "../components/NavbarPTG"
// import CustomerList from "../components/CustomerList";
import { base_url } from "../config.js";
import $ from "jquery"
import axios from "axios"
import { Radio, RadioGroup } from 'react-radio-group'


export default class Petugas extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            action: "",
            petugass: [],
            id_petugas: "",
            name: "",
            username: "",
            password: "",
            telp: "",
            level: "",
            fillPassword: true
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
    }

    getPetugas = () => {
        let url = base_url + "/petugas"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ petugass: response.data })
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
        this.getPetugas()
        this.initPetugas()
    }

    Add = () => {
        $("#modal_petugas").modal("show")
        this.setState({
            action: "insert",
            id_petugas: "",
            name: "",
            username: "",
            password: "",
            telp: "",
            level: "",
            fillPassword: true,
        })
    }

    Edit = selectedItem => {
        $("#modal_petugas").modal("show")
        this.setState({
            action: "update",
            id_petugas: selectedItem.id_petugas,
            name: selectedItem.name,
            username: selectedItem.username,
            password: "",
            telp: selectedItem.telp,
            level: selectedItem.level,
            fillPassword: false,
        })
    }

    savePetugas = event => {
        event.preventDefault()
        $("#modal_petugas").modal("hide")
        let form = {
            id_petugas: this.state.id_petugas,
            name: this.state.name,
            username: this.state.username,
            telp: this.state.telp,
            level: this.state.level,
            admin: "Admin",
            petugas: "petugas",
        }

        if (this.state.fillPassword) {
            form.password = this.state.password
        }

        let url = base_url + "/petugas"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getPetugas()
                })
                .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getPetugas()
                })
                .catch(error => console.log(error))
        }
    }

    dropPetugas = selectedItem => {
        if (window.confirm("are you sure will delete this item?")) {
            let url = base_url + "/petugas/" + selectedItem.id_petugas
            axios.delete(url, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getPetugas()
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
                    <h3 className="text-bold text-info mt-3">List Petugas</h3>
                    <button className="btn btn-success mt-1 mb-3" onClick={() => this.Add()}>
                        Tambah Petugas
                    </button>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nama</th>
                                <th>Username</th>
                                <th>Telp</th>
                                <th>Status</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.petugass.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.username}</td>
                                    <td>{item.telp}</td>
                                    <td>{item.level}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info m-1"
                                            onClick={() => this.Edit(item)}>
                                            Edit
                                        </button>

                                        <button className="btn btn-sm btn-danger m-1"
                                            onClick={() => this.dropPetugas(item)}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* modal petugas  */}
                    <div className="modal fade" id="modal_petugas">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-info text-white">
                                    <h4>Form Petugas</h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={ev => this.savePetugas(ev)}>
                                        Nama Petugas
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
                                            <button className="btn btn-sm btn-secondary my-2 btn-block"
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
                                        Status
                                        {/* <input type="text" className="form-control mb-1"
                                            value={this.state.status}
                                            onChange={ev => this.setState({ status: ev.target.value })}
                                            required
                                        /> */}
                                        <RadioGroup name="fruits" className="mb-2" >
                                            <div className="radio-button-background">
                                                <Radio value="Admin" onChange={ev => this.setState({ level: ev.target.value })} className="radio-button" /> Admin
                                            </div>
                                            <div className="radio-button-background">
                                                <Radio value="Petugas" onChange={ev => this.setState({ level: ev.target.value })} className="radio-button" /> Petugas
                                            </div>
                                        </RadioGroup>
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
                )}
                
            </div>
        )
    }

}