import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../../../services/api';
import InputMask from 'react-input-mask';
import Select from '../../../components/select';
import Moment from 'moment';

class Editar extends Component {
    constructor() {
        super();

        this.state = {
            veiculo: {
                id: 0,
                placa: '',
                modeloId: 0,
                anoFabricacao: '',
                anoModelo: '',
                corId: 0,
                dataLicenciamento: '',
                grupoId: 6,
                marca:
                {
                    id: 0,
                    nome: '',
                },
                modelo: 
                {
                    id: 0,
                    nome: '',
                    marcaId: 0
                },
                combustiveisIds: [],
                condutoresIds: []
            },
            combustivel: null,
            erro: null,
            showModelo: null,
            redirect: false
        }
    }

    async componentDidMount() {
        const id = this.props.match.params.id;

        await api.get(`/Veiculo/${id}`)
            .then(response => {
                this.setState({ veiculo: response.data });
            })
            .catch(error => this.setState({ erro: error.message }));

        await api.get(`/Combustivel/GetAllByVeiculoId/${id}`)
            .then(response => {
                this.setState(prevState => ({
                    veiculo: { ...prevState.veiculo}, combustivel: response.data

                }));
                console.log(this.state)
                console.log(response.data)
            })
            .catch(error => this.setState({ erro: error.message }));
            
    }
    
    handleInputChange = event => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState(prevState => ({
            veiculo: { ...prevState.veiculo, [name]: value }
        }));
    };

    handleSelectChange = (selectedOptions, element) => {
        const name = element.name;
        const value = Object.values(selectedOptions)[0];
        this.setState(prevState => ({
            veiculo: { ...prevState.veiculo, [name]: value }
        }));
    }

    handleSelectChangeMarca = async (selectedOptions, element) => {
        await this.setState({showModelo: null });
        const name = element.name;
        const value = Object.values(selectedOptions)[0];
        await this.setState(prevState => ({
            veiculo: { ...prevState.veiculo, [name]: value }
        }));
        await this.setState({showModelo: true });
    }

    handleSelectMultiChange = (selectedOptions, element) => {
        const name = element.name;
        let tempArray = [ ...this.state.veiculo[name] ];
        if(selectedOptions !== null && selectedOptions !== undefined && selectedOptions.length > 1) {
            selectedOptions.forEach(option => {
                const value = Object.values(option)[0];
                tempArray.push(value);
            });
        } else {
            tempArray.length = 0;
        }
        this.setState(prevState => ({
            usuario: { ...prevState.veiculo, [name]: tempArray }
        }));
    }

    handleSubmit = event => {
        event.preventDefault();
        api.post('/Veiculo', this.state.veiculo)
            .then( () => {
                this.setState({ redirect: true });
            })
            .catch(error => this.setState({ erro: error.message }));
    };

    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Redirect to="/Veiculo" />
        } else {
            return (
                <section className="new-user">
                    <div className="container">
                        <form onSubmit={this.handleSubmit}>
                            <fieldset>
                                <div className="d-flex align-items-center mb-4">
                                    <h1>Editar veiculo</h1>
                                    <a className="btn btn-light ml-auto back-link" href="/">Voltar</a>
                                </div>
                                {this.state.erro &&
                                    <div className="alert alert-danger" role="alert">
                                        { this.state.erro }
                                    </div>
                                }
                               
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="placa">Placa</label>
                                            <InputMask mask="aaa-9999" className="form-control" type="text" id="placa" name="placa" value={this.state.veiculo.placa} onChange={this.handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="marca">Marca</label>
                                            <Select name="marca" id="marca" recurso="MarcaVeiculo" value="id" label="nome" onChange={this.handleSelectChangeMarca} selectedValue={this.state.veiculo.marca.nome} />
                                            
                                        </div>
                                    </div>
                                    
                                    
                                        <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="modeloId">Modelo</label>
                                            <Select selectedValue={this.state.veiculo.modelo.nome} name="modeloId" id="modeloId" recurso={`ModeloVeiculo/GetAllByMarca/${this.state.veiculo.marca}`} onChange={this.handleSelectChange} value="id" label="nome"/>
                                            
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="row">
                                <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="anoFabricacao">Ano Fabricação</label>
                                            <InputMask mask="9999" className="form-control" type="text" id="anoFabricacao" name="anoFabricacao" value={this.state.veiculo.anoFabricacao} onChange={this.handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="anoModelo">Ano Modelo</label>
                                            <InputMask mask="9999" className="form-control" type="text" id="anoModelo" name="anoModelo" value={this.state.veiculo.anoModelo} onChange={this.handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="corId">Cor</label>
                                            <Select name="corId" id="corId" recurso="Cor" onChange={this.handleSelectChange} value="id" label="nome" />
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="dataLicenciamento">Data Licenciamento</label>
                                            <input className="form-control" type="date" id="dataLicenciamento" name="dataLicenciamento" value={Moment(this.state.veiculo.dataLicenciamento).format('YYYY-MM-DD')} onChange={this.handleInputChange} required max="2030-12-31" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="combustiveisIds">Combustíveis</label>
                                            <Select IsMulti="true" name="combustiveisIds" id="combustiveisIds" recurso="Combustivel" onChange={this.handleSelectMultiChange} value="id" label="nome" />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="condutoresIds">Condutores</label>
                                            <Select IsMulti="true" name="condutoresIds" id="condutoresIds" recurso="Condutor" onChange={this.handleSelectMultiChange} value="id" label="nome" />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mt-3">
                                    <button id="btn-inserir" className="btn btn-primary btn-lg btn-block">Inserir</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </section>
            )
        }
    }

}

export default Editar;
