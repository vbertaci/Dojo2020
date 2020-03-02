import React, { Component } from 'react';
import api from '../../../services/api';
import { Redirect } from 'react-router-dom';
import Moment from 'moment';

import './detalhes.css';

export default class Usuario extends Component {
    state = {
        veiculo: {
            placa: '',
            modeloId: 0,
            anoFabricacao: '',
            anoModelo: '',
            corId: 0,
            dataLicenciamento: '',
            grupoId: 6,
            combustiveisIds: [],
            condutoresIds: [],
            dataCadastro: ''
        },
        cor: '',    
        modelo: '',
        erro: null,
        redirect: false
    };

    async componentDidMount() {
        const id = this.props.match.params.id;
        let tempVeiculo = null;
        
        await api.get(`/Veiculo/${id}`)
        .then(response => {
            tempVeiculo = response.data
           
            this.setState({ veiculo: tempVeiculo, cor: '', modelo: '' });
        })
        .catch(error => this.setState({ erro: error.message }));
        console.log(`/ModeloVeiculo/${this.state.veiculo}`);
        await api.get(`/ModeloVeiculo/${this.state.veiculo.modeloId}`)
        .then(response => {
            this.setState(prevState => ({
                veiculo: { ...prevState.veiculo}, modelo: response.data.nome
            }));
        })
        .catch(error => this.setState({ erro: error.message }));
                
        await api.get(`/Cor/${this.state.veiculo.corId}`)
        .then(response => {
            this.setState(prevState => ({
                veiculo: { ...prevState.veiculo}, modelo: prevState.modelo, cor: response.data.nome
            }));
        })
        .catch(error => this.setState({ erro: error.message }));
        
        
    }

    handleDelete = event => {
        event.preventDefault();

        const { id } = this.state.veiculo;

        api.delete(`/Veiculo/${id}`)
            .then(response => {
                this.setState({ redirect: true });
            })
            .catch(error => this.setState({ erro: error.message }));

    };

    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Redirect to="/" />
        } else {
            const { veiculo, cor, modelo } = this.state;
            return (
                <section className="user-details">
                    <div className="container">
                        {this.state.erro &&
                            <div className="alert alert-danger" role="alert">
                                { this.state.erro }
                            </div>
                        }
                        <div className="d-flex align-items-center mb-4">
                            <h1>{veiculo.placa.toUpperCase()}</h1>
                            <a className="btn btn-light ml-auto" href="/">Voltar</a>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <p className="card-text">
                                    Modelo: {modelo} <br />
                                    Ano Fabricacao: {veiculo.anoFabricacao} <br />
                                    Ano Modelo: {veiculo.anoModelo} <br />
                                    Cor: {cor} <br />
                                    Data Licenciamento: {Moment(veiculo.dataLicenciamento).format('YYYY-MM-DD')} <br />
                                    Data Cadastro: {Moment(veiculo.dataCadastro).format('YYYY-MM-DD')} <br />
                                </p>
                                <a href={`/veiculo/editar/${veiculo.id}`} className="btn btn-primary">Editar</a>
                                <button onClick={e => window.confirm(`Tem certeza que deseja excluir o condutor ${veiculo.placa}?`) && this.handleDelete(e)} className="btn btn-danger">Excluir</button>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    }
}