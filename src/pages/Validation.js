import ValidateList from "../components/ValidateList";
import React from "react"
import Navbar from "../components/Navbar"
import NavbarPTG from "../components/NavbarPTG"
import { base_url, pengaduan_image_url } from "../config.js";
import $ from "jquery"
import axios from "axios"
import { Radio, RadioGroup } from 'react-radio-group'

export default class Pengaduan extends React.Component {
    constructor() {
        super()
        this.state = {
            pengaduans: [],
            tanggapans: [],
            token: "",
            action: "",
            id_pengaduan: "",
            nik: "",
            isi_laporan: "",
            image: "",
            status: "",
            uploadFile: true,
            id_tanggapan: "",
            tanggapan: "",
            id_petugas: "",
            pelapor: "",
            createdAt: ""

        }

        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
        this.headerConfig.bind(this)

    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getPengaduans = () => {
        let url = base_url + "/pengaduan/get/status/dalam antrian"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ pengaduans: response.data })
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

    componentDidMount() {
        this.getPengaduans()
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
                    window.alert("sudah mengisi tanggapan, silahkan ganti status ke Selesai !")
                }

            })

    }

    saveA = event => {
        event.preventDefault()
        $("#modal_tanggapan").modal("hide")
        let form = {
            id_pengaduan: this.state.id_pengaduan,
            tanggapan: this.state.tanggapan,
            id_petugas: this.state.id_petugas
        }
        let url = base_url + "/tanggapan"
        axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert("Berhasil menganggapi, silahkan ganti status ke Selesai !")
                this.getPengaduans()
            })
            .catch(error => console.log(error))

    }

    EditTang = selectedItem => {
        this.setState({
            action: "update",
            id_tanggapan: selectedItem.id_tanggapan,
            id_pengaduan: selectedItem.id_pengaduan,
            tanggapan: selectedItem.tanggapan,
            id_petugas: selectedItem.id_petugas
        })
    }

    EditPeng = selectedItem => {
        $("#modal_pengaduan").modal("show")
        this.setState({
            action: "update",
            id_pengaduan: selectedItem.id_pengaduan,
            nik: selectedItem.nik,
            pelapor: selectedItem.pelapor,
            isi_laporan: selectedItem.isi_laporan,
            image: null,
            status: selectedItem.status,
            uploadFile: false,
            // fillNik: false
        })
    }

    savePengaduan = event => {
        event.preventDefault()
        $("#modal_pengaduan").modal("hide")
        let form = new FormData()
        form.append("id_pengaduan", this.state.id_pengaduan)
        form.append("pelapor", this.state.pelapor)
        form.append("nik", this.state.nik)
        form.append("isi_laporan", this.state.isi_laporan)
        form.append("status", this.state.status)
        if (this.state.uploadFile) {
            form.append("image", this.state.image)
        }

        let url = base_url + "/pengaduan"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getPengaduans()
                })
                .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getPengaduans()
                })
                .catch(error => console.log(error))
        }
    }



    dropPengaduan = selectedItem => {
        if (window.confirm("are you sure will delete this item?")) {
            let url = base_url + "/pengaduan/" + selectedItem.id_pengaduan
            axios.delete(url, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getPengaduans()
                })
                .catch(error => console.log(error))
            let ur = base_url + "/tanggapan/adu/" + selectedItem.id_pengaduan
            axios.delete(ur, this.headerConfig())
                .then(response => {
                    this.getPengaduan()
                })
                .catch(error => console.log(error))
        }
    }

    initPetugas = () => {
        if (localStorage.getItem("petugas") !== null) {
            let petugas = JSON.parse(localStorage.getItem("petugas"))
            this.setState({
                petugasID: petugas.id_petugas,
                petugasLevel: petugas.level
            })
        }
    }

    render() {
        return (
            <div>
                {this.state.petugasLevel === "Admin" ? (
                    <Navbar />
                ) : (
                    <NavbarPTG />
                )}

                <div className="container pb-4" >
                    <h3 className="text-bold text-info mt-2" style={{ paddingTop: "15px" }}>List Pengaduan</h3>

                    <div className="row">
                        {this.state.pengaduans.map(item => (
                            <ValidateList
                                key={item.id_pengaduan}
                                tgl_pengaduan={item.createdAt}
                                nik={item.nik}
                                pelapor={item.pelapor}
                                isi_laporan={item.isi_laporan}
                                // status={item.status}
                                image={pengaduan_image_url + "/" + item.image}
                                onEdit={() => this.AddTang(item)}
                                onDrop={() => this.dropPengaduan(item)}
                                onEditP={() => this.EditPeng(item)}
                            />
                        ))}
                    </div>

                </div>


                {/* modal tanggapan */}
                <div className="modal fade" id="modal_tanggapan">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h4>Beri Tanggapan</h4>
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

                {/* modal pengaduan */}
                <div className="modal fade" id="modal_pengaduan">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h4>Validasi</h4>

                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.savePengaduan(ev)}>

                                    <RadioGroup name="fruits" className="mb-2" >
                                        <div className="radio-button-background">
                                            <Radio value="Approved" onChange={ev => this.setState({ status: ev.target.value })} className="radio-button" /> Approved
                                            </div>
                                            <div className="radio-button-background">
                                            <Radio value="Rejected" onChange={ev => this.setState({ status: ev.target.value })} className="radio-button" /> Rejected
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
        )
    }

}
