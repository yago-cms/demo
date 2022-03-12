import { Login } from "./Login";
import { LOGOUT } from "../queries";
import { NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Routes
let routes = require('../routes').default;
let routeFiles = require.context('../../vendor/', true, /routes\/index\.js$/i);

routeFiles.keys().forEach(file => {
    routes = routes.concat(routeFiles(file).default);
});

// Menus
let menuGroups = [
    require('../menus').default,
];
let menuFiles = require.context('../../vendor/', true, /menus\/index\.js$/i);

menuFiles.keys().forEach(file => {
    menuGroups.push(
        menuFiles(file).default,
    );
});

export default function App() {
    const [accessToken, setAccessToken] = useLocalStorage('accessToken');

    const [logout, { loading: isLoading, error }] = useMutation(LOGOUT);

    const handleLogout = () => {
        logout()
            .then(() => {
                localStorage.removeItem('accessToken');
                location.reload();
            });
    };

    return !accessToken
        ? <Login setAccessToken={setAccessToken} />
        :
        <>
            <div className="navbar">
                <div className="navbar__user">Formsmedjan</div>

                <div className="navbar__logout">
                    <button className="btn btn-outline-secondary" onClick={handleLogout} disabled={isLoading}>
                        Log out
                    </button>
                </div>
            </div>

            <div className="sidebar">
                <a href="/admin" className="sidebar__brand">
                    <img src="/svg/yago-content.svg" alt="" width="64" height="38" />
                </a>

                <div className="sidebar__nav">
                    {menuGroups.map((menuGroup, i) => <ul className="nav flex-column" key={i}>
                        {menuGroup.map((menu, j) => <li className="nav-item" key={j}>
                            <NavLink className="nav-link" to={menu.route}>
                                {menu.icon
                                    ? <>
                                        <FontAwesomeIcon icon={menu.icon} fixedWidth /> {menu.name}
                                    </>
                                    : menu.name
                                }
                            </NavLink>
                        </li>)}
                    </ul>)}
                </div>
            </div>

            <main className="main">
                <Routes>
                    {routes.map((route, i) => (
                        <Route
                            key={i}
                            path={route.path}
                            exact={!!route.exact}
                            element={route.component}
                        />
                    ))}
                </Routes>
            </main>

            <footer className="footer">
                <div className="row">
                    <div className="col">Copyright 2011-2021 Formsmedjan AB.</div>

                    <div className="col text-end">Version 3.0.0. <a href="">Changelog</a></div>
                </div>
            </footer>
        </>

}