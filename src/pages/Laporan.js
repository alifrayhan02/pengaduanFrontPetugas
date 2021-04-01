import React from "react"
import Navbar from "../components/Navbar"
import NavbarPTG from "../components/NavbarPTG"
import { base_url, pengaduan_image_url } from "../config.js";
import $ from "jquery"
import axios from "axios"
import ReactToPrint from 'react-to-print';

export default class Tanggapan extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            action: "",
            tanggapans: [],
            pengaduans: [],
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

    getPengaduans = () => {
        let url = base_url + "/pengaduan/detail/tang/tes/"
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

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    componentDidMount() {
        this.getPengaduans()
        this.getTanggapans()
        this.initPetugas()
    }

    Add = () => {
        $("#modal_tanggapan").modal("show")
        this.setState({
            action: "insert",
            id_tanggapan: "",
            id_pengaduan: "",
            tgl_tanggapan: "",
            tanggapan: "",
            id_petugas: "",
        })
    }


    initPetugas = () => {
        if (localStorage.getItem("petugas") !== null) {
            let petugas = JSON.parse(localStorage.getItem("petugas"))
            this.setState({
                petugasNama: petugas.name,
                petugasID: petugas.id_petugas,
                petugasLevel: petugas.level
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
                <div className="container" >
                    <ReactToPrint
                        trigger={() => {
                            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                            // to the root node of the returned component as it will be overwritten.
                            return <button className="btn btn-success my-4" >
                                Generate Laporan
                        </button>;
                        }}
                        content={() => this.componentRef}
                    />
                    <div ref={el => (this.componentRef = el)}>
                        <h4 className="pl-2">ID Petugas : {this.state.petugasID}</h4>
                        <h4 className="pl-2 pb-2">Nama Petugas : {this.state.petugasNama} </h4>
                        <h3 className="text-bold text-info pt-1 pb-3 text-center">Laporan Pengaduan</h3>
                        {/* <h3>{this.state.date}</h3> */}

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ID Pengaduan</th>
                                    <th>Tgl Pengaduan</th>
                                    <th>NIK</th>
                                    <th>Pelapor</th>
                                    <th>Gambar</th>
                                    <th>Isi Pengaduan</th>
                                    <th>Tanggapan</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.pengaduans.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.id_pengaduan}</td>
                                        <td>{this.convertTime(item.createdAt)}</td>
                                        <td>{item.nik}</td>
                                        <td>{item.pelapor}</td>
                                        <td><img src={pengaduan_image_url + "/" + item.image} className="img-thumbnail border border-5 border border-black" height="250" width="250" alt="lapor"></img></td>
                                        <td>{item.isi_laporan}</td>
                                        <td>{item.tanggapan.map((y) =>
                                             <h6>
                                            {y.tanggapan}
                                             </h6>
                                             )}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* </div> */}

                        {/* <div ref={ref2}> */}

                    </div>

                </div>
            </div>
        )
    }

}