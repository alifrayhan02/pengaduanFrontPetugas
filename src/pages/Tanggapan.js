import React from "react"
import Navbar from "../components/Navbar"
import NavbarPTG from "../components/NavbarPTG"
import { base_url } from "../config.js";
import $ from "jquery"
import axios from "axios"


export default class Tanggapan extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            action: "",
            tanggapans: [],
            id_tanggapan: "",
            id_pengaduan: "",
            tgl_tanggapan: "",
            tanggapan: "",
            id_petugas: "",
            createdAt: "",
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
    }

    getTanggapans = () => {
        let url = base_url + "/tanggapan"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ tanggapans: response.data })
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
        this.getTanggapans()
        this.initPetugas()
    }

    AddTang = selectedItem => {
        let url = base_url + "/tanggapan/" + selectedItem.id_pengaduan
        axios.get(url, this.headerConfig())
            .then(response => {
                if (response.data == null) {
                    $("#modal_tanggapan").modal("show")
                    this.setState({
                        id_pengaduan: selectedItem.id_pengaduan,
                        tanggapan: "",
                        id_petugas: this.state.petugasID
                    })
                } else {
                    window.confirm("sudah di isi, silahkan ganti status ke selesai")
                }

            })

    }

    Edit = selectedItem => {
        $("#modal_tanggapan").modal("show")
        this.setState({
            action: "update",
            id_tanggapan: selectedItem.id_tanggapan,
            id_pengaduan: selectedItem.id_pengaduan,
            tanggapan: selectedItem.tanggapan,
            id_petugas: selectedItem.id_petugas,
        })
    }

    saveA = event => {
        event.preventDefault()
        $("#modal_tanggapan").modal("hide")
        let form = {
            id_tanggapan: this.state.id_tanggapan,
            id_pengaduan: this.state.id_pengaduan,
            tanggapan: this.state.tanggapan,
            id_petugas: this.state.id_petugas
        }
        let url = base_url + "/tanggapan"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getTanggapans()
                })
                .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getTanggapans()
                })
                .catch(error => console.log(error))
        }
    }

    dropTanggapan = selectedItem => {
        if (window.confirm("are you sure will delete this item?")) {
            let url = base_url + "/tanggapan/" + selectedItem.id_tanggapan
            axios.delete(url, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getTanggapans()
                })
                .catch(error => console.log(error))
        }
    }

    initPetugas = () => {
        if (localStorage.getItem("petugas") !== null) {
            let petugas = JSON.parse(localStorage.getItem("petugas"))
            this.setState({
                petugasLevel: petugas.level,
                petugasID: petugas.id_petugas
            })
        }
    }
    convertTime = tgl_pengaduan => {
        let date = new Date(tgl_pengaduan)
        return `${date.getDate()}/${Number(date.getMonth()) + 1}/${date.getFullYear()}`
    }


    render() {
        return (
            <div>
                {this.state.petugasLevel === "Admin" ? (
                    <Navbar />
                ) : (
                    <NavbarPTG />
                )}
                <div className="container">
                    <h3 className="text-bold text-info pt-4 pb-3">List Tanggapan</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>id_pengaduan</th>
                                <th>tgl_tanggapan</th>
                                <th>tanggapan</th>
                                <th>id_petugas</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tanggapans.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.id_pengaduan}</td>
                                    <td>{this.convertTime(item.createdAt)}</td>
                                    <td>{item.tanggapan}</td>
                                    <td>{item.id_petugas}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary m-1"
                                            onClick={() => this.Edit(item)}>
                                            Edit
                                        </button>
                                        {/* <button className="btn btn-sm btn-danger m-1"
                                            onClick={() => this.dropTanggapan(item)}>
                                            Hapus
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* modal petugas  */}
                    <div className="modal fade" id="modal_tanggapan">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h4>Ganti Tanggapan</h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.saveA(ev)}>
                                    Tanggapan
                                     <input type="text" className="form-control mb-1"
                                        value={this.state.tanggapan}
                                        onChange={ev => this.setState({ tanggapan: ev.target.value })}
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
        )
    }

}