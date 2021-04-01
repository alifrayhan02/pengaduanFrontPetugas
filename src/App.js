import React from "react"
import { Switch, Route } from "react-router-dom";
import Login from "./pages/Login"
import Petugas from "./pages/Petugas"
import Masyarakat from "./pages/Masyarakat";
import Tanggapan from "./pages/Tanggapan";
import Pengaduan from "./pages/Pengaduan";
import Register from "./pages/Register";
import Laporan from "./pages/Laporan";
import Validation from "./pages/Validation";


export default class App extends React.Component{
  
  render(){
    return(
      <Switch>
        <Route exact path="/" component={Pengaduan} />
        <Route exact path="/validation" component={Validation} />
        <Route path="/login" component={Login} />
        <Route path="/petugas" component={Petugas} />
        <Route path="/masyarakat" component={Masyarakat} />
        <Route path="/tanggapan" component={Tanggapan} />
        <Route path="/register" component={Register} />
        <Route path="/laporan" component={Laporan} />
      </Switch>
    )
  }
}
