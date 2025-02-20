import { Link } from "react-router-dom";

export const PRMHome = () => {
    return (
        <div className="hero bg-base-200 py-8">
            <div className="hero-content text-center max-w-4xl flex flex-col">
                <div className="h-screen flex flex-col justify-center gap-5">
                    <h1 className="text-5xl font-bold">
                        PRM Stack Boilerplate
                    </h1>
                    <h1 className="text-3xl font-bold">
                        Fast, Scalable & Developer-Friendly
                    </h1>
                    <p className="text-xl">
                        🚀 Build Modern Web Apps with <b>Python</b>, <b>React</b> & <b>MongoDB</b>
                    </p>
                    <p>
                        This boilerplate provides a <span className="font-semibold">production-ready foundation</span> to kickstart your project.
                    </p>

                    <div className="hero-footer">
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link to="/PRM" className="btn btn-primary">
                                Visit Demo Site 🚀
                            </Link>
                            <button className="btn btn-ghost" onClick={() => {
                                document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' });
                            }}>
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>


                <div>
                    <div className="divider">Why Choose PRM?</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 cursor-default">
                        <div className="card bg-base-100 shadow-xl hover:shadow-lg">
                            <div className="card-body">
                                <img className="rounded-xl shadow-md my-2" src="https://raw.githubusercontent.com/dependabot-pr/Static-Files/refs/heads/main/Assets/Logo/Technologies/Python.svg" alt="Python" />
                                <p className="text-lg flex flex-col">
                                    <span className="font-semibold"><kbd className="kbd items-end"><b className="font-extrabold text-2xl">P</b>ython</kbd> for Backend</span> Fast, scalable, and easy to maintain
                                </p>
                            </div>
                        </div>
                        <div className="card bg-base-100 shadow-xl hover:shadow-lg">
                            <div className="card-body">
                                <img className="rounded-xl shadow-md my-2" src="https://raw.githubusercontent.com/dependabot-pr/Static-Files/refs/heads/main/Assets/Logo/Technologies/React.svg" alt="Python" />
                                <p className="text-lg flex flex-col">
                                    <span className="font-semibold"><kbd className="kbd items-end"><b className="font-extrabold text-2xl">R</b>eact</kbd> for Frontend</span> Modern, interactive UI development
                                </p>
                            </div>
                        </div>
                        <div className="card bg-base-100 shadow-xl hover:shadow-lg">
                            <div className="card-body">
                                <img className="rounded-xl shadow-md my-2" src="https://raw.githubusercontent.com/dependabot-pr/Static-Files/refs/heads/main/Assets/Logo/Technologies/MongoDB.svg" alt="Python" />
                                <p className="text-lg flex flex-col">
                                    <span className="font-semibold"><kbd className="kbd items-end"><b className="font-extrabold text-2xl">M</b>ongoDB</kbd> for Database</span> Flexible NoSQL storage solution
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="divider">Try the Boilerplate</div>
                    <div className="card bg-base-100 shadow-xl p-4 text-left mb-8 space-y-2 flex flex-col justify-center">
                        <ul className="mx-auto space-y-2 mb-4 list-item list-disc">
                            <li><b>Pre-built Authentication System: </b> Secure, ready-to-use authentication.</li>
                            <li><b>API + Database Integration: </b> Seamless API and database connectivity.</li>
                            <li><b>Optimized for Scalability: </b> Built to handle growth effortlessly.</li>
                            <li><b>Easy to Customize & Extend: </b> Flexible and modular for easy customization.</li>
                            <li><b>Production-Ready Setup: </b> Ready for live deployment out of the box.</li>
                            <li><b>Detailed Documentation: </b> Comprehensive guides and examples.</li>
                        </ul>
                        <Link to="/PRM" className="btn btn-primary">
                            Visit Demo Site 🚀
                        </Link>
                    </div>

                    <div className="divider" id="get-started">Get Started</div>
                    <div className="card bg-base-100 shadow-xl p-4 text-left mb-8 space-y-2 flex flex-col justify-center">
                        <ul className="mx-auto space-y-2 mb-4 list-item list-disc">
                            <li>Read the docs for setup instructions</li>
                            <li>Fork & extend it for your projects</li>
                            <li>Join our community for support!</li>
                        </ul>
                    </div>

                    <button className="btn btn-primary mt-4">
                        Ready to build? Start now! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
};
