import React from 'react';

const Header = () => (
    <nav className="navbar navbar-dark bg-dark mb-5">
        <div className="container">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="/">Fitcard <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/">Condutor</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link " href="/veiculo">Veículo</a>
                </li>
            </ul>
        </div>
    </nav>
);

export default Header;